// import { useState, useRef, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Send,
//   Paperclip,
//   X,
//   Sparkles,
//   FileText,
//   Zap,
//   Upload,
//   Image,
//   File,
//   FolderOpen,
//   SendHorizontal,
// } from "lucide-react";
// import { useDropzone } from "react-dropzone";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useCases } from "@/contexts/CaseContext";
// import { ChatMessage, UploadedDocument } from "@/lib/types";
// import { ChatBubble, TypingIndicator } from "./ChatBubble";
// import { DocumentViewer } from "./DocumentViewer";
// import {
//   DocumentHistorySidebar,
//   UploadedDocumentHistory,
// } from "./DocumentHistorySidebar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { mockServices, generateCaseNumber } from "@/lib/mockData";
// import qatariAgentAvatar from "@/assets/qatari-agent-avatar.png";
// import { completeChat } from "@/services/chatCompletionService";
// import { BackendChatState } from "@/models/ChatCompletionModel";

// interface ChatInterfaceProps {
//   caseId?: string;
//   onCaseCreated?: (caseId: string) => void;
// }

// // Extended ChatMessage with file previews
// interface ChatMessageWithFiles extends ChatMessage {
//   fileAttachments?: {
//     id: string;
//     file: File;
//     preview?: string;
//   }[];
// }

// // AI Agent responses based on conversation flow
// const agentResponses = {
//   greeting: {
//     ar: "مرحبًا بك في بوابة الخدمات الإلكترونية! كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في:\n\n• المساعدة الاجتماعية\n• دعم الأسرة\n• رعاية كبار السن\n• خدمات ذوي الإعاقة\n• الدعم السكني\n• المساعدة الطارئة",
//     en: "Welcome to the E-Services Portal! How can I help you today? I can assist you with:\n\n• Social Assistance\n• Family Support\n• Elder Care\n• Disability Services\n• Housing Support\n• Emergency Aid",
//   },
//   serviceSelected: {
//     ar: "ممتاز! لقد اخترت خدمة {service}. دعني أسألك بعض الأسئلة لمعالجة طلبك.\n\nما هو سبب تقديمك لهذا الطلب؟",
//     en: "Excellent! You have selected {service}. Let me ask you a few questions to process your request.\n\nWhat is the reason for your application?",
//   },
//   documentsRequest: {
//     ar: "شكرًا على المعلومات. الآن يرجى إرفاق المستندات المطلوبة:\n\n• بطاقة الهوية\n• شهادة الراتب (إن وجدت)\n• أي مستندات داعمة\n\nيمكنك إرفاق الملفات باستخدام زر الإرفاق أدناه.",
//     en: "Thank you for the information. Now please attach the required documents:\n\n• ID Card\n• Salary Certificate (if available)\n• Any supporting documents\n\nYou can attach files using the attachment button below.",
//   },
//   documentsReceived: {
//     ar: "تم استلام المستندات بنجاح! جاري تحليل ومراجعة الملفات...\n\n✅ تم التحقق من صحة المستندات\n\nبناءً على المعلومات المقدمة، تم تسعير الخدمة مبدئيًا بمبلغ {price} ريال قطري.\n\nهل تريد تأكيد تقديم الطلب؟",
//     en: "Documents received successfully! Analyzing and reviewing files...\n\n✅ Documents verified\n\nBased on the information provided, the service is preliminarily priced at {price} QAR.\n\nWould you like to confirm submission?",
//   },
//   caseCreated: {
//     ar: 'تم تقديم طلبك بنجاح! 🎉\n\nرقم الطلب: {caseNumber}\n\nسيتم مراجعة طلبك من قبل الفريق المختص وسنقوم بإخطارك بأي تحديثات.\n\nيمكنك متابعة حالة طلبك من خلال صفحة "طلباتي".',
//     en: 'Your request has been submitted successfully! 🎉\n\nCase Number: {caseNumber}\n\nYour request will be reviewed by our team and we will notify you of any updates.\n\nYou can track your request status through "My Requests" page.',
//   },
//   fallback: {
//     ar: "أفهم. هل يمكنك تقديم المزيد من التفاصيل حول طلبك؟",
//     en: "I understand. Can you provide more details about your request?",
//   },
// };

