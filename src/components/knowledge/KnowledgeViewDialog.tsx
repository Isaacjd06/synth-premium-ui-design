import { 
  FileText, 
  Link2, 
  Code, 
  Database, 
  FileCode, 
  File,
  Pencil, 
  Trash2,
  Calendar,
  Tag
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { KnowledgeItem } from "./KnowledgeItemCard";

const typeIcons: Record<string, React.ElementType> = {
  "Document": FileText,
  "URL": Link2,
  "Text": File,
  "Code": Code,
  "Database Schema": Database,
  "API Documentation": FileCode,
  "Other": File,
};

const typeColors: Record<string, string> = {
  "Document": "bg-blue-500/20 text-blue-400",
  "URL": "bg-green-500/20 text-green-400",
  "Text": "bg-purple-500/20 text-purple-400",
  "Code": "bg-yellow-500/20 text-yellow-400",
  "Database Schema": "bg-orange-500/20 text-orange-400",
  "API Documentation": "bg-pink-500/20 text-pink-400",
  "Other": "bg-muted text-muted-foreground",
};

interface KnowledgeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: KnowledgeItem | null;
  onEdit: (item: KnowledgeItem) => void;
  onDelete: (item: KnowledgeItem) => void;
}

const KnowledgeViewDialog = ({ open, onOpenChange, item, onEdit, onDelete }: KnowledgeViewDialogProps) => {
  if (!item) return null;

  const Icon = typeIcons[item.type] || File;
  const colorClass = typeColors[item.type] || typeColors["Other"];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg shrink-0 ${colorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl mb-2">{item.title}</DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={colorClass}>
                  {item.type}
                </Badge>
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4 py-4">
            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Content</h4>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {item.content}
                </pre>
              </div>
            </div>

            {/* Metadata */}
            {item.metadata && Object.keys(item.metadata).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Metadata</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg border border-border bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">{key}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3" />
                  Created
                </div>
                <p className="text-sm font-medium text-foreground">{formatDate(item.createdAt)}</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3" />
                  Last Updated
                </div>
                <p className="text-sm font-medium text-foreground">{formatDate(item.updatedAt)}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              onEdit(item);
            }}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onDelete(item);
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeViewDialog;
