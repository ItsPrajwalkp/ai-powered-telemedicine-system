\# AI-Powered Telemedicine System for Intelligent Disease Prediction and Healthcare Access



An AI-powered telemedicine platform designed to improve healthcare accessibility by providing intelligent disease prediction, specialist recommendations, doctor information, appointment booking, and healthcare assistance through a web-based system.



\## 📌 Project Overview



The \*\*AI-Powered Telemedicine System\*\* combines Artificial Intelligence and telemedicine technologies to help patients access healthcare services remotely.



The system allows patients to:



\* Enter their personal information

\* Select or enter symptoms

\* Get an AI-based disease prediction

\* Identify the appropriate medical specialist

\* View available doctor information

\* Check doctor appointment slots

\* Book appointments

\* Manage appointments

\* Access an AI healthcare chatbot

\* Upload medical reports when required



The system is particularly designed with healthcare accessibility and low-connectivity/rural healthcare scenarios in mind.



\---



\## ✨ Key Features



\### 1. AI Disease Prediction



The system uses a fine-tuned \*\*DistilBERT\*\* model to predict possible diseases based on patient symptoms.



The current model supports prediction for diseases including:



\* Allergy

\* Arthritis

\* Asthma

\* Common Cold

\* Dengue

\* Diabetes

\* Ear Infection

\* Eye Infection

\* Flu

\* Food Poisoning

\* Gastroenteritis

\* Glaucoma

\* Heart Disease

\* Jaundice

\* Malaria

\* Migraine

\* Spondylitis

\* Throat Infection

\* Thyroid Disorder

\* Varicose Veins



> The prediction is intended for educational/project purposes and should not replace professional medical diagnosis.



\---



\### 2. Specialist Recommendation



Based on the predicted disease, the system maps the condition to an appropriate medical specialist.



Examples:



| Condition        | Specialist        |

| ---------------- | ----------------- |

| Allergy          | Allergist         |

| Arthritis        | Rheumatologist    |

| Asthma           | Pulmonologist     |

| Common Cold      | General Physician |

| Dengue           | General Physician |

| Diabetes         | Endocrinologist   |

| Eye Infection    | Ophthalmologist   |

| Flu              | General Physician |

| Heart Disease    | Cardiologist      |

| Malaria          | General Physician |

| Migraine         | Neurologist       |

| Thyroid Disorder | Endocrinologist   |



\---



\### 3. Doctor Information



The system provides doctor-related information such as:



\* Doctor name

\* Specialization

\* Hospital/clinic

\* Location

\* Availability

\* Appointment slots



\---



\### 4. Appointment Booking



Patients can:



1\. Select a doctor

2\. View available slots

3\. Select a suitable time

4\. Confirm an appointment

5\. View their appointments



\---



\### 5. AI Healthcare Chatbot



The system includes an AI-based healthcare chatbot to provide general healthcare-related assistance.



The chatbot uses a text-to-text language model to generate responses.



\---



\### 6. Medical Report Upload



Patients can upload medical reports through the system for healthcare-related workflows.



\---



\### 7. Patient and Hospital Interfaces



The frontend contains separate interfaces for different users, including:



\* Patient registration

\* Patient login

\* Patient dashboard

\* Hospital registration

\* Hospital login

\* Doctor dashboard

\* Appointment management



\---



\# 🏗️ System Architecture



The project follows a web-based client-server architecture.



```text

&#x20;                ┌──────────────────────┐

&#x20;                │      Patient/User     │

&#x20;                └──────────┬───────────┘

&#x20;                           │

&#x20;                           ▼

&#x20;                ┌──────────────────────┐

&#x20;                │   Frontend Web UI    │

&#x20;                │ HTML / CSS / JavaScript│

&#x20;                └──────────┬───────────┘

&#x20;                           │

&#x20;                           │ HTTP Requests

&#x20;                           ▼

&#x20;                ┌──────────────────────┐

&#x20;                │     FastAPI Backend  │

&#x20;                │      Python API      │

&#x20;                └──────────┬───────────┘

&#x20;                           │

&#x20;         ┌─────────────────┼─────────────────┐

&#x20;         │                 │                 │

&#x20;         ▼                 ▼                 ▼

&#x20;┌────────────────┐ ┌────────────────┐ ┌────────────────┐

&#x20;│ Disease Model  │ │ Doctor System  │ │ Appointment   │

&#x20;│   DistilBERT   │ │                │ │ System        │

&#x20;└────────────────┘ └────────────────┘ └────────────────┘

&#x20;         │

&#x20;         ▼

&#x20;┌──────────────────────┐

&#x20;│ Disease Prediction   │

&#x20;│ + Specialist Mapping │

&#x20;└──────────────────────┘

```



\---



\# 🛠️ Technologies Used



\## Frontend



\* HTML5

\* CSS3

\* JavaScript



\## Backend



\* Python

\* FastAPI

\* Uvicorn



\## Machine Learning / AI



