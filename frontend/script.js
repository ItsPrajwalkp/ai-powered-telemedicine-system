let map;
let markers = [];
let hospitalMarkers = [];
const API_URL =
"http://127.0.0.1:8000";


// REGISTER
/* ----------------------------- */
/* Check Login Session */
/* ----------------------------- */

function checkLogin() {

const userEmail =
localStorage.getItem("userEmail");

if (!userEmail) {

alert("⚠ Please login first");

window.location.replace(
"login.html"
);

}

}

async function registerUser() {

const role =
document.getElementById("role").value;

const email =
document.getElementById(
"register_email"
).value;

const password =
document.getElementById(
"register_password"
).value;

const result =
document.getElementById(
"register_result"
);

let url = "";

/* Select API */

if(role === "patient") {

url =
API_URL + "/patient_register";

}
else {

url =
API_URL + "/doctor_register";

}

/* Send Request */

const response =
await fetch(url, {

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

name: "User",

specialization:
role === "doctor"
? "General"
: "",

email: email,
password: password

})

});

const data =
await response.json();

result.innerText =
data.message;

}


// LOGIN

async function loginUser() {

const role =
document.getElementById("role").value;

const email =
document.getElementById(
"login_email"
).value;

const password =
document.getElementById(
"login_password"
).value;

const result =
document.getElementById(
"login_result"
);

let url = "";

/* Choose API */

if(role === "patient") {

url =
API_URL + "/patient_login";

}
else {

url =
API_URL + "/doctor_login";

}

/* Send Request */

const response =
await fetch(url, {

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

email: email,
password: password

})

});

const data =
await response.json();

result.innerText =
data.message;

/* Save login */

if (data.status === "success") {

localStorage.setItem(
"userEmail",
email
);

localStorage.setItem(
"userRole",
role
);

/* Redirect */

setTimeout(() => {

if(role === "patient") {

window.location.replace(
"predict.html"
);

}
else {

window.location.replace(
"doctor_dashboard.html"
);

}

}, 1000);

}

}

// LOGOUT

function logoutUser() {

localStorage.removeItem(
"userEmail"
);

localStorage.removeItem(
"userRole"
);

window.location.replace(
"login.html"
);

}


// PREDICT

async function predictDisease() {

const symptoms =
document.getElementById(
"symptoms"
).value;

const result =
document.getElementById(
"prediction_result"
);

const doctorList =
document.getElementById(
"doctor_list"
);

/* Get User Location */

navigator.geolocation.getCurrentPosition(

async position => {

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

/* Backend Prediction */

const response =
await fetch(
API_URL + "/predict",
{
method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

symptoms: symptoms,
lat: lat,
lon: lon

})

}
);

const data =
await response.json();

/* Show Disease */

result.innerHTML =

"<b>Disease:</b> "
+ data.predicted_disease

+

"<br><b>Specialist:</b> "
+ data.recommended_specialist;

/* Show Doctors */

doctorList.innerHTML =
"<h3>👨‍⚕️ Nearby Doctors</h3>";

data.nearby_doctors.forEach(
doctor => {

doctorList.innerHTML += `

<div class="doctor-card">

<h4>
${doctor.name}
</h4>

<p>
🏥 ${doctor.specialist}
</p>

<button
onclick="bookDoctor('${doctor.name}')">

📅 Book Appointment

</button>

</div>

`;

});
initMap(
lat,
lon
);
/* Load Real Hospitals */

loadRealHospitalsList(
lat,
lon
);

}

);

}


// BOOK APPOINTMENT

let selectedDoctor = "";


// SHOW BOOKING PANEL

function bookDoctor(

        doctorName
) {

    selectedDoctor =
        doctorName;

    document
        .getElementById(
            "booking_panel"
        ).style.display =
        "block";

    document
        .getElementById(
            "selected_doctor"
        ).innerText =
        "Doctor: "
        + doctorName;

    loadDoctorSlots(
        doctorName
    );

}


// LOAD DOCTOR SLOTS

async function loadDoctorSlots(

        doctorName
) {

    const response =
        await fetch(
            API_URL
            + "/doctor_slots/"
            + doctorName
        );

    const data =
        await response.json();

    const dropdown =
        document.getElementById(
            "appointment_time"
        );

    dropdown.innerHTML =
        "<option>Select Time</option>";

    data.slots.forEach(
        slot => {

            dropdown.innerHTML +=
                `<option>
                ${slot}
                </option>`;

        }
    );

}


