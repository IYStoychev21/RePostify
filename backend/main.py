from typing import List, Union
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from Post import Post
from jose import jwt
import requests
import json
import db as db
import os
from dotenv import load_dotenv

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    db.cur.execute(f"""
                        SELECT * FROM post WHERE id = {post_id}           
    """)
    return db.cur.fetchone()[1]


@app.get("/posts")
def get_posts():
    db.cur.execute(f"""
                        SELECT * FROM post 
    """)
    return db.cur.fetchall()


@app.get("/login/google")
async def login_google():
    load_dotenv()
    print(os.getenv("GOOGLE_CLIENT_ID"))
    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={os.getenv("GOOGLE_CLIENT_ID")}&redirect_uri={os.getenv("GOOGLE_REDIRECT_URI")}&scope=openid%20profile%20email&access_type=offline"
    }


@app.get("/auth/google")
async def auth_google(code: str):
    token_url = "https://accounts.google.com/o/oauth2/token"
    data = {
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")
    user_info = requests.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {access_token}"})
    print(user_info.json())
    return user_info.json()


@app.get("/token")
async def get_token(token: str = Depends(oauth2_scheme)):
    return jwt.decode(token, db.GOOGLE_CLIENT_SECRET, algorithms=["HS256"])