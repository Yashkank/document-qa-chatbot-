# 📄 Document QA Chatbot

A modern, intelligent Question-Answering chatbot built with Retrieval-Augmented Generation (RAG) that allows users to query documents and get accurate, context-aware answers. The application features a beautiful React frontend with a draggable chat interface and a FastAPI backend powered by FAISS vector search and Groq's Llama 3.1 model.

## ✨ Features

- **🔍 Semantic Search**: Advanced vector-based document retrieval using FAISS
- **🤖 AI-Powered Answers**: Leverages Groq's Llama 3.1-8B-Instant model for fast, accurate responses
- **📱 Modern UI**: Beautiful, responsive React interface with drag-and-drop functionality
- **🌙 Dark Mode**: Toggle between light and dark themes
- **💬 Real-time Chat**: Interactive chat interface with typing animations
- **📄 PDF Support**: Automatically processes and indexes PDF documents
- **⚡ Fast Performance**: Optimized vector search for quick response times

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **FAISS** - Facebook AI Similarity Search for efficient vector operations
- **Sentence Transformers** - State-of-the-art sentence embeddings (all-MiniLM-L6-v2)
- **Groq API** - High-performance LLM inference (Llama 3.1-8B-Instant)
- **PyPDF** - PDF document processing
- **Python 3.10+** - Backend runtime

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with dark mode support

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 16+ and npm
- Groq API key ([Get one here](https://console.groq.com/))
- PDF documents to query (place in `backend/data/documents/`)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "QA chatbot"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # On Windows: type nul > .env
```

Add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 5. Document Ingestion

Place your PDF documents in `backend/data/documents/` and run the ingestion script:

```bash
cd backend
python ingest.py
```

This will:
- Extract text from all PDF files
- Split documents into chunks
- Generate embeddings using Sentence Transformers
- Create a FAISS vector index
- Save the index and chunks for fast retrieval

## 🎯 Usage

### Starting the Backend

```bash
cd backend

# Activate virtual environment if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run the FastAPI server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Starting the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

### Using the Chatbot

1. Open the frontend URL in your browser
2. The chat window is draggable - click and drag the header to move it
3. Type your question in the input field
4. Press Enter or click Send
5. The bot will search the document index and provide an answer
6. Toggle dark mode using the 🌙/☀️ button in the header

## 📁 Project Structure

```
QA chatbot/
├── backend/
│   ├── data/
│   │   └── documents/          # Place PDF files here
│   ├── vector_store/           # Generated FAISS index and chunks
│   │   ├── index.faiss
│   │   └── chunks.pkl
│   ├── main.py                 # FastAPI application
│   ├── rag.py                  # RAG implementation
│   ├── ingest.py               # Document ingestion script
│   ├── requirements.txt        # Python dependencies
│   ├── runtime.txt             # Python version specification
│   └── .env                    # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # Styles
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
└── README.md                   # This file
```

## 🔌 API Documentation

### Endpoints

#### `GET /`
Health check endpoint.

**Response:**
```json
{
  "message": "Document QA Chatbot backend running 🚀"
}
```

#### `POST /ask`
Query the chatbot with a question.

**Request Body:**
```json
{
  "question": "What is the company's vacation policy?"
}
```

**Response:**
```json
{
  "question": "What is the company's vacation policy?",
  "answer": "According to the HR policy document, employees are entitled to..."
}
```

### Interactive API Docs

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔧 Configuration

### Backend Configuration

- **Chunk Size**: Modify `chunk_size` in `backend/ingest.py` (default: 500 characters)
- **Top K Results**: Change `k` in `backend/rag.py` (default: 3 chunks)
- **LLM Model**: Update `model` in `backend/rag.py` (default: "llama-3.1-8b-instant")
- **Temperature**: Adjust `temperature` in `backend/rag.py` (default: 0.2)

### Frontend Configuration

- **API Endpoint**: Update the API URL in `frontend/src/App.jsx` (line 72) if deploying to a different backend
- **CORS**: Configure CORS settings in `backend/main.py` for production deployments

## 🚢 Deployment

### Backend Deployment (Render/Heroku)

1. Ensure `runtime.txt` specifies the correct Python version
2. Add a `Procfile` with: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Set environment variables in your hosting platform
4. Upload the vector store files or regenerate them after deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Update the API endpoint in `App.jsx` to point to your deployed backend

## 🧪 Development

### Adding New Documents

1. Place new PDF files in `backend/data/documents/`
2. Run `python backend/ingest.py` to regenerate the vector index
3. Restart the backend server

### Customizing the System Prompt

Edit the prompt template in `backend/rag.py` (lines 41-54) to customize the assistant's behavior and response style.

## 📝 Notes

- The vector index must be generated before running the backend
- First-time embedding model download may take a few minutes
- For production, consider using a more restrictive CORS policy
- The current implementation uses CPU-based FAISS; for larger datasets, consider FAISS-GPU

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [FAISS](https://github.com/facebookresearch/faiss) for efficient similarity search
- [Sentence Transformers](https://www.sbert.net/) for embeddings
- [Groq](https://groq.com/) for fast LLM inference
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework

---

Made with ❤️ using RAG and modern web technologies

