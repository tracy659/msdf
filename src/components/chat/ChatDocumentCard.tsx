"use client";

import { motion } from "framer-motion";
import { FileText, Eye, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatDocumentCardProps {
  file: File;
  uploadedAt?: Date;
  onView: () => void;
  onDownload: () => void;
}

export function ChatDocumentCard({
  file,
  uploadedAt,
  onView,
  onDownload,
}: ChatDocumentCardProps) {
  const { language, isRTL } = useLanguage();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        group relative
        min-h-[180px]
        rounded-xl border border-border
        bg-card shadow-sm
        hover:shadow-md transition-all
        flex flex-col
      "
    >
      {/* FILE TYPE BADGE */}
      <div className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-md bg-primary/10 text-primary">
        {file.type === "application/pdf"
          ? "PDF"
          : file.type.split("/")[1]?.toUpperCase()}
      </div>

      {/* TITLE */}
      <div className={`px-4 pt-4 ${isRTL ? "text-right" : "text-left"}`}>
        <h3 className="font-semibold text-sm truncate" title={file.name}>
          {file.name}
        </h3>
      </div>

      {/* CONTENT */}
      <div
        className={`flex gap-3 px-4 pt-3 flex-1 ${
          isRTL ? "flex-row-reverse text-right" : ""
        }`}
      >
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
            {uploadedAt && ` • ${uploadedAt.toLocaleTimeString()}`}
          </p>
        </div>
      </div>

      {/* ACTIONS (ALWAYS TAKE SPACE, FADE IN) */}
      <div
        className="
          px-4 py-3 mt-auto
          border-t border-border
          bg-muted/40
          flex items-center justify-end gap-4
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-200
        "
      >
        <button
          onClick={onView}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Eye className="w-4 h-4" />
          {language === "ar" ? "عرض" : "View"}
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Download className="w-4 h-4" />
          {language === "ar" ? "حفظ" : "Save"}
        </button>
      </div>
    </motion.div>
  );
}
