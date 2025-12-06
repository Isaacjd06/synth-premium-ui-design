import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-10">
      <div className="h-full flex items-center px-4 lg:px-6">
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-accent text-lg sm:text-xl font-semibold text-foreground">
            Synth
          </span>
        </Link>
        
        {/* Vertical divider */}
        <div className="hidden sm:block h-6 w-px bg-border mx-4" />
        
        {/* Accent bar */}
        <div className="hidden sm:block h-1 w-8 bg-primary rounded-full" />
      </div>
    </header>
  );
};

export default Header;