// export function ChatInterface({ caseId, onCaseCreated }: ChatInterfaceProps) {
//   const { t, language, isRTL } = useLanguage();
//   const { currentCase, createCase, addMessage, addDocument } = useCases();
//   const [messages, setMessages] = useState<ChatMessageWithFiles[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [conversationState, setConversationState] = useState<
//     "greeting" | "selecting" | "details" | "documents" | "confirm" | "complete"
//   >("greeting");
//   const [selectedService, setSelectedService] = useState<string | null>(null);
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
//   const [documentHistory, setDocumentHistory] = useState<
//     UploadedDocumentHistory[]
//   >([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isDraggingOverChat, setIsDraggingOverChat] = useState(false);
//   const [apiMessages, setApiMessages] = useState<
//     { type: "user" | "assistant"; content: string }[]
//   >([]);
//   // const STATIC_CASE_ID = "CASE-1023";

//   const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());

//   // Map backend state to your frontend conversationState
//   const mapBackendStateToUI = (state: BackendChatState) => {
//     switch (state) {
//       case "AwaitingGreeting":
//         return "greeting";
//       case "AwaitingServiceSelection":
//         return "selecting";
//       case "AwaitingDetails":
//         return "details";
//       case "AwaitingDocuments":
//         return "documents";
//       case "AwaitingConfirmation":
//         return "confirm";
//       case "Completed":
//         return "complete";
//       default:
//         return "greeting";
//     }
//   };

//   // Helper to create preview for file
//   const createFilePreview = (file: File): string | undefined => {
//     if (file.type.startsWith("image/")) {
//       return URL.createObjectURL(file);
//     }
//     return undefined;
//   };

//   // Add files to history when sent
//   const addToDocumentHistory = (files: File[]) => {
//     const newDocs: UploadedDocumentHistory[] = files.map((file) => ({
//       // id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       id: crypto.randomUUID(),
//       file,
//       preview: createFilePreview(file),
//       uploadedAt: new Date(),
//     }));
//     setDocumentHistory((prev) => [...newDocs, ...prev]);
//   };

//   // Dropzone configuration
//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     setAttachedFiles((prev) => [...prev, ...acceptedFiles]);
//     setIsDraggingOverChat(false);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/pdf": [".pdf"],
//       "image/*": [".png", ".jpg", ".jpeg"],
//     },
//     noClick: true,
//     onDragEnter: () => setIsDraggingOverChat(true),
//     onDragLeave: () => setIsDraggingOverChat(false),
//   });

//   const getFileIcon = (type: string) => {
//     if (type.startsWith("image/")) return Image;
//     if (type === "application/pdf") return FileText;
//     return File;
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
//   };
//   // const fetchFirstMessage = async () => {
//   //   const aiResponse = await completeChat({
//   //     messages: [
//   //       {
//   //         type: "user",
//   //         content: "",
//   //       },
//   //     ],
//   //     attachments: [],
//   //     question: "",
//   //     caseId: STATIC_CASE_ID,
//   //   });
//   //   return aiResponse;
//   // };
//   // Initialize with greeting
//   // useEffect(() => {

//   //   const greeting: ChatMessage = {
//   //     id: "greeting",
//   //     role: "agent",
//   //     content: agentResponses.greeting[language],
//   //     timestamp: new Date().toISOString(),
//   //   };
//   //   setMessages([greeting]);
//   // }, [language]);
//   // useEffect(() => {
//   //   const loadGreeting = async () => {
//   //     const greeting: ChatMessage = {
//   //       id: "greeting",
//   //       role: "agent",
//   //       content: await fetchFirstMessage(),
//   //       timestamp: new Date().toISOString(),
//   //     };

//   //     setMessages([greeting]);
//   //   };

//   //   loadGreeting();
//   // }, [language]);

