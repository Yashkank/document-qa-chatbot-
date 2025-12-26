from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag import get_answer

app = FastAPI(title="Document QA Chatbot API")

# ✅ Allow React frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (OK for development)
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message": "Document QA Chatbot backend running 🚀"}

@app.post("/ask")
def ask_question(request: QuestionRequest):
    answer = get_answer(request.question)
    return {
        "question": request.question,
        "answer": answer
    }
