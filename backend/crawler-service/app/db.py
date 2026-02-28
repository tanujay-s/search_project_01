import psycopg2
from app.config import DB_CONFIG
import json

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

def insert_crawl_record(conn, url):
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO crawled_pages (url, status)
                values(%s,%s)
                ON CONFLICT (url) DO NOTHING;
                """,
                (url, "pending")
            )
        conn.commit()
        print("Entry added for: ", url)
    except Exception as e:
        conn.rollback()
        print(e)

def update_page_content(conn, data, status):
    try:    
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE crawled_pages
                SET status = %s,
                    title = %s,
                    meta_description = %s,
                    content = %s,
                    h1_tags = %s

                WHERE url = %s
                """,
                (status, 
                 data["title"], data["meta_description"],
                 data["content"], 
                 json.dumps(data["h1_tags"]),
                 data["url"])
            )
        conn.commit()
        print("Entry updated for: ", data["url"])
    except Exception as e:
        conn.rollback()
        print(e)

def get_page_status(conn, url):
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT status
                FROM crawled_pages
                WHERE url = %s
                """,
                (url,)
            )

            row = cursor.fetchone()
            return row[0] if row else None

    except Exception as e:
        print( e)
        return None