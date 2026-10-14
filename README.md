# 🏥 MediPulse | Three-Tier Cloud Architecture
### Design and Deployment of a Hospital Patient Management System Using Netlify, Render, and MongoDB Atlas

---

## 📌 1. Project Title & Overview
**Project Title:** Design and Deployment of a Three-Tier Web Application Using Netlify, Render, and MongoDB Atlas  
**Domain:** Hospital Patient Information Management System (HPMS)  
**Objective:** To design, develop, and deploy an enterprise-grade cloud web application using a strict three-tier architecture where the **Presentation Layer**, **Application Layer**, and **Database Layer** are hosted independently on different cloud platforms.

```
+-----------------------------------------------------------------------------------------+
|                               THREE-TIER CLOUD ARCHITECTURE                             |
|                                                                                         |
|   [ USER BROWSER ]                                                                      |
|          │                                                                              |
|          │ HTTPS                                                                        |
|          ▼                                                                              |
|   ┌────────────────────────────────┐                                                    |
|   │ TIER 1: PRESENTATION LAYER     │ ➔ Deployed on NETLIFY                              |
|   │ Technology: React.js + Vite    │    (Serves UI, accepts inputs, client validation)  |
|   └────────────────────────────────┘                                                    |
|          │                                                                              |
|          │ HTTPS REST API                                                               |
|          ▼                                                                              |
|   ┌────────────────────────────────┐                                                    |
|   │ TIER 2: APPLICATION LAYER      │ ➔ Deployed on RENDER                               |
|   │ Technology: Node.js + Express  │    (Business logic, CORS, REST APIs, validation)   |
|   └────────────────────────────────┘                                                    |
|          │                                                                              |
|          │ TLS / Mongoose Driver                                                        |
|          ▼                                                                              |
|   ┌────────────────────────────────┐                                                    |
|   │ TIER 3: DATABASE LAYER         │ ➔ Hosted on MONGODB ATLAS                          |
|   │ Technology: MongoDB Atlas      │    (Database: hospitalDB, Collection: patients)    |
|   └────────────────────────────────┘                                                    |
+-----------------------------------------------------------------------------------------+
```

---

## 🏗️ 2. Architectural Tiers Breakdown

