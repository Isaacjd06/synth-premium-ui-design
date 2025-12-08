import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Settings,
  Workflow,
  Link2,
  Calendar,
  FileText,
  Shield,
  User,
  Database,
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import MemoryInfoCard from "@/components/memory/MemoryInfoCard";
import MemoryFilters from "@/components/memory/MemoryFilters";
import MemoryCategoryCard from "@/components/memory/MemoryCategoryCard";
import MemoryAddCard from "@/components/memory/MemoryAddCard";
import MemoryEmptyState from "@/components/memory/MemoryEmptyState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { MemoryItemData } from "@/components/memory/MemoryItem";

interface CategoryConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
}

const categories: CategoryConfig[] = [
  { id: "preferences", title: "General Preferences", icon: <Settings className="w-4 h-4 text-blue-400" />, iconBg: "bg-blue-500/20" },
  { id: "workflows", title: "Workflow Behaviors", icon: <Workflow className="w-4 h-4 text-purple-400" />, iconBg: "bg-purple-500/20" },
  { id: "apps", title: "Connected Apps Insights", icon: <Link2 className="w-4 h-4 text-green-400" />, iconBg: "bg-green-500/20" },
  { id: "scheduling", title: "Scheduling Patterns", icon: <Calendar className="w-4 h-4 text-orange-400" />, iconBg: "bg-orange-500/20" },
  { id: "formatting", title: "Output Formatting Preferences", icon: <FileText className="w-4 h-4 text-sky-400" />, iconBg: "bg-sky-500/20" },
  { id: "rules", title: "Business Rules & Conditions", icon: <Shield className="w-4 h-4 text-red-400" />, iconBg: "bg-red-500/20" },
  { id: "habits", title: "User Habits", icon: <User className="w-4 h-4 text-pink-400" />, iconBg: "bg-pink-500/20" },
  { id: "data", title: "Data Handling Preferences", icon: <Database className="w-4 h-4 text-amber-400" />, iconBg: "bg-amber-500/20" },
];

const mockMemories: MemoryItemData[] = [
  { id: "1", title: "Prefers Slack for alerts", description: "User prefers to receive urgent notifications via Slack instead of email.", category: "preferences", lastUpdated: "2 hours ago" },
  { id: "2", title: "Morning notification preference", description: "Prefers to receive daily summaries between 9am and 10am EST.", category: "scheduling", lastUpdated: "1 day ago" },
  { id: "3", title: "Short summaries preferred", description: "User likes concise summaries, max 3 bullet points.", category: "formatting", lastUpdated: "3 days ago" },
  { id: "4", title: "Auto-archive old leads", description: "Leads older than 30 days should be automatically archived.", category: "workflows", lastUpdated: "5 days ago" },
  { id: "5", title: "Skip duplicates", description: "Skip processing if a contact already exists in the CRM.", category: "rules", lastUpdated: "1 week ago" },
  { id: "6", title: "Uses HubSpot for CRM", description: "Primary CRM is HubSpot, all lead data should sync there.", category: "apps", lastUpdated: "2 weeks ago" },
  { id: "7", title: "Checks email frequently", description: "User typically responds to emails within 2 hours during business hours.", category: "habits", lastUpdated: "3 days ago" },
  { id: "8", title: "Sensitive data handling", description: "PII should be masked in logs and notifications.", category: "data", lastUpdated: "1 week ago" },
  { id: "9", title: "Weekly report on Fridays", description: "User wants a weekly performance report every Friday at 5pm.", category: "scheduling", lastUpdated: "4 days ago" },
  { id: "10", title: "Retry failed workflows", description: "Automatically retry failed workflows up to 3 times.", category: "workflows", lastUpdated: "6 days ago" },
];

const Memory = () => {
  const [memories, setMemories] = useState<MemoryItemData[]>(mockMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredMemories = useMemo(() => {
    let filtered = memories.filter((memory) => {
      const matchesSearch =
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || memory.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "az") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "oldest") {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [memories, searchQuery, categoryFilter, sortBy]);

  const getMemoriesByCategory = (categoryId: string) => {
    return filteredMemories.filter((m) => m.category === categoryId);
  };

  const handleAddMemory = (title: string, description: string, category: string) => {
    const newMemory: MemoryItemData = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      lastUpdated: "Just now",
    };
    setMemories([newMemory, ...memories]);
    toast.success("Memory added successfully");
  };

  const handleEditMemory = (id: string, newTitle: string, newDescription: string) => {
    setMemories(
      memories.map((m) =>
        m.id === id
          ? { ...m, title: newTitle, description: newDescription, lastUpdated: "Just now" }
          : m
      )
    );
    toast.success("Memory updated");
  };

  const handleDeleteMemory = () => {
    if (!deleteId) return;
    setMemories(memories.filter((m) => m.id !== deleteId));
    setDeleteId(null);
    toast.success("Memory deleted");
  };

  const hasAnyMemories = memories.length > 0;
  const hasFilteredMemories = filteredMemories.length > 0;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Memory</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            View and manage what Synth remembers about your preferences and workflows.
          </p>
        </motion.div>

        {/* Info Card */}
        <MemoryInfoCard />

        {/* Add Memory Card */}
        <MemoryAddCard onAdd={handleAddMemory} />

        {/* Filters */}
        <MemoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Memory Categories or Empty State */}
        {!hasAnyMemories ? (
          <MemoryEmptyState />
        ) : !hasFilteredMemories ? (
          <div className="text-center py-8 text-muted-foreground">
            No memories match your search criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, idx) => {
              const categoryMemories = getMemoriesByCategory(category.id);
              if (categoryFilter !== "all" && categoryFilter !== category.id) return null;
              if (categoryMemories.length === 0 && categoryFilter === "all") return null;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <MemoryCategoryCard
                    title={category.title}
                    icon={category.icon}
                    iconBg={category.iconBg}
                    memories={categoryMemories}
                    onEditMemory={handleEditMemory}
                    onDeleteMemory={(id) => setDeleteId(id)}
                    defaultOpen={categoryMemories.length > 0 && categoryMemories.length <= 3}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Memory</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this memory? Synth will no longer use this information to personalize your automations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMemory}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
};

export default Memory;
