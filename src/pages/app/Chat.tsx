import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import ChatMessage, { ChatMessageProps } from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ChatSidebar from "@/components/chat/ChatSidebar";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Placeholder messages demonstrating different message types
const placeholderMessages: ChatMessageProps[] = [
  {
    id: "1",
    role: "system",
    content: "Welcome to Synth. I'm here to help you build and manage your automation workflows.",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    role: "user",
    content: "Create an automation that sends me a Slack message when a Stripe payment succeeds.",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    role: "assistant",
    content: "I can build that workflow for you! Here's what I'm proposing:",
    timestamp: "10:01 AM",
    workflowSteps: [
      { step: 1, title: "Stripe Webhook Trigger", description: "Listen for payment_intent.succeeded events" },
      { step: 2, title: "Extract Payment Data", description: "Parse customer email, amount, and invoice ID" },
      { step: 3, title: "Send Slack Notification", description: "Post formatted message to #payments channel" },
    ],
    actions: [
      { label: "Create Workflow" },
      { label: "Customize Steps" },
      { label: "Preview Message" },
    ],
    metadata: { plan: "workflow_generation", confidence: 0.95 },
  },
  {
    id: "4",
    role: "user",
    content: "Show me how the Slack message will look",
    timestamp: "10:02 AM",
  },
  {
    id: "5",
    role: "assistant",
    content: "Here's a preview of the Slack notification format:",
    timestamp: "10:02 AM",
    codeBlock: {
      language: "json",
      code: `{
  "channel": "#payments",
  "blocks": [
    {
      "type": "header",
      "text": "💰 New Payment Received"
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Amount:* $99.00" },
        { "type": "mrkdwn", "text": "*Customer:* john@example.com" }
      ]
    }
  ]
}`,
    },
    actions: [
      { label: "Use This Format" },
      { label: "Edit Template" },
    ],
  },
  {
    id: "6",
    role: "system",
    content: "Tip: You can say \"generate workflow\" at any time to start building a new automation.",
    timestamp: "10:03 AM",
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(placeholderMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageProps = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1500));

    const assistantMessage: ChatMessageProps = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "I understand your request. Let me help you with that. This is a simulated response for the UI demonstration. In production, this would be connected to the AI backend.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actions: [
        { label: "Learn More" },
        { label: "Try Another" },
      ],
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/50 bg-background px-4 lg:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chat</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Talk to Synth to build automations and get intelligent guidance.
            </p>
          </div>

          {/* Mobile sidebar toggle */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-background border-border">
              <ChatSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat window - Left column */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 lg:px-6">
              <div className="max-w-3xl mx-auto py-6 space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} {...message} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>

          {/* Context Sidebar - Right column (desktop only) */}
          <div className="hidden lg:block w-80 border-l border-border/50 bg-card/30">
            <ChatSidebar />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Chat;
