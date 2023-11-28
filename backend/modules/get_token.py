from fastapi import HTTPException, Request

def get_current_token(request: Request):
    token = request.session.get("access_token")
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token        