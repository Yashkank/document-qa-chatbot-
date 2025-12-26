import os
import faiss
import pickle
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from groq import Groq
import numpy as np

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load FAISS index
index = faiss.read_index("vector_store/index.faiss")

# Load document chunks (list of text chunks)
with open("vector_store/chunks.pkl", "rb") as f:
    chunks = pickle.load(f)


def get_answer(question: str) -> str:
    # 1️⃣ Convert question to embedding
    question_embedding = embedding_model.encode([question])
    question_embedding = np.array(question_embedding).astype("float32")

    # 2️⃣ Search FAISS index
    k = 3
    distances, indices = index.search(question_embedding, k)

    # 3️⃣ Collect relevant document chunks
    relevant_chunks = [chunks[i] for i in indices[0]]

    context = "\n".join(relevant_chunks)

    # 4️⃣ Strong prompt for high-quality answers
    prompt = f"""
You are an intelligent HR assistant.

Answer the question strictly using the information provided in the context below.
If the answer is not found in the context, say "Information not available in the provided documents."

Context:
{context}

Question:
{question}

Answer in clear, complete sentences.
"""

    # 5️⃣ Call Groq LLM
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    # 6️⃣ Return clean answer
    return completion.choices[0].message.content.strip()