// CONFIRM BOOKING

async function confirmBooking() {

    const patientName =
        document.getElementById(
            "patient_name"
        ).value;

    const date =
        document.getElementById(
            "appointment_date"
        ).value;

    const time =
        document.getElementById(
            "appointment_time"
        ).value;

    const email =
        localStorage.getItem(
            "userEmail"
        );

    if (
        !patientName ||
        !date ||
        time === "Select Time"
    ) {

        alert(
            "Please fill all details"
        );

        return;

    }

    const response =
        await fetch(
            API_URL
            + "/book_appointment",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    patient_name:
                    patientName,

                    user_email:
                    email,

                    doctor_name:
                    selectedDoctor,

                    date: date,

                    time: time

                })

            }
        );

    const data =
        await response.json();

    alert(
        data.message
    );

}

// LOAD APPOINTMENTS

async function loadAppointments() {

    const email =
        localStorage.getItem(
            "userEmail"
        );

    const list =
        document.getElementById(
            "appointments_list"
        );

    const response =
        await fetch(
            API_URL
            + "/my_appointments/"
            + email
        );

    const data =
        await response.json();

    list.innerHTML = "";

    data.appointments.forEach(
        appt => {

            list.innerHTML +=
                `
                <p>

                Doctor:
                ${appt.doctor_name}

                <br>

                Date:
                ${appt.date}

                <br>

                Time:
                ${appt.time}

                </p>
                `;

        }
    );

}
function displayDoctors(doctors) {

const list =
document.getElementById(
"doctor_list"
);

list.innerHTML = "";

/* Clear markers */

markers.forEach(marker => {

map.removeLayer(marker);

});

markers = [];

doctors.forEach(doctor => {

list.innerHTML += `

<div class="doctor-card">

<h3>
👨‍⚕️ ${doctor.name}
</h3>

<p>
🏥 ${doctor.specialist}
</p>

<p>
📍 ${doctor.location}
<br>
📏 ${doctor.distance} km away
</p>

<button
onclick="bookDoctor(
'${doctor.name}'
)">

📅 Book Appointment

</button>

</div>

`;
const doctorIcon = L.icon({

iconUrl:
"https://cdn-icons-png.flaticon.com/512/387/387561.png",

iconSize: [30, 30]

});

/* Map Marker */

const marker =
L.marker(
[doctor.lat, doctor.lon],
{ icon: doctorIcon }
)

.addTo(map)

.bindPopup(

`<b>${doctor.name}</b>
<br>
${doctor.specialist}
<br>
📏 ${doctor.distance} km away`

);

markers.push(marker);

});

/* Auto Zoom */

if (markers.length > 0) {

const group =
new L.featureGroup(markers);

map.fitBounds(
group.getBounds()
);

}

}
function initMap() {

map = L.map('map').setView(
[12.9716, 77.5946],
10
);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:
'© OpenStreetMap contributors'
}
).addTo(map);

/* Get User Location */