//   // useEffect(() => {
//   //   setMessages([
//   //     {
//   //       id: "init",
//   //       role: "agent",
//   //       content: "",
//   //       timestamp: new Date().toISOString(),
//   //     },
//   //   ]);
//   // }, []);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   // Auto-scroll to bottom
//   // useEffect(() => {
//   //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   // }, [messages, isTyping]);
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;

//     container.scrollTo({
//       top: container.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages, isTyping]);

//   // const handleSendMessage = async () => {
//   //   if (!inputValue.trim() && attachedFiles.length === 0) return;

//   //   const userText = inputValue;

//   //   const userMessage: ChatMessageWithFiles = {
//   //     id: `msg-${Date.now()}`,
//   //     role: "user",
//   //     content: userText,
//   //     timestamp: new Date().toISOString(),
//   //   };

//   //   setMessages((prev) => [...prev, userMessage]);
//   //   setInputValue("");
//   //   setIsTyping(true);

//   //   const updatedApiMessages = [
//   //     ...apiMessages,
//   //     {
//   //       type: "user" as const,
//   //       content: userText,
//   //     },
//   //   ];

//   //   setApiMessages(updatedApiMessages);

//   //   try {
//   //     // const aiResponse = await completeChat({
//   //     //   messages: updatedApiMessages,
//   //     //   attachments: attachedFiles,
//   //     //   question: userText,
//   //     //   caseId: STATIC_CASE_ID,
//   //     // });

//   //     const aiResponse = await completeChat({
//   //       sessionId,
//   //       message: userText,
//   //       attachments: attachedFiles,
//   //     });

//   //     const agentMessage: ChatMessageWithFiles = {
//   //       id: `msg-${Date.now()}`,
//   //       role: "agent",
//   //       content: aiResponse,
//   //       timestamp: new Date().toISOString(),
//   //     };

//   //     setMessages((prev) => [...prev, agentMessage]);

//   //     setApiMessages((prev) => [
//   //       ...prev,
//   //       {
//   //         type: "assistant",
//   //         content: aiResponse,
//   //       },
//   //     ]);
//   //   } catch (error) {
//   //     console.error(error);
//   //   } finally {
//   //     setIsTyping(false);
//   //     setAttachedFiles([]);
//   //   }
//   // };

//   // const handleSendMessage = async () => {
//   //   if (!inputValue.trim() && attachedFiles.length === 0) return;

//   //   const userText = inputValue;

//   //   console.log("Attached files before send:", attachedFiles);
//   //   console.log("Files length:", attachedFiles.length);
//   //   // Add user message
//   //   setMessages((prev) => [
//   //     ...prev,
//   //     {
//   //       id: crypto.randomUUID(),
//   //       role: "user",
//   //       content: userText,
//   //       timestamp: new Date().toISOString(),
//   //     },
//   //   ]);

//   //   setInputValue("");
//   //   setIsTyping(true);

//   //   try {
//   //     const response: any = await completeChat({
//   //       sessionId,
//   //       message: userText,
//   //       attachments: attachedFiles,
//   //     });

//   //     // Map backend state to frontend UI
//   //     setConversationState(mapBackendStateToUI(response.state));

//   //     // Ensure message is a string before rendering
//   //     const agentMessageContent =
//   //       typeof response.message === "string"
//   //         ? response.message
//   //         : JSON.stringify(response.message);

//   //     setMessages((prev) => [
//   //       ...prev,
//   //       {
//   //         id: crypto.randomUUID(),
//   //         role: "agent",
//   //         content: agentMessageContent,
//   //         timestamp: new Date().toISOString(),
//   //       },
//   //     ]);
//   //     // Add to document history
//   //     addToDocumentHistory(attachedFiles);
//   //   } catch (err) {
//   //     console.error("Chat error:", err);
//   //   } finally {
//   //     setIsTyping(false);
//   //     setAttachedFiles([]);
//   //   }
//   // };
//   const handleSendMessage = async () => {
//     if (!inputValue.trim() && attachedFiles.length === 0) return;

//     const userText = inputValue;

