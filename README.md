# 🎓 Student Management Frontend

This is the frontend for the **Student Management System**, built using **React**, **Bootstrap 5**, and **Axios**.  
It supports three user roles: **Admin**, **Teacher**, and **Student**, each with their own dashboard and navigation structure.

---

## 🚀 Features

### 🧑‍💼 Admin Panel
- Manage **sessions, semesters, sections, subjects**
- Create and manage **teacher schedules**
- Enroll students into subjects
- View platform **statistics** and submitted results
- Full CRUD operations for **students**

### 👨‍🏫 Teacher Dashboard
- Create/manage **CT exams**
- Mark **attendance** for classes
- Create, update, delete **assignments**
- Upload **student results**
- View teaching schedule assigned by admin

### 🧑‍🎓 Student Panel
- View **class schedule**
- View and submit **assignments**
- View upcoming **CT exams**
- Check **attendance records**
- View **grades** and **enrollment information**

---

## 🧰 Tech Stack

| Tool / Library      | Purpose                                 |
|---------------------|-------------------------------------------|
| **React**     | UI framework                              |
| **React Router**    | Routing and role-based navigation         |
| **Axios**           | API communication                         |
| **Bootstrap 5**     | UI layout and styling                     |
| **React Icons**     | Icon set                                  |

---

## 🔐 Authentication

- JWT-based login for Admin
- Token stored in `localStorage`
- Protected routes by role:
  - `/admin/*` – Admin only  
  - `/teacher/*` – Teacher only  
  - `/student/*` – Student only  

---

## 📦 Scripts

```bash
# Install dependencies
npm install

# Start in development mode
npm start

# Create production build
npm run build

# Run tests
npm test

