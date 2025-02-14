# Hospital Backend System

## Overview

This hospital backend system is designed to facilitate secure user signups, doctor-patient assignments, doctor note submissions, and dynamic scheduling of actionable steps. It integrates a live LLM to extract structured tasks from doctor notes, ensuring efficient treatment tracking and patient engagement.

## Architectural Decision: GraphQL over REST

### Why GraphQL?

I chose GraphQL as the primary API architecture instead of REST due to its flexibility, efficiency, and developer experience. Some of the key advantages of GraphQL over REST include:

- **Efficient Data Fetching:** Unlike REST, where multiple requests may be needed to fetch related data, GraphQL allows the frontend to request only the necessary fields in a single query, reducing over-fetching and under-fetching issues.
- **Auto-generated Documentation:** GraphQL comes with an introspection system that enables auto-generated API documentation, making it easier for frontend developers to explore and understand available queries and mutations.
- **Strong Type System:** GraphQL enforces strict typing, reducing potential errors and improving data validation.
- **Batching & Caching Support:** With GraphQL, multiple queries can be resolved in a single request, and caching strategies can be implemented efficiently using libraries like Apollo Client.
- **Client-Specific Queries:** Unlike REST, where fixed endpoints return predefined responses, GraphQL allows clients to specify exactly what data they need, leading to optimized network usage.

## Authentication & Security

### Authentication

- **JWT-based Authentication:** Ensures secure API access.
- **User Roles:** Doctors and Patients have distinct roles and permissions.
- **Rate Limiting:** Prevents brute-force attacks and API abuse.

### Data Encryption Strategy

#### Why Encrypt the Private Key with the Password?

- The private key is encrypted using the user's password to ensure that even if the database is compromised, the private key remains inaccessible without the correct password.
- This approach ensures that only the user (or an authorized party with the correct password) can decrypt and use the private key.
- If encryption keys are exposed, the system remains secure since an additional authentication factor (the password) is required for decryption.

#### Encryption Algorithm Choice

- **AES-256-GCM** was selected for encrypting the private key because:
  - It offers high security and is resistant to brute-force attacks.
  - GCM mode provides both encryption and integrity verification, preventing tampering.
  - AES is a widely adopted standard in secure systems and meets industry best practices.

## Data Storage

### Database Choice & Schema Normalization

- **Database:** PostgreSQL with Sequelize ORM (chosen for relational data integrity).
- **Schema Normalization:**
  - **User Table:** Stores general user data.
  - **Doctor & Patient Tables:** Separate tables for each role, referencing User.
  - **DoctorNotes Table:** Links doctor notes to patients securely.
  - **ActionableSteps Table:** Stores checklist and plan items extracted via LLM.
  - **Reminders Table:** Tracks patient adherence and follow-ups.

## Scheduling Strategy

### BullMQ for Queue Management

- **Processing LLM Extraction:** A queue handles doctor note processing asynchronously.
- **Repeatable Reminders:** Patients receive reminders at scheduled intervals.
- **Time-based Scheduling:** Uses cron jobs for recurring reminders.
- **Dynamic Extension:** Reminders continue until the patient checks in.
- **Event-driven Cancellation:** New doctor notes override existing reminders.

## Justification for Design Choices

### Security First Approach

#### Why End-to-End Encryption?

- Protects sensitive patient information.
- Ensures compliance with HIPAA-like regulations.

#### Why Public/Private Key Encryption?

- Prevents unauthorized access.
- Even database breaches won’t expose patient notes.

### Scalability Considerations

#### Why BullMQ for Task Scheduling?

- Enables efficient background processing.
- Supports retry mechanisms for failed jobs.
- Reduces real-time API load by offloading tasks to queues.

#### Why PostgreSQL?

- Ensures **ACID compliance** for transactional integrity.
- Handles relational queries efficiently.
- Allows structured indexing for fast lookups.

### Real-time Patient Engagement

- **Dynamic Reminders** ensure that patients adhere to treatment plans.
- **LLM-powered Actionable Steps** provide structured treatment guidance.

## How to Run the Project

### Prerequisites

Ensure you have **TypeScript** installed on your machine.

### Setup Instructions

1. **Clone the repository**

   ```sh
   git clone https://github.com/Manuel2u/Backend-Test-001.git
   cd Backend-Test-001
   ```

2. **Create an `.env` file**

   - Copy the environment variables from `.env.sample` and configure them accordingly.

3. **Install dependencies**

   ```sh
   yarn install
   ```

4. **Start the project**
   ```sh
   yarn run dev
   ```

## Conclusion

This backend system balances security, scalability, and automation. It ensures patient confidentiality, efficient scheduling, and AI-powered guidance for structured treatment plans. The use of encryption, queuing, and dynamic scheduling makes it a robust and production-ready system.
