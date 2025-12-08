import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import KnowledgeCard, { KnowledgeEntry } from "@/components/knowledge/KnowledgeCard";
import KnowledgeActionsBar from "@/components/knowledge/KnowledgeActionsBar";
import KnowledgeCategorySidebar from "@/components/knowledge/KnowledgeCategorySidebar";
import KnowledgeDetailsDrawer from "@/components/knowledge/KnowledgeDetailsDrawer";
import KnowledgeEditorModal from "@/components/knowledge/KnowledgeEditorModal";
import KnowledgeEmptyState from "@/components/knowledge/KnowledgeEmptyState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const mockEntries: KnowledgeEntry[] = [
  {
    id: "1",
    title: "How to qualify a lead",
    category: "sop",
    content: "A qualified lead must meet the following criteria:\n\n1. Budget: Has a budget of at least $10,000\n2. Authority: Decision maker or can influence the decision\n3. Need: Has a clear pain point we can solve\n4. Timeline: Looking to make a decision within 3 months\n\nSteps to qualify:\n- Ask about their current solution\n- Understand their pain points\n- Confirm budget range\n- Identify decision makers\n- Establish timeline expectations",
    preview: "A qualified lead must meet the following criteria: Budget, Authority, Need, and Timeline...",
    lastUpdated: "2 hours ago",
    createdAt: "Jan 10, 2025",
    usedByWorkflows: 3,
    referencedInChat: true,
    tags: ["sales", "leads", "qualification"],
  },
  {
    id: "2",
    title: "Refund policy guidelines",
    category: "rule",
    content: "Refund Policy:\n\n- Full refunds are available within 30 days of purchase\n- After 30 days, only partial refunds (50%) are available\n- No refunds after 60 days\n- Subscription cancellations take effect at the end of the billing period\n- Enterprise customers have custom terms in their contracts\n\nExceptions:\n- Technical issues preventing usage qualify for full refund\n- Billing errors always receive full refund",
    preview: "Full refunds are available within 30 days of purchase. After 30 days, only partial refunds...",
    lastUpdated: "1 day ago",
    createdAt: "Jan 5, 2025",
    usedByWorkflows: 1,
    referencedInChat: true,
    tags: ["billing", "refunds", "policy"],
  },
  {
    id: "3",
    title: "Customer onboarding checklist",
    category: "process",
    content: "New Customer Onboarding Process:\n\n□ Send welcome email within 1 hour\n□ Schedule kickoff call within 24 hours\n□ Create account in CRM\n□ Add to onboarding email sequence\n□ Assign customer success manager\n□ Schedule training session\n□ Send documentation links\n□ Set up check-in for day 7\n□ Set up check-in for day 30",
    preview: "New Customer Onboarding Process: Send welcome email, schedule kickoff call, create account...",
    lastUpdated: "3 days ago",
    createdAt: "Dec 28, 2024",
    usedByWorkflows: 5,
    referencedInChat: false,
    tags: ["onboarding", "customers", "checklist"],
  },
  {
    id: "4",
    title: "Daily admin workflow rules",
    category: "rule",
    content: "Daily Administrative Tasks:\n\n1. Morning (9:00 AM):\n   - Check overnight support tickets\n   - Review pending approvals\n   - Update task board\n\n2. Midday (12:00 PM):\n   - Process invoices\n   - Follow up on outstanding items\n\n3. End of Day (5:00 PM):\n   - Update daily log\n   - Send end-of-day summary to team\n   - Archive completed tickets",
    preview: "Daily Administrative Tasks including morning checks, midday processing, and end-of-day updates...",
    lastUpdated: "5 days ago",
    createdAt: "Dec 20, 2024",
    usedByWorkflows: 2,
    referencedInChat: true,
    tags: ["admin", "daily", "tasks"],
  },
  {
    id: "5",
    title: "Email response template - Sales inquiry",
    category: "template",
    content: "Subject: Thanks for your interest in [Product Name]\n\nHi [First Name],\n\nThank you for reaching out about [Product Name]! I'd love to learn more about your needs.\n\nCould you share:\n1. What challenges are you looking to solve?\n2. What's your timeline for making a decision?\n3. Would you prefer a quick call or a demo?\n\nLooking forward to hearing from you!\n\nBest,\n[Your Name]",
    preview: "Email template for responding to sales inquiries with personalized questions...",
    lastUpdated: "1 week ago",
    createdAt: "Dec 15, 2024",
    usedByWorkflows: 4,
    referencedInChat: true,
    tags: ["email", "template", "sales"],
  },
  {
    id: "6",
    title: "Definition: MQL vs SQL",
    category: "definition",
    content: "Marketing Qualified Lead (MQL):\nA lead that has shown interest through marketing activities but hasn't been vetted by sales. Examples include downloading content, attending webinars, or visiting pricing pages multiple times.\n\nSales Qualified Lead (SQL):\nA lead that has been reviewed by sales and meets the criteria for direct sales follow-up. They have confirmed budget, authority, need, and timeline (BANT).\n\nConversion: An MQL becomes an SQL after a discovery call confirms they meet qualification criteria.",
    preview: "Marketing Qualified Lead (MQL) vs Sales Qualified Lead (SQL) definitions and criteria...",
    lastUpdated: "2 weeks ago",
    createdAt: "Dec 1, 2024",
    usedByWorkflows: 0,
    referencedInChat: false,
    tags: ["definitions", "sales", "marketing"],
  },
];

