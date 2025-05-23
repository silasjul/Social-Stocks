import asyncio
from contextlib import asynccontextmanager
from fastapi import BackgroundTasks, FastAPI, HTTPException, status
from src.twitter import Twitter, Profile, scrape_to_infinity, scrape_user_tweets
from selenium.common.exceptions import NoSuchElementException
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    scraper = asyncio.create_task(scrape_to_infinity())
    yield
    scraper.cancel()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000", # allow frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/twitter/profile/{username}")
def scrape_user(username: str, background_tasks: BackgroundTasks) -> Profile:
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
    background_tasks.add_task(scrape_user_tweets, username)
    return profile_data