### 🌐 Tier 1: Presentation Layer (Frontend)
* **Cloud Platform:** [Netlify](https://www.netlify.com)
* **Technology:** React 18, Vite, Lucide Icons, Modern Responsive CSS.
* **Responsibilities:**
  * Renders dashboard with real-time statistics (Total patients, Admitted, Outpatients, Discharged, Departments).
  * Collects patient registration and medical update inputs.
  * Form validation before API submission.
  * Dispatches asynchronous HTTP/HTTPS REST requests to Render backend.
  * Displays user feedback with animated toast notifications.
  * **Strict Isolation:** Zero database credentials; communicates *only* with the Tier 2 REST API.

### ⚙️ Tier 2: Application / Business Logic Layer (Backend)
* **Cloud Platform:** [Render](https://render.com)
* **Technology:** Node.js, Express.js, Mongoose ODM, CORS, Dotenv.
* **Responsibilities:**
  * Exposes secure REST API endpoints for all CRUD operations.
  * CORS verification: only requests from authorized origins (such as Netlify domain) are accepted.
  * Validates patient information against business constraints.
  * Establishes encrypted database connections to MongoDB Atlas using environment variables.
  * Provides health check and diagnostic monitoring at `/api/health`.

### 🗄️ Tier 3: Database Layer (Cloud Database)
* **Cloud Platform:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* **Technology:** Managed MongoDB Cloud Cluster.
* **Database Name:** `hospitalDB`
* **Collection:** `patients`
* **Responsibilities:**
  * Persists patient medical records.
  * Guarantees data durability, automated indexing, and high availability.
  * Protected by database user credentials and TLS network access encryption.

---

## 📋 3. Schema Definition

A typical patient document in the MongoDB Atlas `patients` collection contains:

```json
{
  "_id": "670da938e5bc3d8492001a12",
  "patientId": "P-101",
  "name": "Rahul Sharma",
  "age": 34,
  "gender": "Male",
  "contact": "9876543210",
  "email": "rahul.sharma@example.com",
  "department": "Cardiology",
  "doctorAssigned": "Dr. Priya Mehta",
  "roomNumber": "ICU-04",
  "status": "Admitted",
  "diagnosis": "Acute Coronary Syndrome - Observation",
  "admissionDate": "2026-10-14T00:00:00.000Z",
  "createdAt": "2026-10-14T11:00:00.000Z",
  "updatedAt": "2026-10-14T11:00:00.000Z"
}
```

---

## 🔌 4. REST API Endpoints Specification

| Operation | HTTP Method | Endpoint | Description | Layer Sequence |
|---|---|---|---|---|
| **Create** | `POST` | `/api/patients` | Register a new patient | Frontend &rarr; Render &rarr; MongoDB Atlas |
| **Read (All)** | `GET` | `/api/patients` | Display all patients (supports `?search=&department=&status=`) | Frontend &larr; Render &larr; MongoDB Atlas |
| **Read (Single)**| `GET` | `/api/patients/:id`| Find patient by ID or `_id` | Frontend &larr; Render &larr; MongoDB Atlas |
| **Update** | `PUT` | `/api/patients/:id`| Modify patient medical/ward information | Frontend &rarr; Render &rarr; MongoDB Atlas |
| **Delete** | `DELETE` | `/api/patients/:id`| Discharge / remove patient record | Frontend &rarr; Render &rarr; MongoDB Atlas |
| **Stats** | `GET` | `/api/patients/stats`| Summary counts for dashboard metrics | Frontend &larr; Render &larr; MongoDB Atlas |
| **Health** | `GET` | `/api/health` | Tier 2 status and MongoDB connection check | Monitoring & Frontend |

---

## 📂 5. Project Directory Structure

```text
CA2 ACTIVITY 1/
├── backend/                             # TIER 2: Express REST API Server
│   ├── config/
│   │   └── database.js                 # MongoDB Atlas Mongoose connection
│   ├── controllers/
│   │   └── patientController.js        # CRUD business logic and stats
│   ├── models/
│   │   └── Patient.js                  # Mongoose Patient schema definition
│   ├── routes/
│   │   └── patientRoutes.js            # Express router mapping
│   ├── .env.example                    # Environment template
│   ├── .gitignore                      # Git exclusion rules
│   ├── package.json                    # Backend dependencies & start scripts
│   └── server.js                       # Main Express application entry
│
├── frontend/                            # TIER 1: React / Vite Presentation UI
│   ├── public/
│   │   └── _redirects                  # Netlify SPA routing rewrite rule
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureModal.jsx   # Interactive 3-Tier cloud visualizer
│   │   │   ├── DeleteConfirmModal.jsx  # Deletion verification modal
│   │   │   ├── Navbar.jsx              # Header with Tier badges & connectivity
│   │   │   ├── NotificationToast.jsx   # Toast notifications
│   │   │   ├── PatientDetailsModal.jsx # Detailed medical chart viewer
│   │   │   ├── PatientFormModal.jsx    # Add / Edit patient modal
│   │   │   └── StatsCards.jsx          # Live hospital metrics cards
│   │   ├── services/
│   │   │   └── api.js                  # Asynchronous HTTP client for Render API
│   │   ├── App.jsx                     # Core application view & state manager
│   │   ├── index.css                   # Custom medical UI styling
│   │   └── main.jsx                    # React entry file
│   ├── .env.example                    # Frontend environment template
│   ├── index.html                      # HTML template
│   ├── netlify.toml                    # Netlify deployment configuration
│   ├── package.json                    # Frontend dependencies
│   └── vite.config.js                  # Vite bundler configuration
│
├── DEPLOYMENT_GUIDE.md                  # Comprehensive step-by-step deployment guide
├── netlify.toml                         # Root Netlify build descriptor
├── .gitignore                           # Root git ignore
└── README.md                            # Complete architecture documentation
```

---

## 💻 6. Local Development & Testing Instructions

You can run both tiers locally to test before or alongside cloud deployment:

### 1. Start Tier 2 (Backend)
```bash
cd backend
npm install
# Copy .env.example to .env and insert your MongoDB Atlas URI
npm run dev
```
The server will start at `http://localhost:5000`.

### 2. Start Tier 1 (Frontend)
```bash
cd frontend
npm install
npm run dev
```
The application will open at `http://localhost:5173`.

---

## 🚀 7. Cloud Deployment Checklist

For complete step-by-step instructions on obtaining credentials and deploying to each cloud provider, see **[`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)**:

1. **MongoDB Atlas:** Create cluster, set Network Access to `0.0.0.0/0`, obtain URI.
2. **Render:** Deploy Web Service pointing to `backend/`, set `MONGODB_URI` environment variable.
3. **Netlify:** Deploy Site pointing to `frontend/`, set `VITE_API_BASE_URL` pointing to Render API URL.
4. **CORS:** Update `FRONTEND_URL` on Render to allow secure cross-domain requests.
5. **Testing:** Run the 5 verification test cases in `DEPLOYMENT_GUIDE.md`.
