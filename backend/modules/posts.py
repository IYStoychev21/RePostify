from calendar import c
from fastapi import APIRouter
from fastapi import APIRouter, HTTPException, Request
from typing import List
from pydantic import BaseModel
from . import db
import re

class Post(BaseModel):
    body: str

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
async def create_post(request: Request, organisation_id: int, body: Post):
    if not request.session.get('email'):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db.cur.execute(f"""SELECT * FROM organisations WHERE id = {organisation_id}""")
    organisation = db.cur.fetchone()
    
    if not organisation:
        raise HTTPException(status_code=404, detail="Could not find organisation")
    
    db.cur.execute("""INSERT INTO posts (id, body)
                        VALUES           
                            (DEFAULT, %s) RETURNING id;
    """, (body.body, ))
    
    post_id = db.cur.fetchone()["id"] # type: ignore
    
    db.cur.execute(f"""SELECT * FROM users WHERE lower(email) = lower('{request.session.get('email')}')""")
    user_id = db.cur.fetchone()["id"] # type: ignore
    
    db.cur.execute(f"""INSERT INTO pou_bridge (id, pid, oid, uid)
                        VALUES
                            (DEFAULT, {post_id}, {organisation_id}, {user_id});
    """)
    
    db.conn.commit()
    
    
@router.delete("/post/delete/{post_id}", tags=["Posts"])
async def delete_post(post_id: int):
    db.cur.execute(f"""DELETE FROM posts WHERE id = {post_id}""")
    db.conn.commit()