# 📋 Team Task Manager

> A comprehensive full-stack task management application with role-based access control, perfect for teams of all sizes.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-blue?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#)

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📦 Project Structure](#-project-structure)
- [🔐 Configuration](#-configuration)
- [📤 Deployment](#-deployment)
- [💡 Key Notes](#-key-notes)

---

## ✨ Features

- 🔐 **Secure Authentication**: Signup/Login with JWT token-based authentication
- 👥 **Role-Based Access Control**: Admin and Member roles with different permissions
- 📊 **Project Management**: Create and manage projects with team member assignments
- ✅ **Task Management**: Create, assign, and track task status in real-time
- ⚠️ **Smart Notifications**: Automatic overdue task detection and alerts
- 📈 **Dashboard**: Beautiful summary view for tasks, statuses, and overdue items
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with Vite
- **Axios** for API requests
- **Modern CSS** with responsive design

### Backend
- **Node.js** & **Express** for server
- **SQLite** for local database
- **JWT** for authentication

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

#### 1️⃣ Server Setup

```bash
cd server
npm install
npm run dev
```

The server will start on **http://localhost:4000**

#### 2️⃣ Client Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

✅ That's it! Your app is ready to use.

---

## 📦 Project Structure

```
Playground/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Node.js backend application
    ├── routes/
    │   ├── auth.js        # Authentication endpoints
    │   ├── dashboard.js   # Dashboard endpoints
    │   ├── projects.js    # Project management
    │   └── tasks.js       # Task management
    ├── middleware/
    │   └── auth.js        # JWT authentication middleware
    ├── db.js              # Database configuration
    ├── index.js           # Server entry point
    ├── package.json
    └── Procfile           # Deployment configuration
```

---

## 🔐 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=4000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 📤 Deployment

### Deploy on Railway

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to [Railway](https://railway.app/)
3. Set the following environment variables:
   - `PORT`: 4000
   - `JWT_SECRET`: Your secure secret key
4. Railway will auto-detect the Node.js app and deploy

---

## 💡 Key Notes

| Feature | Details |
|---------|---------|
| 🗄️ **Database** | SQLite is used for local development |
| 👑 **Admin Role** | The first user to sign up automatically becomes an Admin |
| 🌐 **Access URLs** | Frontend: `http://localhost:5173` \| Backend: `http://localhost:4000` |
| 🔑 **Authentication** | JWT tokens stored in local storage for session management |

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

**Built with ❤️ for better team collaboration**
