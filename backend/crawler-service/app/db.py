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

def get_pending_link(conn):
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, url, depth
                FROM links_to_crawl
                WHERE status = 'pending'
                ORDER BY id
                LIMIT 1
                """
            )
            row = cursor.fetchone()
            return row if row else None
    except Exception as e:
        print(e)
        return None
    
def mark_crawling(conn, link_id):
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE links_to_crawl
                SET status = 'crawling'
                WHERE id = %s
                """,
                (link_id,)
            )

        conn.commit()
        print("Crawling marked for id:", link_id)

    except Exception as e:
        conn.rollback()
        print(e)

def mark_done(conn, link_id):
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE links_to_crawl
                SET status = 'done'
                WHERE id = %s
                """,
                (link_id,)
            )
        conn.commit()
        print("Updated crawled status completed of id: ", link_id)
    
    except Exception as e:
        conn.rollback()
        print(e)

def insert_new_link(conn, url, depth, from_url):
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO links_to_crawl (url, depth, discovered_from, status)
                VALUES (%s, %s, %s, 'pending')
                ON CONFLICT (url) DO NOTHING
                """,
                (url, depth, from_url)
            )

        conn.commit()
        print("Inserted new link:", url)

    except Exception as e:
        conn.rollback()
        print(e)