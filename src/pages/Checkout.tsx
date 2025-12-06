import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckoutStatus = 'loading' | 'success' | 'cancelled';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CheckoutStatus>('loading');
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const cancelled = searchParams.get('cancelled');
    
    if (cancelled === 'true') {
      setStatus('cancelled');
    } else if (sessionId) {
      // Simulate verifying the session
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    } else {
      // Redirect to Stripe (simulated)
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-6" />
          <h1 className="text-2xl font-accent font-bold text-foreground mb-2">
            Processing your payment...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we confirm your subscription.
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <h1 className="text-2xl font-accent font-bold text-foreground mb-2">
            Checkout Cancelled
          </h1>
          <p className="text-muted-foreground mb-8">
            Your checkout was cancelled. No charges were made to your account.
          </p>

          <div className="space-y-3">
            <Button onClick={() => navigate('/pricing')} className="w-full">
              Return to Pricing
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-accent font-bold text-foreground mb-4">
          Welcome to Synth!
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          Your subscription is now active. You have full access to all features.
        </p>

        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            What's Next?
          </h2>
          <ul className="text-left space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Set up your Knowledge base to teach Synth about your business.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Connect your apps in the Connections page.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Create your first workflow and start automating.</span>
            </li>
          </ul>
        </div>

        <Button size="lg" onClick={() => navigate('/app/dashboard')} className="gap-2">
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Checkout;
