# School Timetable Management System (STMS) 🌿

An educational timetable scheduling and academic management platform built with a **Sage + Cream aesthetic**, **JWT Authentication**, and **Multi-Role Role-Based Access Control (RBAC)** according to institutional Software Requirements Specifications (SRS).

---

## 🌟 Key Features

### 🔐 1. JWT Authentication & Role-Based Access Control (RBAC)
- **User Registration (`/register`)**: Register accounts with Full Name, Email, Username, Password, and Role selection. Signs and issues HMAC-SHA256 JWT tokens.
- **User Login (`/login`)**: Authenticates credentials and returns a secure JWT token stored in `localStorage`. Includes 1-click quick presets for testing.
- **Route Protection (`ProtectedRoute.jsx`)**: Enforces authentication on all role dashboards (`/admin`, `/teacher`, `/student`, `/parent`, `/resources`, `/calendar`).

### 👥 2. Role-Specific Dashboards & Portals
- 👑 **System Admin Hub (`/admin`)**: Institutional metrics, stakeholder management table, and audit trail.
- 👩‍🏫 **Teacher Portal (`/teacher`)**: Personal timetable, period workload tracking, and attendance logger.
- 🎓 **Student Hub (`/student`)**: Class 10-A personal timetable and attendance streak tracker.
- 👨‍👩‍👦 **Parent Portal (`/parent`)**: Student schedule monitoring and attendance remarks.

### 🗓️ 3. Timetable & Facility Management
- **List & Weekly Grid Matrix (`/view-schedule`)**: Dynamic switching between structured table and day-by-day weekly timetable grid with live filtering and CSV export.
- **Classroom & Facility Inventory (`/resources`)**: Room capacity, equipment tracking, and 1-click Book/Release availability toggle.
- **Academic Calendar (`/calendar`)**: School terms, exam dates, and official holidays.
- **AI Microservice**: Python FastAPI service on port 8000 for schedule conflict detection and slot balancing.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router v6, Lucide React, Framer Motion
- **Backend**: Spring Boot (Java 17), Spring Data JPA, H2 / MySQL Database, JWT (HMAC-SHA256)
- **AI Microservice**: FastAPI, Uvicorn, Python 3.11
- **Styling**: Modern CSS3 Custom Properties (Sage + Cream Palette: `#71856A`, `#A8B5A0`, `#F2F5EF`, `#FAFBF8`)

---

## 🚀 Getting Started

### 1. Spring Boot Backend (Port 8080)
```bash
cd springapp
mvn clean package -DskipTests
java -jar target/springapp-0.0.1-SNAPSHOT.jar
```

### 2. React Frontend (Port 8081 / 3000)
```bash
cd reactapp
npm install
npm start
```

### 3. FastAPI Service (Port 8000)
```bash
cd fastapi_service
pip install fastapi uvicorn
uvicorn main:app --port 8000 --host 0.0.0.0
```

---

## 🔑 Demo Accounts

| Role | Username | Password | Default Portal |
|---|---|---|---|
| 👑 **System Administrator** | `admin` | `admin123` | `/admin` |
| 👩‍🏫 **Teacher** | `teacher` | `teacher123` | `/teacher` |
| 🎓 **Student** | `student` | `student123` | `/student` |
| 👨‍👩‍👦 **Parent** | `parent` | `parent123` | `/parent` |

---

## 🧪 Automated Testing

```bash
# Run Backend Tests (13/13 passing)
cd springapp
mvn test

# Run Frontend Tests (7/7 passing)
cd reactapp
npm test -- --watchAll=false
```
