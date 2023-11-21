from typing import List, Union
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from Post import Post
from jose import jwt
import requests
import json
import db as db
import os
from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.add_middleware(
    SessionMiddleware, secret_key=os.getenv("SECRET_KEY")
)
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
async def auth_google(code: str, request: Request):
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
    # print(f"\n\nresponse = {response.json().get("access_token")}\n\n")
    user_info = requests.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {access_token}"})
    request.session["access_token"] = access_token
    return user_info.json()


def get_current_token(request: Request):
    token = request.session.get("access_token")
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token


@app.get("/token")
async def get_token(token: str = Depends(get_current_token)):
    print(f"\n\nToken = {token}\n\n")
    return token