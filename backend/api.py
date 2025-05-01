from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi import Path
from db import get_all_truths
from run import run_once, serialize_truth
import asyncio
import json


app = FastAPI()

@app.get("/truths")
async def get_truths():
    truths = get_all_truths()
    return [serialize_truth(t) for t in truths]

@app.get("/stream/{interval}")
async def stream_truths(interval: int = Path(..., ge=5, le=3600)):
    async def event_generator():
        while True:
            new_truths = run_once(streaming=True)
            if new_truths:
                yield f"data: {json.dumps([new_truths])}\n\n"
            await asyncio.sleep(interval)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
