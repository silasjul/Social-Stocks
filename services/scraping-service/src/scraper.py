import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Scraper:
    def __init__(self):
        chrome_profile_path = "C:/Users/silas/AppData/Local/Google/Chrome/User Data"

        # --- Selenium setup---
        self.options = Options()
        self.options.add_argument(f"--user-data-dir={chrome_profile_path}") # access to my chrome pass, cookies, history, etc.
        self.options.add_argument("--profile-directory=Default") # use my default profile
        self.options.add_experimental_option("excludeSwitches", ["enable-automation"]) # Avoid bot detection
        self.options.add_experimental_option("useAutomationExtension", False)

        self.driver = webdriver.Chrome(options=self.options)

    def load_site(self, url: str):
        try:
            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, self.tag)))
            time.sleep(5)
            return True
        except Exception as e:
            print(f"\nError occured trying to fetch html: {e}")
            return False
