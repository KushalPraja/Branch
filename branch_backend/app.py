from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import jwt
import bcrypt
import os
import ssl
from datetime import datetime, timedelta
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# MongoDB setup (Atlas Cluster)
MONGODB_URI = os.getenv("MONGODB_URI")
print(f"Connecting to MongoDB: {MONGODB_URI}")

# Configure MongoDB client with ServerApi
client = MongoClient(
    MONGODB_URI,
    server_api=ServerApi('1'),
    connect=False  # Don't connect immediately
)

# Connect to database
try:
    # Force a connection to verify it works
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    db = client.linktree_clone
    users_collection = db.users
    links_collection = db.links
except Exception as e:
    print(f"MongoDB connection error: {e}")
    raise

# Use API_PREFIX from environment variables
API_PREFIX = os.getenv("API_PREFIX", "/api/v1")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{API_PREFIX}/auth/token")

app = FastAPI()

# Add debugging to show all registered routes
@app.on_event("startup")
async def startup_event():
    print("FastAPI Startup - Registered Routes:")
    for route in app.routes:
        print(f"Route: {route.path} - {route.methods}")
    print("-" * 50)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        body = await request.body()
        if body:
            logger.info(f"Request body: {body.decode()}")
    except Exception as e:
        logger.error(f"Error reading body: {e}")
    response = await call_next(request)
    return response

# Models - Fix the order to resolve circular references
class ThemeSettings(BaseModel):
    pageBackground: Optional[str] = "bg-black"
    buttonStyle: Optional[str] = "solid"
    fontFamily: Optional[str] = "inter"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None  # Added avatar field
    theme: Optional[ThemeSettings] = None

