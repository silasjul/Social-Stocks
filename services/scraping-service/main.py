from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.twitter import Twitter, Tweet

tw = Twitter()
app = FastAPI()

@app.get("/twitter/scrape/{username}")
def scrape_user(username: str) -> List[Tweet]:
    return tw.scrape_profile(username)