getUserLocation();

}
function getUserLocation() {

if (navigator.geolocation) {

navigator.geolocation.getCurrentPosition(

position => {

const userLat =
position.coords.latitude;

const userLon =
position.coords.longitude;

/* Move Map */

map.setView(
[userLat, userLon],
13
);

/* User Marker */

L.marker(
[userLat, userLon]
)

.addTo(map)

.bindPopup(
"📍 You are here"
)

.openPopup();

/* Load Hospitals */

loadRealHospitals(
userLat,
userLon
);

}

);

}

}
async function loadRealHospitals(
        lat,
        lon
) {

const radius = 5000; // 5 km

const query = `

[out:json];

(

node
["amenity"="hospital"]
(around:${radius},${lat},${lon});

node
["amenity"="clinic"]
(around:${radius},${lat},${lon});

);

out;

`;

const url =
"https://overpass-api.de/api/interpreter?data="
+ encodeURIComponent(query);

const response =
await fetch(url);

const data =
await response.json();

displayRealHospitals(
data.elements
);

}
function displayRealHospitals(hospitals) {

/* Clear old hospital markers */

hospitalMarkers.forEach(marker => {

map.removeLayer(marker);

});

hospitalMarkers = [];

const hospitalIcon = L.icon({

iconUrl:
"https://cdn-icons-png.flaticon.com/512/2967/2967350.png",

iconSize: [30, 30]

});

hospitals.forEach(hospital => {

const marker =
L.marker(
[hospital.lat, hospital.lon],
{ icon: hospitalIcon }
)

.addTo(map)

.bindPopup(

`🏥 ${hospital.tags.name
|| "Hospital"}`

);

hospitalMarkers.push(marker);

});

}
async function loadRealHospitalsList(lat, lon) {

const radius = 5000; // 5 km

/* Get Hospitals + Doctors */

const query = `

[out:json];

(

node["amenity"="hospital"]
(around:${radius},${lat},${lon});

node["amenity"="clinic"]
(around:${radius},${lat},${lon});

node["amenity"="doctors"]
(around:${radius},${lat},${lon});

);

out;

`;

const url =
"https://overpass-api.de/api/interpreter?data="
+ encodeURIComponent(query);

const response =
await fetch(url);

const data =
await response.json();

/* Display */
displayHospitalsAndDoctors(
data.elements,
lat,
lon
);

}
function displayHospitalsList(
hospitals
) {

const doctorList =
document.getElementById(
"doctor_list"
);

/* Add Hospital Section */

doctorList.innerHTML +=
"<h3>🏥 Nearby Hospitals</h3>";

hospitals.slice(0,10).forEach(
hospital => {

const name =
hospital.tags?.name
|| "Hospital";

doctorList.innerHTML += `

<div class="hospital-card">

<h4>
🏥 ${name}
</h4>

</div>

`;

});

}
function displayHospitalsAndDoctors(
places,
userLat,
userLon
) {

const list =
document.getElementById(
"doctor_list"
);

list.innerHTML =
"<h3>🏥 Nearby Hospitals & Clinics</h3>";

let hospitalArray = [];

/* Step 1 — Collect Hospitals */

places.forEach(place => {

const name =
place.tags?.name
|| "Clinic";

const type =
place.tags?.amenity;

/* Filter Medical Places */

if (

type === "hospital"

||

type === "clinic"

||

type === "doctors"

) {

/* Calculate Distance */

const distance =
calculateDistance(

userLat,
userLon,

place.lat,
place.lon

);

/* Store in Array */

hospitalArray.push({

name: name,
lat: place.lat,
lon: place.lon,
distance: parseFloat(distance)

});

}

});

/* Step 2 — Sort by Distance */

hospitalArray.sort(

(a, b) =>
a.distance - b.distance

);
hospitalArray =
hospitalArray.slice(0, 10);

/* Step 3 — Show Sorted List */

hospitalArray.forEach(place => {

list.innerHTML += `

<div class="doctor-card">

<h4>
🏥 ${place.name}
</h4>

<p class="distance-box">
📏 ${place.distance} km away
</p>

<div class="button-group">

<button
onclick="openGoogleMaps(${place.lat}, ${place.lon})">

📍 Show Location

</button>

<button
onclick="bookDoctor('${place.name}')">

📅 Book Appointment

</button>

</div>

</div>

`;

});

}
function calculateDistance(
lat1,
lon1,
lat2,
lon2
) {

const R = 6371; // km

const dLat =
(lat2 - lat1)
* Math.PI / 180;

const dLon =
(lon2 - lon1)
* Math.PI / 180;

const a =

Math.sin(dLat/2)
* Math.sin(dLat/2)

+

Math.cos(
lat1 * Math.PI/180
)

*

Math.cos(
lat2 * Math.PI/180
)

*

Math.sin(dLon/2)
* Math.sin(dLon/2);

const c =
2 * Math.atan2(
Math.sqrt(a),
Math.sqrt(1-a)
);

return (
R * c
).toFixed(2);

}
function initMap(lat, lon) {

map = L.map('map').setView(
[lat, lon],
13
);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:
'© OpenStreetMap'
}
).addTo(map);

/* User Marker */

L.marker(
[lat, lon]
)

.addTo(map)

.bindPopup(
"📍 You are here"
)

.openPopup();

}
function openGoogleMaps(
lat,
lon
) {

const url =

`https://www.google.com/maps?q=${lat},${lon}`;

window.open(
url,
"_blank"
);

}
/* ========================= */
/* PATIENT REGISTER */
/* ========================= */

async function registerPatient() {

const name =
document.getElementById("register_name").value;

const email =
document.getElementById("register_email").value;

const password =
document.getElementById("register_password").value;

const response =
await fetch(
API_URL + "/patient_register",
{

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

name: name,
email: email,
password: password

})

}
);

const data =
await response.json();

document.getElementById(
"register_result"
).innerText =
data.message;

}


