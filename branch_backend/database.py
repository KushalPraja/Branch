from pymongo import MongoClient
import os
from typing import Dict, Any

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
client = MongoClient(MONGODB_URL)
db = client["branch"]
users_collection = db["users"]
tokens_collection = db["tokens"]

def create_user(user_data: Dict[str, Any]) -> str:
    """Create a new user with default theme settings"""
    if "theme" not in user_data:
        user_data["theme"] = {
            "pageBackground": "bg-black",
            "buttonStyle": "solid"
        }
    
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)

def initialize_db():
    """Setup initial database indexes"""
    # Create unique index for username
    users_collection.create_index("username", unique=True)
    # Create unique index for email
    users_collection.create_index("email", unique=True)
