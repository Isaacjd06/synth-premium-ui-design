import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Mail, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const WaitlistConfirmed = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-accent font-bold text-foreground mb-4">
          You're on the list!
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Thanks for joining the Synth waitlist. We'll be in touch soon.
        </p>

        {/* What to expect */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-foreground mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Confirmation email</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email with more details about Synth.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Early access</p>
                <p className="text-sm text-muted-foreground">
                  When we launch, you'll be among the first to get access.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Exclusive updates</p>
                <p className="text-sm text-muted-foreground">
                  Get sneak peeks and product updates before anyone else.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <Button asChild variant="outline" className="w-full">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default WaitlistConfirmed;