//     // Create file attachments with previews
//     const fileAttachments = attachedFiles.map((file) => ({
//       id: crypto.randomUUID(),
//       file: file,
//       preview: createFilePreview(file),
//     }));

//     // Add user message WITH file attachments
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: crypto.randomUUID(),
//         role: "user",
//         content: userText,
//         timestamp: new Date().toISOString(),
//         fileAttachments: fileAttachments, // ← Add this
//       },
//     ]);

//     setInputValue("");
//     setAttachedFiles([]);
//     setIsTyping(true);

//     try {
//       const response: any = await completeChat({
//         sessionId,
//         message: userText,
//         attachments: attachedFiles,
//       });

//       setConversationState(mapBackendStateToUI(response.state));

//       const agentMessageContent =
//         typeof response.message === "string"
//           ? response.message
//           : JSON.stringify(response.message);

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: crypto.randomUUID(),
//           role: "agent",
//           content: agentMessageContent,
//           timestamp: new Date().toISOString(),
//         },
//       ]);

//       // Add files to document history
//       addToDocumentHistory(attachedFiles);
//     } catch (err) {
//       console.error("Chat error:", err);
//     } finally {
//       setIsTyping(false);
//       setAttachedFiles([]); // Clear after sending
//     }
//   };
//   const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setAttachedFiles((prev) => [...prev, ...files]);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleRemoveFromHistory = (id: string) => {
//     setDocumentHistory((prev) => prev.filter((doc) => doc.id !== id));
//   };

//   return (
//     <div className="flex h-full relative">
//       {/* Main Chat Area */}
//       <div
//         {...getRootProps()}
//         className="flex flex-col flex-1 h-full bg-card rounded-2xl border border-border overflow-hidden shadow-xl relative"
//       >
//         {/* Drag Overlay */}
//         <AnimatePresence>
//           {(isDragActive || isDraggingOverChat) && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-2xl flex items-center justify-center"
//             >
//               <div className="text-center">
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 1.5, repeat: Infinity }}
//                 >
//                   <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
//                 </motion.div>
//                 <p className="text-xl font-bold text-primary">
//                   {language === "ar" ? "أفلت الملفات هنا" : "Drop files here"}
//                 </p>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   {language === "ar" ? "PDF، PNG، JPG" : "PDF, PNG, JPG"}
//                 </p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <input {...getInputProps()} />

//         {/* Enhanced Chat Header */}
//         <div className="relative bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground px-5 py-4 overflow-hidden">
//           {/* Animated Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" />
//             <div
//               className="absolute bottom-0 right-0 w-24 h-24 bg-accent/30 rounded-full blur-2xl animate-pulse"
//               style={{ animationDelay: "1s" }}
//             />
//           </div>

//           <div className="relative flex items-center gap-4">
//             {/* Qatari Agent Avatar */}
//             <motion.div
//               className="relative"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 200, damping: 15 }}
//             >
//               {/* Outer Maroon Glow Ring */}
//               <motion.div
//                 className="absolute inset-[-4px] rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//                 style={{
//                   background:
//                     "conic-gradient(from 0deg, hsl(344 72% 32%), hsl(344 72% 45%), hsl(43 74% 49%), hsl(344 72% 32%))",
//                   filter: "blur(4px)",
//                   opacity: 0.8,
//                 }}
//               />

//               {/* Main Avatar Container with Image */}
//               <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-xl border-2 border-accent/50">
//                 <img
//                   src={qatariAgentAvatar}
//                   alt="Qatari AI Assistant"
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Online Indicator with Qatari Gold */}
//               <motion.div
//                 className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-accent to-accent/80 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
//                 animate={{ scale: [1, 1.15, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               >
//                 <Zap className="w-2.5 h-2.5 text-accent-foreground" />
//               </motion.div>

//               {/* Orbiting Sparkle - Gold */}
//               <motion.div
//                 className="absolute -top-1 -left-1"
//                 animate={{
//                   rotate: 360,
//                   scale: [1, 1.2, 1],
//                 }}
//                 transition={{
//                   rotate: { duration: 5, repeat: Infinity, ease: "linear" },
//                   scale: { duration: 2, repeat: Infinity },
//                 }}
//               >
//                 <Sparkles className="w-4 h-4 text-accent drop-shadow-lg" />
//               </motion.div>
//             </motion.div>

