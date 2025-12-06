import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Waitlist from "./pages/Waitlist";
import WaitlistConfirmed from "./pages/WaitlistConfirmed";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/app/Dashboard";
import Chat from "./pages/app/Chat";
import Workflows from "./pages/app/Workflows";
import CreateWorkflow from "./pages/app/CreateWorkflow";
import WorkflowDetail from "./pages/app/WorkflowDetail";
import Executions from "./pages/app/Executions";
import Knowledge from "./pages/app/Knowledge";
import Connections from "./pages/app/Connections";
import Memory from "./pages/app/Memory";
import Settings from "./pages/app/Settings";
import Billing from "./pages/Billing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/waitlist/confirmed" element={<WaitlistConfirmed />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/chat" element={<Chat />} />
          <Route path="/app/workflows" element={<Workflows />} />
          <Route path="/app/workflows/create" element={<CreateWorkflow />} />
          <Route path="/app/workflows/:id" element={<WorkflowDetail />} />
          <Route path="/app/executions" element={<Executions />} />
          <Route path="/app/knowledge" element={<Knowledge />} />
          <Route path="/app/connections" element={<Connections />} />
          <Route path="/app/memory" element={<Memory />} />
          <Route path="/app/settings" element={<Settings />} />
          <Route path="/app/billing" element={<Billing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;