from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import motor.motor_asyncio
from bson import ObjectId
from datetime import datetime, timedelta
import jwt
import os
import bcrypt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Branch API")

# Set up CORS
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "https://*.vercel.app",  # Vercel preview deployments
    "https://branch-app.vercel.app",  # Example production domain
    # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.branch_db

# Models
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Link(BaseModel):
    id: Optional[str] = None
    title: str
    url: str
    icon: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None


class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr
    username: str
    hashed_password: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    links: List[Link] = []
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    links: List[Link] = []

    class Config:
        schema_extra = {
            "example": {
                "id": "5f7e3b2c9d3e2a1b8c7d6e5f",
                "username": "johndoe",
                "email": "john@example.com",
                "name": "John Doe",
                "bio": "Software Developer",
                "avatar": "https://example.com/avatar.jpg",
                "links": [
                    {"id": "1", "title": "Website", "url": "https://example.com", "icon": "🌐"}
                ]
            }
        }


class TokenData(BaseModel):
    username: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


# Auth helper functions
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_pw.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


async def get_user(username: str):
    user = await db.users.find_one({"username": username})
    if user:
        return User(**user)


async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    # Check if username already exists
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email already exists
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_dict = User(
        email=user.email, 
        username=user.username, 
        hashed_password=hashed_password,
        links=[]
    ).dict(by_alias=True)
    
    new_user = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": new_user.inserted_id})
    
    return UserResponse(**created_user)


@app.get("/users/{username}", response_model=UserResponse)
async def get_user_by_username(username: str):
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)


@app.get("/me/", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())


@app.put("/me/", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate, 
    current_user: User = Depends(get_current_user)
):
    update_data = user_update.dict(exclude_unset=True)
    
    if len(update_data) >= 1:
        await db.users.update_one(
            {"_id": current_user.id}, {"$set": update_data}
        )
    
    updated_user = await db.users.find_one({"_id": current_user.id})
    return UserResponse(**updated_user)


@app.post("/me/links/", response_model=UserResponse)
async def add_link(
    link: Link, 
    current_user: User = Depends(get_current_user)
):
    # Generate a new unique ID for the link
    link_dict = link.dict()
    link_dict["id"] = str(ObjectId())
    
    await db.users.update_one(
        {"_id": current_user.id}, 
        {"$push": {"links": link_dict}}
    )
    
    updated_user = await db.users.find_one({"_id": current_user.id})
    return UserResponse(**updated_user)


@app.delete("/me/links/{link_id}", response_model=UserResponse)
async def delete_link(
    link_id: str,
    current_user: User = Depends(get_current_user)
):
    await db.users.update_one(
        {"_id": current_user.id},
        {"$pull": {"links": {"id": link_id}}}
    )
    
    updated_user = await db.users.find_one({"_id": current_user.id})
    return UserResponse(**updated_user)


@app.put("/me/links/{link_id}", response_model=UserResponse)
async def update_link(
    link_id: str,
    link_update: Link,
    current_user: User = Depends(get_current_user)
):
    # Find the user document
    user = await db.users.find_one({"_id": current_user.id})
    
    # Find the link to update
    for i, link in enumerate(user["links"]):
        if link["id"] == link_id:
            # Update the link with new data while preserving the id
            updated_link = link_update.dict()
            updated_link["id"] = link_id
            
            await db.users.update_one(
                {"_id": current_user.id, "links.id": link_id},
                {"$set": {"links.$": updated_link}}
            )
            break
    
    updated_user = await db.users.find_one({"_id": current_user.id})
    return UserResponse(**updated_user)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
