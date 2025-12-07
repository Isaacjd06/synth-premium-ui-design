import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
}

const GoogleSignInButton = ({ className = "", variant = "primary" }: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    // Simulate OAuth redirect delay
    await new Promise(r => setTimeout(r, 800));
    // In real implementation, this would redirect to /api/auth/signin?provider=google
    window.location.href = "/app/dashboard";
  };

  const baseStyles = "inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = variant === "primary" 
    ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl" 
    : "bg-card border border-border text-foreground hover:bg-muted";

  return (
    <motion.button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
    </motion.button>
  );
};

export default GoogleSignInButton;
