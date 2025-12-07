import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowRight,
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import AppCard from "@/components/app/AppCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Mock subscription state - null means no subscription
const mockSubscription: {
  planId: string;
  status: "active" | "trialing" | "past_due" | "canceling" | "canceled";
  renewalDate: string;
  trialEndDate?: string;
  ownedAddons: string[];
} | null = null; // Set to null for "no subscription" state

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
    id: "pro",
    name: "Pro",
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
    id: "agency",
    name: "Agency",
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
    id: "rapid_booster",
    name: "Rapid Automation Booster Pack",
    description: "Unlock 25,000 additional automation runs instantly",
    price: 97,
  },
  {
    id: "performance_turbo",
    name: "Workflow Performance Turbo",
    description: "Priority execution queue for faster processing",
    price: 147,
  },
  {
    id: "jumpstart",
    name: "Business Systems Jumpstart Kit",
    description: "Done-for-you workflow setup and optimization",
    price: 199,
  },
  {
    id: "ai_training",
    name: "AI Persona Training Upgrade",
    description: "Custom AI model training for your business context",
    price: 249,
  },
  {
    id: "knowledge_injection",
    name: "Unlimited Knowledge Injection",
    description: "Unlimited document uploads and knowledge base entries",
    price: 99,
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
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(mockSubscription);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasSubscription = subscription !== null;
  const isCancelConfirmValid = cancelConfirmation === "UNSUBSCRIBE";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(selectedPlan === planId ? null : planId);
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleContinueToCheckout = () => {
    if (!selectedPlan) return;
    const params = new URLSearchParams();
    params.set("plan", selectedPlan);
    params.set("interval", billingInterval);
    if (selectedAddons.length > 0) {
      params.set("addons", selectedAddons.join(","));
    }
    navigate(`/app/checkout?${params.toString()}`);
  };

  const handleCancelSubscription = async () => {
    if (!isCancelConfirmValid) return;
    setLoading(true);
    
    try {
      // Mock API call - would call /api/billing/cancel
      await new Promise((r) => setTimeout(r, 1500));
      
      setSubscription(null);
      setShowCancelModal(false);
      setCancelConfirmation("");
      setCancelReason("");
      toast.success("Subscription canceled successfully");
    } catch (error) {
      setErrorMessage("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      active: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Active" },
      trialing: { color: "bg-primary/20 text-primary border-primary/30", label: "Trial" },
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

  // Calculate checkout totals for the sticky footer
  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const planTotal = selectedPlanData ? getPrice(selectedPlanData) : 0;
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = addons.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto pb-32">
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
            {hasSubscription
              ? "Manage your subscription and billing information"
              : "Choose a plan to get started with Synth"}
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

        {/* NO SUBSCRIPTION STATE */}
        {!hasSubscription && (
          <>
            {/* Plan Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h2 className="font-accent text-2xl text-foreground mb-4">Choose Your Plan</h2>
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
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`relative rounded-2xl border p-6 transition-all cursor-pointer ${
                      selectedPlan === plan.id
                        ? "border-primary ring-2 ring-primary/30 bg-gradient-to-b from-primary/10 to-transparent"
                        : plan.popular
                        ? "border-primary/50 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                        SELECTED
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
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select"}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Add-ons Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <AppCard>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="font-accent text-xl text-foreground">Add-ons</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Enhance your workflow with these one-time purchases (optional)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleAddonToggle(addon.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground">{addon.name}</h4>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>
                        <span className="font-bold text-foreground">${addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </AppCard>
            </motion.div>
          </>
        )}

        {/* HAS SUBSCRIPTION STATE */}
        {hasSubscription && subscription && (
          <>
            {/* Current Subscription Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <AppCard>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="font-accent text-xl text-foreground">Current Subscription</h2>
                      {getStatusBadge(subscription.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Plan</p>
                        <p className="text-lg font-semibold text-foreground capitalize">
                          {plans.find((p) => p.id === subscription.planId)?.name || subscription.planId}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Renewal Date</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatDate(subscription.renewalDate)}
                        </p>
                      </div>
                    </div>

                    {subscription.trialEndDate && (
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <p className="text-primary">
                            Trial ends: {formatDate(subscription.trialEndDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    {subscription.ownedAddons.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Owned Add-ons</h4>
                        <div className="flex flex-wrap gap-2">
                          {subscription.ownedAddons.map((addonId) => {
                            const addon = addons.find((a) => a.id === addonId);
                            return addon ? (
                              <Badge
                                key={addonId}
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              >
                                {addon.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelModal(true)}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </AppCard>
            </motion.div>

            {/* Billing History */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
          </>
        )}

        {/* Cancel Subscription Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Your subscription will remain active until the end of your current billing period.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive">
                  To confirm cancellation, please type <strong>UNSUBSCRIBE</strong> below:
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation">Confirmation</Label>
                <Input
                  id="confirmation"
                  value={cancelConfirmation}
                  onChange={(e) => setCancelConfirmation(e.target.value)}
                  placeholder="Type UNSUBSCRIBE to confirm"
                  className={
                    cancelConfirmation && !isCancelConfirmValid
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for cancellation (optional)</Label>
                <Textarea
                  id="reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you're leaving..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelConfirmation("");
                  setCancelReason("");
                }}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={!isCancelConfirmValid || loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sticky Checkout Footer - Only show when no subscription */}
      {!hasSubscription && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 z-50"
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {selectedPlan ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Plan</p>
                    <p className="font-semibold text-foreground capitalize">
                      {selectedPlanData?.name} - ${planTotal}/{billingInterval === "yearly" ? "year" : "month"}
                    </p>
                  </div>
                  {selectedAddons.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Add-ons</p>
                      <p className="font-semibold text-foreground">
                        {selectedAddons.length} selected (+${addonsTotal})
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Select a plan to continue</p>
              )}
            </div>
            <Button
              onClick={handleContinueToCheckout}
              disabled={!selectedPlan}
              className="btn-system bg-primary text-primary-foreground min-w-[200px]"
            >
              Continue to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </AppShell>
  );
};

export default Billing;
