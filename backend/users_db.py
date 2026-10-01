import json
import os

# File to store users
USER_FILE = "backend/users.json"


# -------------------------------
# Load Users
# -------------------------------

def load_users():

    if os.path.exists(USER_FILE):

        with open(USER_FILE, "r") as f:

            return json.load(f)

    return {}


# -------------------------------
# Save Users
# -------------------------------

def save_users():

    with open(USER_FILE, "w") as f:

        json.dump(users, f, indent=4)


# Load users into memory
users = load_users()