\* PyTorch

\* Hugging Face Transformers

\* DistilBERT

\* FLAN-T5

\* Pandas

\* Scikit-learn



\## Database / Storage



\* SQLite

\* JSON-based data storage



\## Additional Libraries



\* Geopy

\* Requests

\* Python Multipart

\* Hugging Face Hub



\## Version Control



\* Git

\* GitHub

\* Git Large File Storage (Git LFS)



\---



\# 📁 Project Structure



```text

ai-powered-telemedicine-system/

│

├── backend/

│   ├── \_\_init\_\_.py

│   ├── appointments.json

│   ├── appointments\_db.py

│   ├── check\_dataset.py

│   ├── doctor\_database.py

│   ├── doctors\_db.py

│   │

│   ├── dataset/

│   │   └── symptom\_dataset.csv

│   │

│   ├── model/

│   │   └── symptom\_model/

│   │       ├── config.json

│   │       ├── model.safetensors

│   │       ├── tokenizer.json

│   │       └── tokenizer\_config.json

│   │

│   ├── predict\_api.py

│   ├── specialist\_mapping.py

│   ├── test\_model.py

│   ├── train\_model.py

│   ├── users.json

│   └── users\_db.py

│

├── frontend/

│   ├── index.html

│   ├── dashboard.html

│   ├── predict.html

│   ├── disease\_prediction.html

│   ├── booking.html

│   ├── appointments.html

│   ├── chatbot.html

│   ├── doctor\_dashboard.html

│   ├── hospital\_login.html

│   ├── hospital\_register.html

│   ├── patient\_login.html

│   ├── patient\_register.html

│   ├── register.html

│   ├── video\_call.html

│   ├── script.js

│   └── style.css

│

├── create\_vocab.py

├── requirements.txt

├── .gitignore

├── .gitattributes

└── README.md

```



\---



\# ⚙️ Installation and Setup



\## 1. Clone the Repository



```bash

git clone https://github.com/ItsPrajwalkp/ai-powered-telemedicine-system.git

```



Move into the project:



```bash

cd ai-powered-telemedicine-system

```



\---



\## 2. Install Git LFS



The trained disease prediction model is stored using \*\*Git LFS\*\* because the model file is approximately 268 MB.



Install Git LFS if it is not already installed.



Then run:



```bash

git lfs install

```



After cloning, make sure the LFS files are downloaded:



```bash

git lfs pull

```



Verify:



```bash

git lfs ls-files

```



You should see:



```text

backend/model/symptom\_model/model.safetensors

```



\---



\## 3. Create a Virtual Environment



Windows:



```powershell

python -m venv venv

```



Activate it:



```powershell

venv\\Scripts\\activate

```



\---



\## 4. Install Dependencies



```powershell

pip install -r requirements.txt

```



\---



\# 🚀 Running the Backend



Move into the backend directory:



```powershell

cd backend

```



Start the FastAPI server:



```powershell

uvicorn predict\_api:app --reload

```



The backend will normally be available at:



```text

http://127.0.0.1:8000

```



FastAPI documentation:



```text

http://127.0.0.1:8000/docs

```



\---



\# 🌐 Running the Frontend



The frontend consists of HTML, CSS and JavaScript files.



The frontend can be opened using a local development server.



For example, from the project root:



```powershell

python -m http.server 5500 --directory frontend

```



Then open:



```text

http://127.0.0.1:5500

```



\---



\# 🔌 API Endpoints



The backend currently provides functionality including:



| Endpoint                   | Purpose                                |

| -------------------------- | -------------------------------------- |

| `/predict`                 | Predict possible disease from symptoms |

| `/doctor\_slots/{doctor}`   | Retrieve doctor appointment slots      |

| `/book\_appointment`        | Book an appointment                    |

| `/my\_appointments/{email}` | Retrieve patient appointments          |



Additional endpoints and functionality may be added as development continues.



\---



\# 🧠 Machine Learning Model



The disease prediction system uses a fine-tuned \*\*DistilBERT sequence classification model\*\*.



\### Model location



```text

backend/model/symptom\_model/

```



The trained model file:



```text

model.safetensors

```



is approximately 268 MB.



Because GitHub has file-size limitations for normal Git objects, the model is maintained using \*\*Git LFS\*\*.



\### Training Dataset



```text

backend/dataset/symptom\_dataset.csv

```



The dataset contains symptom/disease information used for model development and prediction.



\---



\# 🔐 Local Files and Sensitive Data



The following files are intentionally excluded from GitHub:



```text

venv/

telemedicine.db

\_\_pycache\_\_/

uploads/

\*.db

\*.sqlite

```



These files are local/runtime files and should not normally be committed to the repository.



\---



\# 👥 Team Collaboration Workflow



All team members should follow the same Git workflow.



\## Do NOT work directly on `main`



Before starting a new task:



```bash

git checkout main

git pull origin main

```



Create a feature branch:



