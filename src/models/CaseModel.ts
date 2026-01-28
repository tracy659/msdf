export interface Documents {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}
export interface Messages {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}
export interface statusHistory {
  status: string;
  timestamp: string;
  note: string;
}
export interface CaseModelItem {
  id: string;
  caseNumber: string;
  serviceType: string;
  serviceNameAr: string;
  submissionDate: string;
  status: string;
  estimatedPrice: number;
  currency: string;
  userId: string;
  messages: Messages[];
  documents: Documents[];
  statusHistory: statusHistory[];
}
export class CaseModel {
  private _case: CaseModelItem;

  constructor(caseItem: CaseModelItem) {
    this._case = caseItem;
  }

  toJSON(): CaseModelItem {
    return { ...this._case };
  }
}
