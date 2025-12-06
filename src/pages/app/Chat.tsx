import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Copy, Check, ChevronDown, ChevronUp, Filter, X, Loader2 } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  conversation_id?: string;
  metadata?: Record<string, unknown>;
}

// Mock messages for skeleton
const mockMessages: Message[] = [
  {
    id: "1",
    role: "system",
    content: "Welcome to Synth. I'm here to help you build and manage your automation workflows.",
    timestamp: "10:00 AM",
    conversation_id: "conv_main",
  },
  {
    id: "2",
    role: "user",
    content: "I want to create a workflow that sends a Slack notification when I get a new lead in my CRM.",
    timestamp: "10:01 AM",
    conversation_id: "conv_main",
  },
  {
    id: "3",
    role: "assistant",
    content: "I can help you set that up! I'll create a workflow that triggers when a new lead is added to your CRM and sends a notification to your Slack channel. Would you like me to proceed with the default configuration, or would you like to customize the notification message?",
    timestamp: "10:01 AM",
    conversation_id: "conv_main",
    metadata: { plan: "workflow_generation", confidence: 0.95 },
  },
  {
    id: "4",
    role: "user",
    content: "How do I connect my Gmail account?",
    timestamp: "11:30 AM",
    conversation_id: "conv_support",
  },
  {
    id: "5",
    role: "assistant",
    content: "To connect your Gmail account, go to Connections in the sidebar and click 'Add Connection'. Select Gmail from the list and follow the OAuth flow to authorize access.",
    timestamp: "11:31 AM",
    conversation_id: "conv_support",
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
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [conversationFilter, setConversationFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get unique conversation IDs
  const conversationIds = Array.from(new Set(messages.map(m => m.conversation_id).filter(Boolean))) as string[];

  // Filter messages by conversation
  const filteredMessages = conversationFilter
    ? messages.filter(m => m.conversation_id === conversationFilter)
    : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      conversation_id: conversationFilter || "conv_main",
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsSending(true);

    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));

    const responseMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "I understand your request. Let me help you with that. This is a simulated response for the UI demonstration.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      conversation_id: conversationFilter || "conv_main",
      metadata: { processed: true },
    };

    setMessages(prev => [...prev, responseMessage]);
    setIsSending(false);
    toast.success("Message sent successfully");
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        {/* Header with filter */}
        <div className="border-b border-border bg-background px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Chat</h1>
          <div className="flex items-center gap-2">
            {conversationFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {conversationFilter}
                <button onClick={() => setConversationFilter("")} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
              className={cn(showFilter && "bg-muted")}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>

        {/* Filter dropdown */}
        {showFilter && (
          <div className="border-b border-border bg-muted/50 px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3 max-w-md">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Conversation:</label>
              <Input
                placeholder="Enter conversation ID or select..."
                value={conversationFilter}
                onChange={(e) => setConversationFilter(e.target.value)}
                className="flex-1"
              />
            </div>
            {conversationIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => setConversationFilter("")}>
                  All
                </Button>
                {conversationIds.map(id => (
                  <Button
                    key={id}
                    variant={conversationFilter === id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConversationFilter(id)}
                  >
                    {id}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
          {filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                {conversationFilter ? `No messages in conversation "${conversationFilter}"` : "No messages yet. Start a conversation!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {filteredMessages.map((message, index) => (
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
                    
                    {/* Timestamp & conversation */}
                    <div className={cn(
                      "text-xs mt-2 flex items-center gap-2",
                      message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      <span>{message.timestamp}</span>
                      {message.conversation_id && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1">
                          {message.conversation_id}
                        </Badge>
                      )}
                    </div>

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
                disabled={isSending}
                className="flex-1 min-h-[52px] max-h-[200px] px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
                style={{ overflowY: input.split("\n").length > 3 ? "auto" : "hidden" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
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
