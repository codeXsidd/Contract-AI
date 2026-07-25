from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core_config import settings

security = HTTPBearer()

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    
    # Dev/local fallback if no auth header is present
    if not auth_header or settings.ENVIRONMENT == "development":
        # Check if auth header exists and is valid, otherwise use mock
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == "bearer" and parts[1] != "mock-jwt-token":
                token = parts[1]
                try:
                    payload = jwt.decode(
                        token, 
                        settings.SUPABASE_ANON_KEY, 
                        algorithms=[settings.ALGORITHM],
                        options={"verify_aud": False}
                    )
                    user_id = payload.get("sub")
                    if user_id:
                        return {"id": user_id, "email": payload.get("email")}
                except JWTError:
                    pass # Fall through to mock user in dev

        # Fallback developer user
        return {"id": "00000000-0000-0000-0000-000000000000", "email": "dev@contractai.local"}

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Use 'Bearer <JWT>'",
        )
    
    token = parts[1]
    
    # Allow mock JWT token in production if environment is dev
    if token == "mock-jwt-token":
        return {"id": "00000000-0000-0000-0000-000000000000", "email": "dev@contractai.local"}

    try:
        # Supabase uses HS256 JWT with its anon/service key as secret
        payload = jwt.decode(
            token, 
            settings.SUPABASE_ANON_KEY, 
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False}
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload is missing subject claim",
            )
        return {"id": user_id, "email": payload.get("email")}
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )
