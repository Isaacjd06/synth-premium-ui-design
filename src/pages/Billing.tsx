import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CreditCard, Check, ArrowRight, Loader2, Receipt, 
  ChevronDown, ChevronUp, AlertCircle, Calendar
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    workflows: 3,
    runs: "5k-10k",
    features: ["3 active workflows", "Up to 10k runs/month", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 149,
    workflows: 10,
    runs: "25k-35k",
    popular: true,
    features: ["10 active workflows", "Up to 35k runs/month", "Priority support", "Advanced analytics"],
  },
  {
    id: "scale",
    name: "Scale",
    price: 399,
    workflows: 40,
    runs: "75k-100k",
    features: ["40 active workflows", "Up to 100k runs/month", "Dedicated support", "Custom integrations"],
  },
];

const mockInvoices = [
  { id: "inv_001", date: "Jan 15, 2025", amount: 149, status: "paid" },
  { id: "inv_002", date: "Dec 15, 2024", amount: 149, status: "paid" },
  { id: "inv_003", date: "Nov 15, 2024", amount: 149, status: "paid" },
];

const Billing = () => {
  const [currentPlan] = useState("growth");
  const [isYearly, setIsYearly] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);

  const handleChangePlan = async (planId: string) => {
    if (planId === currentPlan) return;
    
    setIsChangingPlan(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsChangingPlan(false);
    toast.success(`Switched to ${plans.find(p => p.id === planId)?.name} plan`);
  };

  const getPrice = (basePrice: number) => {
    return isYearly ? Math.round(basePrice * 0.8) : basePrice;
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and view invoices.
          </p>
        </div>

        {/* Current Plan Status */}
        <AppCard className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {plans.find(p => p.id === currentPlan)?.name}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                ${plans.find(p => p.id === currentPlan)?.price}/month · Renews on Feb 15, 2025
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment
              </Button>
            </div>
          </div>
        </AppCard>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isYearly ? "bg-primary" : "bg-muted"
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
              animate={{ x: isYearly ? 26 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Yearly <span className="text-primary">(20% off)</span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <AppCard 
              key={plan.id}
              className={`relative ${plan.id === currentPlan ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-foreground">${getPrice(plan.price)}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                {isYearly && (
                  <p className="text-xs text-primary mt-1">Save ${plan.price * 12 * 0.2}/year</p>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.id === currentPlan ? "outline" : "default"}
                className="w-full"
                disabled={plan.id === currentPlan || isChangingPlan}
                onClick={() => handleChangePlan(plan.id)}
              >
                {plan.id === currentPlan ? (
                  "Current Plan"
                ) : isChangingPlan ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Switching...</>
                ) : (
                  <>Switch to {plan.name}</>
                )}
              </Button>
            </AppCard>
          ))}
        </div>

        {/* Invoice History */}
        <AppCard>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowInvoices(!showInvoices)}
          >
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Invoice History</h2>
            </div>
            {showInvoices ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          {showInvoices && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-4"
            >
              <div className="space-y-2">
                {mockInvoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{invoice.date}</p>
                        <p className="text-xs text-muted-foreground">{invoice.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">${invoice.amount}</span>
                      <Badge variant="secondary" className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AppCard>
      </div>
    </AppShell>
  );
};

export default Billing;
