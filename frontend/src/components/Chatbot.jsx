import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader, Sparkles, RefreshCw } from 'lucide-react'
import './Chatbot.css'

// Base URL for the Flask backend
// In production, replace with your deployed Render URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Suggested questions shown in empty state
const SUGGESTIONS = [
  "What projects has Ajay built?",
  "What technologies does he know?",
  "Tell me about his internship",
  "What scholarships did he receive?",
  "Is he available for work?",
]

// Initial greeting from the bot
const INITIAL_MESSAGE = {
  id: 'init',
  role: 'assistant',
  text: "Hi! 👋 I'm Ajay's AI assistant. I can answer questions about his projects, skills, experience, and background.\n\nWhat would you like to know?",
  time: new Date(),
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/* ── Message Bubble ── */
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`bubble-wrap ${isUser ? 'bubble-wrap--user' : 'bubble-wrap--bot'}`}>
      {/* Avatar */}
      <div className={`bubble-avatar ${isUser ? 'bubble-avatar--user' : 'bubble-avatar--bot'}`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Content */}
      <div className="bubble-content">
        <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--bot'}`}>
          {msg.loading ? (
            <div className="bubble-loading">
              <span /><span /><span />
            </div>
          ) : (
            <span className="bubble-text">{msg.text}</span>
          )}
        </div>
        <div className="bubble-time">{formatTime(msg.time)}</div>
      </div>
    </div>
  )
}

/* ── Main Chatbot Component ── */
export default function Chatbot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setError(null)

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', text: userText, time: new Date() }
    // Add typing indicator
    const botPlaceholder = { id: Date.now() + 1, role: 'assistant', text: '', loading: true, time: new Date() }

    setMessages(prev => [...prev, userMsg, botPlaceholder])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Server error')
      }

      // Replace placeholder with real response
      setMessages(prev =>
        prev.map(m =>
          m.id === botPlaceholder.id
            ? { ...m, text: data.reply, loading: false }
            : m
        )
      )
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === botPlaceholder.id
            ? { ...m, text: '⚠️ Couldn\'t reach the server. Make sure the backend is running.', loading: false }
            : m
        )
      )
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE])
    setError(null)
  }

  const showSuggestions = messages.length === 1

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-label="Open AI chat"
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <>
            <MessageSquare size={22} />
            <span className="fab-badge">AI</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header__info">
              <div className="chat-bot-avatar">
                <Bot size={16} />
                <span className="bot-online" />
              </div>
              <div>
                <div className="chat-bot-name">
                  <Sparkles size={12} /> Portfolio AI
                </div>
                <div className="chat-bot-status">Powered by RAG + GPT</div>
              </div>
            </div>
            <div className="chat-header__actions">
              <button onClick={resetChat} className="chat-header-btn" title="Reset chat">
                <RefreshCw size={14} />
              </button>
              <button onClick={() => setIsOpen(false)} className="chat-header-btn" title="Close">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {/* Suggestion chips — shown only on initial state */}
            {showSuggestions && (
              <div className="suggestions">
                <p className="suggestions__label">Try asking:</p>
                <div className="suggestions__chips">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      className="suggestion-chip"
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="chat-input-bar">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Ajay's work..."
              rows={1}
              disabled={loading}
            />
            <button
              className="chat-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              {loading ? <Loader size={16} className="spin" /> : <Send size={16} />}
            </button>
          </div>

          {/* Footer note */}
          <div className="chat-footer">
            Answers based on Ajay's portfolio data only
          </div>
        </div>
      )}
    </>
  )
}
