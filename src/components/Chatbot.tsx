import { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import "../assets/css/Chatbot.css";
import mainLogo from "/public/logo.png";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Chatbot = () => {
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; isTyping?: boolean }[]
  >([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const botAvatar = mainLogo;
  const userAvatar = "https://via.placeholder.com/35?text=U";

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const addMessage = (text: string, isUser: boolean, isTyping = false) => {
    setMessages((prev) => [...prev, { text, isUser, isTyping }]);
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      addMessage(userMessage, true);
      setInput("");
      showTypingIndicator();
      fetchGroqResponse(userMessage);
    }
  };

  const showTypingIndicator = () => {
    addMessage("", false, true);
  };

  const hideTypingIndicator = () => {
    setMessages((prev) => prev.filter((msg) => !msg.isTyping));
  };

  const fetchGroqResponse = async (userMessage: string) => {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: userMessage }],
        model: "llama3-8b-8192",
      });

      const botMessage =
        response.choices[0]?.message?.content || "I couldn't understand that.";
      hideTypingIndicator();
      addMessage(botMessage, false);
    } catch (error) {
      console.error("Error fetching response from Groq:", error);
      hideTypingIndicator();
      addMessage("Oops! Something went wrong. Please try again.", false);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <img src={botAvatar} alt="Chatbot" /> JaatakaAI
      </div>

      {/* Chat Box */}
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isUser ? "user-message" : "bot-message"}`}
          >
            <img
              src={msg.isUser ? userAvatar : botAvatar}
              alt={msg.isUser ? "User" : "Bot"}
            />
            <div className="message-content">
              {msg.isTyping ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="input-box">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
