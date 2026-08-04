from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core_config import settings

security = HTTPBearer()

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    
    is_dev = settings.ENVIRONMENT == "development"
    
    # In development mode with no auth header, return mock user
    if not auth_header and is_dev:
        return {"id": "00000000-0000-0000-0000-000000000000", "email": "dev@contractai.local"}
    
    # No auth header in production -> 401
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required",
        )

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Use 'Bearer <JWT>'",
        )
    
    token = parts[1]
    
    # Allow mock JWT token in dev mode
    if token == "mock-jwt-token":
        if is_dev:
            return {"id": "00000000-0000-0000-0000-000000000000", "email": "dev@contractai.local"}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Mock token is not allowed in production. Please login.",
            )

    # Decode real Supabase JWT
    # Supabase issues access tokens signed with SUPABASE_JWT_SECRET (not the anon key)
    # Use the anon key as secret fallback for backward compatibility
    jwt_secret = settings.SUPABASE_JWT_SECRET or settings.SUPABASE_ANON_KEY
    
    try:
        payload = jwt.decode(
            token, 
            jwt_secret, 
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
