# Hospital Backend System Test

## Overview
Develop a backend system for a hospital that handles user signups, patient–doctor assignments, doctor note submissions, and dynamic scheduling of actionable steps based on live LLM processing. The system must secure sensitive data and use a live LLM to extract actionable steps—divided into a checklist (immediate tasks) and a plan (scheduled actions). New note submissions should cancel any existing actionable steps and create new ones.

## Requirements

### 1. User Management
- **Signup Endpoint:**  
  - Register users with **Name, Email, Password**.
  - Users sign up as either a *Patient* or a *Doctor* (you choose the structure).

- **Authentication & Security:**  
  - Use your preferred authentication method.
  - Store passwords securely and encrypt all doctor notes so raw notes can ONLY be seen by the patient or doctor (Hint. end-to-end encryption).

### 2. Patient–Doctor Assignment
- **Doctor Selection:**  
  - Patients must choose from a list of available doctors after signup.
- **Doctor View:**  
  - Doctors should see a list of patients who have selected them.

### 3. Doctor Notes & Actionable Steps
- **Note Submission:**  
  - Doctors select a patient and submit notes.
- **LLM Integration:**  
  - Use a live LLM (e.g., Google Gemini Flash or equivalent) to extract actionable steps:
    - **Checklist:** Immediate tasks.
    - **Plan:** A schedule of actions (e.g., daily reminders for 7 days).
- **Dynamic Scheduling:**  
  - Schedule reminders per the plan (reminders may be logged or stored).
  - Reminders repeat until a patient checks in, then proceed to the next one.
  - New notes cancel any previously scheduled actionable steps.

### 4. API Endpoints
Expose endpoints for:
- User signup and authentication.
- Patient doctor selection.
- Doctor retrieval of their patient list.
- Submitting doctor notes and processing actionable steps.
- Retrieving actionable steps and reminders.

### 5. Documentation & Justification
Provide documentation justifying your design decisions (e.g., authentication, encryption, scheduling strategy, data storage). All specifics are up to you.

## Technical Constraints
- Use any backend stack you prefer (Node.js is recommended).
- This is a backend-only project.
- External resources are allowed.

## Submission
- Host your project on GitHub.
- Submit via the gigsama.com talent portal.

Good luck!
