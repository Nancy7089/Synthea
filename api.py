from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline import run_research_pipeline  # your existing module

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Req(BaseModel):
    topic: str

@app.post("/api/research")
def research(req: Req):
    state = run_research_pipeline(req.topic)
    return {k: str(state.get(k, "")) for k in
            ("search_results", "scraped_content", "report", "feedback")}

# run: uvicorn api:app --reload --port 8000
