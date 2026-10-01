from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

import shutil
import os
import sqlite3
import torch
import pandas as pd

from geopy.distance import geodesic

# Transformers
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    AutoTokenizer,
    AutoModelForSeq2SeqLM
)

# External modules
from backend.doctors_db import doctors
from backend.specialist_mapping import specialist_dict

# ==============================
# FOLDERS
# ==============================

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ==============================
# FASTAPI SETUP
# ==============================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# DATABASE
# ==============================

def create_tables():

    conn = sqlite3.connect("telemedicine.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctors(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        specialization TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_email TEXT,
        file_path TEXT,
        doctor_feedback TEXT DEFAULT '',
        status TEXT DEFAULT 'Pending'
    )
    """)

    conn.commit()
    conn.close()

create_tables()

# ==============================
# LOAD DISEASE MODEL
# ==============================

print("Loading Disease Model...")

model = DistilBertForSequenceClassification.from_pretrained(
    "model/symptom_model"
)

tokenizer = DistilBertTokenizer.from_pretrained(
    "model/symptom_model"
)

df = pd.read_csv(
    "dataset/symptom_dataset.csv"
)

label_map = dict(
    enumerate(
        df["disease"].astype("category").cat.categories
    )
)

print("✅ Disease Model Loaded")

# ==============================
# LOAD CHATBOT MODEL (FIXED)
# ==============================

print("Loading Multilingual Chatbot...")

chat_tokenizer = AutoTokenizer.from_pretrained(
    "google/flan-t5-small"
)

chat_model = AutoModelForSeq2SeqLM.from_pretrained(
    "google/flan-t5-small"
)

print("✅ Chatbot Loaded")

def generate_chatbot_response(user_input):

    prompt = (
        "You are a helpful medical assistant.\n"
        "Give short and safe healthcare advice.\n"
        "Do NOT repeat the patient's sentence.\n"
        "Answer clearly in 3 parts.\n\n"

        f"Patient: {user_input}\n\n"

        "Provide response as:\n"
        "Possible Cause:\n"
        "Home Care:\n"
        "When to See Doctor:\n"
    )

    inputs = chat_tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    outputs = chat_model.generate(
        **inputs,
        max_length=200,
        min_length=60,
        temperature=0.5,
        do_sample=True,
        top_p=0.9,
        repetition_penalty=1.2
    )

    response = chat_tokenizer.decode(
        outputs[0],
        skip_special_tokens=True
    )

    return response

# ==============================
# REQUEST MODELS
# ==============================

class PatientRegister(BaseModel):
    name: str
    email: str
    password: str

class DoctorRegister(BaseModel):
    name: str
    specialization: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class PredictRequest(BaseModel):
    symptoms: str
    lat: float
    lon: float

class ChatRequest(BaseModel):
    message: str

class FeedbackRequest(BaseModel):
    report_id: int
    feedback: str

# ==============================
# HOME
# ==============================

@app.get("/")
def home():

    return {
        "message": "Telemedicine AI API Running"
    }

# ==============================
# CHATBOT API
# ==============================

@app.post("/chatbot")
def chatbot(req: ChatRequest):

    try:

        reply = generate_chatbot_response(
            req.message
        )

        return {"reply": reply}

    except Exception as e:

        return {
            "reply":
            "Sorry, I could not process your question."
        }

# ==============================
# REGISTER APIs
# ==============================

@app.post("/patient_register")
def patient_register(user: PatientRegister):

    conn = sqlite3.connect("telemedicine.db")
    cursor = conn.cursor()

    try:

        cursor.execute("""
        INSERT INTO patients
        (name,email,password)
        VALUES (?,?,?)
        """,
        (user.name,
         user.email,
         user.password)
        )

        conn.commit()

        return {
            "status": "success"
        }

    except:

        return {
            "status": "fail"
        }

    finally:
        conn.close()

@app.post("/doctor_register")
def doctor_register(user: DoctorRegister):

    conn = sqlite3.connect("telemedicine.db")
    cursor = conn.cursor()

    try:

        cursor.execute("""
        INSERT INTO doctors
        (name,specialization,email,password)
        VALUES (?,?,?,?)
        """,
        (user.name,
         user.specialization,
         user.email,
         user.password)
        )

        conn.commit()

        return {
            "status": "success"
        }

    except:

        return {
            "status": "fail"
        }

    finally:
        conn.close()

# ==============================
# LOGIN
# ==============================

@app.post("/patient_login")
def patient_login(user: UserLogin):

    conn = sqlite3.connect("telemedicine.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM patients
    WHERE email=? AND password=?
    """,
    (user.email,
     user.password)
    )

    result = cursor.fetchone()

    conn.close()

    if result:

        return {
            "status": "success",
            "role": "patient"
        }

    return {"status": "fail"}



