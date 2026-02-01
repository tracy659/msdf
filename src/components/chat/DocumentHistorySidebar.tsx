import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image,
  File,
  X,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Clock,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface UploadedDocumentHistory {
  id: string;
  file: File;
  preview?: string;
  uploadedAt: Date;
}

interface DocumentHistorySidebarProps {
  documents: UploadedDocumentHistory[];
  isOpen: boolean;
  onToggle: () => void;
  onRemove: (id: string) => void;
}

export function DocumentHistorySidebar({
  documents,
  isOpen,
  onToggle,
  onRemove,
}: DocumentHistorySidebarProps) {
  const { language, isRTL } = useLanguage();
  const [selectedDoc, setSelectedDoc] =
    useState<UploadedDocumentHistory | null>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type === "application/pdf") return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === "ar" ? "ar-QA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`h-full bg-card border-${isRTL ? "r" : "l"} border-border overflow-hidden flex-shrink-0`}
      >
        <div className="h-full flex flex-col w-[280px]">
          {/* Header */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  {language === "ar" ? "المستندات" : "Documents"}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {documents.length}
              </span>
            </div>
          </div>

          {/* Document List */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? "لا توجد مستندات" : "No documents yet"}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {documents.map((doc) => {
                    const DocIcon = getFileIcon(doc.file.type);
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        className="group relative bg-background rounded-lg border border-border p-3 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Preview Thumbnail */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {doc.preview ? (
                              <img
                                src={doc.preview}
                                alt={doc.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <DocIcon className="w-6 h-6 text-primary" />
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-foreground">
                              {doc.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatFileSize(doc.file.size)}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(doc.uploadedAt)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDoc(doc);
                              }}
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(doc.id);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>
        </div>
      </motion.div>

      {/* Toggle Button */}
      {/* <motion.button
        onClick={onToggle}
        className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-10 w-6 h-16 bg-primary text-primary-foreground rounded-${isRTL ? 'r' : 'l'}-lg flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        ) : (
          isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
        )}
      </motion.button> */}

      {/* Document Viewer Modal */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              {selectedDoc?.file.type.startsWith("image/") ? (
                <Image className="w-5 h-5 text-primary" />
              ) : (
                <FileText className="w-5 h-5 text-primary" />
              )}
              <DialogTitle className="truncate">
                {selectedDoc?.file.name}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-4">
            {selectedDoc && (
              <>
                {selectedDoc.file.type.startsWith("image/") &&
                selectedDoc.preview ? (
                  <img
                    src={selectedDoc.preview}
                    alt={selectedDoc.file.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                ) : selectedDoc.file.type === "application/pdf" ? (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      {selectedDoc.file.name}
                    </p>
                    <Button
                      onClick={() => {
                        const url = URL.createObjectURL(selectedDoc.file);
                        window.open(url, "_blank");
                      }}
                    >
                      {language === "ar" ? "فتح PDF" : "Open PDF"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                      <File className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {selectedDoc.file.name}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {selectedDoc && (
            <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {language === "ar" ? "النوع:" : "Type:"}{" "}
                {selectedDoc.file.type || "Unknown"}
              </span>
              <span className="text-muted-foreground">
                {language === "ar" ? "الحجم:" : "Size:"}{" "}
                {formatFileSize(selectedDoc.file.size)}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
