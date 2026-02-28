from app.crawler import fetch_page
from app.extractor import extract_data
from app.db import (
    get_connection,
    insert_crawl_record,
    update_page_content,
    get_page_status
)

def run(url):
    conn = get_connection()
    if not conn:
        print("DB connection failed")
        return

    existing_status = get_page_status(conn, url)
    if existing_status == "completed":
        print("Page is alerady added: ", url)
        conn.close()
        return

    # add basic info of crawled pages
    insert_crawl_record(conn, url)
    
    # crawl page
    result = fetch_page(url)

    if not result or result["status_code"] != 200:
        print("Fetch failed")
        update_page_content(conn, {
            "url": url,
            "title": "",
            "meta_description": "",
            "content": "",
            "h1_tags": []
        }, "failed")
        conn.close()
        return    

    # extract crawled page data
    data = extract_data(url, result["html"])
    
    # store whole data after extracting it in diff parts 
    update_page_content(conn, data, "completed")

    conn.close()

if __name__ == "__main__":
    test_url = "https://www.geeksforgeeks.org/python/command-line-interface-programming-python/"
    run(test_url)

