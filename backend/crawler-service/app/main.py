from app.crawler import fetch_page
from app.extractor import extract_data
from app.db import (
    get_connection,
    insert_crawl_record,
    update_page_content,
    get_pending_link,
    mark_crawling,
    mark_done,
    insert_new_link,
    get_page_status
)
import time
from urllib.parse import urlparse

def normalize_url(url):
    url = url.split("#")[0]
    url = url.split("?")[0]
    return url.rstrip("/")


def crawl_next():

    conn = get_connection()
    if not conn:
        print("DB connection failed")
        return

    row = get_pending_link(conn)

    if not row:
        print("No pending links")
        conn.close()
        return

    link_id, url, depth = row

    status = get_page_status(conn, url)

    if status == "completed":
        print("[SKIP] Already crawled:", url)
        mark_done(conn, link_id)
        conn.close()
        return

    print("Crawling:", url)

    mark_crawling(conn, link_id)

    insert_crawl_record(conn, url)

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

        mark_done(conn, link_id)
        conn.close()
        return

    data = extract_data(url, result["html"])

    print("Total links extracted:", len(data["links"]))

    update_page_content(conn, data, "completed")

    MAX_DEPTH = 2
    MAX_LINKS_PER_PAGE = 50
    seen = set()

    if depth < MAX_DEPTH:
        for link in data["links"][:MAX_LINKS_PER_PAGE]:

            link = normalize_url(link)

            parsed = urlparse(link)

            if link in seen:
                continue
            seen.add(link)

            if parsed.netloc != "www.geeksforgeeks.org":
                continue

            if not parsed.path.startswith("/dsa/"):
                continue

            insert_new_link(conn, link, depth + 1, url)

    mark_done(conn, link_id)
    conn.close()


if __name__ == "__main__":

    while True:
        crawl_next()
        time.sleep(1)