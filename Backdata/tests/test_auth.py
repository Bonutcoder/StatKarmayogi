import pytest
from httpx import AsyncClient
from app.core.security import create_access_token, decode_access_token

@pytest.mark.asyncio
async def test_jwt_token_generation_and_decoding():
    token = create_access_token({"sub": "user-123", "email": "test@mospi.gov.in", "role": "LEARNER", "department_id": "dept-1"})
    payload = decode_access_token(token)
    
    assert payload is not None
    assert payload["sub"] == "user-123"
    assert payload["email"] == "test@mospi.gov.in"
    assert payload["role"] == "LEARNER"

@pytest.mark.asyncio
async def test_unauthenticated_request_fails(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
