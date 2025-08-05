from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import hashlib
import os
from datetime import datetime
import logging
from enum import Enum
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NYCT No-Writer MVP", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reason codes as defined in requirements
class ReasonCode(str, Enum):
    GENERAL_OPERATING_SUPPORT = "General Operating Support"
    ENDOWMENT = "Endowment"
    CAPITAL = "Capital"
    DEFICIT_FINANCING = "Deficit Financing"
    UNAPPROVED_PROGRAM_CATEGORY = "Unapproved Program Category"
    OUTSIDE_APPROVED_GUIDELINES = "Outside Approved Guidelines"
    OTHER_PROJECTS_HIGHER_MERIT = "Other Projects Higher Merit"
    OTHER_QUALITATIVE = "Other Qualitative (Replace Govt. Funds, Poor Design, Capability Problems, Duplicative Effort, Budget Exhausted)"

# Pydantic models
class GenerateRequest(BaseModel):
    reason_code: ReasonCode
    staff_note: str
    proposal_text: str

class GeneratedOutput(BaseModel):
    internal_rationale: str
    external_reply: str
    generation_time_ms: int

class AuditLog(BaseModel):
    timestamp: datetime
    user_id: str
    proposal_hash: str
    reason_code: ReasonCode
    internal_rationale: str

# Mock user for demo purposes - no authentication required
def get_current_user():
    return {"user_id": "demo_user", "role": "Program Director"}

@app.get("/")
async def root():
    return {"message": "NYCT No-Writer MVP API", "version": "1.0.0"}

@app.get("/reason-codes")
async def get_reason_codes():
    """Get all available reason codes"""
    return [{"value": code.value, "label": code.value} for code in ReasonCode]

@app.post("/upload", response_model=dict)
async def upload_proposal(file: UploadFile = File(...)):
    """Upload and process proposal document"""
    
    # Validate file size (10MB max)
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
    
    # Validate file type
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF and Word documents are allowed.")
    
    try:
        # Read file content
        content = await file.read()
        
        # Create hash for proposal identification
        proposal_hash = hashlib.sha256(content).hexdigest()
        
        # Extract text based on file type
        if file.content_type == "application/pdf":
            text_content = extract_pdf_text(content)
        else:  # Word document
            text_content = extract_docx_text(content)
        
        # Create vector embedding for semantic compression (mock implementation)
        # In production, use pgvector with actual embeddings
        compressed_text = text_content[:2000] if len(text_content) > 2000 else text_content
        
        return {
            "proposal_hash": proposal_hash,
            "text_content": compressed_text,
            "filename": file.filename,
            "size": len(content)
        }
        
    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing file")

@app.post("/generate", response_model=GeneratedOutput)
async def generate_rationale(request: GenerateRequest):
    """Generate internal rationale and external reply"""
    
    start_time = datetime.now()
    
    try:
        # Mock LLM call - replace with actual OpenAI/Anthropic integration
        internal_rationale, external_reply = await generate_mock_outputs(
            request.proposal_text,
            request.reason_code,
            request.staff_note
        )
        
        end_time = datetime.now()
        generation_time_ms = int((end_time - start_time).total_seconds() * 1000)
        
        # Create audit log entry
        current_user = get_current_user()
        audit_entry = AuditLog(
            timestamp=datetime.now(),
            user_id=current_user["user_id"],
            proposal_hash=hashlib.sha256(request.proposal_text.encode()).hexdigest()[:16],
            reason_code=request.reason_code,
            internal_rationale=internal_rationale
        )
        
        # In production, save to database
        logger.info(f"Audit log: {audit_entry}")
        
        return GeneratedOutput(
            internal_rationale=internal_rationale,
            external_reply=external_reply,
            generation_time_ms=generation_time_ms
        )
        
    except Exception as e:
        logger.error(f"Error generating rationale: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating rationale")

@app.get("/metrics")
async def get_metrics():
    """Get usage metrics for dashboard"""
    # Mock metrics - replace with real database queries
    return {
        "avg_generation_time_ms": 3500,
        "declines_cleared_this_week": 47,
        "total_processed": 234,
        "manual_edits_ratio": 0.23
    }

# Helper functions
def extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF - mock implementation"""
    # In production, use PyPDF2 or similar
    return "Mock PDF text content extracted..."

def extract_docx_text(content: bytes) -> str:
    """Extract text from Word document - mock implementation"""
    # In production, use python-docx
    return "Mock Word document text content extracted..."

async def generate_mock_outputs(proposal_text: str, reason_code: ReasonCode, staff_note: str) -> tuple[str, str]:
    """Mock LLM generation - replace with actual LLM calls"""
    
    # Simulate API call delay
    await asyncio.sleep(2)
    
    internal_rationale = f"""
{reason_code.value.upper()}

Based on our review of the submitted proposal, we have determined that this request does not align with our current funding priorities. {staff_note}

The proposal requests funding for activities that fall outside our approved guidelines for this funding cycle. While the organization demonstrates good intentions, the specific program design and implementation approach do not meet our established criteria for impact and sustainability.

We appreciate the time and effort invested in preparing this submission and encourage the organization to consider revising their approach for future opportunities.
""".strip()

    external_reply = f"""
Thank you for your proposal submission to The New York Community Trust. We appreciate your organization's commitment to serving the community and the time you invested in preparing your application.

After careful review, we have determined that we will not be able to provide funding for this request at this time. {reason_code.value.lower()} proposals are not within our current funding priorities for this cycle.

We encourage you to review our funding guidelines on our website and consider applying for future opportunities that may be a better fit for your organization's work. We value your partnership in strengthening our community.
""".strip()

    return internal_rationale, external_reply

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)