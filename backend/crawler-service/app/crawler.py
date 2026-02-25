import requests

def fetch_page(url):
    try:
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
        }

        response = requests.get(url, headers=headers, timeout=10)

        return {
            "status_code": response.status_code,
            "html": response.text
        }
    except requests.exceptions.RequestException as e:
        print("Error in fetching page: ", e)
        return None
