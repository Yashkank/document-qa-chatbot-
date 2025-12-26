import os
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import pickle

DATA_DIR = "data/documents"
VECTOR_DB_DIR = "vector_store"

os.makedirs(VECTOR_DB_DIR, exist_ok=True)

def load_documents():
    texts = []
    for file in os.listdir(DATA_DIR):
        if file.endswith(".pdf"):
            reader = PdfReader(os.path.join(DATA_DIR, file))
            for page in reader.pages:
                texts.append(page.extract_text())
    return texts

def split_text(texts, chunk_size=500):
    chunks = []
    for text in texts:
        for i in range(0, len(text), chunk_size):
            chunks.append(text[i:i+chunk_size])
    return chunks

def create_embeddings(chunks):
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(chunks)
    return embeddings, model

def save_faiss_index(embeddings, chunks):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    faiss.write_index(index, f"{VECTOR_DB_DIR}/index.faiss")

    with open(f"{VECTOR_DB_DIR}/chunks.pkl", "wb") as f:
        pickle.dump(chunks, f)

if __name__ == "__main__":
    docs = load_documents()
    chunks = split_text(docs)
    embeddings, _ = create_embeddings(chunks)
    save_faiss_index(embeddings, chunks)
    print("✅ Documents ingested and FAISS index created")