```bash

git checkout -b feature/your-feature-name

```



Example:



```bash

git checkout -b feature/appointment-system

```



Make your changes.



Check the changes:



```bash

git status

```



Add the changes:



```bash

git add .

```



Commit:



```bash

git commit -m "Add appointment booking functionality"

```



Push your branch:



```bash

git push -u origin feature/appointment-system

```



Then create a \*\*Pull Request\*\* on GitHub.



After the Pull Request is reviewed and merged:



```bash

git checkout main

git pull origin main

```



Then create a new branch for your next task.



\---



\# 🔄 Recommended Team Workflow



```text

&#x20;                 main

&#x20;                  │

&#x20;                  ▼

&#x20;         git pull origin main

&#x20;                  │

&#x20;                  ▼

&#x20;           Create feature branch

&#x20;                  │

&#x20;                  ▼

&#x20;            Make changes

&#x20;                  │

&#x20;                  ▼

&#x20;             git add .

&#x20;                  │

&#x20;                  ▼

&#x20;            git commit

&#x20;                  │

&#x20;                  ▼

&#x20;             git push

&#x20;                  │

&#x20;                  ▼

&#x20;            Pull Request

&#x20;                  │

&#x20;                  ▼

&#x20;             Code Review

&#x20;                  │

&#x20;                  ▼

&#x20;            Merge into main

&#x20;                  │

&#x20;                  ▼

&#x20;         git pull origin main

```



\---



\# ⚠️ Important Git Rules



\### 1. Never commit the virtual environment



Do not commit:



```text

venv/

```



\### 2. Do not commit local databases



Do not commit:



```text

telemedicine.db

```



\### 3. Do not remove Git LFS



The trained model depends on Git LFS.



Before working with the repository, team members should have Git LFS installed.



\### 4. Pull before starting new work



Always:



```bash

git checkout main

git pull origin main

```



before creating a new feature branch.



\### 5. Do not directly modify another teammate's branch



Use your own feature branch.



\### 6. Use meaningful commit messages



Good:



```text

Add doctor appointment booking

Fix disease prediction API

Update patient dashboard

Add specialist mapping

```



Avoid:



```text

update

changes

final

test

abc

```



\---



\# 🧩 Handling Merge Conflicts



If Git reports a merge conflict:



```bash

git pull origin main

```



Git will identify the conflicting files.



Open the files and resolve the conflict.



Then:



```bash

git add .

git commit -m "Resolve merge conflicts"

git push

```



For important conflicts, discuss the changes with the teammate who modified the same files before resolving them.



\---



\# 📋 Development Modules



The project is divided into several functional modules:



\### Patient Module



\* Registration

\* Login

\* Patient information

\* Symptom selection

\* Disease prediction

\* Doctor selection

\* Appointment booking

\* Appointment viewing



\### Doctor/Hospital Module



\* Doctor information

\* Hospital registration

\* Hospital login

\* Doctor dashboard

\* Appointment management



\### AI Module



\* Symptom processing

\* Disease prediction

\* Specialist mapping

\* Healthcare chatbot



\### Appointment Module



\* Doctor availability

\* Slot management

\* Appointment booking

\* Patient appointment history



\---



\# 🎯 Project Objectives



The major objectives of the project are:



1\. Provide AI-assisted disease prediction based on symptoms.

2\. Improve access to healthcare services through telemedicine.

3\. Connect patients with suitable medical specialists.

4\. Provide doctor information and appointment facilities.

5\. Provide an AI-based healthcare assistance interface.

6\. Support healthcare accessibility in areas where physical access to specialists may be limited.

7\. Develop an integrated platform combining AI and telemedicine functionality.



\---



\# 🔮 Future Enhancements



Potential future improvements include:



\* Real-time doctor availability

\* Video consultation

\* Improved location-based doctor search

\* Offline/low-connectivity support

\* Multilingual healthcare assistance

\* Voice-based symptom input

\* Improved medical report analysis

\* Electronic health record integration

\* Mobile application

\* Enhanced model evaluation

\* Secure authentication and authorization

\* Cloud deployment



\---



\# ⚠️ Disclaimer



This project is developed for \*\*academic and research purposes\*\*.



Disease predictions generated by the system are not a substitute for professional medical diagnosis, treatment, or medical advice.



Users should consult qualified healthcare professionals for medical decisions.



\---



\# 📌 Project Status



\*\*Status:\*\* Under Development



The system currently includes:



\* AI-based disease prediction

\* Specialist mapping

\* Doctor information

\* Appointment management

\* Patient interfaces

\* Hospital/doctor interfaces

\* AI healthcare chatbot

\* GitHub-based team collaboration

\* Git LFS model storage



Further development and testing are ongoing.



\---



\# 👨‍💻 Repository



GitHub:



https://github.com/ItsPrajwalkp/ai-powered-telemedicine-system



\---



\## License



This project is currently developed as an academic project.



A formal open-source license can be added if the project is later released for public use.



