# Contract AI Implementation Plan

This document outlines the architecture, technology stack, database schema, and phased implementation strategy for building Contract AI, a comprehensive AI-powered Contract Intelligence & Lifecycle Management Platform.

## User Review Required

> [!WARNING]
> **Scale of the Request**
> Building a complete enterprise-grade SaaS platform is a massive undertaking. To ensure quality, we will need to break this down into phases. Please review the phased approach below and let me know if you agree with the prioritization. 

> [!IMPORTANT]
> **Supabase Configuration**
> Since we are using Supabase for Auth, PostgreSQL, and Storage, you will need a Supabase project set up. I can provide the SQL schema for you to run in the Supabase SQL editor, or we can use Supabase CLI to manage migrations locally. Please confirm how you'd like to handle the Supabase setup.

## Open Questions

1. **AI Model Provider**: The prompt mentions "Grok API" alongside local/open-source tools like "Sentence Transformers" and "spaCy". Should we build the core LLM integrations specifically against Grok (via its LangChain integration if available, or direct REST API), or would you prefer a generic LLM interface where we can swap providers easily?
2. **Supabase Project**: Do you already have a Supabase project created? If so, we'll need the API keys and URL stored in `.env` files.
3. **Execution Scope**: Are you comfortable starting with Phase 1 (Core Infrastructure & Auth) and Phase 2 (Dashboard & Basic Contract Management) before moving to the advanced AI features?

## Architecture Overview

### Frontend
- **Framework**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS, ShadCN UI for accessible components
- **Routing**: React Router DOM
- **State/Data**: TanStack Query (React Query) for server state, Zustand/Context for global UI state
- **UI Libraries**: Framer Motion (animations), Recharts (charts), Lucide React (icons)
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (Email + Google OAuth)
- **Deployment**: Render

### AI & Processing Stack
- **LLM/Embeddings**: Grok API, Sentence Transformers, FAISS
- **NLP**: spaCy, LangChain
- **Document Processing**: PyMuPDF, pdfplumber, python-docx
- **Report Generation**: ReportLab

## Proposed Database Schema

We will utilize Supabase Postgres. Here is a high-level view of the primary tables:

- `users`: Managed mostly by Supabase Auth (`auth.users`), extended with custom profiles.
- `contracts`: id, user_id, title, status, type, upload_date, effective_date, expiry_date, value, file_url, masked_file_url, risk_score, health_score, compliance_score.
- `contract_versions`: id, contract_id, version_num, file_url, created_at.
- `clauses`: id, contract_id, type, content, risk_level, risk_reason.
- `red_flags`: id, contract_id, description, severity.
- `obligations`: id, contract_id, description, due_date, status.
- `chat_history`: id, contract_id, user_id, message, sender (user/ai), created_at.
- `audit_logs`: id, user_id, action, target_type, target_id, created_at.

## Phased Implementation Strategy

### Phase 1: Foundation & Infrastructure Setup
- Initialize Git repository and project structure (monorepo or split frontend/backend).
- Set up React (Vite) + TypeScript with Tailwind CSS and ShadCN UI.
- Set up FastAPI project with structure for routers, services, and AI modules.
- Create Supabase SQL schema and define database policies (RLS).
- Implement Authentication (Login/Signup via Supabase) on both frontend and backend.

### Phase 2: Core Platform & Contract Management
- Build layout components (Sidebar, Navbar, Theme toggling).
- Implement the core Dashboard UI (Cards, Charts with mock data initially).
- Implement Smart Contract Upload (Drag & Drop, upload to Supabase Storage).
- Build the API routes for uploading, fetching, and managing contracts.
- Implement basic document parsing (PyMuPDF/pdfplumber/python-docx) to extract text.

### Phase 3: AI Analysis & Processing Pipeline
- Implement PII Detection & Masking (using spaCy and regex).
- Integrate LangChain and Grok API for Clause Extraction, Summarization, and Classification.
- Build the AI Risk Analysis and Contract Health Score calculators.
- Create the AI Insights Dashboard to display analyzed contract metrics.

### Phase 4: Advanced AI Features & Negotiation
- Build the RAG pipeline with FAISS and Sentence Transformers for the AI Contract Chatbot.
- Implement the AI Negotiation Copilot (Risk detection, suggestions, score generation).
- Implement Contract Comparison (Version differences, added/removed clauses).
- Implement Similarity Search using embeddings.

### Phase 5: Lifecycle, Compliance & Reporting
- Build the Smart Deadline Tracker & Lifecycle Management UI.
- Implement the Compliance Checker (GDPR, HIPAA, etc.).
- Implement PDF Report Generation using ReportLab.
- Final polish, error handling, and performance optimization.

## Verification Plan

### Automated Tests
- Write Pytest unit tests for core backend parsers and AI integrations (mocking APIs where necessary).
- Write frontend component tests (React Testing Library) for critical user flows like uploading and chatting.

### Manual Verification
- Deploy Supabase DB and verify RLS.
- Run FastAPI and Vite locally, testing end-to-end upload flow.
- Verify AI features process documents correctly and handle edge cases (e.g., poor quality PDFs).
