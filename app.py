
import os
import json
import sqlite3
import secrets
from functools import wraps
from pathlib import Path

from flask import (
    Flask, request, jsonify, render_template,
    redirect, url_for, session, abort
)
from werkzeug.security import check_password_hash

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
INSTANCE_DIR = BASE_DIR / "instance"

DATA_DIR.mkdir(exist_ok=True)
INSTANCE_DIR.mkdir(exist_ok=True)

CONFIG_FILE = INSTANCE_DIR / "config.json"
DB_FILE = DATA_DIR / "database.db"

secret_key = os.environ.get("SECRET_KEY")
admin_password_hash = os.environ.get("ADMIN_PASSWORD_HASH")

if CONFIG_FILE.exists():
    with open(CONFIG_FILE, encoding="utf-8") as file:
        config = json.load(file)

    secret_key = secret_key or config.get("secret_key")
    admin_password_hash = admin_password_hash or config.get("password_hash")

if not secret_key or not admin_password_hash:
    raise RuntimeError("Missing application configuration")

app = Flask(
    __name__,
    static_folder=str(BASE_DIR),
    static_url_path=""
)

app.secret_key = secret_key
ADMIN_PASSWORD_HASH = admin_password_hash
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
def get_db():
    db = sqlite3.connect(DB_FILE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                request_type TEXT NOT NULL,
                budget TEXT,
                details TEXT NOT NULL,
                status TEXT DEFAULT 'new',
                created_at TEXT DEFAULT
                    (datetime('now', 'localtime'))
            )
        """)

def login_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return redirect(url_for("admin_login"))
        return function(*args, **kwargs)
    return wrapper

def csrf_token():
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(32)
    return session["csrf_token"]

app.jinja_env.globals["csrf_token"] = csrf_token

@app.route("/")
def home():
    return redirect("/index.html")

@app.route("/api/requests", methods=["POST"])
def create_request():
    data = request.get_json(silent=True) or request.form

    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    email = str(data.get("email", "")).strip()
    request_type = str(data.get("request_type", "")).strip()
    budget = str(data.get("budget", "")).strip()
    details = str(data.get("details", "")).strip()

    allowed_types = {"consultation", "project", "design"}

    if not name or not phone or not details:
        return jsonify(
            success=False,
            message="الاسم والهاتف والتفاصيل مطلوبة"
        ), 400

    if request_type not in allowed_types:
        return jsonify(success=False, message="نوع الطلب غير صحيح"), 400

    if len(name) > 100 or len(phone) > 30:
        return jsonify(success=False, message="بيانات طويلة جداً"), 400

    if len(email) > 150 or len(details) > 5000:
        return jsonify(success=False, message="تجاوزت الحد المسموح"), 400

    with get_db() as db:
        cursor = db.execute("""
            INSERT INTO requests
            (name, phone, email, request_type, budget, details)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name, phone, email, request_type, budget, details))

        request_id = cursor.lastrowid

    return jsonify(
        success=True,
        message="تم استلام طلبك بنجاح",
        request_id=request_id
    ), 201

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    error = None

    if request.method == "POST":
        if request.form.get("csrf_token") != session.get("csrf_token"):
            abort(400)

        password = request.form.get("password", "")

        if check_password_hash(ADMIN_PASSWORD_HASH, password):
            session.clear()
            session["admin_logged_in"] = True
            csrf_token()
            return redirect(url_for("admin_dashboard"))

        error = "كلمة المرور غير صحيحة"

    return render_template("login.html", error=error)


@app.route("/admin/logout", methods=["POST"])
@login_required
def admin_logout():
    if request.form.get("csrf_token") != session.get("csrf_token"):
        abort(400)

    session.clear()
    return redirect(url_for("admin_login"))


@app.route("/admin")
@login_required
def admin_dashboard():
    with get_db() as db:
        requests_list = db.execute("""
            SELECT * FROM requests
            ORDER BY id DESC
        """).fetchall()

    return render_template(
        "admin.html",
        requests_list=requests_list
    )

@app.route("/admin/update/<int:request_id>", methods=["POST"])
@login_required
def update_request(request_id):
    if request.form.get("csrf_token") != session.get("csrf_token"):
        abort(400)

    status = request.form.get("status", "")

    if status not in {"new", "processing", "completed"}:
        abort(400)

    with get_db() as db:
        db.execute(
            "UPDATE requests SET status = ? WHERE id = ?",
            (status, request_id)
        )

    return redirect(url_for("admin_dashboard"))

@app.after_request
def security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"] = "no-store"
    return response

if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5000, debug=False)

