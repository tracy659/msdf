// Case/Request Types
export type CaseStatus =
  | "new"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";

export interface Case {
  id: string;
  caseNumber: string;
  serviceType: string;
  serviceNameAr: string;
  submissionDate: string;
  status: CaseStatus;
  estimatedPrice: number;
  currency: string;
  userId: string;
  documents: UploadedDocument[];
  messages: ChatMessage[];
  statusHistory: StatusUpdate[];
}

export interface StatusUpdate {
  status: CaseStatus;
  timestamp: string;
  note?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  attachments?: UploadedDocument[];
}

// User Types
export interface User {
  id: string;
  qid: string;
  email: string;
  nameAr: string;
  nameEn?: string;
  phone?: string;
}

// Service Types
export interface Service {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  category: string;
  basePrice: number;
  estimatedDays: number;
  requiredDocuments: string[];
}

// Language Types
export type Language = "ar" | "en";

export interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}
