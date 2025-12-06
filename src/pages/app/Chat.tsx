import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Mock messages for skeleton
const mockMessages: Message[] = [
  {
    id: "1",
    role: "system",
    content: "Welcome to Synth. I'm here to help you build and manage your automation workflows.",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    role: "user",
    content: "I want to create a workflow that sends a Slack notification when I get a new lead in my CRM.",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    role: "assistant",
    content: "I can help you set that up! I'll create a workflow that triggers when a new lead is added to your CRM and sends a notification to your Slack channel. Would you like me to proceed with the default configuration, or would you like to customize the notification message?",
    timestamp: "10:01 AM",
    metadata: { plan: "workflow_generation", confidence: 0.95 },
  },
];

const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-3">
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
    <span className="text-sm text-muted-foreground">Synth is thinking...</span>
  </div>
);

const Chat = () => {
  const [messages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no actual send
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "flex",
                    message.role === "user" && "justify-end",
                    message.role === "system" && "justify-center"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] rounded-lg px-4 py-3 group relative",
                      message.role === "user" && "bg-primary text-primary-foreground",
                      message.role === "assistant" && "bg-muted text-foreground",
                      message.role === "system" && "bg-card/50 text-muted-foreground border border-border text-center"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    
                    {/* Timestamp */}
                    <p className={cn(
                      "text-xs mt-2",
                      message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {message.timestamp}
                    </p>

                    {/* Copy button (hover) */}
                    {message.role !== "system" && (
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-background/20"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}

                    {/* Metadata expand */}
                    {message.metadata && (
                      <div className="mt-2">
                        <button
                          onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {expandedId === message.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                          Metadata
                        </button>
                        {expandedId === message.id && (
                          <motion.pre
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 text-xs bg-background/40 p-2 rounded overflow-x-auto"
                          >
                            {JSON.stringify(message.metadata, null, 2)}
                          </motion.pre>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isSending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-background px-4 lg:px-6 py-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message... (Shift+Enter for newline)"
                rows={1}
                className="flex-1 min-h-[52px] max-h-[200px] px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                style={{ overflowY: input.split("\n").length > 3 ? "auto" : "hidden" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Press Enter to send, Shift+Enter for newline
            </p>
          </form>
        </div>
      </div>
    </AppShell>
  );
};

export default Chat;
