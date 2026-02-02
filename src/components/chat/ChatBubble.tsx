import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadedDocument } from "@/lib/types";
import {
  Download,
  Eye,
  File,
  FileText,
  Image,
  Maximize2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatDocumentCard } from "./ChatDocumentCard";

interface FileAttachment {
  id: string;
  file: File;
  preview?: string;
}

interface ChatBubbleProps {
  role: "user" | "agent";
  content: string;
  timestamp: string;
  attachments?: UploadedDocument[];
  fileAttachments?: FileAttachment[];
}

// Helper function to parse markdown content (links and bold text)
function parseMarkdownContent(content: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];

  // First, handle markdown links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  const matches: Array<{
    text: string;
    url: string;
    index: number;
    length: number;
  }> = [];

  while ((match = linkRegex.exec(content)) !== null) {
    matches.push({
      text: match[1],
      url: match[2],
      index: match.index,
      length: match[0].length,
    });
  }

  // Process matches and build parts
  let currentIndex = 0;

  matches.forEach(({ text, url, index }) => {
    // Add text before link
    if (index > currentIndex) {
      parts.push(content.substring(currentIndex, index));
    }

    // Add the link
    parts.push(
      <a
        key={`link-${index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 hover:underline font-medium break-all"
      >
        {text}
      </a>,
    );

    currentIndex = index + text.length + url.length + 4; // [text](url) = 4 extra chars
  });

  // Add remaining text
  if (currentIndex < content.length) {
    parts.push(content.substring(currentIndex));
  }

  // If no links found, return original content
  if (parts.length === 0) {
    parts.push(content);
  }

  return parts;
}

// Helper to format text with bold
function formatMessageContent(content: string): (string | JSX.Element)[] {
  const linkedContent = parseMarkdownContent(content);
  const parts: (string | JSX.Element)[] = [];

  linkedContent.forEach((part, idx) => {
    if (typeof part === "string") {
      const boldRegex = /\*\*([^*]+)\*\*/g;

      let boldMatch;
      const boldMatches: Array<{
        text: string;
        index: number;
        length: number;
      }> = [];

      while ((boldMatch = boldRegex.exec(part)) !== null) {
        boldMatches.push({
          text: boldMatch[1],
          index: boldMatch.index,
          length: boldMatch[0].length,
        });
      }

      if (boldMatches.length === 0) {
        parts.push(part);
      } else {
        let currIdx = 0;
        boldMatches.forEach(({ text, index }) => {
          if (index > currIdx) {
            parts.push(part.substring(currIdx, index));
          }
          parts.push(
            <strong key={`bold-${idx}-${index}`} className="font-bold">
              {text}
            </strong>,
          );
          currIdx = index + text.length + 4; // **text** = 4 extra chars
        });

        if (currIdx < part.length) {
          parts.push(part.substring(currIdx));
        }
      }
    } else {
      parts.push(part);
    }
  });

  return parts;
}

export const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ role, content, timestamp, attachments, fileAttachments }, ref) => {
    const { language, isRTL } = useLanguage();
    const isUser = role === "user";
    const [selectedFile, setSelectedFile] = useState<FileAttachment | null>(
      null,
    );

    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return format(date, "HH:mm", { locale: language === "ar" ? ar : enUS });
    };

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
    const hasText = content.trim().length > 0;
    const hasFiles = fileAttachments && fileAttachments.length > 0;

    return (
      <>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex w-full ${isUser ? "justify-start" : "justify-end"}`}
        >
          <div className={`max-w-[80%] ${isUser ? "order-1" : "order-1"}`}>
            {/* Message bubble */}
            {hasText && (
              <div
                className={isUser ? "chat-bubble-user" : "chat-bubble-agent"}
              >
                {/* <p className="text-md md:text-base whitespace-pre-wrap"> */}
                <p className="text-md md:text-base whitespace-pre-wrap leading-relaxed">
                  {formatMessageContent(content)}
                </p>
              </div>
            )}

            {/* Legacy Attachments */}
            {attachments && attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((doc) => {
                  const DocIcon = getFileIcon(doc.type);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 p-2 bg-white/10 rounded-lg"
                    >
                      <DocIcon className="w-4 h-4" />
                      <span className="text-sm truncate">{doc.name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* File Attachments with Preview */}
            {/* {fileAttachments && fileAttachments.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {fileAttachments.map((file) => {
                    const FileIcon = getFileIcon(file.file.type);
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative bg-white/10 rounded-lg overflow-hidden cursor-pointer hover:bg-white/20 transition-colors"
                        onClick={() => setSelectedFile(file)}
                      >
                        {file.preview ? (
                          <div className="relative h-20">
                            <img
                              src={file.preview}
                              alt={file.file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-20 flex items-center justify-center bg-white/5">
                            <FileIcon className="w-8 h-8 text-white/70" />
                          </div>
                        )}
                        <div className="p-2">
                          <p className="text-xs font-medium truncate text-white/90">
                            {file.file.name}
                          </p>
                          <p className="text-xs text-white/60">
                            {formatFileSize(file.file.size)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )} */}
            {/* File Attachments – Sidebar Style */}
            {/* File Attachments – 2 Columns, Custom Background */}
            {fileAttachments && fileAttachments.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <AnimatePresence>
                  {fileAttachments.map((file) => {
                    const isImage = file.file.type.startsWith("image/");
                    const fileTypeLabel =
                      file.file.type === "application/pdf"
                        ? "PDF"
                        : file.file.type.split("/")[1]?.toUpperCase() || "FILE";

                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedFile(file)}
                        className="group relative rounded-xl 
              border border-[rgba(139,24,53,0.25)]
              bg-[rgba(139,24,53,0.1)]
              p-4 shadow-sm hover:shadow-md 
              transition-all cursor-pointer overflow-hidden"
                      >
                        {/* File type badge */}
                        <div
                          className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-md 
              bg-white/60 text-[rgba(139,24,53,0.9)]"
                        >
                          {fileTypeLabel}
                        </div>

                        {/* File info */}
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-white/60 flex items-center justify-center">
                            {isImage ? (
                              <Image className="w-6 h-6 text-[rgba(139,24,53,0.9)]" />
                            ) : (
                              <FileText className="w-6 h-6 text-[rgba(139,24,53,0.9)]" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pr-8">
                            <p className="font-semibold text-foreground truncate">
                              {file.file.name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatFileSize(file.file.size)}
                            </p>
                          </div>
                        </div>

                        {/* Hover actions */}
                        <div
                          className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
              flex items-center gap-4 border-t border-[rgba(139,24,53,0.2)] pt-2"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(file);
                            }}
                            className="flex items-center gap-2 text-[rgba(139,24,53,0.9)] hover:opacity-80 transition"
                          >
                            <Eye className="w-4 h-4" />
                            {language === "ar" ? "عرض" : "View"}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const url = URL.createObjectURL(file.file);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = file.file.name;
                              a.click();
                            }}
                            className="flex items-center gap-2 text-[rgba(139,24,53,0.9)] hover:opacity-80 transition"
                          >
                            <Download className="w-4 h-4" />
                            {language === "ar" ? "حفظ" : "Save"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Timestamp */}
            <p
              className={`text-xs text-muted-foreground mt-1 ${isUser ? "text-start" : "text-end"}`}
            >
              {formatTime(timestamp)}
            </p>
          </div>
        </motion.div>

        {/* File Preview Dialog */}
        <Dialog
          open={!!selectedFile}
          onOpenChange={() => setSelectedFile(null)}
        >
          <DialogContent className="max-w-3xl h-[70vh] flex flex-col p-0">
            <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                {selectedFile?.file.type.startsWith("image/") ? (
                  <Image className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
                <DialogTitle className="truncate">
                  {selectedFile?.file.name}
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-4">
              {selectedFile && (
                <>
                  {selectedFile.file.type.startsWith("image/") &&
                  selectedFile.preview ? (
                    <img
                      src={selectedFile.preview}
                      alt={selectedFile.file.name}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-foreground mb-2">
                        {selectedFile.file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.file.size)}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);

ChatBubble.displayName = "ChatBubble";

// Typing indicator for the agent
export const TypingIndicator = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex justify-end">
      <div className="chat-bubble-agent flex gap-1 items-center py-4 px-5">
        <span
          className="w-2 h-2 bg-foreground/40 rounded-full animate-typing-dot"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 bg-foreground/40 rounded-full animate-typing-dot"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="w-2 h-2 bg-foreground/40 rounded-full animate-typing-dot"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";
