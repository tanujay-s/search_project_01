import psycopg2
from app.config import DB_CONFIG

def get_connection():
    try:
        connection = psycopg2.connect(
            host = DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            database=DB_CONFIG["database"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"] 
        )
        return connection
    except Exception as e:
        print("Database Connection failed")
        print(e)
        return None