from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class ThemeSettings(BaseModel):
    pageBackground: Optional[str] = "bg-black"  
    buttonStyle: Optional[str] = "solid"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    theme: Optional[ThemeSettings] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    name: Optional[str] = None
    bio: Optional[str] = None
    theme: Optional[ThemeSettings] = None
    links: List[Dict[str, Any]] = []

class LinkCreate(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None

class LinkUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