const Knowledge = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>(mockEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    let filtered = entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || entry.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "az") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "za") {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "oldest") {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [entries, searchQuery, categoryFilter, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: entries.length };
    entries.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [entries]);

  const handleView = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
    setDrawerOpen(true);
  };

  const handleEdit = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setEditorMode("edit");
    setEditorOpen(true);
    setDrawerOpen(false);
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setEditorMode("create");
    setEditorOpen(true);
  };

  const handleSave = (data: Partial<KnowledgeEntry>) => {
    if (editorMode === "create") {
      const newEntry: KnowledgeEntry = {
        id: crypto.randomUUID(),
        title: data.title || "",
        category: data.category || "general",
        content: data.content || "",
        preview: data.preview || "",
        lastUpdated: "Just now",
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        usedByWorkflows: 0,
        referencedInChat: false,
        tags: data.tags,
      };
      setEntries([newEntry, ...entries]);
      toast.success("Knowledge entry created");
    } else {
      setEntries(
        entries.map((e) =>
          e.id === data.id
            ? { ...e, ...data, lastUpdated: "Just now" }
            : e
        )
      );
      toast.success("Knowledge entry updated");
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setEntries(entries.filter((e) => e.id !== deleteId));
    setDeleteId(null);
    setDrawerOpen(false);
    toast.success("Knowledge entry deleted");
  };

  const handleDuplicate = (entry: KnowledgeEntry) => {
    const duplicate: KnowledgeEntry = {
      ...entry,
      id: crypto.randomUUID(),
      title: `${entry.title} (Copy)`,
      lastUpdated: "Just now",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      usedByWorkflows: 0,
      referencedInChat: false,
    };
    setEntries([duplicate, ...entries]);
    setDrawerOpen(false);
    toast.success("Knowledge entry duplicated");
  };

  const hasEntries = entries.length > 0;
  const hasFilteredEntries = filteredEntries.length > 0;

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Knowledge
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Store important information that Synth can use to automate your business.
          </p>
        </motion.div>

        <div className="flex gap-6">
          {/* Category Sidebar */}
          <KnowledgeCategorySidebar
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categoryCounts={categoryCounts}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Actions Bar */}
            <KnowledgeActionsBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onNewEntry={handleNewEntry}
            />

            {/* Content */}
            {!hasEntries ? (
              <KnowledgeEmptyState onCreateEntry={handleNewEntry} />
            ) : !hasFilteredEntries ? (
              <div className="text-center py-8 text-muted-foreground">
                No entries match your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredEntries.map((entry, idx) => (
                  <KnowledgeCard
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteId(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Drawer */}
        <KnowledgeDetailsDrawer
          entry={selectedEntry}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onEdit={handleEdit}
          onDelete={(id) => {
            setDrawerOpen(false);
            setDeleteId(id);
          }}
          onDuplicate={handleDuplicate}
        />

        {/* Editor Modal */}
        <KnowledgeEditorModal
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSave}
          entry={editingEntry}
          mode={editorMode}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Knowledge Entry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this entry? Synth will no longer have access to this information.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
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

export default Knowledge;
