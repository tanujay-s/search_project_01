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
                UPDATE crawled_pges
                SET status = %s,
                    title = %s,
                    meta_description = %s,
                    content = %s,
                    h1_tags = %s

                WHERE url = %s
                """,
                (status, 
                 data["title"], data["meta_description"],
                 data["content"], data["h1_tags"],  
                 data["url"])
            )
        conn.commit()
        print("Entry updated for: ", data["url"])
    except Exception as e:
        conn.rollback()
        print(e)