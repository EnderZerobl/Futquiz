from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World", "data": "RECEBA!!"}

@app.get("/random")
async def get_random_number():
    rn = random.randint(1, 100)
    return {f"random": rn, "limit": 100}

@app.get("/random/{limit}")
async def get_random_number_with_limit(limit: int):
    rn = random.randint(0, limit)
    return {"random": rn, "limit": limit}