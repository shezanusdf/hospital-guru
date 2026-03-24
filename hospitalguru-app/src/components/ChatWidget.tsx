"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Bot,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  id: "init",
  content:
    "👋 Hello! I'm GuruBot, your medical assistant at HospitalGuru.\n\nI help patients from Russia, Kazakhstan, Ukraine and all CIS countries find the best treatment in India — at 70–84% lower cost.\n\n**Здравствуйте!** Я помогу вам найти лучшее лечение в Индии. Напишите мне на русском или английском.\n\nWhat brings you here today? / Чем могу помочь?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      id: Date.now().toString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    // Placeholder for assistant response (streams into it)
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", id: assistantId },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          leadAlreadyCaptured: leadCaptured,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 500) {
          setHasApiKey(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      "⚙️ The AI assistant is not configured yet (API key missing). Please use the contact form or WhatsApp to reach our team.",
                  }
                : m
            )
          );
          setIsTyping(false);
          return;
        }
        throw new Error(err.error);
      }

      // Read SSE stream
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));

            if (parsed.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.text }
                    : m
                )
              );
            }

            if (parsed.done) {
              if (parsed.leadCaptured) {
                setLeadCaptured(true);
              }
            }
          } catch {
            // ignore parse errors on incomplete chunks
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I encountered an error. Please try again or contact us via WhatsApp.",
              }
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown: **bold**, newlines
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
        >
          <MessageCircle size={26} />
          {/* Pulse ring */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with GuruBot
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-24 md:bottom-6 right-6 z-50 w-95 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${
            minimized ? "h-14" : "h-[560px] max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-100px)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-t-2xl shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">GuruBot</div>
              <div className="text-blue-100 text-xs">
                {leadCaptured ? "✅ Inquiry created" : "Medical Assistant • Online"}
              </div>
            </div>
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-white/70 hover:text-white p-1"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Lead captured banner */}
              {leadCaptured && (
                <div className="bg-green-50 border-b border-green-100 px-4 py-2 flex items-center gap-2 shrink-0">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="text-green-700 text-xs font-medium">
                    Inquiry saved — case manager will contact you within 24h
                  </span>
                </div>
              )}

              {/* No API key warning */}
              {!hasApiKey && (
                <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2 shrink-0">
                  <p className="text-yellow-700 text-xs">
                    ⚠️ Add your <code className="bg-yellow-100 px-1 rounded">ANTHROPIC_API_KEY</code> to{" "}
                    <code className="bg-yellow-100 px-1 rounded">.env</code> to enable AI responses.
                  </p>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "assistant"
                          ? "bg-blue-100"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Bot size={14} className="text-blue-600" />
                      ) : (
                        <User size={14} className="text-gray-600" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "assistant"
                          ? "bg-gray-50 text-gray-800 border border-gray-100"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.content === "" && msg.role === "assistant" ? (
                        <div className="flex gap-1 items-center py-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(msg.content),
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              {messages.length === 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                  {[
                    "Heart surgery",
                    "Knee replacement",
                    "Cancer treatment",
                    "IVF / Fertility",
                    "Хочу лечиться в Индии",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="border-t border-gray-100 px-3 py-3 flex gap-2 items-end shrink-0">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... / Напишите сообщение..."
                  rows={1}
                  className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 outline-none border border-gray-200 rounded-xl px-3 py-2 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 max-h-24 overflow-y-auto"
                  style={{ minHeight: "36px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  {isTyping ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 pb-2 text-center text-[10px] text-gray-400 shrink-0">
                Powered by HospitalGuru AI • Your data is confidential
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
