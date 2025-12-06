import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/app/Dashboard";
import Chat from "./pages/app/Chat";
import Workflows from "./pages/app/Workflows";
import CreateWorkflow from "./pages/app/CreateWorkflow";
import WorkflowDetail from "./pages/app/WorkflowDetail";
import Executions from "./pages/app/Executions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/chat" element={<Chat />} />
          <Route path="/app/workflows" element={<Workflows />} />
          <Route path="/app/workflows/create" element={<CreateWorkflow />} />
          <Route path="/app/workflows/:id" element={<WorkflowDetail />} />
          <Route path="/app/executions" element={<Executions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
