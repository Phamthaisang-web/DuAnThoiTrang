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
  const [isMobile, setIsMobile] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      {/* Compact Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${
          isMobile ? "bottom-10 right-3 p-2" : "bottom-20 right-5 p-3"
        } z-50 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-white rounded-full shadow-md transition transform hover:scale-105`}
      >
        <MessageCircle size={isMobile ? 40 : 40} strokeWidth={1.5} />
      </button>

      {/* Ultra-Compact Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className={`fixed ${
            isMobile
              ? "bottom-10 inset-x-2 h-[55vh]"
              : "bottom-20 right-4 w-[350px] h-[450px]"
          } z-40 flex flex-col bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all animate-fade-in`}
        >
          {/* Minimal Header */}
          <div className="p-2 border-b flex items-center justify-between bg-gradient-to-r from-blue-400 to-purple-400 text-white">
            <span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
              🤖 AI Assistant
            </span>
            <button
              className="hover:text-red-200 transition p-1"
              onClick={() => setIsOpen(false)}
            >
              <X size={isMobile ? 14 : 18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Compact Messages */}
          <div
            className={`flex-1 overflow-y-auto ${
              isMobile ? "px-1 py-1" : "px-2 py-2"
            } space-y-1 bg-gray-50 text-xs`}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    isMobile ? "px-2 py-1" : "px-3 py-1.5"
                  } rounded-md ${
                    isMobile ? "max-w-[92%]" : "max-w-[80%]"
                  } whitespace-pre-wrap leading-snug ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.sender === "bot" && <span className="mr-1">💡</span>}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className={`${
                    isMobile ? "px-2 py-1" : "px-3 py-1.5"
                  } rounded-md bg-gray-200 text-gray-800 ${
                    isMobile ? "max-w-[92%]" : "max-w-[80%]"
                  } text-xs flex items-center space-x-1`}
                >
                  <span>Đang trả lời...</span>
                  <span className="typing-dot">.</span>
                  <span className="typing-dot delay-200">.</span>
                  <span className="typing-dot delay-400">.</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Minimal Input Area */}
          <div className={`${isMobile ? "p-1" : "p-1.5"} border-t bg-white`}>
            <textarea
              rows={1}
              className="w-full p-1.5 text-xs border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`mt-1 w-full bg-blue-500 hover:bg-blue-600 text-white ${
                isMobile ? "py-1.5 text-xs" : "py-2 text-xs"
              } rounded-md disabled:opacity-50 transition`}
            >
              {loading ? "..." : "Gửi"}
            </button>
          </div>
        </div>
      )}

      {/* Optimized CSS Animations */}
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
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductAIChat;
