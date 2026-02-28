from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin


def extract_data(url, html):
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "nav", "footer", "aside"]):
        tag.decompose()

    title = soup.title.string.strip() if soup.title and soup.title.string else ""

    meta_desc = ""
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        meta_desc = desc_tag["content"].strip()
    else:
        og_desc = soup.find("meta", property="og:description")
        if og_desc and og_desc.get("content"):
            meta_desc = og_desc["content"].strip()

    h1_tags = [h1.get_text(strip=True) for h1 in soup.find_all("h1")]

    content = soup.get_text(separator=" ", strip=True)
    content = re.sub(r"\s+", " ", content)

    links = [
        urljoin(url, a["href"])
        for a in soup.find_all("a", href=True)
    ]
    
    return {
        "url": url,
        "title": title,
        "meta_description": meta_desc,
        "h1_tags": h1_tags,
        "content": content,
        "links": links
    }