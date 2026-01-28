import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Case, CaseStatus, ChatMessage, UploadedDocument } from '@/lib/types';
import { mockCases, generateCaseNumber } from '@/lib/mockData';

interface CaseContextType {
  cases: Case[];
  currentCase: Case | null;
  setCurrentCase: (caseItem: Case | null) => void;
  createCase: (serviceType: string, serviceNameAr: string) => Case;
  updateCaseStatus: (caseId: string, status: CaseStatus, note?: string) => void;
  addMessage: (caseId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addDocument: (caseId: string, document: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  getCaseById: (caseId: string) => Case | undefined;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>(() => {
    const saved = localStorage.getItem('msdf-cases');
    return saved ? JSON.parse(saved) : mockCases;
  });
  const [currentCase, setCurrentCase] = useState<Case | null>(null);

  const saveCases = (newCases: Case[]) => {
    setCases(newCases);
    localStorage.setItem('msdf-cases', JSON.stringify(newCases));
  };

  const createCase = (serviceType: string, serviceNameAr: string): Case => {
    const newCase: Case = {
      id: `case-${Date.now()}`,
      caseNumber: generateCaseNumber(),
      serviceType,
      serviceNameAr,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'new',
      estimatedPrice: 0,
      currency: 'QAR',
      userId: 'user-1',
      documents: [],
      messages: [],
      statusHistory: [
        {
          status: 'new',
          timestamp: new Date().toISOString(),
          note: 'تم استلام الطلب',
        },
      ],
    };
    
    const newCases = [newCase, ...cases];
    saveCases(newCases);
    setCurrentCase(newCase);
    return newCase;
  };

  const updateCaseStatus = (caseId: string, status: CaseStatus, note?: string) => {
    const newCases = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status,
          statusHistory: [
            ...c.statusHistory,
            { status, timestamp: new Date().toISOString(), note },
          ],
        };
      }
      return c;
    });
    saveCases(newCases);
    
    if (currentCase?.id === caseId) {
      setCurrentCase(newCases.find(c => c.id === caseId) || null);
    }
  };

  const addMessage = (caseId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newCases = cases.map(c => {
      if (c.id === caseId) {
        const newMessage: ChatMessage = {
          ...message,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        return {
          ...c,
          messages: [...c.messages, newMessage],
        };
      }
      return c;
    });
    saveCases(newCases);
    
    if (currentCase?.id === caseId) {
      setCurrentCase(newCases.find(c => c.id === caseId) || null);
    }
  };

  const addDocument = (caseId: string, document: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => {
    const newCases = cases.map(c => {
      if (c.id === caseId) {
        const newDoc: UploadedDocument = {
          ...document,
          id: `doc-${Date.now()}`,
          uploadedAt: new Date().toISOString(),
        };
        return {
          ...c,
          documents: [...c.documents, newDoc],
        };
      }
      return c;
    });
    saveCases(newCases);
    
    if (currentCase?.id === caseId) {
      setCurrentCase(newCases.find(c => c.id === caseId) || null);
    }
  };

  const getCaseById = (caseId: string): Case | undefined => {
    return cases.find(c => c.id === caseId);
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        currentCase,
        setCurrentCase,
        createCase,
        updateCaseStatus,
        addMessage,
        addDocument,
        getCaseById,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}
