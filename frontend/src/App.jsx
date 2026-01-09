import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Drag state
  const [position, setPosition] = useState({ x: 80, y: 80 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const chatEndRef = useRef(null);

  // 🔹 Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔹 Dark mode toggle
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // 🔹 Drag logic
  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  function startDrag(e) {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }

  // 🔹 Send question
  async function handleSend() {
    if (!question.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: question, time: getTime() },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://document-qa-chatbot.onrender.com/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

      const data = await response.json();
      typeBotMessage(data.answer);
    } catch {
      typeBotMessage("❌ Error contacting backend.");
    }
  }

  // 🔹 Typing animation for bot
  function typeBotMessage(text) {
    let index = 0;

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "", time: getTime() },
    ]);

    const interval = setInterval(() => {
      index++;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = text.slice(0, index);
        return updated;
      });

      if (index >= text.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 20);
  }

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div
      className="chat-container"
      style={{ left: position.x, top: position.y }}
    >
      {/* 🔹 Header (Drag Handle) */}
      <div className="chat-title" onMouseDown={startDrag}>
        📄 Document QA Chatbot
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* 🔹 Chat Box */}
      <div className="chat-box">

        {/* 👋 Welcome panel (only when no messages) */}
        {messages.length === 0 && (
          <div className="welcome-box">
            <h3>👋 Welcome!</h3>
            <p>
                This chatbot answers questions based on internal company documents such as HR policies and rules.

            </p>

            <p><b>💡 Try asking:</b></p>
            <ul>
              <li>How many paid leaves are provided?</li>
              <li>What is the notice period?</li>
              <li>Is work from home allowed?</li>
            </ul>
          </div>
        )}

        {/* 💬 Messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="timestamp">{msg.time}</div>
          </div>
        ))}

        {loading && <div className="loading">🤖 Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* 🔹 Input */}
      <div className="input-box">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
