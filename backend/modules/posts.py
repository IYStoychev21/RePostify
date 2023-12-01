from importlib.resources import Resource
import os
from fastapi import APIRouter, File, HTTPException, Request, UploadFile, Form
from typing import Optional
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import requests
from . import db
import re
from azure.storage.blob.aio import BlobServiceClient
from azure.core.exceptions import ResourceExistsError
import uuid

blob_service_client = BlobServiceClient.from_connection_string("DefaultEndpointsProtocol=https;AccountName=repostify;AccountKey=SMXj6x5aTMVgb5y3Qn9m97sg7fDQoGaodfplm7fGJVxyInSRzXNV2VknIa3hUuH9K/g6ZLDDMUam+AStjUbJYg==;EndpointSuffix=core.windows.net")

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
async def create_post(request: Request, organisation_id: int, body: str = Form(...), image: UploadFile = File(None)):
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
    
    if image:
        _, extension = image.filename.split(".") # type: ignore
        
        print(f"\n\n{image.filename}\n\n")
        container_client = blob_service_client.get_container_client("images")
        
        try:
            if not await container_client.exists():
                await container_client.create_container()
                
            blob_client = container_client.get_blob_client(f"{uuid.uuid4()}.{extension}")
            
            await blob_client.upload_blob(await image.read(), blob_type="BlockBlob")
            db.cur.execute(f"""UPDATE posts SET attachment = '{blob_client.url}' WHERE id = {post_id}""")
        except:
            raise HTTPException(status_code=500, detail="Could not upload image")
                
    
    
    
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
    print(f"app secret: {os.getenv('FACEBOOK_APP_SECRET')}")
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
    db.cur.execute(f"""DELETE FROM pou_bridge WHERE pid = {post_id}""")
    db.cur.execute(f"""DELETE FROM posts WHERE id = {post_id}""")
    db.conn.commit()