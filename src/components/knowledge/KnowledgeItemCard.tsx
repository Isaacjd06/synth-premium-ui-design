import { motion } from "framer-motion";
import { 
  FileText, 
  Link2, 
  Code, 
  Database, 
  FileCode, 
  File,
  Pencil, 
  Trash2, 
  Eye,
  MoreVertical
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface KnowledgeItem {
  id: string;
  title: string;
  type: "Document" | "URL" | "Text" | "Code" | "Database Schema" | "API Documentation" | "Other";
  content: string;
  tags: string[];
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

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
  "Document": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "URL": "bg-green-500/20 text-green-400 border-green-500/30",
  "Text": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Code": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Database Schema": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "API Documentation": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Other": "bg-muted text-muted-foreground border-border",
};

interface KnowledgeItemCardProps {
  item: KnowledgeItem;
  index?: number;
  onView: (item: KnowledgeItem) => void;
  onEdit: (item: KnowledgeItem) => void;
  onDelete: (item: KnowledgeItem) => void;
}

const KnowledgeItemCard = ({ item, index = 0, onView, onEdit, onDelete }: KnowledgeItemCardProps) => {
  const Icon = typeIcons[item.type] || File;
  const colorClass = typeColors[item.type] || typeColors["Other"];

  const truncateContent = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="p-4 border-border bg-card hover:border-primary/30 transition-colors group">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 
                className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                onClick={() => onView(item)}
              >
                {item.title}
              </h4>
              
              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem onClick={() => onView(item)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Type Badge */}
            <Badge variant="outline" className={`text-xs mb-2 ${colorClass}`}>
              {item.type}
            </Badge>
            
            {/* Content Preview */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {truncateContent(item.content)}
            </p>
            
            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Dates */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Created: {formatDate(item.createdAt)}</span>
              {item.updatedAt !== item.createdAt && (
                <>
                  <span className="text-border">•</span>
                  <span>Updated: {formatDate(item.updatedAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default KnowledgeItemCard;
