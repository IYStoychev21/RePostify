from typing import List
from fastapi import APIRouter, FastAPI, HTTPException, Request
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from . import db

router = APIRouter()

class Member(BaseModel):
    email: EmailStr
    role: str

class CreateOrganisationBody(BaseModel):
    name: str
    owner: str
    members: List[Member] | None = None
    
class AddMemberBody(BaseModel):
    members: List[Member]


@router.get("/organisation/{organisation_id}", tags=["Organisations"])
async def get_organisation(organisation_id: int):
    db.cur.execute(f"""SELECT * FROM organisations WHERE id = {organisation_id}""")
    return db.cur.fetchone()


@router.get("/organisation/members/{organisation_id}", tags=["Organisations"])
async def get_organisation_members(organisation_id: int):
    db.cur.execute(f"""SELECT role FROM uo_bridge WHERE oid = {organisation_id}""")
    roles = db.cur.fetchall()
    
    db.cur.execute(f"""SELECT uid FROM uo_bridge WHERE oid = {organisation_id}""")
    user_ids = db.cur.fetchall()
    
    users = []
    
    for user_id in user_ids:
        db.cur.execute(f"""SELECT * FROM users WHERE id = {user_id['uid']}""")
        users.append(db.cur.fetchone())
    
    for i in range(len(user_ids)):
        users[i]["role"] = roles[i]["role"]
        
    return {"users": users}


@router.post("/organisation/member/add/{organisation_id}", tags=["Organisations"])
async def add_member(request: Request, organisation_id: int, body: AddMemberBody):
    if not request.session.get("email"):
        raise HTTPException(status_code=400, detail="Not logged in")
    db.cur.execute(f"""SELECT role FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get('email')}') LIMIT 1)""")
    role: str = db.cur.fetchone()["role"] # type: ignore
    
    
    
    if role != "owner":
        raise HTTPException(status_code=401, detail="Not authorised")
    
    members = body.members
    
    for member in members:
        db.cur.execute(f"""SELECT * FROM users WHERE email = '{member.email}'""")
        member_db = db.cur.fetchone()
        
        if member_db is None:
            raise HTTPException(status_code=400, detail=f"User ({member.email}) doesn't exist")
        
        db.cur.execute(f"""INSERT INTO uo_bridge (id, uid, oid, role)
                        VALUES           
                            (DEFAULT, (SELECT id FROM users WHERE email = '{member.email}'), {organisation_id}, '{member.role}');
        """)
    
    db.conn.commit()


@router.post("/organisation/create", tags=["Organisations"])
async def create_organisation(request: Request, body: CreateOrganisationBody):
    db.cur.execute(f"""SELECT * FROM organisations WHERE lower(name) = lower('{body.name}')""")
    organisation = db.cur.fetchone()
    if (organisation is not None):
        raise HTTPException(status_code=400, detail="Organisation already exists")
    
    db.cur.execute(f"""INSERT INTO organisations (id, name)
                        VALUES           
                            (DEFAULT, '{body.name}');
    """)
    
    db.cur.execute(f"""INSERT INTO uo_bridge (id, uid, oid, role)
                        VALUES           
                            (DEFAULT, (SELECT id FROM users WHERE email = '{body.owner}'), (SELECT id FROM organisations WHERE name = '{body.name}'), 'owner');
    """)
    
    if body.members is None:
        db.conn.commit()
        return
    
    for member in body.members:
        db.cur.execute(f"""SELECT * FROM users WHERE email = '{member.email}'""")
        member_db = db.cur.fetchone()
        
        if member_db is None:
            raise HTTPException(status_code=400, detail=f"User ({member.email}) doesn't exist")
        
        db.cur.execute(f"""INSERT INTO uo_bridge (id, uid, oid, role)
                        VALUES           
                            (DEFAULT, (SELECT id FROM users WHERE email = '{member.email}'),
                            (SELECT id FROM organisations WHERE name = '{body.name}'), '{member.role}');
        """)
    
    db.conn.commit()
    
@router.delete("/organisation/delete/{organisation_id}", tags=['Organisations'])
async def delete_organisation(request: Request, organisation_id: int):
    if not request.session.get("email"):
        raise HTTPException(status_code=400, detail="Not logged in")
    
    db.cur.execute("""SELECT role FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower(%s)) AND oid = %s""", (request.session.get("email"),organisation_id))
    user_role:str = db.cur.fetchone()["role"] # type: ignore
    
    if user_role.lower() != "owner":
        raise HTTPException(status_code=401, detail="Not authorised")
    
    db.cur.execute(f"""DELETE FROM pou_bridge WHERE oid = {organisation_id}""")
    db.cur.execute(f"""DELETE FROM uo_bridge WHERE oid = {organisation_id}""")
    db.cur.execute(f"""DELETE FROM organisations WHERE id = {organisation_id}""")
    db.conn.commit()
        
    