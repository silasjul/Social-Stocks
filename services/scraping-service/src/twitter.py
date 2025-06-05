import asyncio
import os
import time
from typing import List, Optional
import httpx
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from pydantic import BaseModel

base_url = os.getenv("DATA_URL")
isDocker = True
if base_url == None: 
    base_url = "http://localhost:8080"
    isDocker = False
    print("Not a docker container")
else: 
    print("Running from docker container")

class Profile(BaseModel):
    id: Optional[int] = None
    profileName: str
    username: str
    description: str
    imgUrl: str

    def __str__(self):
        return f"Profile: {self.profileName}, Username: {self.username}, Description: {self.description}, img_url: {self.imgUrl}"

class Tweet(BaseModel):
    personId: int
    text: str
    time: str
    comments: int
    retweets: int
    likes: int
    views: int

    def __str__(self):
        return f"Text: '{self.text}', Time: '{self.time}', Comments: '{self.comments}', Retweets: '{self.retweets}', Likes: '{self.likes}', Views: '{self.views}'"

class Twitter():
    def __init__(self):
        self.options = Options()
        self.options.add_experimental_option("excludeSwitches", ["enable-automation"]) # Real user imitation
        self.options.add_experimental_option("useAutomationExtension", False)

        if (isDocker): # Running from docker
            self.options.add_argument("--headless=new")
            self.options.add_argument("--window-size=1920,1080") # Resolution is facked in headless mode and it cant find elements
            self.options.add_argument("--no-sandbox") # Needed for docker. MAKES YOUR PC VULNERABLE as attackers are no longer limited by the sandbox configuration and can access your pc
            self.options.add_argument("--disable-dev-shm-usage") # dont use /dev/shm for temporary files
            service = Service(executable_path="/usr/local/bin/chromedriver")
            self.driver = webdriver.Chrome(options=self.options, service=service)
        else:
            self.options.add_argument(r"--user-data-dir=C:\Webdriver\temp\profile") # I created a temporary profile. So i can use my twitter account to access more profiles
            self.options.add_argument(r"--profile-directory=Default")
            self.driver = webdriver.Chrome(options=self.options)
        
        self.wait = WebDriverWait(self.driver, 20)

    def get_tweets(self) -> List[WebElement]:
        tweet_containers = self.driver.find_elements(By.XPATH, "//article[@data-testid='tweet']")
        return tweet_containers
    
    def get_tweet_data(self, personId: int, tweet: WebElement) -> Tweet:
        # Tweet text
        try:
            text_container = tweet.find_element(By.XPATH, ".//div[@data-testid='tweetText']")
            tweet_text = text_container.text
        except NoSuchElementException:
            tweet_text = "" # not all tweets has text

        # Time - datetime of post
        time = tweet.find_element(By.TAG_NAME, "time")
        datetime = time.get_attribute('datetime')

        # Counts - comments, retweets, likes, views
        comments_count = self.get_count(tweet, ".//button[@data-testid='reply']")
        retweets_count = self.get_count(tweet, ".//button[@data-testid='retweet']")
        likes_count = self.get_count(tweet, ".//button[@data-testid='like']")
        try:
            views_count = self.get_count(tweet, ".//a[contains(@aria-label, 'views.')]")
        except NoSuchElementException:
            views_count = -1

        return Tweet(
            personId=personId,
            text=tweet_text,
            time=datetime,
            comments=comments_count,
            retweets=retweets_count,
            likes=likes_count,
            views=views_count
        )

    def get_count(self, tweet: WebElement, xpath: str):
        container = tweet.find_element(By.XPATH, xpath)
        aria = container.get_attribute('aria-label')
        count = aria.split(" ")[0]
        return int(count)
    
    def scrape_profile_tweets(self, username: str, personId: int) -> List[Tweet]:
        self.load_site('https://x.com/' + str.lower(username))
        tweets = self.get_tweets()

        data = []
        for tweet in tweets:
            tweet_data = self.get_tweet_data(personId, tweet)
            data.append(tweet_data)

        return data
    
    def scrape_profile(self, username) -> Profile:
        print("Scraping profile: " + username)
        self.load_site('https://x.com/' + str.lower(username))

        # Profile name
        container = self.driver.find_element(By.XPATH, '//div[@data-testid="UserName"]')
        profile_name = container.find_element(By.XPATH, './/span/span')

        # Username
        username = container.find_element(By.XPATH, './/span[starts-with(text(), "@")]')

        # Description
        description_text = ""
        try:
            description = self.driver.find_element(By.XPATH, '//div[@data-testid="UserDescription"]')
            description_text = description.text
        except NoSuchElementException as e:
            pass # Having a profile description is not mandatory

        # Image
        # 1. click image element
        try:
            container = self.wait.until(EC.element_to_be_clickable((By.XPATH, '//div[@aria-label="Home timeline"]//div[contains(@data-testid, "UserAvatar-Container")]')))
            container.click()
        except NoSuchElementException:
            self.load_site(f"https://x.com/{username}/photo")
        time.sleep(1)
        # 2. grab img url
        container = self.driver.find_element(By.XPATH, "//div[@aria-label='Image']")
        img = container.find_element(By.XPATH, ".//img")

        print("IMG URL: " + img.get_attribute("src"))

        return Profile(
            profileName=profile_name.text, 
            username=username.text, 
            description=description_text, 
            imgUrl=img.get_attribute("src")
        )
    
    def load_site(self, url: str):
        try:
            self.driver.get(url)
            time.sleep(5)
            return True
        except Exception as e:
            print(f"\nError occured trying to fetch html: {e}")
            return False

    def close(self):
        self.driver.quit()

async def scrape_to_infinity():
    async with httpx.AsyncClient() as client:
        while True:
            # Get all people from data-service
            res = None
            try:
                res = await client.get(f"{base_url}/people")
                res.raise_for_status()
            except Exception as e:
                print(f"Error getting people: {e}")

            # Scrape all tweets
            if res:
                for person_data in res.json():
                    person = Profile(**person_data)
                    await scrape(client, person.username, person.id)
            await asyncio.sleep(60)

async def scrape_user_tweets(username: str):
    async with httpx.AsyncClient() as client:
        # Get all people from data-service
        res = None
        try:
            res = await client.get(f"{base_url}/people")
            res.raise_for_status()
        except Exception as e:
            print(f"Error getting people: {e} | {base_url}")

        if res:
            await scrape(client, username, len(res.json())+1) # <- dont be a lazy fuck could cause race condition if multiple users add a person at the same time
            
async def scrape(client: httpx.AsyncClient, username: str, id: int):
    print("Scraping tweets from: " + username)
    # Scrape all tweets
    tw = Twitter()
    tweet_data = tw.scrape_profile_tweets(username, id)
    tw.close()

    # Send tweet to data-service
    dict_tweets = [tweet.model_dump() for tweet in tweet_data]
    try:
        res = await client.post(f"{base_url}/posts", json=dict_tweets)
        res.raise_for_status()
    except Exception as e:
        print(f"Failed to insert scraped tweets: {e}")

if __name__ == '__main__':
    # testing
    tw = Twitter()
    res = tw.scrape_profile("elonmusk")
    print(res)
    tw.close()