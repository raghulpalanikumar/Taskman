
```markdown
# 🚀 TaskHive — AI-Enhanced Task Management System

TaskHive is a modern full-stack productivity application designed to help users manage tasks intelligently using smart prioritization and structured workflows.

---

## ✨ Key Highlights

- 🔐 Secure authentication using JWT
- 🧠 AI-inspired task prioritization (based on deadlines & importance)
- 📊 Structured task organization with better productivity flow
- ⚡ Fast and responsive UI with modern design
- 🌐 Full-stack implementation using MERN

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS3
- Vite

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Tools & Libraries
- JWT (Authentication)
- bcryptjs (Security)
- Mongoose (Database modeling)
- Postman (API testing)

---

## 📌 Features

- User Signup/Login (JWT Authentication)
- Create, Update, Delete Tasks
- Smart Task Prioritization Logic
- RESTful API Integration
- Responsive UI (Mobile + Desktop)

---

## 🧠 AI Integration (Important Section)

TaskHive includes intelligent logic to enhance productivity:

- Automatically prioritizes tasks based on deadlines
- Suggests task importance using structured rules
- Helps users focus on high-impact work

> Note: AI logic is implemented using rule-based intelligence (can be extended with ML models)

---

## 📁 Project Structure

```

TaskHive/
├── backend/
├── frontend/
└── README.md

````

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/raghulpalanikumar/Taskman
cd Taskman
````

### 2. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside backend:

```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

⚠️ Never expose your real credentials in public repositories.

---

## ▶️ Run the Project

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 📡 API Overview

* POST `/api/auth/signup`
* POST `/api/auth/login`
* GET `/api/auth/me`

---

## 🚀 Future Enhancements

* Real AI model integration (ML-based predictions)
* Task recommendation system
* Notifications & reminders
* Analytics dashboard

---

## 📌 Author

**Raghul P**
📧 [raghulpg2006@gmail.com](mailto:raghulpg2006@gmail.com)
🔗 [https://github.com/raghulpalanikumar](https://github.com/raghulpalanikumar)


