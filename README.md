# 🧠 PPT Chatbot — AI PowerPoint Assistant

An intelligent chatbot that helps users **create, edit, and generate PowerPoint presentations (PPTs)** automatically using AI.  
Built with a **FastAPI backend** and a **React + Tailwind frontend**, this project enables users to generate slides through chat-style prompts.

---

## 🌟 Features

✅ **AI-Generated Slides** — Automatically create presentations from text prompts.  
✅ **Template Upload** — Upload your own `.pptx` templates for customization.  
✅ **Slide Editor** — Edit content and structure through a chat interface.  
✅ **Download & Save** — Export the final PowerPoint file.  
✅ **Modern UI** — Sleek React + Tailwind design.

---

## 🧩 Tech Stack

| Layer        | Technology                         | Description                              |
|--------------|-------------------------------------|------------------------------------------|
| Frontend     | React, Vite, Tailwind CSS           | Chat interface & editor UI               |
| Backend      | FastAPI (Python)                    | RESTful API for processing requests      |
| AI Logic     | Python (Custom Model / OpenAI API)  | Generates and structures slide content   |
| PPT Handling | python-pptx                         | Creates and modifies PowerPoint files    |
| Communication| Axios                               | Frontend ↔ Backend connection            |
| Storage      | Local / Cloud (uploads folder)      | Stores PPT templates and generated files |

---

## 📁 Folder Structure

ppt-chatbot/
│
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPI entry point
│ │ ├── config.py # Configuration file
│ │ ├── routes/ # API endpoints
│ │ │ ├── generate.py # PPT generation logic
│ │ │ ├── upload.py # Template upload
│ │ │ └── edit.py # Edit slides
│ │ ├── models/ # AI models
│ │ │ └── ai_model.py
│ │ ├── utils/ # Helper utilities
│ │ │ ├── pptx_helper.py
│ │ │ └── file_handler.py
│ ├── uploads/ # Uploaded files
│ ├── run.py # Backend runner
│ └── requirements.txt # Python dependencies
│
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/ # React UI components
│ │ ├── pages/ # Main pages
│ │ ├── utils/ # API integrations
│ │ └── index.js # Entry point
│ ├── package.json # Node dependencies
│ ├── tailwind.config.js # Tailwind setup
│ └── vite.config.js # Vite config
│
├── .gitignore
└── README.md


---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/deenathayalan08/ppts-chatbot.git
cd ppt-chatbot

2️⃣ Setup Backend (FastAPI)
cd backend
python -m venv venv
venv\Scripts\activate   # (on Windows)
pip install -r requirements.txt
python run.py


Server runs at 👉 http://127.0.0.1:8000

3️⃣ Setup Frontend (React)
cd frontend
npm install
npm run dev


Frontend runs at 👉 http://localhost:5173

🏗️ Project Progress
✅ Completed

Backend setup with FastAPI

Routes: /generate, /upload, /edit

PPT generation using python-pptx

Dummy AI model integrated

CORS enabled for frontend connection

GitHub repo initialized and pushed

🚀 Next Steps

Add requirements.txt dependencies

Create frontend using React + Tailwind

Connect frontend to backend API

Add real AI model (OpenAI / LLaMA)

Add cloud storage & design themes

📦 Dependencies
Backend

FastAPI

Uvicorn

python-pptx

Pydantic

aiofiles

Frontend

React

Vite

Tailwind CSS

Axios

👨‍💻 Author

🧑‍🎓 Deenathayalan (Bubly Bear)
B.Tech Artificial Intelligence & Data Science
Karpagam College of Engineering

📅 Final Year Project — AI-Powered PPT Chatbot

🏁 Future Enhancements

Integrate OpenAI or LLaMA for real text-to-slide generation

Add voice command support

Enable cloud-based PPT storage and sharing

Add multiple design templates and color themes

⭐ If you like this project, don’t forget to star the repo!


---

Just copy and paste this into a file named `README.md` in your **root folder**, then commit and push it:
```bash
git add README.md
git commit -m "Added project README"
git push