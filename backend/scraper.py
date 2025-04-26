from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from typing import List
import time

def get_page_sources(
    base_url: str,
    per_page_xpath: str,
    per_page_value: str,
    next_button_xpath: str,
    max_pages: int
) -> List[str]:
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    driver.get(base_url)
    time.sleep(2)

    try:
        select_elem = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, per_page_xpath))
        )
        Select(select_elem).select_by_value(per_page_value)
        print(f"[i] Selected {per_page_value} items per page")
        time.sleep(2)
    except TimeoutException:
        print(f"[!] Could not find per-page dropdown: {per_page_xpath}")
    except Exception as e:
        print(f"[!] Could not select per-page value: {e}")

    pages = []
    page_counter = 0


    while True:
        pages.append(driver.page_source)
        page_counter += 1

        if page_counter >= max_pages:
            print(f"[i] Reached max pages limit ({max_pages}), stopping.")
            break

        try:
            next_button = driver.find_element(By.XPATH, next_button_xpath)
            if not next_button.is_displayed() or not next_button.is_enabled():
                print("[i] No more next button available.")
                break
            driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
            time.sleep(1)
            next_button.click()
            print(f"[i] Clicked next page ({page_counter})")
            time.sleep(2)
        except NoSuchElementException:
            print("[i] No more next button found, stopping pagination.")
            break
        except Exception as e:
            print(f"[!] Error while trying to paginate: {e}")
            break

    driver.quit()
    return pages
