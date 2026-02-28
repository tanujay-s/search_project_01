from app.crawler import fetch_page
from app.extractor import extract_data
from app.db import get_connection, insert_crawl_record

def run(url):
    # add basic info of crawled pages
    conn = get_connection()
    insert_crawl_record(conn, url)
    
    # crawl page
    result = fetch_page(url)    

    # extract crawled page data
    data = extract_data(url, result["html"])
    print(data)

# def db():
#     conn = get_connection()
#     if(conn):
#         print("Database connected successfully")
#         conn.close()
#     else:
#         print("Connection failed")

if __name__ == "__main__":
    test_url = "https://www.geeksforgeeks.org/python/command-line-interface-programming-python/"
    run(test_url)

