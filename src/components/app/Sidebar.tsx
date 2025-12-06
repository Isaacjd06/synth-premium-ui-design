import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Workflow,
  PlusCircle,
  PlaySquare,
  BookOpen,
  Menu,
  X,
  Link2,
  Brain,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { title: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { title: "Chat", href: "/app/chat", icon: MessageSquare },
  { title: "Workflows", href: "/app/workflows", icon: Workflow },
  { title: "Create Workflow", href: "/app/workflows/create", icon: PlusCircle },
  { title: "Executions", href: "/app/executions", icon: PlaySquare },
  { title: "Connections", href: "/app/connections", icon: Link2 },
  { title: "Memory", href: "/app/memory", icon: Brain },
  { title: "Knowledge", href: "/app/knowledge", icon: BookOpen },
];

const bottomNavItems = [
  { title: "Settings", href: "/app/settings", icon: Settings },
  { title: "Billing", href: "/app/billing", icon: CreditCard },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/app/workflows/create") {
      return location.pathname === href;
    }
    if (href === "/app/workflows") {
      return location.pathname === href || (location.pathname.startsWith("/app/workflows/") && !location.pathname.includes("/create"));
    }
    return location.pathname === href;
  };

  const NavContent = () => (
    <nav className="flex flex-col h-full p-4">
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isDisabled = 'disabled' in item && item.disabled;
          const badge = 'badge' in item ? (item.badge as string) : undefined;
          
          return (
            <Link
              key={item.href}
              to={isDisabled ? "#" : item.href}
              onClick={() => !isDisabled && setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive(item.href) && !isDisabled
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
              {badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Bottom Navigation */}
      <div className="border-t border-border pt-4 mt-4 flex flex-col gap-1">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive(item.href)
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-60 bg-background border-r border-border overflow-y-auto">
        <NavContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-background border-r border-border z-40"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-accent text-lg font-semibold text-foreground">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
