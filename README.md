# 🚀 SmartHire AI

SmartHire AI is an AI-powered resume analysis and job discovery platform designed for freshers and internship seekers. It helps users analyze resumes, evaluate ATS compatibility, identify missing keywords, discover live job opportunities, and understand skill-market alignment.

## 🌐 Live Demo

🔗 **Live Application:**  
https://ats-frontend-q9ef.onrender.com

## ✨ Key Features

- 📄 AI-powered resume analysis
- ✅ ATS compatibility checker
- 🤖 AI-generated resume insights
- 💪 Strength identification
- ⚠️ Missing keyword detection
- 🚀 Personalized resume improvement suggestions
- 🎯 Resume-based job matching
- 🔴 Live fresher and internship job discovery
- 📊 Resume and job market statistics
- 📈 Skill-market alignment analysis
- 🔐 User authentication with JWT
- 📤 PDF resume upload and processing

## 🧠 AI Resume Insights

SmartHire AI analyzes uploaded resumes and provides:

- ATS score
- AI score
- Resume strengths
- Missing keywords
- Actionable improvements
- Detected technical skills
- Resume section analysis

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage
- Responsive UI

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer
- PDF.js Extract
- Google Gemini API
- SerpAPI

### Deployment

- Frontend: Render Static Site
- Backend: Render Web Service
- Database: Render PostgreSQL

## 🔗 Backend API

The frontend communicates with the deployed SmartHire backend API.

POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me

POST /api/resume/analyze
POST /api/ats/check

GET  /api/live-jobs
GET  /api/jobs
GET  /api/statistics

Project Structure
ats_frontend/
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── atsChecker.js
│   │   ├── auth.js
│   │   ├── jobsManager.js
│   │   ├── liveJobs.js
│   │   ├── resumeAnalyzer.js
│   │   ├── statistics.js
│   │   └── utils.js
│   │
│   ├── index.html
│   ├── ats-checker.html
│   ├── login.html
│   └── signup.html
│
├── package.json
├── package-lock.json
├── start-server.js
└── README.md

Run Locally

Clone the repository:

git clone https://github.com/Aditi2354/ats_frontend.git

Navigate to the project directory:

cd ats_frontend

Install dependencies:

npm install

Start the frontend:

npm start

Open the application:

http://127.0.0.1:3001
🔐 Authentication Flow

SmartHire uses JWT-based authentication.

User creates an account.
User logs in with email and password.
Backend returns a JWT token.
Token is stored in LocalStorage.
Protected API requests send the token using the Bearer authorization header.
🚀 Deployment

The frontend is deployed as a static site on Render.

Live URL:

https://ats-frontend-q9ef.onrender.com
🔮 Future Improvements
Resume-to-job semantic matching
Advanced AI career recommendations
Resume history dashboard
Job bookmarking
Application tracking
Personalized skill-gap roadmap
Interview preparation recommendations
👩‍💻 Author

Aditi Kesharwani

GitHub: https://github.com/Aditi2354

```text
https://ats-backend-9fms.onrender.com
