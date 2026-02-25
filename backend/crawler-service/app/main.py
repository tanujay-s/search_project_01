from app.crawler import fetch_page
from app.extractor import extract_data
# from app.db import get_connection

def run(url):
    result = fetch_page(url)

    if not result or result["status_code"] !=200:
        print("Failed to get result")
        return
    print("Status Code:", result["status_code"])
    print("HTML length:", len(result["html"]))
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

