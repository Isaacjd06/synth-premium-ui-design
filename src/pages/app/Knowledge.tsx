import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, FileText, Database, BookMarked, Shield, Upload } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Components
import KnowledgeGeneralCard, { GeneralKnowledgeItem } from "@/components/knowledge/KnowledgeGeneralCard";
import GeneralKnowledgeEditor from "@/components/knowledge/GeneralKnowledgeEditor";
import KnowledgeViewerDrawer from "@/components/knowledge/KnowledgeViewerDrawer";
import FileUploadArea from "@/components/knowledge/FileUploadArea";
import KnowledgeFileItem, { UploadedFile } from "@/components/knowledge/KnowledgeFileItem";
import FileMetadataModal from "@/components/knowledge/FileMetadataModal";
import StructuredItemCard, { StructuredDataItem } from "@/components/knowledge/StructuredItemCard";
import StructuredDataEditor from "@/components/knowledge/StructuredDataEditor";
import GlossaryEntryCard, { GlossaryEntry } from "@/components/knowledge/GlossaryEntryCard";
import GlossaryEditorModal from "@/components/knowledge/GlossaryEditorModal";
import BusinessRuleCard, { BusinessRule } from "@/components/knowledge/BusinessRuleCard";
import BusinessRuleModal from "@/components/knowledge/BusinessRuleModal";
import KnowledgeTabEmptyState from "@/components/knowledge/KnowledgeTabEmptyState";

// Mock Data
const mockGeneralItems: GeneralKnowledgeItem[] = [
  { id: "1", title: "Company Refund Policy", type: "text", content: "Full refunds within 30 days...", preview: "Full refunds within 30 days of purchase. Partial refunds available up to 60 days.", updatedAt: "2 hours ago" },
  { id: "2", title: "Sales Process Documentation", type: "markdown", content: "# Sales Process\n\n## Step 1: Qualification...", preview: "Detailed markdown documentation for the sales qualification process.", updatedAt: "1 day ago" },
  { id: "3", title: "API Documentation", type: "url", content: "Link to our external API docs", preview: "Reference to external API documentation.", url: "https://docs.example.com/api", updatedAt: "3 days ago" },
  { id: "4", title: "Employee Handbook", type: "file", content: "Uploaded PDF file", preview: "Complete employee handbook with policies and procedures.", fileUrl: "/files/handbook.pdf", updatedAt: "1 week ago" },
];

