from pydantic import BaseModel


class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    lgpd_accepted: bool


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthUserOut(BaseModel):
    id: int
    email: str
    username: str
    is_admin: bool


class AuthResponse(BaseModel):
    token: str
    user: AuthUserOut
