import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckoutStatus = "loading" | "success" | "canceled" | "error";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CheckoutStatus>("loading");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    if (canceled === "true") {
      setStatus("canceled");
    } else if (sessionId) {
      // Simulate verification delay
      const timer = setTimeout(() => {
        setStatus("success");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // No params - redirect to pricing or show loading for Stripe redirect
      const timer = setTimeout(() => {
        // Simulate redirect to Stripe
        setStatus("loading");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-accent font-bold text-foreground mb-3">
              Redirecting to checkout...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we connect you to our secure payment provider.
            </p>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-accent font-bold text-foreground mb-3">
              Welcome to Synth!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your subscription is now active. Let's get started building automations.
            </p>
            <Button onClick={() => navigate("/app/dashboard")} size="lg">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      case "canceled":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-accent font-bold text-foreground mb-3">
              Checkout canceled
            </h1>
            <p className="text-muted-foreground mb-8">
              No worries! Your checkout was canceled. You can try again anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/pricing")} variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                View Plans
              </Button>
              <Button onClick={() => navigate("/app/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-accent font-bold text-foreground mb-3">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-8">
              We couldn't process your checkout. Please try again or contact support.
            </p>
            <Button onClick={() => navigate("/pricing")}>
              Try Again
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default Checkout;
