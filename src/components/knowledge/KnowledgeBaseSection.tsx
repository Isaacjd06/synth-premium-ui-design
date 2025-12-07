import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Loader2,
  FileText,
  Link2,
  Code,
  Database,
  BookOpen,
  Tag,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface KnowledgeItem {
  id: string;
  title: string;
  type: "document" | "url" | "text" | "code" | "database_schema" | "api_documentation" | "other";
  content: string;
  tags: string[];
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const typeOptions = [
  { value: "document", label: "Document", icon: FileText },
  { value: "url", label: "URL", icon: Link2 },
  { value: "text", label: "Text", icon: BookOpen },
  { value: "code", label: "Code", icon: Code },
  { value: "database_schema", label: "Database Schema", icon: Database },
  { value: "api_documentation", label: "API Documentation", icon: BookOpen },
  { value: "other", label: "Other", icon: FileText },
];

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "Customer Onboarding SOP",
    type: "document",
    content: "This document outlines the standard operating procedure for onboarding new customers. It includes steps for initial setup, account configuration, and training sessions.",
    tags: ["onboarding", "customers", "SOP"],
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-12T14:30:00Z",
  },
  {
    id: "2",
    title: "API Integration Guide",
    type: "api_documentation",
    content: "Complete guide for integrating with our REST API. Includes authentication, endpoints, rate limits, and code examples.",
    tags: ["api", "integration", "technical"],
    createdAt: "2025-01-08T09:00:00Z",
    updatedAt: "2025-01-08T09:00:00Z",
  },
  {
    id: "3",
    title: "Product Database Schema",
    type: "database_schema",
    content: "CREATE TABLE products (\n  id UUID PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  price DECIMAL(10,2),\n  category VARCHAR(100)\n);",
    tags: ["database", "schema", "products"],
    createdAt: "2025-01-05T11:00:00Z",
    updatedAt: "2025-01-05T11:00:00Z",
  },
];

const KnowledgeBaseSection = () => {
  const [items, setItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<KnowledgeItem["type"]>("text");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const allTags = [...new Set(items.flatMap(item => item.tags))];

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesTag = filterTag === "all" || item.tags.includes(filterTag);
    
    return matchesSearch && matchesType && matchesTag;
  });

  const resetForm = () => {
    setFormTitle("");
    setFormType("text");
    setFormContent("");
    setFormTags("");
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formTitle.trim()) errors.title = "Title is required";
    if (!formContent.trim()) errors.content = "Content is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    const newItem: KnowledgeItem = {
      id: crypto.randomUUID(),
      title: formTitle.trim(),
      type: formType,
      content: formContent.trim(),
      tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setItems([newItem, ...items]);
    setIsAddOpen(false);
    resetForm();
    setIsLoading(false);
    toast.success("Knowledge item added successfully");
  };

  const handleEdit = async () => {
    if (!selectedItem || !validateForm()) return;
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? {
            ...item,
            title: formTitle.trim(),
            type: formType,
            content: formContent.trim(),
            tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
            updatedAt: new Date().toISOString(),
          }
        : item
    ));
    
    setIsEditOpen(false);
    setSelectedItem(null);
    resetForm();
    setIsLoading(false);
    toast.success("Knowledge item updated successfully");
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    setItems(items.filter(item => item.id !== selectedItem.id));
    setIsDeleteOpen(false);
    setSelectedItem(null);
    setIsLoading(false);
    toast.success("Knowledge item deleted successfully");
  };

  const openEditModal = (item: KnowledgeItem) => {
    setSelectedItem(item);
    setFormTitle(item.title);
    setFormType(item.type);
    setFormContent(item.content);
    setFormTags(item.tags.join(", "));
    setIsEditOpen(true);
  };

  const openViewModal = (item: KnowledgeItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const openDeleteModal = (item: KnowledgeItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const getTypeIcon = (type: KnowledgeItem["type"]) => {
    const typeOption = typeOptions.find(t => t.value === type);
    const Icon = typeOption?.icon || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeLabel = (type: KnowledgeItem["type"]) => {
    return typeOptions.find(t => t.value === type)?.label || "Other";
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {typeOptions.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(filterType !== "all" || filterTag !== "all" || searchQuery) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => { setFilterType("all"); setFilterTag("all"); setSearchQuery(""); }}
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Knowledge Items Grid */}
      {filteredItems.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            {items.length === 0 ? (
              <>
                <h3 className="text-lg font-medium text-foreground mb-2">No Knowledge Items Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start building your knowledge base by adding your first item.
                </p>
                <Button onClick={() => setIsAddOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Knowledge Item
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-foreground mb-2">No Results Found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="border-border bg-card h-full hover:border-primary/30 transition-colors group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-muted text-primary">
                          {getTypeIcon(item.type)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openViewModal(item)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(item)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => openDeleteModal(item)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-foreground mb-2 line-clamp-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{item.content}</p>
                    
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Knowledge Item</DialogTitle>
            <DialogDescription>
              Add a new item to your knowledge base.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter a title..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className={formErrors.title ? "border-destructive" : ""}
              />
              {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as KnowledgeItem["type"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Enter the content..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className={`min-h-[150px] ${formErrors.content ? "border-destructive" : ""}`}
              />
              {formErrors.content && <p className="text-xs text-destructive">{formErrors.content}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., api, documentation, guide"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : "Add Knowledge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Item</DialogTitle>
            <DialogDescription>
              Update the knowledge item details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Title *</Label>
              <Input
                id="editTitle"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className={formErrors.title ? "border-destructive" : ""}
              />
              {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as KnowledgeItem["type"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editContent">Content *</Label>
              <Textarea
                id="editContent"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className={`min-h-[150px] ${formErrors.content ? "border-destructive" : ""}`}
              />
              {formErrors.content && <p className="text-xs text-destructive">{formErrors.content}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editTags">Tags (comma-separated)</Label>
              <Input
                id="editTags"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedItem && (
                <>
                  <div className="p-2 rounded bg-muted text-primary">
                    {getTypeIcon(selectedItem.type)}
                  </div>
                  {selectedItem.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getTypeLabel(selectedItem.type)}</Badge>
                {selectedItem.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-muted/30 whitespace-pre-wrap font-mono text-sm">
                {selectedItem.content}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Created: {new Date(selectedItem.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(selectedItem.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => { setIsViewOpen(false); if (selectedItem) openEditModal(selectedItem); }}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Knowledge Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KnowledgeBaseSection;
