from scraper import get_page_sources
from truth_parser import parse_truths
from db import get_last_scraped_href_and_time, insert_truths, update_last_scraped_href_and_time, get_truths_count, get_all_truths
from dotenv import load_dotenv
import os
import argparse
import time
import json
from datetime import datetime

load_dotenv()
base_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(base_dir, "config.json")

with open(config_path, "r") as config_file:
    config = json.load(config_file)

max_pages = config.get("max_pages", 10)

def parse_args():
    parser = argparse.ArgumentParser(description="Run the Social Stocks scraper.")
    parser.add_argument("--stream", action="store_true", help="Continuously scrape in streaming mode")
    parser.add_argument("--interval", type=int, default=60, help="Interval between scrapes in streaming mode (seconds)")
    parser.add_argument("--all", action="store_true", help="Show all truths in database")
    return parser.parse_args()

def run_once(streaming=False, max_pages=None):

    if streaming:
        max_pages = 0
    elif max_pages is None:
        max_pages = int(os.getenv("MAX_PAGES", 10))
    
    # Inform how many pages MAX_PAGES are set to
    if max_pages == 0:
        print("[i] Scraper set to FIRST PAGE ONLY mode")
    else:
        print(f"[i] Scraper configured to use max_pages={max_pages}")
    

    base_url = "https://trumpstruth.org/"
    per_page_xpath = "//select[@name='per_page']"
    per_page_value = "50"
    next_button_xpath = "//a[@class='button button--xsmall']"

    last_href, last_time = get_last_scraped_href_and_time()

    if streaming:
        per_page_value = "10"

    pages = get_page_sources(
        base_url=base_url,
        per_page_xpath=per_page_xpath,
        per_page_value=per_page_value,
        next_button_xpath=next_button_xpath,
        max_pages=max_pages
    )

    
    
    truths, newest_href, newest_time = parse_truths(pages, last_href, last_time)

    before_count = get_truths_count()

    if truths:
        insert_truths(truths)
        update_last_scraped_href_and_time(newest_href, newest_time)
        print(f"[i] Inserted {len(truths)} new truths.")
    else:
        print("[i] No new truths to insert.")

    after_count = get_truths_count()

    print(f"Tried to insert {len(truths)} truths.")
    print(f"Actually inserted: {after_count - before_count}")
    
    if streaming:
        # Streaming mode: return Python-objects
        return [serialize_truth(t) for t in truths]
    else:
        # One-shot mode: return ALL from database
        return [serialize_truth(t) for t in truths]

def run_stream(interval: int):
    while True:
        new_truths = run_once(streaming=True)

        if new_truths:           
            print(json.dumps(new_truths))
        
        print(f"[i] Sleeping {interval} seconds before next scrape...")
        time.sleep(interval)


def serialize_truth(truth):
    """Helper to turn a Truth object into JSON-venlig dict."""
    return {
        "href": truth.href,
        "content": truth.content,
        "timestamp": truth.timestamp.isoformat() if truth.timestamp else None,
        "is_retruth": truth.is_retruth,
        "media_url": truth.media_url
    }

def handle_one_shot():
    truths = run_once(streaming=False, max_pages=max_pages)
    return truths

def handle_streaming(interval):
    try:
        run_stream(interval)
    except KeyboardInterrupt:
        print("\n[i] Exiting steam-mode... Goodbye!")






def main():
    args = parse_args()

    if args.stream:
        print("[i] Running in STREAMING mode!")
        handle_streaming(args.interval)
        
    elif args.all:
        print("Printing all truths")
        truths = get_all_truths()
        for t in truths:
            print(json.dumps([serialize_truth(t) for t in truths], indent=2))

    else:
        print("[i] Running in ONE-SHOT mode!")
        truths = handle_one_shot()
        if truths:
            print(json.dumps(truths))


if __name__ == "__main__":
    main()
