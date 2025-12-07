import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Sparkles,
  Download,
  X,
  Loader2,
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data
const mockBillingState = {
  isTrialing: true,
  trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  trialDaysRemaining: 2,
  hasPaymentMethod: false,
  paymentMethod: null as { brand: string; last4: string; expMonth: number; expYear: number } | null,
  subscription: {
    status: "trialing" as "active" | "trialing" | "past_due" | "canceling" | "canceled",
    planId: "growth",
    billingInterval: "monthly" as "monthly" | "yearly",
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelsAt: null as string | null,
  },
  billingEmail: "user@example.com",
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals getting started",
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: [
      "3 active workflows",
      "5,000 runs/month",
      "Email support",
      "Basic integrations",
      "7-day execution history",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For professionals and growing teams",
    monthlyPrice: 149,
    yearlyPrice: 1430,
    popular: true,
    features: [
      "10 active workflows",
      "25,000 runs/month",
      "Priority email support",
      "Advanced integrations",
      "30-day execution history",
      "Custom webhooks",
      "Team collaboration",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    description: "For agencies and large teams",
    monthlyPrice: 399,
    yearlyPrice: 3830,
    features: [
      "40 active workflows",
      "100,000 runs/month",
      "Dedicated support",
      "All integrations",
      "90-day execution history",
      "Custom webhooks",
      "Team collaboration",
      "SSO & advanced security",
      "Custom onboarding",
    ],
  },
];

const addons = [
  {
    id: "rapid-booster",
    name: "Rapid Automation Booster",
    description: "Unlock 25,000 additional automation runs instantly",
    price: 49,
    owned: false,
  },
  {
    id: "performance-turbo",
    name: "Workflow Performance Turbo",
    description: "Priority execution queue for faster processing",
    price: 99,
    owned: false,
  },
  {
    id: "jumpstart",
    name: "Business Systems Jumpstart",
    description: "Done-for-you workflow setup and optimization",
    price: 500,
    owned: true,
  },
  {
    id: "ai-training",
    name: "AI Persona Training",
    description: "Custom AI model training for your business context",
    price: 249,
    owned: false,
  },
  {
    id: "knowledge-injection",
    name: "Unlimited Knowledge Injection",
    description: "Unlimited document uploads and knowledge base entries",
    price: 79,
    owned: false,
  },
];

const mockInvoices = [
  { id: "INV-001", date: "2025-01-01", amount: 149, status: "paid" },
  { id: "INV-002", date: "2024-12-01", amount: 149, status: "paid" },
  { id: "INV-003", date: "2024-11-01", amount: 49, status: "paid" },
];

const mockPurchaseLog = [
  { addon: "Business Systems Jumpstart", date: "2024-12-15", amount: 500, status: "completed" },
];

const Billing = () => {
  const [billingState, setBillingState] = useState(mockBillingState);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState(billingState.subscription.planId);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [purchasingAddon, setPurchasingAddon] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPrice = (plan: typeof plans[0]) => {
    return billingInterval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getMonthlyEquivalent = (plan: typeof plans[0]) => {
    return billingInterval === "yearly"
      ? Math.round(plan.yearlyPrice / 12)
      : plan.monthlyPrice;
  };

  const handleSelectPlan = async (planId: string) => {
    if (planId === selectedPlan) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSelectedPlan(planId);
    setBillingState((prev) => ({
      ...prev,
      subscription: { ...prev.subscription, planId },
    }));
    setLoading(false);
    setSuccessMessage("Plan updated successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
    toast.success("Plan updated successfully");
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setBillingState((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        status: "canceling",
        cancelsAt: prev.subscription.nextRenewal,
      },
    }));
    setLoading(false);
    setShowCancelModal(false);
    setCancelReason("");
    toast.success("Subscription will be canceled at the end of the billing period");
  };

  const handleReactivate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setBillingState((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        status: "active",
        cancelsAt: null,
      },
    }));
    setLoading(false);
    toast.success("Subscription reactivated successfully");
  };

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setBillingState((prev) => ({
      ...prev,
      hasPaymentMethod: true,
      paymentMethod: { brand: "Visa", last4: "4242", expMonth: 12, expYear: 2027 },
    }));
    setLoading(false);
    setShowPaymentModal(false);
    toast.success("Payment method added successfully");
  };

  const handlePurchaseAddon = async (addonId: string) => {
    setPurchasingAddon(addonId);
    await new Promise((r) => setTimeout(r, 1500));
    setPurchasingAddon(null);
    toast.success("Add-on purchased successfully");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      active: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Active" },
      trialing: { color: "bg-primary/20 text-primary border-primary/30", label: "Free Trial" },
      past_due: { color: "bg-destructive/20 text-destructive border-destructive/30", label: "Past Due" },
      canceling: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Canceling" },
      canceled: { color: "bg-muted text-muted-foreground border-border", label: "Canceled" },
    };
    const variant = variants[status] || variants.canceled;
    return (
      <Badge variant="outline" className={variant.color}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your subscription, payment method, and billing information
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300">{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-emerald-400 hover:text-emerald-300"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-destructive/20 to-destructive/10 border border-destructive/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-red-300">{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="ml-auto text-destructive hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trial Status Banner */}
        {billingState.isTrialing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-purple-500/20 border border-primary/30 shadow-glow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg text-foreground">
                      3-Day Free Trial Active
                    </h3>
                    <p className="text-muted-foreground">
                      You have {billingState.trialDaysRemaining} days remaining in your free trial.
                      Add a payment method to continue after the trial.
                    </p>
                    <p className="text-sm text-primary mt-1">
                      Trial ends: {formatDateTime(billingState.trialEndsAt)}
                    </p>
                  </div>
                </div>
                {!billingState.hasPaymentMethod && (
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    className="md:ml-auto btn-system bg-primary text-primary-foreground"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Method Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <AppCard>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-accent text-xl text-foreground">Payment Method</h2>
            </div>
            {billingState.hasPaymentMethod && billingState.paymentMethod ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      {billingState.paymentMethod.brand} •••• {billingState.paymentMethod.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {billingState.paymentMethod.expMonth}/{billingState.paymentMethod.expYear}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowPaymentModal(true)}>
                  Update Payment Method
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Add a payment method to get started
                </p>
                <Button onClick={() => setShowPaymentModal(true)} className="btn-system bg-primary text-primary-foreground">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            )}
          </AppCard>
        </motion.div>

        {/* Current Subscription Status */}
        {billingState.subscription.status !== "canceled" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <AppCard>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusBadge(billingState.subscription.status)}
                    {billingState.isTrialing && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        <Clock className="w-3 h-3 mr-1" />
                        {billingState.trialDaysRemaining} days left
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {billingState.isTrialing && (
                      <p className="text-muted-foreground">
                        <span className="text-foreground/70">Trial ends:</span>{" "}
                        {formatDateTime(billingState.trialEndsAt)}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      <span className="text-foreground/70">Started:</span>{" "}
                      {formatDate(billingState.subscription.startedAt)}
                    </p>
                    {!billingState.isTrialing && billingState.subscription.status !== "canceling" && (
                      <p className="text-muted-foreground">
                        <span className="text-foreground/70">Next renewal:</span>{" "}
                        {formatDate(billingState.subscription.nextRenewal)}
                      </p>
                    )}
                    {billingState.subscription.cancelsAt && (
                      <p className="text-amber-400">
                        <span className="text-foreground/70">Cancels on:</span>{" "}
                        {formatDate(billingState.subscription.cancelsAt)}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      <span className="text-foreground/70">Current plan:</span>{" "}
                      <span className="text-foreground capitalize">{selectedPlan}</span>
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-foreground/70">Billing email:</span>{" "}
                      {billingState.billingEmail || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {billingState.subscription.status === "canceling" ? (
                    <Button
                      onClick={handleReactivate}
                      disabled={loading}
                      className="btn-system bg-primary text-primary-foreground"
                    >
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Reactivate Subscription
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelModal(true)}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </div>
            </AppCard>
          </motion.div>
        )}

        {/* Plan Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="font-accent text-2xl text-foreground mb-2">Choose Your Plan</h2>
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-secondary/50 border border-border">
              <button
                onClick={() => setBillingInterval("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingInterval === "monthly"
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval("yearly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  billingInterval === "yearly"
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  Save 20%
                </Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border p-6 transition-all cursor-pointer ${
                  selectedPlan === plan.id
                    ? "border-primary ring-2 ring-primary/30 bg-gradient-to-b from-primary/10 to-transparent"
                    : plan.popular
                    ? "border-primary/50 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary"
                    : "border-border bg-card hover:border-primary/50"
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {selectedPlan === plan.id && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    CURRENT PLAN
                  </Badge>
                )}
                {plan.popular && selectedPlan !== plan.id && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
                    MOST POPULAR
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-accent text-xl text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-center mb-6">
                  {billingInterval === "yearly" && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${plan.monthlyPrice}/mo
                    </span>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ${getMonthlyEquivalent(plan)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {billingInterval === "yearly" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${getPrice(plan)} billed yearly
                    </p>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? "bg-secondary text-foreground cursor-default"
                      : "btn-system bg-primary text-primary-foreground"
                  }`}
                  disabled={loading || selectedPlan === plan.id}
                >
                  {loading && selectedPlan !== plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : selectedPlan === plan.id ? (
                    "Current Plan"
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add-ons Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <AppCard>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-accent text-xl text-foreground">One-Time Add-ons</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Enhance your workflow with these one-time purchases
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className={`p-4 rounded-xl border transition-all ${
                    addon.owned
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">{addon.name}</h4>
                    {addon.owned && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Owned
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">${addon.price}</span>
                    <Button
                      size="sm"
                      variant={addon.owned ? "outline" : "default"}
                      disabled={addon.owned || purchasingAddon === addon.id}
                      onClick={() => handlePurchaseAddon(addon.id)}
                      className={addon.owned ? "" : "btn-system bg-primary text-primary-foreground"}
                    >
                      {purchasingAddon === addon.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : addon.owned ? (
                        "Owned"
                      ) : (
                        "Purchase"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AppCard>
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <AppCard>
            <h2 className="font-accent text-xl text-foreground mb-4">Billing History</h2>
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="purchases">Purchase Log</TabsTrigger>
              </TabsList>
              <TabsContent value="invoices">
                {mockInvoices.length > 0 ? (
                  <div className="space-y-3">
                    {mockInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium text-foreground">{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(invoice.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-foreground">${invoice.amount}</span>
                          <Badge
                            variant="outline"
                            className={
                              invoice.status === "paid"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            }
                          >
                            {invoice.status}
                          </Badge>
                          <Button size="icon" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No invoices yet</p>
                )}
              </TabsContent>
              <TabsContent value="purchases">
                {mockPurchaseLog.length > 0 ? (
                  <div className="space-y-3">
                    {mockPurchaseLog.map((purchase, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div>
                          <p className="font-medium text-foreground">{purchase.addon}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(purchase.date)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-foreground">${purchase.amount}</span>
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          >
                            {purchase.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No purchases yet</p>
                )}
              </TabsContent>
            </Tabs>
          </AppCard>
        </motion.div>

        {/* Cancel Subscription Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Reason for cancellation (optional)
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're leaving..."
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Cancel Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Method Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {billingState.hasPaymentMethod ? "Update Payment Method" : "Add Payment Method"}
              </DialogTitle>
              <DialogDescription>
                Enter your payment details below. Your information is securely processed.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* Mock payment form - would be replaced with Stripe Elements */}
              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <p className="text-sm text-muted-foreground text-center">
                  [Stripe PaymentElement would render here]
                </p>
                <div className="mt-4 space-y-3">
                  <div className="h-10 rounded-md bg-background border border-input" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-md bg-background border border-input" />
                    <div className="h-10 rounded-md bg-background border border-input" />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddPaymentMethod}
                disabled={loading}
                className="btn-system bg-primary text-primary-foreground"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {billingState.hasPaymentMethod ? "Update" : "Save Payment Method"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
};

export default Billing;