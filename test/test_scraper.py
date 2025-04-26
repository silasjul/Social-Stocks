from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup
import json
import time
import sys
from datetime import datetime

# Dummy-tidspunkt – du kan ændre til det, du ønsker
last_href = "https://trumpstruth.org/statuses/30666"
last_scraped_time = datetime(2025, 4, 16, 7, 6)
stop_scraping = False


options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)
driver.get("https://trumpstruth.org/")
time.sleep(2)

# Vælg 50 truths per page
try:
    select = Select(driver.find_element(By.ID, "per_page"))
    select.select_by_value("50")
    time.sleep(5)
except Exception as e:
    print(f"[!] Kunne ikke vælge '50 per page': {e}")

data = []

while True:
    soup = BeautifulSoup(driver.page_source, "html.parser")
    truth_links = soup.select('a.status-info__meta-item[href]:not([href="#"])')
    truth_texts = soup.select('div.status__content > p')

    for i in range(len(truth_links)):
        link = truth_links[i]
        text = truth_texts[i].get_text(strip=True) if i < len(truth_texts) else None

        href = link['href']
        time_text = link.get_text(strip=True)

        # Parse og check om vi skal stoppe
        try:
            parsed_time = datetime.strptime(time_text, "%B %d, %Y, %I:%M %p")
        except Exception as e:
            print(f"[!] Kunne ikke parse tidspunkt: {time_text} ({e})")
            parsed_time = None

        if href == last_href and parsed_time == last_scraped_time:
            print(f"[i] Ramte grænsen: {parsed_time} <= {last_scraped_time}")
            stop_scraping = True
            break

        data.append({
            "href": href,
            "time": time_text,
            "text": text
        })
        

    # Find og klik på næste side
    try:
        next_button = driver.find_element(By.XPATH, "//a[@class='button button--xsmall']")
        next_href = next_button.get_attribute("href")
        if next_href:
            driver.get(next_href)
            time.sleep(2)
        else:
            print("[i] Knappen har ikke noget href — stopper.")
            break
    except NoSuchElementException:
        print("[i] Ingen flere sider at hente.")
        break
    if stop_scraping:
        break
driver.quit()

with open("truths.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

try:
    sys.stdout.buffer.write(json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8'))
except Exception as e:
    print(f"[!] Kunne ikke vise i terminalen: {e}")

print(f"Hentede {len(data)} truths i alt.")
