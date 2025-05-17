import time
from typing import List
from src.scraper import Scraper
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.common.exceptions import NoSuchElementException
from pydantic import BaseModel

class Profile(BaseModel):
    profile_name: str
    username: str
    description_text: str
    img_url: str

    def __str__(self):
        return f"Profile: {self.profile_name}, Username: {self.username}, Description: {self.description_text}, img_url: {self.img_url}"

class Tweet(BaseModel):
    text: str
    time: str
    comments: int
    retweets: int
    likes: int
    views: int

    def __str__(self):
        return f"Text: '{self.text}', Time: '{self.time}', Comments: '{self.comments}', Retweets: '{self.retweets}', Likes: '{self.likes}', Views: '{self.views}'"

class Twitter(Scraper):
    def __init__(self):
        super().__init__()

    def get_tweets(self) -> List[WebElement]:
        tweet_containers = self.driver.find_elements(By.XPATH, "//article[@data-testid='tweet']")
        return tweet_containers
    
    def get_tweet_data(self, tweet: WebElement) -> Tweet:
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
    
    def scrape_profile_tweets(self, username) -> List[Tweet]:
        self.load_site('https://x.com/' + str.lower(username))
        tweets = self.get_tweets()
        print(f"Found {len(tweets)} tweets.")

        data = []
        for tweet in tweets:
            tweet_data = self.get_tweet_data(tweet)
            data.append(tweet_data)

        return data
    
    def scrape_profile(self, username) -> Profile:
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
        container = self.driver.find_element(By.XPATH, '//div[contains(@data-testid, "UserAvatar-Container")]')
        container.click()
        time.sleep(1)
        # 2. grab img url
        container = self.driver.find_element(By.XPATH, "//div[@aria-label='Image']")
        img = container.find_element(By.XPATH, ".//img")

        return Profile(
            profile_name=profile_name.text, 
            username=username.text, 
            description_text=description_text, 
            img_url=img.get_attribute("src")
        )

    def close(self):
        self.driver.quit()


if __name__ == '__main__':
    tw = Twitter()

    res = tw.scrape_profile("elonmusk")
    print(res)

    tw.close()