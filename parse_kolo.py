import json

with open("KOLO REV.json", "r", encoding="utf-8") as f:
    data = json.load(f)

urls = []
def extract_requests(item_list, path_prefix=""):
    for item in item_list:
        name = path_prefix + item.get("name", "Unknown")
        if "request" in item:
            url = item["request"].get("url", {})
            if isinstance(url, dict):
                raw = url.get("raw", "")
                urls.append(f"{name}: {raw}")
            elif isinstance(url, str):
                urls.append(f"{name}: {url}")
        if "item" in item:
            extract_requests(item["item"], name + " -> ")

extract_requests(data.get("item", []))

with open("endpoints_list.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(urls))
