from bs4 import BeautifulSoup

def extract_data(url, html):
    soup = BeautifulSoup(html, "html.parser")

    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    print(title)

    meta_disc = ""
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        meta_disc = desc_tag["content"].strip()
    print(meta_disc)