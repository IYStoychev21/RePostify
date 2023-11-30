from calendar import c
import os
from click import File
from fastapi import APIRouter, HTTPException, Request, UploadFile, Form
from typing import List, Optional
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import requests
from . import db
import re
from azure.storage.blob.aio import BlobServiceClient

blob_service_client = BlobServiceClient.from_connection_string("DefaultEndpointsProtocol=https;AccountName=repostify;AccountKey=SMXj6x5aTMVgb5y3Qn9m97sg7fDQoGaodfplm7fGJVxyInSRzXNV2VknIa3hUuH9K/g6ZLDDMUam+AStjUbJYg==;EndpointSuffix=core.windows.net")

class Post(BaseModel):
    body: str
    image: Optional[UploadFile] = None

router = APIRouter()

@router.get("/posts/{post_id}", tags=["Posts"])
async def get_post(post_id: int):
    try:
        db.cur.execute(f"""
                            SELECT * FROM posts WHERE id = {post_id}           
        """)
        result = db.cur.fetchone()
        
        if not result:
            raise TypeError
        
        return result["name"]
    except TypeError:
        raise HTTPException(status_code=404, detail=f"Could not find post with id {post_id}")

@router.get("/posts", tags=["Posts"])
async def get_posts():
    try:
        db.cur.execute(f"""
                            SELECT * FROM posts 
        """)
        result = db.cur.fetchall()
        
        if not result:
            raise ValueError
        
        return result
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Could not find any posts")


@router.get("/organisation/posts/{organisation_id}", tags=["Posts"])
async def get_organisation_posts(organisation_id: int):
    try:
        
        db.cur.execute(f"""SELECT * FROM pou_bridge WHERE oid = {organisation_id}""")
        pou_data = db.cur.fetchall()
        
        if not pou_data:
            raise ValueError
        
        result = []
        
        for (i, pou) in enumerate(pou_data):
            db.cur.execute(f"""SELECT * FROM posts WHERE id = {pou['pid']}""")
            post = db.cur.fetchone()
            db.cur.execute(f"""SELECT * FROM users WHERE id = {pou['uid']}""")
            user = db.cur.fetchone()
            
            result.append({"post": post, "user": user})
            
        return result
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Could not find any posts")


@router.get("/user/posts/{user_id}", tags=["Posts"])
async def get_user_posts(user_id: int):
    db.cur.execute(f"""SELECT * FROM pou_bridge WHERE uid = {user_id}""")
    return db.cur.fetchall()


@router.post("/post/create/{organisation_id}", tags=["Posts"])
async def create_post(request: Request, organisation_id: int, body: str = Form(...), image: UploadFile = File(...)): # type: ignore
    if not request.session.get('email'):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db.cur.execute(f"""SELECT * FROM organisations WHERE id = {organisation_id}""")
    organisation = db.cur.fetchone()
    
    if not organisation:
        raise HTTPException(status_code=404, detail="Could not find organisation")
    
    
    
    db.cur.execute("""INSERT INTO posts (id, body)
                        VALUES           
                            (DEFAULT, %s) RETURNING id;
    """, (body, ))
    
    post_id = db.cur.fetchone()["id"] # type: ignore
    
    db.cur.execute(f"""SELECT * FROM users WHERE lower(email) = lower('{request.session.get('email')}')""")
    user_id = db.cur.fetchone()["id"] # type: ignore
    
    db.cur.execute(f"""INSERT INTO pou_bridge (id, pid, oid, uid)
                        VALUES
                            (DEFAULT, {post_id}, {organisation_id}, {user_id});
    """)
    
    db.conn.commit()
    
    
    
    
@router.get("/post/publish/facebook", response_class=RedirectResponse, tags=["Posts"])
async def auth_facebook(code: str, request: Request) -> RedirectResponse:
    token_url = "https://graph.facebook.com/oauth/access_token"
    print(f"app secret: {os.getenv("FACEBOOK_APP_SECRET")}")
    params = {
        "client_id": os.getenv("FACEBOOK_APP_ID"),
        "redirect_uri": os.getenv("FACEBOOK_REDIRECT_URI"),
        "client_secret": "0fcd5275692c7c4e2468f44489429db8",
        "code": code
    }
    response = requests.get(token_url, params=params).json()
    print(f"response: {response}")
    access_token = response.get("access_token")
    # print(f"code: {access_token}")  # Print the access token
    # request.session["access_token"] = access_token
    print(f"access_token: {access_token}")

    pages_response = requests.get("https://graph.facebook.com/me/accounts", params={"access_token": access_token}).json()
    page_access_token = pages_response['data'][0]['access_token']  # Get the access token for the first page
    print(f"page_access_token: {page_access_token}")
    
    post_url = f"https://graph.facebook.com/{pages_response['data'][0]['id']}/feed"
    post_params = {
        "message": "Hello, world from python!",
        "access_token": page_access_token
    }
    post_response = requests.post(post_url, data=post_params)

    return RedirectResponse(url="http://localhost:5173/organizations")
    
    
@router.delete("/post/delete/{post_id}", tags=["Posts"])
async def delete_post(post_id: int):
    db.cur.execute(f"""DELETE FROM posts WHERE id = {post_id}""")
    db.conn.commit()