import pytest

from app import create_app
from app.extensions import db


@pytest.fixture()
def client():
    class TestConfig:
        TESTING = True
        SECRET_KEY = "test-secret"
        SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        FRONTEND_ORIGIN = "http://localhost:5173"
        SESSION_COOKIE_SECURE = False

    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        with app.test_client() as test_client:
            yield test_client
        db.session.remove()


def register(client, email="test@example.com"):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "display_name": "Test User"},
    )
    assert response.status_code == 201
    return response.json