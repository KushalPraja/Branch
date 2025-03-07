from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection():
    """Test MongoDB Atlas connection"""
    mongo_uri = os.getenv("MONGODB_URI")
    print(f"Connecting to: {mongo_uri}")
    
    try:
        # Create a new client and connect to the server
        client = MongoClient(mongo_uri, server_api=ServerApi('1'))
        
        # Force a connection to verify it works
        client.admin.command('ping')
        print("✅ Pinged your deployment. You successfully connected to MongoDB!")
        
        # List databases
        print("\nAvailable databases:")
        databases = client.list_database_names()
        for db in databases:
            print(f"  - {db}")
        
        return client
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return None

if __name__ == "__main__":
    client = test_connection()
    if client:
        print("\nSuccessfully connected to MongoDB Atlas!")
