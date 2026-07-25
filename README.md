# Contract AI — Platform Documentation

Contract AI is an enterprise-grade LegalTech SaaS platform designed to help organizations upload, analyze, negotiate, compare, and manage contracts using AI (Grok API, RAG search, and SpaCy).

---

## 🏛 Project Architecture

```
CONTRACT-AI/
├── frontend/               # React + TS + Tailwind + ShadCN
│   ├── src/
│   │   ├── components/     # Reusable layout & UI components
│   │   ├── pages/          # Dashboard, upload, negotiate, compare, etc.
│   │   ├── services/       # Supabase Client & Axios API layer
│   │   └── utils/          # Helpers for formatting & risk colors
│   └── index.html          # Entry point with SEO tags
│
└── backend/                # FastAPI + Python + PyMuPDF + FAISS
    ├── app/
    │   ├── api/            # API Endpoints
    │   ├── ai/             # Grok LLM logic & FAISS vector search
    │   ├── database/       # Supabase PG connection
    │   ├── middleware/     # JWT Authorization checks
    │   └── services/       # PDF parsing & ReportLab PDF compiler
    └── requirements.txt    # Python requirements
```

---

## ⚙️ Getting Started

### 1. Database Setup (Supabase)
1. Create a project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the query script inside `backend/supabase_schema.sql` to initialize tables, relationships, and Row-Level Security (RLS) policies.
3. Obtain your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_KEY` (service role).

### 2. Backend Setup (FastAPI)
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and configure your `.env` file from the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Download the SpaCy language model:
   ```bash
   python -m spacy download en_core_web_sm
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 3. Frontend Setup (React)
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Create and configure your `.env` file from the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

---

## 📑 API Endpoints Reference

### Contracts
- `POST /api/contracts/upload` — Upload PDF/DOCX contracts.
- `GET /api/contracts` — List all user contracts.
- `GET /api/contracts/{id}` — Fetch detailed metadata of a contract.

### AI Analysis
- `GET /api/analysis/{id}/summary` — Fetch AI-generated summary.
- `GET /api/analysis/{id}/clauses` — List extracted clauses & individual risk levels.
- `GET /api/analysis/{id}/red-flags` — Retrieve potential red flag items.

### Compliance
- `POST /api/compliance/{id}` — Check GDPR/HIPAA/DPDP compliance checklist.

### RAG Chatbot
- `POST /api/chat/{id}` — Ask questions about a specific contract (RAG-backed).

### Copilot Negotiation
- `POST /api/negotiation/{id}/analyze` — Detect clause vulnerabilities and suggest win-win alternatives.

### 6 Next-Gen AI Features
- `GET /api/analytics/{id}/time-machine` — Predictive 0-12 month legal & financial risk trajectory.
- `POST /api/analytics/{id}/simulate-impact` — What-if simulator for Payment terms, Liability caps & SLA targets.
- `GET /api/analytics/{id}/knowledge-graph` — Inter-clause relational network graph data.
- `GET /api/analytics/{id}/health-timeline` — Historic & projected contract health score timeline.
- `GET /api/compliance/regulatory-radar` — Real-time tracking of global/national regulatory updates (DPDP, GDPR, HIPAA, EU AI Act).
- `POST /api/chat/{id}` — RAG-backed Chatbot with Voice Assistant & Multilingual Translation (`en`, `es`, `fr`, `de`, `hi`, `zh`).

---

## 🚀 Deployment

### Frontend (Vercel)
The SPA router is pre-configured for Vercel static builds. Deploy via CLI or Github Integration:
```bash
cd frontend
vercel
```

### Backend (Render)
Preconfigured with `render.yaml`. Connect your repository to Render, configure variables (`GROK_API_KEY`, `SUPABASE_URL`, etc.), and trigger build.
