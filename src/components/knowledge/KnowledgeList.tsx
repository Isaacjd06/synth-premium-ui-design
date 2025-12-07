import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter,
  FileText,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import KnowledgeItemCard, { type KnowledgeItem } from "./KnowledgeItemCard";
import KnowledgeFormDialog from "./KnowledgeFormDialog";
import KnowledgeViewDialog from "./KnowledgeViewDialog";

// Mock data
const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "Customer Support Guidelines",
    type: "Document",
    content: "Our customer support team should always greet customers warmly and address their concerns promptly. Key principles: 1) Listen actively to understand the issue. 2) Acknowledge the customer's frustration. 3) Provide clear solutions. 4) Follow up to ensure resolution.",
    tags: ["support", "guidelines", "customers"],
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-15T14:30:00Z",
  },
  {
    id: "2",
    title: "API Endpoints Reference",
    type: "API Documentation",
    content: "Base URL: https://api.example.com/v1\n\nGET /users - List all users\nPOST /users - Create a new user\nGET /users/:id - Get user by ID\nPUT /users/:id - Update user\nDELETE /users/:id - Delete user\n\nAuthentication: Bearer token required in Authorization header.",
    tags: ["api", "development", "reference"],
    metadata: { version: "1.0", author: "Engineering Team" },
    createdAt: "2025-01-08T09:00:00Z",
    updatedAt: "2025-01-08T09:00:00Z",
  },
  {
    id: "3",
    title: "Company Website",
    type: "URL",
    content: "https://www.example.com - Our main company website with product information, pricing, and contact details.",
    tags: ["website", "company"],
    createdAt: "2025-01-05T12:00:00Z",
    updatedAt: "2025-01-05T12:00:00Z",
  },
  {
    id: "4",
    title: "Database Schema - Users Table",
    type: "Database Schema",
    content: "CREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  name VARCHAR(100),\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);",
    tags: ["database", "schema", "users"],
    createdAt: "2025-01-03T08:00:00Z",
    updatedAt: "2025-01-12T16:00:00Z",
  },
];

const knowledgeTypes = ["All", "Document", "URL", "Text", "Code", "Database Schema", "API Documentation", "Other"];

const KnowledgeList = () => {
  const [items, setItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  
  // View dialog state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<KnowledgeItem | null>(null);
  
  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    setFormMode("add");
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = (item: KnowledgeItem) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: KnowledgeItem) => {
    setFormMode("edit");
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: KnowledgeItem) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 500));
    
    setItems(items.filter(i => i.id !== deleteTarget.id));
    setDeleteTarget(null);
    setIsDeleting(false);
    toast.success("Knowledge item deleted");
  };

  const handleSubmit = async (data: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">) => {
    await new Promise(r => setTimeout(r, 500));
    
    if (formMode === "add") {
      const newItem: KnowledgeItem = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setItems([newItem, ...items]);
      toast.success("Knowledge item added");
    } else if (editingItem) {
      setItems(items.map(i => 
        i.id === editingItem.id 
          ? { ...i, ...data, updatedAt: new Date().toISOString() }
          : i
      ));
      toast.success("Knowledge item updated");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {knowledgeTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Add Button */}
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        {(searchQuery || typeFilter !== "All") && " found"}
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 border-border bg-card">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <KnowledgeItemCard
                key={item.id}
                item={item}
                index={index}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          {items.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-2">No knowledge items yet</p>
              <p className="text-sm text-muted-foreground/70 mb-4">
                Add your first knowledge item to help Synth understand your business.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Knowledge Item
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-2">No matching items found</p>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search or filters
              </p>
            </>
          )}
        </motion.div>
      )}

      {/* Form Dialog */}
      <KnowledgeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        item={editingItem}
        onSubmit={handleSubmit}
      />

      {/* View Dialog */}
      <KnowledgeViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        item={viewingItem}
        onEdit={(item) => {
          setIsViewOpen(false);
          handleEdit(item);
        }}
        onDelete={(item) => {
          setIsViewOpen(false);
          handleDelete(item);
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Knowledge Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KnowledgeList;