/* ========================= */
/* HOSPITAL REGISTER */
/* ========================= */

async function registerHospital() {

const name =
document.getElementById("register_name").value;

const specialization =
document.getElementById(
"register_specialization"
).value;

const email =
document.getElementById("register_email").value;

const password =
document.getElementById("register_password").value;

const response =
await fetch(
API_URL + "/doctor_register",
{

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

name: name,
specialization: specialization,
email: email,
password: password

})

}
);

const data =
await response.json();

document.getElementById(
"register_result"
).innerText =
data.message;

}


/* ========================= */
/* PATIENT LOGIN */
/* ========================= */

/* ========================= */
/* PATIENT LOGIN */
/* ========================= */

async function patientLogin() {

const email =
document.getElementById(
"login_email"
).value;

const password =
document.getElementById(
"login_password"
).value;

const result =
document.getElementById(
"login_result"
);

const response =
await fetch(
API_URL + "/patient_login",
{

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

email: email,
password: password

})

}
);

const data =
await response.json();

result.innerText =
data.message;

if (data.status === "success") {

localStorage.setItem(
"userEmail",
email
);

localStorage.setItem(
"userRole",
"patient"
);

setTimeout(() => {

window.location.replace(
"predict.html"
);

}, 1000);

}

}


/* ========================= */
/* HOSPITAL LOGIN */
/* ========================= */

async function hospitalLogin() {

const email =
document.getElementById(
"login_email"
).value;

const password =
document.getElementById(
"login_password"
).value;

const result =
document.getElementById(
"login_result"
);

const response =
await fetch(
API_URL + "/doctor_login",
{

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

email: email,
password: password

})

}
);

const data =
await response.json();

result.innerText =
data.message;

if (data.status === "success") {

localStorage.setItem(
"userEmail",
email
);

localStorage.setItem(
"userRole",
"doctor"
);

setTimeout(() => {

window.location.replace(
"doctor_dashboard.html"
);

}, 1000);

}

}
/* ========================= */
/* AI CHATBOT */
/* ========================= */

async function sendMessage() {

const message =
document.getElementById(
"user_message"
).value;

const chatbox =
document.getElementById(
"chatbox"
);

/* Show user message */

chatbox.innerHTML +=

"<p><b>You:</b> "
+ message
+ "</p>";

/* Send to backend */

const response =
await fetch(
API_URL + "/chatbot",
{

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

message: message

})

}
);

const data =
await response.json();

/* Show bot reply */

chatbox.innerHTML +=

"<p><b>AI:</b> "
+ data.reply
+ "</p>";

document.getElementById(
"user_message"
).value = "";

chatbox.scrollTop =
chatbox.scrollHeight;

}
function openVideo() {

window.open(
"video_call.html",
"_blank"
);

}
/* ========================= */
/* OPEN DASHBOARD CARDS */
/* ========================= */

function openPrediction() {

window.location.href =
"disease_prediction.html";

}

function openChatbot() {

window.location.href =
"chatbot.html";

}

function openVideo() {

window.location.href =
"video_call.html";

}
async function uploadReport() {

    let fileInput =
        document.getElementById("reportFile");

    let file = fileInput.files[0];

    let email =
        localStorage.getItem("user_email");

    let formData = new FormData();

    formData.append(
        "patient_email",
        email
    );

    formData.append(
        "file",
        file
    );

    let response = await fetch(
        "http://127.0.0.1:8000/upload_report",
        {
            method: "POST",
            body: formData
        }
    );

    let data = await response.json();

    alert(data.message);
}
async function sendFeedback() {

    let reportId =
        document.getElementById("reportId").value;

    let feedback =
        document.getElementById("feedbackText").value;

    let response = await fetch(
        "http://127.0.0.1:8000/add_feedback",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                report_id: parseInt(reportId),
                feedback: feedback

            })
        }
    );

    let data = await response.json();

    alert(data.message);
}
async function loadReports() {

    let email =
        localStorage.getItem("user_email");

    let response = await fetch(
        `http://127.0.0.1:8000/get_patient_reports/${email}`
    );

    let reports = await response.json();

    let list =
        document.getElementById("reportList");

    list.innerHTML = "";

    reports.forEach(r => {

        list.innerHTML += `

<li>
Report ID: ${r.id} <br>
Status: ${r.status} <br>
Feedback: ${r.feedback}
</li>

`;

    });

}

loadReports();
function openChatbot() {

window.location.href =
"chatbot.html";

}