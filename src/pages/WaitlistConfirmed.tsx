import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
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
          transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-accent font-bold text-foreground mb-4">
          You're on the list!
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          Thanks for joining the Synth waitlist. We'll notify you as soon as we're ready to launch.
        </p>

        {/* What to expect */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            What to Expect
          </h2>
          <ul className="text-left space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>We'll send you a confirmation email shortly.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>You'll receive early access before the public launch.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>We'll keep you updated on new features and announcements.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Button asChild size="lg">
          <Link to="/" className="flex items-center gap-2">
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default WaitlistConfirmed;
