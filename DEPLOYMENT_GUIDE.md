# 📋 Three-Tier Cloud Architecture: Complete Deployment & Credentials Guide

**Project Title:** Design and Deployment of a Three-Tier Web Application Using Netlify, Render, and MongoDB Atlas  
**Domain Adaptation:** Hospital Patient Information Management System (MediPulse)

---

## 🔑 What is Needed From Your Side (Credentials & Accounts)

To deploy and link all three independent cloud tiers, you will need free accounts on the following three platforms:

### 1. MongoDB Atlas Account (Database Tier 3)
* **Website:** [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
* **What you need to obtain:**
  * **MongoDB Atlas Connection URI string**:
    ```text
    mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hospitalDB?retryWrites=true&w=majority
    ```
  * Replace `<username>` with your MongoDB Database User username.
  * Replace `<password>` with your database user password.
  * Ensure the database name is set to `hospitalDB`.

### 2. GitHub Account (Version Control & CI/CD)
* **Website:** [https://github.com](https://github.com)
* **What you need:** A GitHub repository (public or private) where you push this project (`CA2 ACTIVITY 1`). Both Netlify and Render will link directly to this repository for continuous deployment.

### 3. Render Account (Backend / API Tier 2)
* **Website:** [https://render.com](https://render.com)
* **What you will get:** A public HTTPS API URL:
  ```text
  https://hospital-patient-api.onrender.com
  ```

### 4. Netlify Account (Frontend / Presentation Tier 1)
* **Website:** [https://www.netlify.com](https://www.netlify.com)
* **What you will get:** A public HTTPS web application URL:
  ```text
  https://medipulse-hospital.netlify.app
  ```

---

## 🛠️ Step-by-Step Deployment Instructions

### Step 1: Set Up MongoDB Atlas (Database Tier 3)

1. **Sign in** to MongoDB Atlas.
2. Click **Build a Database** and select the **M0 Free Shared Tier**.
3. Choose a provider (e.g., AWS) and region nearest to you.
4. **Create Database User:**
   * Go to **Security → Database Access → Add New Database User**.
   * Authentication Method: **Password**.
   * Username: e.g., `hospital_admin`
   * Password: Create a secure password (avoid special characters like `@` or `:` that break URL parsing, or URL-encode them).
   * Database User Privileges: **Read and write to any database**.
   * Click **Add User**.
5. **Configure Network Access (Crucial for Render):**
   * Go to **Security → Network Access → Add IP Address**.
   * Select **Allow Access From Anywhere** (`0.0.0.0/0`).
   * *Why?* Render uses dynamic IP addresses in its free tier; `0.0.0.0/0` ensures Render's web service can reach your database securely with TLS.
   * Click **Confirm**.
6. **Copy Connection String:**
   * Go to **Clusters → Connect → Drivers**.
   * Select **Node.js** and version `5.5 or later`.
   * Copy the connection string. It looks like:
     ```
     mongodb+srv://hospital_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
   * Add `/hospitalDB` before the `?retryWrites=true` query:
     ```
     mongodb+srv://hospital_admin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/hospitalDB?retryWrites=true&w=majority
     ```

---

### Step 2: Push Code to GitHub

1. Open PowerShell or Command Prompt in the `CA2 ACTIVITY 1` directory.
2. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Three-Tier Hospital Management System"
   ```
3. Create a new repository on GitHub (e.g., `three-tier-hospital-system`).
4. Link and push:
   ```bash
   git remote add origin https://github.com/<your-username>/three-tier-hospital-system.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 3: Deploy Backend on Render (Application Tier 2)

1. Log in to [Render.com](https://render.com) and click **New + → Web Service**.
2. Connect your GitHub repository (`three-tier-hospital-system`).
3. Fill in the following deployment configuration:
   * **Name:** `hospital-patient-api` (or any custom name)
   * **Region:** Any (e.g., Singapore, Frankfurt, or Oregon)
   * **Root Directory:** `backend` *(Important!)*
   * **Environment:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
   * **Plan Type:** `Free`
4. Scroll down to **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | `mongodb+srv://hospital_admin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/hospitalDB?retryWrites=true&w=majority` |
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | `https://your-hospital-frontend.netlify.app` *(Can be updated after Netlify deployment)* |
5. Click **Deploy Web Service**.
6. Once deployed, Render will display your live Backend URL:
   ```text
   https://hospital-patient-api.onrender.com
   ```
7. Verify by opening in browser: `https://hospital-patient-api.onrender.com/api/health`.  
   You should receive:
   ```json
   {
     "status": "OK",
     "database": {
       "status": "Connected",
       "name": "hospitalDB"
     }
   }
   ```

---

### Step 4: Deploy Frontend on Netlify (Presentation Tier 1)

1. Log in to [Netlify.com](https://www.netlify.com).
2. Click **Add new site → Import an existing project**.
3. Select **GitHub** and authorize your repository (`three-tier-hospital-system`).
4. Fill in the build settings:
   * **Base directory:** `frontend`
   * **Build command:** `npm run build`
   * **Publish directory:** `frontend/dist`
5. Expand **Environment variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://hospital-patient-api.onrender.com/api` |
6. Click **Deploy Site**.
7. Netlify will generate your public URL:
   ```text
   https://your-hospital-frontend.netlify.app
   ```
8. *(Optional)* Return to Render Dashboard → Environment Variables → Update `FRONTEND_URL` with your exact Netlify URL so CORS remains strict and secure.

---

## 🧪 Testing the 5 Required Test Cases

After both Render and Netlify deployments are complete, test the 5 required operations:

### Test Case 1: Add Patient (POST /api/patients)
* **Action:** Click **"Register Patient"** in the Netlify web app.
* **Input:**
  * Patient ID: `P-101`
  * Name: `Rahul Sharma`
  * Age: `34`
  * Gender: `Male`
  * Contact: `9876543210`
  * Department: `Cardiology`
  * Attending Doctor: `Dr. Priya Mehta`
  * Ward / Bed: `ICU-04`
  * Status: `Admitted`
  * Diagnosis: `Acute Coronary Syndrome`
* **Expected Result:**
  * Success toast: *"Patient registered successfully in MongoDB Atlas!"*
  * The patient appears in the table.

### Test Case 2: Display Patients (GET /api/patients)
* **Action:** View the directory table or search by `Rahul` or filter by `Cardiology`.
* **Expected Result:**
  * All registered records are fetched from MongoDB Atlas via Render and displayed accurately in the table.

### Test Case 3: Update Patient (PUT /api/patients/:id)
* **Action:** Click the **Edit (pencil icon)** on patient `P-101`.
* **Change:**
  * Status: `Admitted` &rarr; `Discharged`
  * Room: `ICU-04` &rarr; `Discharged Home`
* **Click:** **Update Record**.
* **Expected Result:**
  * Success message displayed.
  * Status badge updates to green `Discharged` pill.
  * MongoDB document is updated.

### Test Case 4: Delete / Discharge Patient (DELETE /api/patients/:id)
* **Action:** Click the **Delete (trash icon)** on a patient.
* **Confirm:** Click **Confirm Delete** in the modal.
* **Expected Result:**
  * Confirmation notification.
  * Patient row is removed from UI and deleted from MongoDB Atlas collection.

### Test Case 5: Database Verification
* **Action:** Open [MongoDB Atlas](https://cloud.mongodb.com) &rarr; **Database** &rarr; **Browse Collections**.
* **Select:** `hospitalDB` &rarr; `patients`.
* **Expected Result:**
  * Inspect the documents and verify that operations performed on Netlify reflect accurately in real-time in MongoDB Atlas!