@app.post("/doctor_login")
def doctor_login(user: UserLogin):

    conn = sqlite3.connect("telemedicine.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM doctors
    WHERE email=? AND password=?
    """,
    (user.email,
     user.password)
    )

    result = cursor.fetchone()

    conn.close()

    if result:

        return {
            "status": "success",
            "role": "doctor"
        }

    return {
        "status": "fail"
    }

# ==============================
# DISEASE PREDICTION
# ==============================

def predict_disease(symptoms):

    inputs = tokenizer(
        symptoms,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    with torch.no_grad():

        outputs = model(**inputs)

    predicted_class_id = torch.argmax(
        outputs.logits
    ).item()

    predicted_disease = label_map[
        predicted_class_id
    ]

    return predicted_disease

# ==============================
# SPECIALIST
# ==============================

def get_specialist(disease):

    disease = disease.lower().strip()

    for key in specialist_dict:

        if disease in key.lower():

            return specialist_dict[key]

    return "General Physician"

# ==============================
# NEAREST DOCTORS
# ==============================

def find_nearest_doctors(
        user_location,
        specialist
):

    nearby = []

    for doctor in doctors:

        doctor_coords = (
            doctor["lat"],
            doctor["lon"]
        )

        distance = geodesic(
            user_location,
            doctor_coords
        ).km

        doctor_copy = doctor.copy()

        doctor_copy["distance"] = round(
            distance,
            2
        )

        nearby.append(
            doctor_copy
        )

    nearby.sort(
        key=lambda x:
        x["distance"]
    )

    return nearby

# ==============================
# PREDICT API
# ==============================

@app.post("/predict")
def predict(request: PredictRequest):

    predicted_disease = predict_disease(
        request.symptoms
    )

    specialist = get_specialist(
        predicted_disease
    )

    user_location = (
        request.lat,
        request.lon
    )

    nearby_doctors = find_nearest_doctors(
        user_location,
        specialist
    )

    return {

        "predicted_disease":
        predicted_disease,

        "recommended_specialist":
        specialist,

        "nearby_doctors":
        nearby_doctors

    }

# ==============================
# UPLOAD REPORT
# ==============================

@app.post("/upload_report")
async def upload_report(
    patient_email: str = Form(...),
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    conn = sqlite3.connect("telemedicine.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO reports
    (patient_email,file_path)
    VALUES (?,?)
    """,
    (patient_email,
     file_path)
    )

    conn.commit()
    conn.close()

    return {
        "message":
        "Report uploaded successfully"
    }

# ==============================
# GET PATIENT REPORTS
# ==============================

@app.get("/get_patient_reports/{email}")
def get_patient_reports(email: str):

    conn = sqlite3.connect("telemedicine.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id,
           file_path,
           doctor_feedback,
           status
    FROM reports
    WHERE patient_email=?
    """,
    (email,)
    )

    rows = cursor.fetchall()

    conn.close()

    reports = []

    for r in rows:

        reports.append({
            "id": r[0],
            "file": r[1],
            "feedback": r[2],
            "status": r[3]
        })

    return reports

# ==============================
# DOWNLOAD REPORT
# ==============================

@app.get("/download_report/{filename}")
def download_report(filename: str):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    if os.path.exists(file_path):

        return FileResponse(
            file_path,
            filename=filename
        )

    return {
        "error": "File not found"
    }