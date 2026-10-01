import json
import os

FILE = "appointments.json"

if os.path.exists(FILE):

    with open(FILE, "r") as f:
        appointments = json.load(f)

else:

    appointments = []

def save_appointments():

    with open(FILE, "w") as f:

        json.dump(
            appointments,
            f,
            indent=4
        )