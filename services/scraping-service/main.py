from typing import List
from fastapi import FastAPI, HTTPException, status
from src.twitter import Twitter, Tweet, Profile
from selenium.common.exceptions import NoSuchElementException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000", # allow frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/twitter/tweets/{username}")
def scrape_user(username: str) -> List[Tweet]:
    tw = Twitter()
    tweet_data = tw.scrape_profile_tweets(username)
    tw.close()
    return tweet_data

@app.get("/twitter/profile/{username}")
def scrape_user(username: str) -> Profile:
    tw = Twitter()
    try:
        profile_data = tw.scrape_profile(username)
    except NoSuchElementException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, # Profile not found
            detail=f"user '@{username}' not found."
        )
    finally:
        tw.close()
    return profile_data