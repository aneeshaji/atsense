# ATSense

AI-powered ATS resume analyzer and builder that scores resumes against job descriptions and generates ATS-friendly resumes.

---

## 🚀 Repository Name

**Recommended repo name:**

```
atsense
```

**Alternatives:**

- atsense-ai
- atsense-app
- ats-resume-builder

---

## 🧠 What is ATSense?

ATSense is a full-stack SaaS-style application that helps job seekers:

- Analyze how well their resume matches a Job Description (ATS score)
- Generate ATS-optimized resume content using AI
- Build clean, recruiter-friendly resumes
- Export resumes as ATS-safe PDF and DOCX files

The platform follows real Applicant Tracking System (ATS) rules such as keyword matching, section completeness, and formatting safety.

---

## ✨ Key Features

- 🔍 ATS Score Analyzer – Keyword and structure-based ATS scoring
- 🤖 AI Resume Generator – Job-description-aware content generation
- 🧾 ATS-Safe Templates – No tables, icons, or columns
- 📄 PDF & DOCX Export – Recruiter and ATS readable formats
- 🔐 JWT Authentication – Secure login & user isolation
- 📊 Resume Dashboard – Manage multiple resume versions
- ⚡ Modern Stack – React, Node.js, MongoDB

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- React Router
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API

### DevOps

- Docker (planned)
- Vercel / Render (deployment)

---

## 📁 Project Structure

```
atsense/
├── frontend/
├── backend/
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/atsense
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

---

## ▶️ Getting Started (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/atsense.git
cd atsense
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at: http://localhost:5000

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔐 Authentication Flow

- User registers / logs in
- JWT token stored in browser
- Token sent via Authorization header
- Protected resume APIs

---

## 🧠 ATS Scoring Logic

ATSense calculates a score based on:

- Job description keyword match
- Skills relevance
- Experience & education presence
- Resume structure completeness

Score range: 0–100

---

## 📄 Resume Export

Supported formats:

- PDF (ATS-safe)
- DOCX (editable)

---

## 🧪 API Endpoints (Sample)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/resumes
POST   /api/ai/generate
GET    /api/export/pdf/:id
GET    /api/export/docx/:id
```

---

## 🧩 Future Enhancements

- Subscription plans
- Cover letter generator
- Resume keyword gap suggestions
- LinkedIn optimization

---

## 📜 License

MIT License

---

## 👨‍💻 Author

Built with ❤️ by Aneesh Ajithkumar

---

**ATSense — Build resumes that ATS understands.**