//             {/* Agent Info */}
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <h3 className="font-bold text-lg">
//                   {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
//                 </h3>
//                 <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-medium rounded-full">
//                   {language === "ar" ? "ذكاء اصطناعي" : "AI Powered"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 mt-1">
//                 <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
//                 <p className="text-sm text-primary-foreground/80">
//                   {language === "ar"
//                     ? "متوفر على مدار الساعة للمساعدة"
//                     : "Available 24/7 to assist you"}
//                 </p>
//               </div>
//             </div>

//             {/* Documents History Toggle */}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
//             >
//               <FolderOpen className="w-5 h-5 mr-2" />
//               <span className="hidden sm:inline">
//                 {language === "ar" ? "المستندات" : "Documents"}
//               </span>
//               {documentHistory.length > 0 && (
//                 <span className="ml-2 px-1.5 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
//                   {documentHistory.length}
//                 </span>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Messages Container */}
//         <div
//           ref={messagesContainerRef}
//           className="flex-1 overflow-y-auto p-4 space-y-4"
//         >
//           <AnimatePresence>
//             {messages.map((message) => (
//               <ChatBubble
//                 key={message.id}
//                 role={message.role}
//                 content={message.content}
//                 timestamp={message.timestamp}
//                 attachments={message.attachments}
//                 fileAttachments={message.fileAttachments}
//               />
//             ))}
//           </AnimatePresence>

//           {isTyping && <TypingIndicator />}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Document Viewer Section */}
//         <AnimatePresence>
//           {attachedFiles.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="px-4 py-4 bg-muted/30 border-t border-border"
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-medium text-foreground">
//                   {language === "ar"
//                     ? `المستندات المرفقة (${attachedFiles.length})`
//                     : `Attached Documents (${attachedFiles.length})`}
//                 </p>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setAttachedFiles([])}
//                   className="text-muted-foreground hover:text-destructive h-7 text-xs"
//                 >
//                   <X className="w-3 h-3 mr-1" />
//                   {language === "ar" ? "مسح الكل" : "Clear All"}
//                 </Button>
//               </div>
//               <DocumentViewer
//                 files={attachedFiles}
//                 onRemove={(index) =>
//                   setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
//                 }
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Input Area */}
//         <div className="p-4 border-t border-border bg-gradient-to-r from-muted/50 to-muted/30">
//           {/* Document Upload Note with Drag & Drop Hint */}
//           <motion.div
//             className="flex items-center gap-2 mb-3 px-3 py-2 bg-info/10 border border-info/20 rounded-lg"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             <Upload className="w-4 h-4 text-info shrink-0" />
//             <p className="text-xs text-info">
//               {language === "ar"
//                 ? "اسحب وأفلت الملفات أو اضغط على زر الإرفاق (PDF، PNG، JPG)"
//                 : "Drag & drop files or click attach button (PDF, PNG, JPG)"}
//             </p>
//           </motion.div>

//           <div className="flex items-center gap-2">
//             {/* File Attach Button */}
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               accept=".pdf,.png,.jpg,.jpeg"
//               className="hidden"
//               onChange={handleFileAttach}
//             />
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="shrink-0 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
//               >
//                 <Paperclip className="w-5 h-5 text-primary" />
//               </Button>
//             </motion.div>

//             {/* Text Input */}
//             <Input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder={t("typeMessage")}
//               className="flex-1 border-primary/20 focus:border-primary/50"
//               dir={isRTL ? "rtl" : "ltr"}
//             />

//             {/* Send Button */}
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={!inputValue.trim() && attachedFiles.length === 0}
//                 size="icon"
//                 className="shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
//               >
//                 {/* <Send className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} /> */}
//                 <SendHorizontal
//                   className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
//                 />
//               </Button>
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Document History Sidebar */}
//       <DocumentHistorySidebar
//         documents={documentHistory}
//         isOpen={isSidebarOpen}
//         onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//         onRemove={handleRemoveFromHistory}
//       />
//     </div>
//   );
// }

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  X,
  Sparkles,
  FileText,
  Zap,
  Upload,
  Image,
  File,
  FolderOpen,
  SendHorizontal,
  BookOpen,
  Bot,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCases } from "@/contexts/CaseContext";
