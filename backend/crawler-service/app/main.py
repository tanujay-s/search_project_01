from app.crawler import fetch_page
from app.extractor import extract_data
from app.db import (
    get_connection,
    insert_crawl_record,
    update_page_content,
    get_pending_link,
    mark_crawling,
    mark_done,
    insert_new_link
)


def crawl_next():

    conn = get_connection()
    if not conn:
        print("DB connection failed")
        return

    # get next pending link
    row = get_pending_link(conn)

    if not row:
        print("No pending links")
        conn.close()
        return

    link_id, url, depth = row

    print("Crawling:", url)

    mark_crawling(conn, link_id)

    # insert into crawled_pages
    insert_crawl_record(conn, url)

    # fetch page
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

    # extract
    data = extract_data(url, result["html"])

    update_page_content(conn, data, "completed")

    # recursive crawling
    MAX_DEPTH = 2

    if depth < MAX_DEPTH:
        for link in data["links"]:
            insert_new_link(conn, link, depth + 1, url)

    # mark done in queue
    mark_done(conn, link_id)

    conn.close()


if __name__ == "__main__":

    while True:
        crawl_next()