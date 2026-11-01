from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("--- TEST 1: Admin Login (Valid Credentials) ---")
admin_res = client.post("/api/auth/admin/login", json={
    "email": "admin@yaatrasathi.com",
    "password": "YaatraAdmin@2026!Secure"
})
assert admin_res.status_code == 200, f"Expected 200, got {admin_res.status_code}"
admin_data = admin_res.json()
assert "access_token" in admin_data, "Access token missing"
assert admin_data["user"]["role"] == "ADMIN", f"Expected ADMIN, got {admin_data['user']['role']}"
admin_token = admin_data["access_token"]
print("[PASS]: Admin login successful, role ADMIN, JWT issued.")

print("--- TEST 2: Admin Login (Invalid Password) ---")
bad_res = client.post("/api/auth/admin/login", json={
    "email": "admin@yaatrasathi.com",
    "password": "WrongPassword123"
})
assert bad_res.status_code == 401, f"Expected 401, got {bad_res.status_code}"
print("[PASS]: Rejected invalid password with 401 Unauthorized.")

print("--- TEST 3: Rate Limiting (5 Attempts -> Lockout) ---")
test_email = "rate_tester_suite@yaatrasathi.com"
for i in range(5):
    r = client.post("/api/auth/admin/login", json={"email": test_email, "password": "bad"})
    assert r.status_code == 401
locked_res = client.post("/api/auth/admin/login", json={"email": test_email, "password": "bad"})
assert locked_res.status_code == 429, f"Expected 429, got {locked_res.status_code}"
print("[PASS]: Rate limiting triggers 429 after 5 failed attempts.")

print("--- TEST 4: Google OAuth Login ---")
g_res = client.post("/api/auth/google", json={
    "credential": "mock-google-token-42",
    "user_data": {
        "email": "sharma.bhavna@gmail.com",
        "name": "Bhavna Sharma",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    }
})
assert g_res.status_code == 200, f"Expected 200, got {g_res.status_code}"
g_data = g_res.json()
assert g_data["user"]["role"] == "USER", f"Expected USER, got {g_data['user']['role']}"
assert g_data["user"]["email"] == "sharma.bhavna@gmail.com"
user_token = g_data["access_token"]
print("[PASS]: Google login successful, created user in database with role USER.")

print("--- TEST 5: RBAC Moderation Access ---")
# Unauthenticated
unauth_res = client.get("/api/auth/admin/moderation-queue")
assert unauth_res.status_code == 401, f"Expected 401, got {unauth_res.status_code}"
print("[PASS]: Unauthenticated access blocked (401).")

# User token (403 Forbidden)
user_mod_res = client.get("/api/auth/admin/moderation-queue", headers={"Authorization": f"Bearer {user_token}"})
assert user_mod_res.status_code == 403, f"Expected 403, got {user_mod_res.status_code}"
print("[PASS]: Normal User forbidden from admin moderation queue (403).")

# Admin token (200 OK)
admin_mod_res = client.get("/api/auth/admin/moderation-queue", headers={"Authorization": f"Bearer {admin_token}"})
assert admin_mod_res.status_code == 200, f"Expected 200, got {admin_mod_res.status_code}"
submissions = admin_mod_res.json()["submissions"]
print(f"[PASS]: Admin access granted (200). {len(submissions)} items in queue.")

# Admin Moderation Action
action_res = client.post(
    f"/api/auth/admin/moderation/{submissions[0]['id']}/action",
    headers={"Authorization": f"Bearer {admin_token}"},
    json={"action": "approve", "reason": "Verified community gem"}
)
assert action_res.status_code == 200, f"Expected 200, got {action_res.status_code}"
print("[PASS]: Admin approved submission successfully.")

# User Moderation Action (403 Forbidden)
user_action_res = client.post(
    f"/api/auth/admin/moderation/{submissions[0]['id']}/action",
    headers={"Authorization": f"Bearer {user_token}"},
    json={"action": "reject", "reason": "User trying to reject"}
)
assert user_action_res.status_code == 403, f"Expected 403, got {user_action_res.status_code}"
print("[PASS]: Normal User forbidden from taking moderation actions (403).")

print("--- TEST 6: Get Profile (/api/auth/me) ---")
me_admin = client.get("/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
assert me_admin.status_code == 200
assert me_admin.json()["user"]["role"] == "ADMIN"

me_user = client.get("/api/auth/me", headers={"Authorization": f"Bearer {user_token}"})
assert me_user.status_code == 200
assert me_user.json()["user"]["role"] == "USER"
print("[PASS]: /api/auth/me verified for both roles.")

print("--- TEST 7: Logout ---")
logout_res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {user_token}"})
assert logout_res.status_code == 200
print("[PASS]: /api/auth/logout returned 200 OK.")

print("\n==============================================")
print("ALL RBAC & AUTHENTICATION TESTS PASSED SUCCESSFULLY!")
print("==============================================")
