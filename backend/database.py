import sqlite3
from datetime import datetime

DB_NAME = "database.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Users Table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    uid TEXT PRIMARY KEY, 
                    email TEXT, 
                    username TEXT, 
                    created_at TEXT)''')
    # Watch History
    c.execute('''CREATE TABLE IF NOT EXISTS watch_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uid TEXT,
                    movie_id INTEGER,
                    watched_at TEXT)''')
    # Ratings
    c.execute('''CREATE TABLE IF NOT EXISTS ratings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uid TEXT,
                    movie_id INTEGER,
                    rating INTEGER,
                    rated_at TEXT)''')
    # Favorites
    c.execute('''CREATE TABLE IF NOT EXISTS favorites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uid TEXT,
                    movie_id INTEGER)''')
    conn.commit()
    conn.close()

# User Functions
def save_user(uid, email, username):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (uid, email, username, created_at) VALUES (?, ?, ?, ?)",
                  (uid, email, username, datetime.now().isoformat()))
        conn.commit()
    except sqlite3.IntegrityError:
        pass # User already exists
    finally:
        conn.close()

def get_user(uid):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE uid=?", (uid,))
    user = c.fetchone()
    conn.close()
    if user:
        return {"uid": user[0], "email": user[1], "username": user[2], "createdAt": user[3]}
    return None

# Watch History
def add_to_history(uid, movie_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO watch_history (uid, movie_id, watched_at) VALUES (?, ?, ?)",
              (uid, movie_id, datetime.now().isoformat()))
    conn.commit()
    conn.close()

# Ratings
def add_rating(uid, movie_id, rating):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO ratings (uid, movie_id, rating, rated_at) VALUES (?, ?, ?, ?)",
              (uid, movie_id, rating, datetime.now().isoformat()))
    conn.commit()
    conn.close()

# Favorites
def add_favorite(uid, movie_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # verify if already favorite
    c.execute("SELECT * FROM favorites WHERE uid=? AND movie_id=?", (uid, movie_id))
    if not c.fetchone():
        c.execute("INSERT INTO favorites (uid, movie_id) VALUES (?, ?)", (uid, movie_id))
        conn.commit()
    conn.close()

def remove_favorite(uid, movie_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM favorites WHERE uid=? AND movie_id=?", (uid, movie_id))
    conn.commit()
    conn.close()
