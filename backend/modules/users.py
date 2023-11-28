import re
from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import EmailStr
from . import db

router = APIRouter()

@router.get("/user/organisations/{user_id}", tags=["Users"])
def get_user_organisations(user_id: int):
    db.cur.execute(f"""SELECT * FROM uo_bridge WHERE uid = {user_id}""")
    rows = db.cur.fetchall()
    return rows or None


@router.get("/user", tags=["Users"])
async def get_user_info(request: Request):
    try:
        email: EmailStr = request.session.get("email") # type: ignore
        if not email:
            raise TypeError
        
        db.cur.execute(f"""SELECT * FROM users WHERE lower(email) = lower('{email}')""")
        user_info = db.cur.fetchone()
        
        if user_info is None:
            print("\n\nhello\n\n")
            raise TypeError
        
        user_info["pfp"] = user_info["pfp"][0:-4] + "320-c"
        
        return user_info
    except TypeError as e:
        raise HTTPException(status_code=404, detail=f"{e}")


@router.delete("/user/organisation/leave/{organisation_id}", tags=["Users"])
async def leave_organisation(request: Request, organisation_id: int):
    if not "email" in request.session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db.cur.execute(f"""SELECT * FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get('email')}'))""")
    user_role = db.cur.fetchone()["role"] # type: ignore
    
    if (user_role == "owner"):
        raise HTTPException(status_code=401, detail="Cannot leave organisation as owner")
    
    db.cur.execute(f"""DELETE FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get('email')}')) AND oid = {organisation_id}""")
    db.conn.commit()
    

@router.delete("/user/delete", tags=["Users"])
async def delete_user(request: Request):
    if not "email" in request.session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db.cur.execute(f"""SELECT * FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get('email')}'))""")
    oid = db.cur.fetchone()["oid"] # type: ignore
    
    db.cur.execute(f"""SELECT * FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get('email')}'))""")
    user_role = db.cur.fetchone()["role"] # type: ignore
    
    db.cur.execute(f"""DELETE FROM pou_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get('email')}'))""")
    db.cur.execute(f"""DELETE FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get('email')}'))""")
    
    if (user_role == "owner"):        
        db.cur.execute(f"""DELETE FROM organisations WHERE id = {oid}""")
    
    db.cur.execute(f"""DELETE FROM users WHERE lower(email) = lower('{request.session.get('email')}')""")
    db.conn.commit()
    
    request.session.pop("access_token", None)
    request.session.pop("email", None)
    
    return {"detail": "Successfully deleted user"}