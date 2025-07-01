"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ProductAIChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/v1/ask", {
        question,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.answer || "Không có câu trả lời." },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Có lỗi xảy ra. Vui lòng thử lại sau." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Nút chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition"
      >
        <MessageCircle size={20} />
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-20 right-4 z-40 w-[320px] h-[460px] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-300 transition-all animate-fade-in"
        >
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <span className="font-semibold text-base">
              🤖 Trợ lý Sản phẩm AI
            </span>
            <button
              className="hover:text-red-300 transition"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-400 text-white"
                      : "bg-gray-200 text-gray-900 flex items-start space-x-1"
                  }`}
                >
                  {msg.sender === "bot" && <span>💡</span>}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-gray-200 text-gray-800 max-w-[75%] text-sm flex items-center space-x-1">
                  <span>Đang soạn câu trả lời</span>
                  <span className="typing-dot">.</span>
                  <span className="typing-dot delay-200">.</span>
                  <span className="typing-dot delay-400">.</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <textarea
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-xl resize-none focus:outline-blue-500 text-sm"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl disabled:opacity-50 text-sm transition"
            >
              {loading ? "Đang xử lý..." : "Gửi"}
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        .typing-dot {
          animation: typing 1s infinite ease-in-out;
          font-weight: bold;
        }
        .typing-dot.delay-200 {
          animation-delay: 0.2s;
        }
        .typing-dot.delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductAIChat;
