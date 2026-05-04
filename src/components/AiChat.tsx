import { useState, useRef, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const chars = "!<>-_\\/[]{}--=+*^?#________";

function scrambleText(
  element: HTMLSpanElement | null,
  finalText: string,
  onComplete?: () => void
) {
  if (!element) return;
  let iterations = 0;
  const interval = setInterval(() => {
    element.innerText = finalText
      .split("")
      .map((_letter, index) => {
        if (index < iterations) return finalText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
    iterations += 1 / 2;
    if (iterations >= finalText.length) {
      clearInterval(interval);
      element.innerText = finalText;
      onComplete?.();
    }
  }, 30);
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 opacity-70">
      <span className="text-xs text-neutral-500 font-mono">CFX_ANALYZING</span>
      <div className="flex gap-1">
        <div
          className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your Credfix AI assistant. Ask me about loan optimization, EMI strategies, or financial planning tips.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  const chatMutation = trpc.chat.send.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    chatMutation.mutate(
      { message: userMsg.content },
      {
        onSuccess: (data) => {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: data.response,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);

          setTimeout(() => {
            const el = messageRefs.current.get(aiMsg.id);
            if (el) scrambleText(el, data.response);
          }, 100);
        },
        onError: () => {
          setIsTyping(false);
          const errorMsg: ChatMessage = {
            id: `ai-error-${Date.now()}`,
            role: "assistant",
            content:
              "I apologize, but I am unable to process your request at the moment. Please try again.",
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      }
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 bg-brand-orange text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        <span className="sr-only">Chat</span>
      </button>

      {/* Chat Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-off-black border border-white/10 w-full max-w-md h-[600px] flex flex-col shadow-2xl overflow-hidden relative rounded-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-pitch-black">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-orange" />
                <span className="text-sm font-semibold tracking-widest uppercase text-white">
                  Credfix AI
                </span>
              </div>
              <button
                className="text-neutral-500 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-brand-orange/20"
                        : "bg-white/10"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={14} className="text-brand-orange" />
                    ) : (
                      <Bot size={14} className="text-neutral-400" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-white text-black rounded-2xl rounded-br-none font-medium"
                        : "bg-white/5 text-white border border-white/10 rounded-2xl rounded-bl-none font-mono"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <span
                        ref={(el) => {
                          if (el) messageRefs.current.set(msg.id, el);
                        }}
                      >
                        {msg.content}
                      </span>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-neutral-400" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-2.5">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your financial situation..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 font-mono focus:outline-none focus:ring-1 focus:ring-brand-orange/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={chatMutation.isPending || !input.trim()}
                  className="bg-brand-orange text-white p-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