const mockFiles: UploadedFile[] = [
  { id: "1", name: "employee_handbook.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "Jan 10, 2025", fileUrl: "/files/handbook.pdf", mimeType: "application/pdf" },
  { id: "2", name: "product_catalog.csv", type: "csv", size: "156 KB", uploadedAt: "Jan 8, 2025", fileUrl: "/files/catalog.csv", mimeType: "text/csv" },
  { id: "3", name: "onboarding_guide.docx", type: "docx", size: "1.1 MB", uploadedAt: "Jan 5, 2025", fileUrl: "/files/onboarding.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
];

const mockStructured: StructuredDataItem[] = [
  { id: "1", type: "company_info", name: "Synth Inc.", preview: "AI automation platform company", data: { name: "Synth Inc.", industry: "Technology", description: "AI-powered workflow automation" }, updatedAt: "2 days ago" },
  { id: "2", type: "product", name: "Synth Pro", preview: "Enterprise automation plan", data: { name: "Synth Pro", price: "$149/mo", features: "Unlimited workflows, priority support" }, updatedAt: "1 week ago" },
  { id: "3", type: "team_member", name: "Jane Doe", preview: "Head of Sales", data: { name: "Jane Doe", role: "Head of Sales", email: "jane@synth.io" }, updatedAt: "3 days ago" },
  { id: "4", type: "tool", name: "Slack", preview: "Team communication", data: { name: "Slack", purpose: "Team messaging", usage: "Send notifications and updates" }, updatedAt: "5 days ago" },
];

const mockGlossary: GlossaryEntry[] = [
  { id: "1", term: "MQL", definition: "Marketing Qualified Lead - A lead that has shown interest through marketing activities.", updatedAt: "1 day ago" },
  { id: "2", term: "SQL", definition: "Sales Qualified Lead - A lead vetted by sales and ready for direct follow-up.", updatedAt: "2 days ago" },
  { id: "3", term: "ARR", definition: "Annual Recurring Revenue - Total yearly revenue from subscriptions.", updatedAt: "1 week ago" },
];

const mockRules: BusinessRule[] = [
  { id: "1", content: "Always send a welcome email within 1 hour of signup.", priority: "high", updatedAt: "1 day ago" },
  { id: "2", content: "Leads from enterprise accounts should be routed to the senior sales team.", priority: "high", updatedAt: "3 days ago" },
  { id: "3", content: "Archive inactive leads after 90 days of no activity.", priority: "medium", updatedAt: "1 week ago" },
  { id: "4", content: "Log all customer interactions to the CRM.", priority: "low", updatedAt: "2 weeks ago" },
];

const Knowledge = () => {
  // General Knowledge State
  const [generalItems, setGeneralItems] = useState<GeneralKnowledgeItem[]>(mockGeneralItems);
  const [selectedGeneral, setSelectedGeneral] = useState<GeneralKnowledgeItem | null>(null);
  const [generalEditorOpen, setGeneralEditorOpen] = useState(false);
  const [generalViewerOpen, setGeneralViewerOpen] = useState(false);
  const [generalMode, setGeneralMode] = useState<"create" | "edit">("create");

  // Files State
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [fileMetadataOpen, setFileMetadataOpen] = useState(false);

  // Structured Data State
  const [structuredItems, setStructuredItems] = useState<StructuredDataItem[]>(mockStructured);
  const [selectedStructured, setSelectedStructured] = useState<StructuredDataItem | null>(null);
  const [structuredEditorOpen, setStructuredEditorOpen] = useState(false);
  const [structuredMode, setStructuredMode] = useState<"create" | "edit">("create");

  // Glossary State
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>(mockGlossary);
  const [selectedGlossary, setSelectedGlossary] = useState<GlossaryEntry | null>(null);
  const [glossaryEditorOpen, setGlossaryEditorOpen] = useState(false);
  const [glossaryMode, setGlossaryMode] = useState<"create" | "edit">("create");

  // Business Rules State
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>(mockRules);
  const [selectedRule, setSelectedRule] = useState<BusinessRule | null>(null);
  const [ruleEditorOpen, setRuleEditorOpen] = useState(false);
  const [ruleMode, setRuleMode] = useState<"create" | "edit">("create");

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"general" | "file" | "structured" | "glossary" | "rule" | null>(null);

  // Handlers
  const handleSaveGeneral = (data: Partial<GeneralKnowledgeItem>) => {
    if (generalMode === "create") {
      const newItem: GeneralKnowledgeItem = {
        id: crypto.randomUUID(),
        title: data.title || "",
        type: data.type || "text",
        content: data.content || "",
        preview: data.preview || "",
        url: data.url,
        fileUrl: data.fileUrl,
        updatedAt: "Just now",
      };
      setGeneralItems([newItem, ...generalItems]);
      toast.success("Knowledge item created");
    } else {
      setGeneralItems(generalItems.map((i) => (i.id === data.id ? { ...i, ...data, updatedAt: "Just now" } : i)));
      toast.success("Knowledge item updated");
    }
  };

  const handleUpload = (uploadedFiles: File[]) => {
    const newFiles: UploadedFile[] = uploadedFiles.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.name.split(".").pop()?.toLowerCase() as UploadedFile["type"],
      size: `${(f.size / 1024).toFixed(1)} KB`,
      uploadedAt: "Just now",
      fileUrl: `/files/${f.name}`,
      mimeType: f.type,
    }));
    setFiles([...newFiles, ...files]);
    toast.success(`${uploadedFiles.length} file(s) uploaded`);
  };

  const handleSaveStructured = (items: Partial<StructuredDataItem>[]) => {
    if (structuredMode === "create") {
      const newItems: StructuredDataItem[] = items.map((i) => ({
        id: crypto.randomUUID(),
        type: i.type!,
        name: i.name || "",
        preview: i.preview || "",
        data: i.data || {},
        updatedAt: "Just now",
      }));
      setStructuredItems([...newItems, ...structuredItems]);
      toast.success("Structured data added");
    } else {
      setStructuredItems(structuredItems.map((i) => (i.id === items[0]?.id ? { ...i, ...items[0], updatedAt: "Just now" } : i)));
      toast.success("Structured data updated");
    }
  };

  const handleSaveGlossary = (data: Partial<GlossaryEntry>) => {
    if (glossaryMode === "create") {
      const newEntry: GlossaryEntry = { id: crypto.randomUUID(), term: data.term || "", definition: data.definition || "", updatedAt: "Just now" };
      setGlossaryEntries([newEntry, ...glossaryEntries]);
      toast.success("Term added");
    } else {
      setGlossaryEntries(glossaryEntries.map((e) => (e.id === data.id ? { ...e, ...data, updatedAt: "Just now" } : e)));
      toast.success("Term updated");
    }
  };

  const handleSaveRule = (data: Partial<BusinessRule>) => {
    if (ruleMode === "create") {
      const newRule: BusinessRule = { id: crypto.randomUUID(), content: data.content || "", priority: data.priority || "medium", updatedAt: "Just now" };
      setBusinessRules([newRule, ...businessRules]);
      toast.success("Rule added");
    } else {
      setBusinessRules(businessRules.map((r) => (r.id === data.id ? { ...r, ...data, updatedAt: "Just now" } : r)));
      toast.success("Rule updated");
    }
  };

  const handleDelete = () => {
    if (!deleteId || !deleteType) return;
    switch (deleteType) {
      case "general":
        setGeneralItems(generalItems.filter((i) => i.id !== deleteId));
        break;
      case "file":
        setFiles(files.filter((f) => f.id !== deleteId));
        break;
      case "structured":
        setStructuredItems(structuredItems.filter((i) => i.id !== deleteId));
        break;
      case "glossary":
        setGlossaryEntries(glossaryEntries.filter((e) => e.id !== deleteId));
        break;
      case "rule":
        setBusinessRules(businessRules.filter((r) => r.id !== deleteId));
        break;
    }
    setDeleteId(null);
    setDeleteType(null);
    toast.success("Item deleted");
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Knowledge</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Store structured information that Synth uses for automation and reasoning.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="general" className="text-xs sm:text-sm">
              <FileText className="w-4 h-4 mr-1.5 hidden sm:block" />General
            </TabsTrigger>
            <TabsTrigger value="files" className="text-xs sm:text-sm">
              <Upload className="w-4 h-4 mr-1.5 hidden sm:block" />Files
            </TabsTrigger>
            <TabsTrigger value="structured" className="text-xs sm:text-sm">
              <Database className="w-4 h-4 mr-1.5 hidden sm:block" />Structured
            </TabsTrigger>
            <TabsTrigger value="glossary" className="text-xs sm:text-sm">
              <BookMarked className="w-4 h-4 mr-1.5 hidden sm:block" />Glossary
            </TabsTrigger>
            <TabsTrigger value="rules" className="text-xs sm:text-sm">
              <Shield className="w-4 h-4 mr-1.5 hidden sm:block" />Rules
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <div className="flex justify-end mb-4">
              <Button onClick={() => { setSelectedGeneral(null); setGeneralMode("create"); setGeneralEditorOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />New Item
              </Button>
            </div>
            {generalItems.length === 0 ? (
              <KnowledgeTabEmptyState
                icon={FileText}
                title="No Knowledge Items"
                description="Add text, markdown, URLs, or files that Synth can reference."
                buttonLabel="Add First Item"
                onAction={() => { setGeneralMode("create"); setGeneralEditorOpen(true); }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {generalItems.map((item, idx) => (
                  <KnowledgeGeneralCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onView={(i) => { setSelectedGeneral(i); setGeneralViewerOpen(true); }}
                    onEdit={(i) => { setSelectedGeneral(i); setGeneralMode("edit"); setGeneralEditorOpen(true); }}
                    onDelete={(id) => { setDeleteId(id); setDeleteType("general"); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <FileUploadArea onUpload={handleUpload} />
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-foreground">Uploaded Files</h3>
                {files.map((file, idx) => (
                  <KnowledgeFileItem
                    key={file.id}
                    file={file}
                    index={idx}
                    onViewMetadata={(f) => { setSelectedFile(f); setFileMetadataOpen(true); }}
                    onDelete={(id) => { setDeleteId(id); setDeleteType("file"); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Structured Data Tab */}
          <TabsContent value="structured">
            <div className="flex justify-end mb-4">
              <Button onClick={() => { setSelectedStructured(null); setStructuredMode("create"); setStructuredEditorOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />New Structured Item
              </Button>
            </div>
            {structuredItems.length === 0 ? (
              <KnowledgeTabEmptyState
                icon={Database}
                title="No Structured Data"
                description="Add company info, products, team members, or tools."
                buttonLabel="Add Structured Data"
                onAction={() => { setStructuredMode("create"); setStructuredEditorOpen(true); }}
              />
            ) : (
              <div className="space-y-3">
                {structuredItems.map((item, idx) => (
                  <StructuredItemCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onView={() => {}}
                    onEdit={(i) => { setSelectedStructured(i); setStructuredMode("edit"); setStructuredEditorOpen(true); }}
                    onDelete={(id) => { setDeleteId(id); setDeleteType("structured"); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Glossary Tab */}
          <TabsContent value="glossary">
            <div className="flex justify-end mb-4">
              <Button onClick={() => { setSelectedGlossary(null); setGlossaryMode("create"); setGlossaryEditorOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />Add Term
              </Button>
            </div>
            {glossaryEntries.length === 0 ? (
              <KnowledgeTabEmptyState
                icon={BookMarked}
                title="No Glossary Terms"
                description="Define terms and acronyms that Synth should understand."
                buttonLabel="Add First Term"
                onAction={() => { setGlossaryMode("create"); setGlossaryEditorOpen(true); }}
              />
            ) : (
              <div className="space-y-3">
                {glossaryEntries.map((entry, idx) => (
                  <GlossaryEntryCard
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    onEdit={(e) => { setSelectedGlossary(e); setGlossaryMode("edit"); setGlossaryEditorOpen(true); }}
                    onDelete={(id) => { setDeleteId(id); setDeleteType("glossary"); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Business Rules Tab */}
          <TabsContent value="rules">
            <div className="flex justify-end mb-4">
              <Button onClick={() => { setSelectedRule(null); setRuleMode("create"); setRuleEditorOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />New Rule
              </Button>
            </div>
            {businessRules.length === 0 ? (
              <KnowledgeTabEmptyState
                icon={Shield}
                title="No Business Rules"
                description="Define rules and constraints that Synth should follow."
                buttonLabel="Add First Rule"
                onAction={() => { setRuleMode("create"); setRuleEditorOpen(true); }}
              />
            ) : (
              <div className="space-y-3">
                {businessRules.map((rule, idx) => (
                  <BusinessRuleCard
                    key={rule.id}
                    rule={rule}
                    index={idx}
                    onEdit={(r) => { setSelectedRule(r); setRuleMode("edit"); setRuleEditorOpen(true); }}
                    onDelete={(id) => { setDeleteId(id); setDeleteType("rule"); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals and Drawers */}
        <GeneralKnowledgeEditor
          open={generalEditorOpen}
          onClose={() => setGeneralEditorOpen(false)}
          onSave={handleSaveGeneral}
          item={selectedGeneral}
          mode={generalMode}
        />

        <KnowledgeViewerDrawer
          item={selectedGeneral}
          open={generalViewerOpen}
          onClose={() => setGeneralViewerOpen(false)}
          onEdit={(i) => { setGeneralViewerOpen(false); setSelectedGeneral(i); setGeneralMode("edit"); setGeneralEditorOpen(true); }}
          onDelete={(id) => { setGeneralViewerOpen(false); setDeleteId(id); setDeleteType("general"); }}
        />

        <FileMetadataModal
          file={selectedFile}
          open={fileMetadataOpen}
          onClose={() => setFileMetadataOpen(false)}
        />

        <StructuredDataEditor
          open={structuredEditorOpen}
          onClose={() => setStructuredEditorOpen(false)}
          onSave={handleSaveStructured}
          item={selectedStructured}
          mode={structuredMode}
        />

        <GlossaryEditorModal
          open={glossaryEditorOpen}
          onClose={() => setGlossaryEditorOpen(false)}
          onSave={handleSaveGlossary}
          entry={selectedGlossary}
          mode={glossaryMode}
        />

        <BusinessRuleModal
          open={ruleEditorOpen}
          onClose={() => setRuleEditorOpen(false)}
          onSave={handleSaveRule}
          rule={selectedRule}
          mode={ruleMode}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId && !!deleteType} onOpenChange={() => { setDeleteId(null); setDeleteType(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
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
