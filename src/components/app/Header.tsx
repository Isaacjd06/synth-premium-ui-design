import { Sparkles, User, LogOut, Settings, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TrialBadge } from "./TrialStatusBanner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Mock user for demo
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: ""
};

const Header = () => {
  const navigate = useNavigate();
  
  // Mock: For demo purposes
  const isTrialing = true;
  const daysRemaining = 3;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-10">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center">
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

        {/* Right side - Trial badge + User menu */}
        <div className="flex items-center gap-3">
          <TrialBadge isTrialing={isTrialing} daysRemaining={daysRemaining} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {mockUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{mockUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/settings?tab=billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/'}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
