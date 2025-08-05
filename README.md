# NYCT No-Writer MVP

AI-assisted proposal decline rationale generator for The New York Community Trust.

## Overview

The NYCT No-Writer MVP reduces time-to-decline from "weeks" to "minutes" by generating polished decline rationales and external replies using AI.

### Key Features

- **File Upload**: Drag-and-drop PDF/Word proposal upload (max 10MB)
- **Reason Code Selection**: 8 board-reportable NYCT decline codes
- **Staff Notes**: 280-character staff input for context
- **Dual Output**: Internal rationale + external reply generation
- **Copy/Download**: Easy text copying and file download
- **Metrics Dashboard**: Usage tracking and performance metrics
- **Sub-10s Generation**: Target <10s response time

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI (Python) with async support
- **UI Components**: Radix UI primitives + Lucide icons
- **Development**: Hot reload, CORS enabled

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on http://localhost:8000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Usage Flow

1. **Upload Proposal**: Drag-and-drop or browse to upload PDF/Word document
2. **Select Reason Code**: Choose from 8 NYCT board-reportable decline reasons
3. **Add Staff Note**: Brief 280-character context (your "two thoughts")
4. **Generate**: Click to create AI-assisted rationale (target <10s)
5. **Review Output**: 
   - **Internal Rationale**: For NYCT staff/board (150-200 words)
   - **External Reply**: For applicant (90-120 words, includes disclaimer)
6. **Copy/Download**: Export text for use in your systems

## API Endpoints

- `GET /` - Health check
- `GET /reason-codes` - Get available decline codes
- `POST /upload` - Upload and process proposal document
- `POST /generate` - Generate rationale and reply
- `GET /metrics` - Usage metrics for dashboard

## Development Notes

- Mock LLM calls (2s delay) - replace with OpenAI/Anthropic
- No authentication required in MVP
- File processing uses mock text extraction
- Audit logging to console (implement database in production)
- Metrics are hardcoded (implement analytics in production)

## Success Metrics

**Primary Goal**: Reduce average "time-to-rationale" per decline from multiple weeks to <15 minutes within pilot team.

**Key Metrics**:
- Average generation time: Target <10s P95
- Weekly declines cleared: Track throughput
- Manual edit ratio: Measure AI quality
- Total processed: Volume tracking

## Next Steps for Production

1. Integrate real LLM APIs (OpenAI GPT-4o/Anthropic Claude)
2. Implement PDF/Word text extraction (PyPDF2, python-docx)
3. Add PostgreSQL + pgvector for proposal embeddings
4. Set up Azure AD authentication
5. Create audit database schema
6. Implement comprehensive error handling
7. Add few-shot training with NYCT examples
8. Deploy to Azure App Service
9. Set up CI/CD pipeline with tests

## File Structure

```
nyct-no-writer-mvp/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main application
│   │   ├── components/     # React components
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md               # This file
```

## Sprint 1 Deliverables (3 weeks)

- [x] Repo scaffold, auth stub, file-upload MVP (Days 0-2)
- [x] Prompt template & LLM integration (env vars) (Days 3-7)
- [x] Reason-code dropdown, output UI, audit log (Days 8-12)
- [x] Metrics dashboard, basic tests (Days 13-15)
- [ ] UAT with pilot PDs, collect feedback (Days 16-18)
- [ ] Hardening, docs, deploy to staging (Days 19-21)

Built with Claude Code for rapid MVP development.