import { ChatMessage, UploadedDocument } from "@/lib/types";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { DocumentViewer } from "./DocumentViewer";
import {
  DocumentHistorySidebar,
  UploadedDocumentHistory,
} from "./DocumentHistorySidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockServices, generateCaseNumber } from "@/lib/mockData";
import qatariAgentAvatar from "@/assets/qatari-agent-avatar.png";
import { completeChat } from "@/services/chatCompletionService";
import { BackendChatState } from "@/models/ChatCompletionModel";

interface ChatInterfaceProps {
  caseId?: string;
  onCaseCreated?: (caseId: string) => void;
}

// Extended ChatMessage with file previews
interface ChatMessageWithFiles extends ChatMessage {
  fileAttachments?: {
    id: string;
    file: File;
    preview?: string;
  }[];
}

// AI Agent responses based on conversation flow
const agentResponses = {
  greeting: {
    ar: "مرحبًا بك في بوابة الخدمات الإلكترونية! كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في:\n\n• المساعدة الاجتماعية\n• دعم الأسرة\n• رعاية كبار السن\n• خدمات ذوي الإعاقة\n• الدعم السكني\n• المساعدة الطارئة",
    en: "Welcome to the E-Services Portal! How can I help you today? I can assist you with:\n\n• Social Assistance\n• Family Support\n• Elder Care\n• Disability Services\n• Housing Support\n• Emergency Aid",
  },
  serviceSelected: {
    ar: "ممتاز! لقد اخترت خدمة {service}. دعني أسألك بعض الأسئلة لمعالجة طلبك.\n\nما هو سبب تقديمك لهذا الطلب؟",
    en: "Excellent! You have selected {service}. Let me ask you a few questions to process your request.\n\nWhat is the reason for your application?",
  },
  documentsRequest: {
    ar: "شكرًا على المعلومات. الآن يرجى إرفاق المستندات المطلوبة:\n\n• بطاقة الهوية\n• شهادة الراتب (إن وجدت)\n• أي مستندات داعمة\n\nيمكنك إرفاق الملفات باستخدام زر الإرفاق أدناه.",
    en: "Thank you for the information. Now please attach the required documents:\n\n• ID Card\n• Salary Certificate (if available)\n• Any supporting documents\n\nYou can attach files using the attachment button below.",
  },
  documentsReceived: {
    ar: "تم استلام المستندات بنجاح! جاري تحليل ومراجعة الملفات...\n\n✅ تم التحقق من صحة المستندات\n\nبناءً على المعلومات المقدمة، تم تسعير الخدمة مبدئيًا بمبلغ {price} ريال قطري.\n\nهل تريد تأكيد تقديم الطلب؟",
    en: "Documents received successfully! Analyzing and reviewing files...\n\n✅ Documents verified\n\nBased on the information provided, the service is preliminarily priced at {price} QAR.\n\nWould you like to confirm submission?",
  },
  caseCreated: {
    ar: 'تم تقديم طلبك بنجاح! 🎉\n\nرقم الطلب: {caseNumber}\n\nسيتم مراجعة طلبك من قبل الفريق المختص وسنقوم بإخطارك بأي تحديثات.\n\nيمكنك متابعة حالة طلبك من خلال صفحة "طلباتي".',
    en: 'Your request has been submitted successfully! 🎉\n\nCase Number: {caseNumber}\n\nYour request will be reviewed by our team and we will notify you of any updates.\n\nYou can track your request status through "My Requests" page.',
  },
  fallback: {
    ar: "أفهم. هل يمكنك تقديم المزيد من التفاصيل حول طلبك؟",
    en: "I understand. Can you provide more details about your request?",
  },
};

