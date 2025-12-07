import AppShell from "@/components/app/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StructuredContextSection from "@/components/knowledge/StructuredContextSection";
import UnstructuredKnowledgeSection from "@/components/knowledge/UnstructuredKnowledgeSection";
import BusinessRulesSection from "@/components/knowledge/BusinessRulesSection";
import GlossarySection from "@/components/knowledge/GlossarySection";
import FileUploadSection from "@/components/knowledge/FileUploadSection";
import KnowledgeSuggestions from "@/components/knowledge/KnowledgeSuggestions";
import KnowledgeBaseSection from "@/components/knowledge/KnowledgeBaseSection";
import { Database, FileText, BookOpen, List, Upload, Brain } from "lucide-react";

const Knowledge = () => {
  return (
    <AppShell>
      <div className="px-4 lg:px-6 py-4 lg:py-6 min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Knowledge Base
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
            Store and manage information for your workflows. The more context you provide, 
            the better Synth understands and automates your business processes.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="knowledge" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="knowledge" className="flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">Items</span>
                </TabsTrigger>
                <TabsTrigger value="structured" className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="unstructured" className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Notes</span>
                </TabsTrigger>
                <TabsTrigger value="rules" className="flex items-center gap-1.5">
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Rules</span>
                </TabsTrigger>
                <TabsTrigger value="glossary" className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Glossary</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Files</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="knowledge">
                <KnowledgeBaseSection />
              </TabsContent>

              <TabsContent value="structured">
                <StructuredContextSection />
              </TabsContent>

              <TabsContent value="unstructured">
                <UnstructuredKnowledgeSection />
              </TabsContent>

              <TabsContent value="rules">
                <BusinessRulesSection />
              </TabsContent>

              <TabsContent value="glossary">
                <GlossarySection />
              </TabsContent>

              <TabsContent value="files">
                <FileUploadSection />
              </TabsContent>
            </Tabs>
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:w-80 shrink-0">
            <KnowledgeSuggestions />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Knowledge;
