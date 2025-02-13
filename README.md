# Hospital Backend System Test

## Overview
Develop a backend system for a hospital that handles user signups, patient–doctor assignments, doctor note submissions, and dynamic scheduling of actionable steps based on live LLM processing. The system must secure sensitive data and process doctor notes through a live LLM to extract actionable steps. These actionable steps are divided into two categories: a checklist (immediate tasks) and a plan (scheduled actions). New note submissions should cancel any previously scheduled actionable steps and generate new ones.

## Requirements

### 1. User Management
- **Signup Endpoint:**  
  - Create an endpoint to register users with the following fields: **Name, Email, Password**.
  - Users can sign up as either a *Patient* or a *Doctor* (you decide whether to use a unified endpoint or separate ones).
  
- **Authentication & Security:**  
  - Choose your preferred authentication method.
  - Ensure passwords are stored securely.
  - Encrypt all doctor notes on the backend so that raw notes cannot be retrieved.

### 2. Patient–Doctor Assignment
- **Doctor Selection:**  
  - After signup, patients must be able to choose from the list of all available doctors.
  
- **Doctor View:**  
  - When a doctor signs in, they should see a list of patients who have selected them.

### 3. Doctor Notes & Actionable Steps
- **Note Submission:**  
  - Doctors can select a patient and submit notes about that patient.
  
- **LLM Integration:**  
  - Integrate with a live LLM (e.g., Google Gemini Flash or an equivalent model) to extract actionable steps divided into two categories:
    - **Checklist:** Immediate tasks (e.g., "acquire drug").
    - **Plan:** A scheduled set of actions (e.g., trigger a daily reminder for 7 days).
  
- **Dynamic Scheduling:**  
  - Upon checklist completion, dynamically schedule reminders based on the plan. These reminders can be logged or stored.
  - When a patient performs a check-in for a reminder, the system should move on to the next scheduled reminder. If no check-in is recorded, the reminder repeats until the patient checks in, before proceeding to the next reminder.
  - If a doctor submits new notes, cancel any previously scheduled actionable steps and generate new ones accordingly.

### 4. API Endpoints:**  
  - Expose endpoints for:
    - User signup and authentication.
    - Patient doctor selection.
    - Doctor retrieval of their patient list.
    - Submitting doctor notes and processing actionable steps.
    - Retrieving actionable steps and reminders.

### 5. Documentation & Justification
- Provide documentation that justifies your design decisions (e.g., choices around authentication, encryption methods, scheduling strategy, and data storage). All specifics (e.g., the type of persistent database, authentication method, etc.) are up to you.

## Technical Constraints
- You may use any backend stack you prefer (Node.js is recommended).
- This is a backend-only project (no frontend required).
- External resources (e.g., Stack Overflow, AI tools) are allowed.

## Submission
- Host your project on GitHub.
- Submit your project via the gigsama.com talent portal.

Good luck!
