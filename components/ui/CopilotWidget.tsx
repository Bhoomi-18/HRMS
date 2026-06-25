'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai", content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: { path: pathname, role: user?.role, name: user?.name }
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I am offline." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-blue-600 text-white p-3 font-semibold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>HR Copilot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">✕</button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-muted/30">
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Hi {user.name}! I know you're looking at {pathname || "Home"}. How can I help?
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                  m.role === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground border border-border"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 bg-muted text-muted-foreground text-sm flex gap-1">
                  <span className="animate-bounce">●</span><span className="animate-bounce delay-75">●</span><span className="animate-bounce delay-150">●</span>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={sendMessage} className="p-2 border-t border-border bg-card flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..." 
              className="flex-1 bg-muted/50 rounded-full px-3 py-1.5 text-sm outline-none border border-transparent focus:border-border"
            />
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white h-8 w-8 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50">
              ↑
            </button>
          </form>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <span className="text-2xl">✨</span>
      </button>
    </div>
  );
}