export function ChatInterface({ caseId, onCaseCreated }: ChatInterfaceProps) {
  const { t, language, isRTL } = useLanguage();
  const { currentCase, createCase, addMessage, addDocument } = useCases();
  const [messages, setMessages] = useState<ChatMessageWithFiles[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<
    "greeting" | "selecting" | "details" | "documents" | "confirm" | "complete"
  >("greeting");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [documentHistory, setDocumentHistory] = useState<
    UploadedDocumentHistory[]
  >([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOverChat, setIsDraggingOverChat] = useState(false);
  const [apiMessages, setApiMessages] = useState<
    { type: "user" | "assistant"; content: string }[]
  >([]);

  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());

  // Map backend state to your frontend conversationState
  const mapBackendStateToUI = (state: BackendChatState) => {
    switch (state) {
      case "AwaitingGreeting":
        return "greeting";
      case "AwaitingServiceSelection":
        return "selecting";
      case "AwaitingDetails":
        return "details";
      case "AwaitingDocuments":
        return "documents";
      case "AwaitingConfirmation":
        return "confirm";
      case "Completed":
        return "complete";
      default:
        return "greeting";
    }
  };

  // Helper to create preview for file
  const createFilePreview = (file: File): string | undefined => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  // Add files to history when sent
  const addToDocumentHistory = (files: File[]) => {
    const newDocs: UploadedDocumentHistory[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: createFilePreview(file),
      uploadedAt: new Date(),
    }));
    setDocumentHistory((prev) => [...newDocs, ...prev]);
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAttachedFiles((prev) => [...prev, ...acceptedFiles]);
    setIsDraggingOverChat(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    noClick: true,
    onDragEnter: () => setIsDraggingOverChat(true),
    onDragLeave: () => setIsDraggingOverChat(false),
  });

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

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    const userText = inputValue;

    // Create file attachments with previews
    const fileAttachments = attachedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      preview: createFilePreview(file),
    }));

    // Add user message WITH file attachments
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: userText,
        timestamp: new Date().toISOString(),
        fileAttachments: fileAttachments,
      },
    ]);

    setInputValue("");
    setAttachedFiles([]);
    setIsTyping(true);

    try {
      const response: any = await completeChat({
        sessionId,
        message: userText,
        attachments: attachedFiles,
      });

      setConversationState(mapBackendStateToUI(response.state));

      const agentMessageContent =
        typeof response.message === "string"
          ? response.message
          : JSON.stringify(response.message);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          content: agentMessageContent,
          timestamp: new Date().toISOString(),
        },
      ]);

      // Add files to document history
      addToDocumentHistory(attachedFiles);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRemoveFromHistory = (id: string) => {
    setDocumentHistory((prev) => prev.filter((doc) => doc.id !== id));
  };

  const removeFile = (fileName: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  return (
    <div className="flex h-full relative">
      {/* Main Chat Area */}
      <div
        {...getRootProps()}
        className="flex flex-col flex-1 h-full bg-card rounded-2xl border border-border overflow-hidden shadow-xl relative"
      >
        {/* Drag Overlay */}
        <AnimatePresence>
          {(isDragActive || isDraggingOverChat) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                </motion.div>
                <p className="text-xl font-bold text-primary">
                  {language === "ar" ? "أفلت الملفات هنا" : "Drop files here"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "ar" ? "PDF، PNG، JPG" : "PDF, PNG, JPG"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input {...getInputProps()} />

        {/* Enhanced Chat Header */}
        <div className="relative bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground px-5 py-4 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-0 w-24 h-24 bg-accent/30 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative flex items-center gap-4">
            {/* Qatari Agent Avatar */}
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {/* Outer Maroon Glow Ring */}
              <motion.div
                className="absolute inset-[-4px] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                  background:
                    "conic-gradient(from 0deg, hsl(344 72% 32%), hsl(344 72% 45%), hsl(43 74% 49%), hsl(344 72% 32%))",
                  filter: "blur(4px)",
                  opacity: 0.8,
                }}
              />

              {/* Main Avatar Container with Image */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-xl border-2 border-accent/50">
                <img
                  src={qatariAgentAvatar}
                  alt="Qatari AI Assistant"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Online Indicator with Qatari Gold */}
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-accent to-accent/80 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap className="w-2.5 h-2.5 text-accent-foreground" />
              </motion.div>

              {/* Orbiting Sparkle - Gold */}
              <motion.div
                className="absolute -top-1 -left-1"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                }}
              >
                <Sparkles className="w-4 h-4 text-accent drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* Agent Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">
                  {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
                </h3>
                <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-medium rounded-full">
                  {language === "ar" ? "ذكاء اصطناعي" : "AI Powered"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <p className="text-sm text-primary-foreground/80">
                  {language === "ar"
                    ? "متوفر على مدار الساعة للمساعدة"
                    : "Available 24/7 to assist you"}
                </p>
              </div>
            </div>

            {/* Documents History Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">
                {language === "ar" ? "المستندات" : "Documents"}
              </span>
              {documentHistory.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                  {documentHistory.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && !isTyping && (
            // Welcome Screen with BookOpen Icon
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md w-full px-6">
                {/* <div className="mx-auto mb-8 p-5 rounded-3xl bg-gradient-to-br from-primary to-sky-400/80 w-fit shadow-2xl shadow-primary/30 transform transition-all hover:scale-[1.03]">
                  <BookOpen className="h-14 w-14 text-white" />
                </div> */}

                <h2 className="text-2xl md:text-2xl font-extrabold mb-4 text-foreground tracking-tight">
                  {language === "ar" ? "هل تحتاج مساعدة؟" : "Need assistance?"}
                </h2>

                <p className="text-base md:text-xl text-muted-foreground/90 leading-relaxed mb-6">
                  {language === "ar"
                    ? "اطرح سؤالك أو ارفع مستندك — سأساعدك بكل ما تحتاجه"
                    : "Ask a question or upload your document — I'm here to help you with everything you need"}
                </p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                attachments={message.attachments}
                fileAttachments={message.fileAttachments}
              />
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Document Upload Preview - Enhanced */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-4 bg-gradient-to-br from-primary/5 to-primary/2 border-t border-primary/10 backdrop-blur-sm"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {language === "ar" ? "جاهز للإرسال" : "Ready to send"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attachedFiles.length}{" "}
                        {language === "ar" ? "ملفات محددة" : "files selected"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
                    {language === "ar" ? "جاهز" : "Ready"}
                  </Badge>
                </div>

                {/* File List */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {attachedFiles.map((file, index) => (
                    <motion.div
                      key={file.name + index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-background/80 backdrop-blur-sm border border-primary/20 hover:border-primary/30 transition-all duration-200 rounded-lg hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          {file.type.startsWith("image/") ? (
                            <Image className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.name)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full animate-pulse"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="shrink-0">
                    {language === "ar" ? "تم المعالجة" : "Processed"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-gradient-to-r from-muted/50 to-muted/30">
          {/* Document Upload Note with Drag & Drop Hint */}
          <motion.div
            className="flex items-center gap-2 mb-3 px-3 py-2 bg-info/10 border border-info/20 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Upload className="w-4 h-4 text-info shrink-0" />
            <p className="text-xs text-info">
              {language === "ar"
                ? "اسحب وأفلت الملفات أو اضغط على زر الإرفاق (PDF، PNG، JPG)"
                : "Drag & drop files or click attach button (PDF, PNG, JPG)"}
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            {/* File Attach Button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileAttach}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              >
                <Paperclip className="w-5 h-5 text-primary" />
              </Button>
            </motion.div>

            {/* Text Input */}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("typeMessage")}
              className="flex-1 border-primary/20 focus:border-primary/50"
              dir={isRTL ? "rtl" : "ltr"}
            />

            {/* Send Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && attachedFiles.length === 0}
                size="icon"
                className="shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
              >
                <SendHorizontal
                  className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document History Sidebar */}
      <DocumentHistorySidebar
        documents={documentHistory}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onRemove={handleRemoveFromHistory}
      />
    </div>
  );
}
