import json
import os
import time
from datetime import datetime, timezone

import requests

API_KEY = os.getenv("ITAD_API_KEY", "")
WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK", "")
ROLE_PING = os.getenv("ROLE_PING", "")

STATE_FILE = "steam_state.json"
OUTPUT_FILE = "public/steam-freebies.json"

ITAD_URL = "https://api.isthereanydeal.com/deals/v2"
STEAM_SHOP_ID = 61

STEAM_LOGO = "https://cdn-icons-png.flaticon.com/512/3670/3670382.png"


def load_json(path, default):
    if not os.path.exists(path):
        return default

    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def fetch_steam_freebies():
    payload = {
        "shops": [STEAM_SHOP_ID],
        "sort": "price",
    }

    r = requests.post(
        ITAD_URL,
        params={"key": API_KEY},
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30,
    )

    print("ITAD:", r.status_code)

    if r.status_code != 200:
        print(r.text[:1000])
        return []

    data = r.json()
    deals = data.get("list", [])

    print("Total ITAD results:", len(deals))

    if deals:
        print("\n=== DEBUG FIRST 2 DEALS ===")
        print(json.dumps(deals[:2], indent=2))
        print("===========================\n")

    freebies = []

    for deal in deals:
        title = deal.get("title", "Unknown Game")
        deal_info = deal.get("deal", {})
        price = deal_info.get("price", {})
        regular = deal_info.get("regular", {})
        shop = deal_info.get("shop", {})

        amount = float(price.get("amount", 9999))
        amount_int = int(price.get("amountInt", 999999))
        cut = int(deal_info.get("cut", 0) or 0)
        regular_amount = float(regular.get("amount", 0))

        if shop.get("id") != STEAM_SHOP_ID:
            continue

        if amount != 0 and amount_int != 0:
            continue

        if cut != 100:
            continue

        if regular_amount <= 0:
            continue

        lower_title = title.lower()
        blocked = ["demo", "playtest", "soundtrack", "server", "tool"]

        if any(word in lower_title for word in blocked):
            continue

        assets = deal.get("assets", {})
        image = (
            assets.get("banner600")
            or assets.get("banner400")
            or assets.get("banner300")
            or assets.get("boxart")
            or ""
        )

        slug = deal.get("slug", "")
        itad_url = f"https://isthereanydeal.com/game/{slug}/" if slug else "https://isthereanydeal.com"

        steam_url = deal_info.get("url") or itad_url

        item = {
            "id": deal.get("id") or slug or title,
            "slug": slug,
            "title": title,
            "url": steam_url,
            "itadUrl": itad_url,
            "image": image,
            "discount": 100,
            "price": "Free",
            "regularPrice": regular.get("amount"),
            "currency": price.get("currency", "USD"),
            "expiry": deal_info.get("expiry"),
            "timestamp": deal_info.get("timestamp"),
            "foundAt": datetime.now(timezone.utc).isoformat(),
        }

        freebies.append(item)

    return freebies


def send_discord(item):
    if not WEBHOOK_URL:
        print("No webhook set, skipping Discord post")
        return False

    fields = [
        {"name": "Discount", "value": "💯 100% OFF", "inline": True},
        {"name": "Price", "value": "FREE TO KEEP", "inline": True},
    ]

    if item.get("regularPrice"):
        fields.append({
            "name": "Regular Price",
            "value": f"{item['regularPrice']} {item.get('currency', '')}",
            "inline": True,
        })

    if item.get("expiry"):
        fields.append({
            "name": "Ends",
            "value": str(item["expiry"]),
            "inline": False,
        })

    embed = {
        "author": {
            "name": "Steam - 100% Off Games",
            "icon_url": STEAM_LOGO,
        },
        "title": item["title"],
        "url": item["url"],
        "color": 0x00D2FF,
        "fields": fields,
        "footer": {
            "text": "Subho's Steam Freebies Informer",
        },
    }

    if item.get("image"):
        embed["image"] = {"url": item["image"]}

    payload = {
        "content": ROLE_PING if ROLE_PING else "",
        "embeds": [embed],
        "allowed_mentions": {"parse": ["roles"]},
    }

    r = requests.post(WEBHOOK_URL, json=payload, timeout=30)

    print("Discord:", r.status_code)

    if r.status_code >= 400:
        print(r.text[:500])
        return False

    return True


def main():
    if not API_KEY or API_KEY == "PASTE_YOUR_ITAD_API_KEY_HERE":
        print("Missing ITAD_API_KEY")
        return

    state = load_json(STATE_FILE, {})
    freebies = fetch_steam_freebies()

    print(f"Detected {len(freebies)} Steam 100% off deals")

    save_json(OUTPUT_FILE, {
        "items": freebies,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    })

    new_count = 0

    for item in freebies:
        deal_id = str(item["id"])

        if deal_id in state:
            continue

        print(f"New Steam 100% off deal: {item['title']}")

        send_discord(item)

        state[deal_id] = {
            "title": item["title"],
            "url": item["url"],
            "foundAt": item["foundAt"],
        }

        save_json(STATE_FILE, state)

        new_count += 1
        time.sleep(1.5)

    print(f"Posted {new_count} new Steam deals")


if __name__ == "__main__":
    main()