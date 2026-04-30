"""
Portfolio RAG Chatbot - Flask Backend
Author: Ajay Kumar
Description: REST API that powers the AI chatbot using RAG (Retrieval-Augmented Generation)
             with OpenAI embeddings and FAISS vector search.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Import our RAG module
from rag import RAGChatbot

# Initialize Flask app
app = Flask(__name__)

# Enable CORS so React frontend can call this API
# In production, replace "*" with your actual frontend domain
CORS(app, origins="*")

# Initialize the RAG chatbot (builds FAISS index on startup)
print("[*] Initializing RAG Chatbot...")
chatbot = RAGChatbot(data_path="data/portfolio_data.txt")
print("[OK] Chatbot ready!")


@app.route("/", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Portfolio RAG API is running!"})


@app.route("/chat", methods=["POST"])
def chat():
    """
    Main chat endpoint.
    
    Request body:
        { "message": "What projects has Ajay built?" }
    
    Response:
        { "reply": "Ajay has built ...", "sources": [...] }
    """
    try:
        data = request.get_json()

        # Validate input
        if not data or "message" not in data:
            return jsonify({"error": "Missing 'message' field in request body"}), 400

        user_message = data["message"].strip()

        if not user_message:
            return jsonify({"error": "Message cannot be empty"}), 400

        if len(user_message) > 500:
            return jsonify({"error": "Message too long (max 500 chars)"}), 400

        # Get response from RAG chatbot
        reply, sources = chatbot.query(user_message)

        return jsonify({
            "reply": reply,
            "sources": sources
        })

    except Exception as e:
        print(f"[ERROR] Error in /chat: {e}")
        return jsonify({"error": "Something went wrong. Please try again."}), 500


@app.route("/reset", methods=["POST"])
def reset():
    """Rebuild the FAISS index (useful after updating portfolio data)."""
    try:
        chatbot.build_index()
        return jsonify({"message": "Index rebuilt successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "production") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