class LinkCreate(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None

class LinkResponse(LinkCreate):
    id: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None  # Added avatar field
    theme: Optional[ThemeSettings] = None
    links: List[LinkResponse] = []

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    # Ensure "sub" is always set with the username
    if "sub" not in to_encode and "username" in to_encode:
        to_encode["sub"] = to_encode["username"]
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user(username: str):
    user = users_collection.find_one({"username": username})
    if user:
        print(f"Successfully found user: {username}")
        user["id"] = str(user["_id"])
        # Fetch links for the user and format them
        links = list(links_collection.find({"user_id": user["id"]}))
        print(f"Successfully retrieved {len(links)} links for user: {username}")
        formatted_links = []
        for link in links:
            formatted_links.append({
                "id": str(link["_id"]),
                "title": link.get("title"),
                "url": link.get("url"),
                "icon": link.get("icon")
            })
        print(f"Successfully formatted links for user: {username}")
        user["links"] = formatted_links
        return user
    print(f"User not found: {username}")
    return None

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = get_user(payload.get("sub"))
        if not user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Auth Endpoints
@app.post(f"{API_PREFIX}/auth/token", response_model=Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info("Login attempt received")
    logger.info(f"Headers: {request.headers}")
    logger.info(f"Form data: username={form_data.username}")
    
    user = get_user(form_data.username)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Username not found"
        )
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )
    
    access_token = create_access_token({"username": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post(f"{API_PREFIX}/users/", response_model=UserResponse)
def signup(user_data: UserCreate):
    if users_collection.find_one({"username": user_data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = hash_password(user_data.password)
    new_user = user_data.model_dump()  # Changed from dict() to model_dump() for Pydantic v2
    new_user["password"] = hashed_password
    result = users_collection.insert_one(new_user)
    new_user["id"] = str(result.inserted_id)
    return new_user

# User Endpoints
@app.get(f"{API_PREFIX}/me/", response_model=UserResponse)
def get_current_user_profile(user: dict = Depends(get_current_user)):
    # Ensure theme exists in the response, with defaults if not present
    if "theme" not in user:
        user["theme"] = {
            "pageBackground": "bg-black",
            "buttonStyle": "solid",
            "fontFamily": "inter"
        }
    return user

@app.put(f"{API_PREFIX}/me/")
def update_profile(profile_data: dict, user: dict = Depends(get_current_user)):
    users_collection.update_one({"_id": ObjectId(user["id"])}, {"$set": profile_data})
    return {"message": "Profile updated"}

# Add this public user endpoint - with a slightly different path pattern
@app.get(f"{API_PREFIX}/users/{{username}}", response_model=UserResponse)
async def get_user_by_username(username: str):
    print(f"DEBUG: Endpoint was called with username: '{username}'")
    
    # Log all usernames in the database to help debug
    all_users = list(users_collection.find({}, {"username": 1, "_id": 0}))
    print(f"DEBUG: All users in database: {[u['username'] for u in all_users]}")
    
    # Try case insensitive search
    user = users_collection.find_one({"username": {"$regex": f"^{username}$", "$options": "i"}})
    
    if not user:
        print(f"DEBUG: User not found: '{username}'")
        raise HTTPException(status_code=404, detail=f"User '{username}' not found")
    
    print(f"DEBUG: Found user: {user['username']}")
    
    user_data = {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user.get("email", ""),
        "name": user.get("name"),
        "bio": user.get("bio"),
        "avatar": user.get("avatar"),
        "theme": user.get("theme", {"pageBackground": "bg-black", "buttonStyle": "solid"}),
        "links": []  # Initialize with empty links, will be filled later
    }
    
    # Print user ID for debugging
    print(f"DEBUG: User ID: {user_data['id']}")
    
    # Fetch links for the user - try both ways
    links = list(links_collection.find({"user_id": user_data["id"]}))
    print(f"DEBUG: Found {len(links)} links with user_id: {user_data['id']}")
    
    # If no links found, try with ObjectId
    if len(links) == 0:
        try:
            links = list(links_collection.find({"user_id": {"$in": [user_data["id"], str(user["_id"]), ObjectId(user_data["id"])]}}))
            print(f"DEBUG: After alternative search, found {len(links)} links")
        except Exception as e:
            print(f"DEBUG: Error in alternative search: {e}")
    
    user_data["links"] = [{
        "id": str(link["_id"]),
        "title": link.get("title", ""),
        "url": link.get("url", ""),
        "icon": link.get("icon")
    } for link in links]
    
    # Ensure theme exists in the response, with defaults if not present
    if "theme" not in user_data:
        user_data["theme"] = {
            "pageBackground": "bg-black",
            "buttonStyle": "solid"
        }
    
    print(f"DEBUG: Returning user with {len(user_data['links'])} links")
    return user_data

# Link Endpoints
@app.post(f"{API_PREFIX}/me/links/", response_model=LinkResponse)
def create_link(link_data: LinkCreate, user: dict = Depends(get_current_user)):
    link = link_data.model_dump()  # Changed from dict() to model_dump()
    link["user_id"] = user["id"]
    result = links_collection.insert_one(link)
    link["id"] = str(result.inserted_id)
    return link

@app.put(f"{API_PREFIX}/me/links/{{link_id}}")
def update_link(link_id: str, link_data: LinkCreate, user: dict = Depends(get_current_user)):
    result = links_collection.update_one(
        {"_id": ObjectId(link_id), "user_id": user["id"]}, 
        {"$set": link_data.model_dump()}  # Changed from dict() to model_dump()
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Link not found")
    return {"message": "Link updated"}

@app.delete(f"{API_PREFIX}/me/links/{{link_id}}")
def delete_link(link_id: str, user: dict = Depends(get_current_user)):
    result = links_collection.delete_one({"_id": ObjectId(link_id), "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Link not found")
    return {"message": "Link deleted"}

# Health Check
@app.get("/health")
def check_health():
    return {"status": "ok"}

@app.get("/favicon.ico")
def favicon():
    return {"message": "No favicon"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Linktree Clone!"}

# Add CORS middleware if needed
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    import socket
    
    # Define port - use a different one than the default 8000
    PORT = 8080
    
    # Check if port is already in use
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    in_use = False
    try:
        sock.bind(('localhost', PORT))
    except socket.error:
        in_use = True
    finally:
        sock.close()
    
    if in_use:
        print(f"WARNING: Port {PORT} is already in use! This might cause conflicts.")
        
    print(f"Starting server on port {PORT}...")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
