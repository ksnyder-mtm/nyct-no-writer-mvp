# NYCT No-Writer MVP - Project Context for Claude

## Project Overview
This is an AI-assisted proposal decline rationale generator for The New York Community Trust (NYCT). The application helps reduce time-to-decline from weeks to minutes by generating polished decline rationales and external replies using AI.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI (Python 3.8+) with async support
- **UI Components**: Radix UI primitives + Lucide icons
- **Deployment**: Frontend on Netlify, Backend ready for Azure

## Project Structure
```
/Users/kimsnyder/code/no-writer/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   └── requirements.txt     # Python dependencies including AI libraries
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main application component
│   │   ├── components/     # React components
│   │   ├── config.ts       # API configuration
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
└── Assets/                 # Static assets
```

## Key Features
1. **File Upload**: PDF/Word document upload (max 10MB)
2. **Reason Code Selection**: 8 board-reportable decline reasons
3. **Staff Notes**: 280-character context input
4. **AI Generation**: Dual output (internal rationale + external reply)
5. **Metrics Dashboard**: Usage tracking and performance metrics

## Development Commands

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py  # Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev     # Development server on http://localhost:5173
npm run build   # Production build
npm run lint    # Run ESLint
```

## API Endpoints
- `GET /` - Health check
- `GET /reason-codes` - Get available decline codes
- `POST /upload` - Upload and process proposal document
- `POST /generate` - Generate rationale and reply
- `GET /metrics` - Usage metrics for dashboard

## Important Notes
1. **Mock Implementation**: Currently uses mock LLM responses with 2-3s delay
2. **No Authentication**: MVP has no auth requirements
3. **File Processing**: Mock text extraction for PDF/Word files
4. **Metrics**: Hardcoded metrics, not from real database
5. **CORS**: Configured for local development (localhost:5173)

## Testing & Quality Checks
- Frontend: `npm run lint` for code quality
- Backend: No tests configured yet
- TypeScript: `npm run build` includes type checking

## Deployment Status
- Frontend: Live at https://nyct-no-writer-mvp.netlify.app
- Backend: Not deployed yet (local development only)

## Next Steps for Production
1. Integrate real LLM APIs (OpenAI/Anthropic)
2. Implement actual PDF/Word text extraction
3. Add PostgreSQL + pgvector for embeddings
4. Set up Azure AD authentication
5. Create audit database schema
6. Deploy backend to Azure App Service

## Environment Variables
- Frontend: `VITE_API_URL` (defaults to http://localhost:8000)
- Backend: Will need OpenAI/Anthropic API keys for production

## Current Limitations
- Mock AI responses only
- No persistent data storage
- No user authentication
- Basic error handling
- No real metrics tracking