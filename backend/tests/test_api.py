from conftest import register


def test_private_routes_require_authentication(client):
    assert client.get("/api/v1/transactions").status_code == 401
    assert client.get("/api/v1/reports").status_code == 401
    assert client.get("/api/v1/budgets").status_code == 401


def test_user_data_isolated(client):
    register(client, "first@example.com")
    category = client.post("/api/v1/categories", json={"name": "Food"}).json
    transaction = client.post(
        "/api/v1/transactions",
        json={"amount": 25, "type": "expense", "description": "Lunch", "category_id": category["id"]},
    )
    assert transaction.status_code == 201
    client.post("/api/v1/auth/logout")
    register(client, "second@example.com")
    assert client.get("/api/v1/transactions").json == []
    assert client.get("/api/v1/reports").json == {"categories": [], "monthly": []}


def test_budget_and_reports_calculate_from_transactions(client):
    register(client)
    category = client.post("/api/v1/categories", json={"name": "Food"}).json
    client.post("/api/v1/transactions", json={"amount": 100, "type": "income", "description": "Salary", "date": "2026-09-01"})
    client.post("/api/v1/transactions", json={"amount": 25, "type": "expense", "description": "Lunch", "date": "2026-09-10", "category_id": category["id"]})
    budget = client.post("/api/v1/budgets", json={"amount": 100, "month": "2026-09", "category_id": category["id"]})
    assert budget.status_code == 201
    assert budget.json["spent"] == "25.00"
    assert client.get("/api/v1/reports").json["monthly"][0]["net"] == "75.00"


def test_non_finite_amount_rejected(client):
    register(client)
    response = client.post("/api/v1/transactions", json={"amount": "NaN", "type": "expense", "description": "Invalid"})
    assert response.status_code == 400