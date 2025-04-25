from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from datetime import datetime
from db import get_last_scraped_href_and_time, update_last_scraped_href_and_time
import mysql.connector
import os
import time
from dotenv import load_dotenv

load_dotenv()

last_href, last_scraped_time = get_last_scraped_href_and_time()
newest_href = None
newest_time = last_scraped_time
stop_scraping = False
scraped_count = 0
new_truths = []

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Start browser
driver = webdriver.Chrome(options=options)
driver.get("https://trumpstruth.org/")
time.sleep(2)

# Show 50 truths per page
try:
    select_elem = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//select[@name='per_page']"))
    )
    Select(select_elem).select_by_value("50")
    time.sleep(2)
except Exception as e:
    print(f"[!] Could not choose 50 per page: {e}")

while True:
    soup = BeautifulSoup(driver.page_source, "html.parser")
    truth_links = soup.select('a.status-info__meta-item[href]:not([href="#"])')
    truth_texts = soup.select('div.status__content > p')

    for i in range(len(truth_links)):
        link = truth_links[i]
        text = truth_texts[i].get_text(strip=True) if i < len(truth_texts) else None
        href = link['href']
        time_text = link.get_text(strip=True)

        try:
            parsed_time = datetime.strptime(time_text, "%B %d, %Y, %I:%M %p")
            rounded_time = parsed_time.replace(second=0, microsecond=0)
        except Exception as e:
            print(f"[!] Could not parse time: {time_text} ({e})")
            continue

        if last_href and last_scraped_time:
            if href == last_href and rounded_time == last_scraped_time:
                stop_scraping = True
                print(f"[i] Ramte sidste kendte truth: {href} @ {parsed_time}")
                break

        new_truths.append((href, text, parsed_time))
        scraped_count += 1

        if not newest_time or rounded_time > newest_time:
            newest_time = rounded_time
            newest_href = href

    if stop_scraping:
        print("[i] Stopped since last saved truth is found.")
        break

    try:
        next_button = driver.find_element(By.XPATH, "//a[@class='button button--xsmall']")
        driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
        time.sleep(1)
        next_button.click()
        time.sleep(2)
    except NoSuchElementException:
        print("[i] No more pages to get.")
        break

print(f"Hentede i alt {scraped_count} nye truths.")
driver.quit()

# Bulk insert to DB
if new_truths:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    cursor = conn.cursor()

    # Før indsættelse
    cursor.execute("SELECT COUNT(*) FROM truths")
    before_count = cursor.fetchone()[0]

    cursor.executemany("""
        INSERT INTO truths (url, content, timestamp)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE url=url
    """, new_truths)
    conn.commit()

    # Efter indsættelse
    cursor.execute("SELECT COUNT(*) FROM truths")
    after_count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    print(f"Forsøgte at indsætte {len(new_truths)} truths.")
    print(f"Faktisk indsat: {after_count - before_count}")

if newest_time:
    update_last_scraped_href_and_time(newest_href, newest_time)
