# CampusConnect

# 🎓 Campus Connect – AI-Powered Smart Campus Platform

**One Campus. One Platform. Endless Possibilities.**

Campus Connect is an AI-powered smart campus management and student assistance platform that brings essential college services, academic information, and campus resources together in one centralized digital environment.

It aims to simplify communication between students, faculty, and college administration through a unified platform.

---

## 📌 Project Overview

In many colleges, students need to visit different departments, websites, or notice boards to access important information.

Campus Connect aims to solve this problem by providing a single digital platform for:

- Academic and campus information
- Student services
- Faculty and department details
- Notices and events
- Admission and placement information
- Library and campus facilities
- AI-powered campus assistance

The platform follows a modular architecture and initially uses mock college data, with scope for future integration of real institutional data.

## 🎯 Objectives

- Centralize college information and services.
- Improve communication between students and administration.
- Provide role-based access to campus services.
- Simplify access to academic and administrative information.
- Introduce AI-powered campus assistance.
- Build a scalable platform for future institutional integration.

## ✨ Key Features

| Module            | Description                       |
| ----------------- | --------------------------------- |
| Student Dashboard | Centralized student interface     |
| Faculty Directory | Faculty information               |
| Departments       | Department details                |
| Notices           | College announcements             |
| Events            | Campus activities                 |
| Admission         | Admission-related information     |
| Campus Guide      | Campus map and location directory |
| Library           | Library information               |
| Placements        | Placement-related resources       |
| Complaints        | Complaint management interface    |
| AI Assistant      | Intelligent campus assistance     |

## 👥 User Roles

The intended platform roles include:

- Student
- Faculty
- HOD
- Admin
- Admission Cell
- Exam Cell
- Library
- Placement Cell
- Event Organizer
- IT Cell
- Hostel and Transport Administration
- Super Admin

Role-based permissions are intended to be enforced through the backend.

## 🛠️ Technology Stack

| Layer             | Technologies                                  |
| ----------------- | --------------------------------------------- |
| Frontend          | React.js, Vite, JavaScript, CSS               |
| Routing           | React Router                                  |
| API Communication | Axios                                         |
| Backend           | Node.js, Express.js                           |
| Database          | MongoDB                                       |
| AI Service        | Python, Google Gemini API                     |
| AI Enhancement    | RAG, embeddings and semantic search (planned) |
| Tools             | VS Code, Git, GitHub, Postman                 |
| Deployment        | Vercel (frontend)                             |

## 🏗️ System Architecture

Campus Connect follows a modular architecture with separate frontend, backend, database, and AI service responsibilities.

```text
          FRONTEND
        React + Vite
              |
              v
        SERVICE LAYER
        Axios / APIs
              |
              v
           BACKEND
      Node.js + Express
              |
              v
           DATABASE
            MongoDB


          AI SERVICE
            Python
              |
              v
         Google Gemini
```

**Frontend:** Provides interfaces for students, faculty, and administrators.

**Service Layer:** Handles API communication between frontend components and backend services.

**Backend:** Processes requests, application logic, and database operations.

**Database:** Stores structured campus information and application records.

**AI Service:** Supports AI-powered campus assistance.

## 📦 Main Project Modules

- Authentication and dashboards
- Department and faculty management
- Notices and events
- Admission assistance
- Campus navigation
- Library and placement services
- Complaints and feedback
- AI-powered campus assistant
- Question-and-answer dataset

## 🤖 AI-Powered Campus Assistant

The AI component aims to help users find college-related information through natural-language questions.

Its intended capabilities include:

- Answering campus FAQs.
- Providing admission guidance.
- Finding department and faculty information.
- Assisting with campus service queries.
- Using college-specific QA data for grounded responses.

The planned RAG approach will retrieve relevant college information before generating answers, helping reduce unsupported responses.

## 🗄️ Database

MongoDB is used for storing structured campus information.

Relevant data collections include:

- Users
- Departments
- Faculty
- Notices
- Events
- Complaints
- Campus Locations
- Library
- Placements
- QA Dataset

The campus location records support structured location search and future map integration.

## 📁 Project Structure

```text
CampusConnect/
│
├── ai-service/
│   ├── main.py
│   └── test_mongodb.py
│
├── backend/
│   ├── src/
│   │   └── config/
│   │       ├── database.js
│   │       └── modules/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- Python
- MongoDB
- Git

### 1. Clone Repository

```bash
git clone https://github.com/praveenyadav2904-cpu/CampusConnect.git
cd CampusConnect
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Set Up AI Service

```bash
cd ai-service
python -m venv venv
```

Activate the virtual environment and install the dependencies specified by the AI service.

## ▶️ Running the Project

Run each service in a separate terminal.

**Frontend:**

```bash
cd frontend
npm run dev
```

**Backend:**

```bash
cd backend
npm start
```

**AI Service:** Run the Python application using its configured entry point.

Configure the required environment variables and database connection before starting integrated services.

## 🔐 Security

The project architecture considers:

- Environment-based secret management.
- Backend-side authorization.
- Role-Based Access Control (RBAC).
- API input validation.
- Separation of frontend, backend, and database responsibilities.

Never upload `.env` files, passwords, or API keys to GitHub.

## 🔮 Future Scope

- Complete authentication and RBAC.
- Advanced RAG-based campus assistant.
- Semantic search over college documents.
- Interactive campus navigation.
- Timetable and examination services.
- Hostel and transport management.
- Real-time notifications.
- Analytics and reporting.
- React Native mobile application.

## 🤝 Contributing

Contributions and suggestions are welcome.

Recommended workflow:

1. Create a feature branch.
2. Implement and test changes.
3. Commit using clear messages.
4. Submit a pull request.

## 📄 Project Information

**Project:** Campus Connect  
**Category:** Smart Campus Management and AI-Powered Student Assistance  
**Repository:** https://github.com/praveenyadav2904-cpu/CampusConnect

---

<p align="center">

**Campus Connect**

_One Campus. One Platform. Endless Possibilities._

</p>
