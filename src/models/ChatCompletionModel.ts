export interface ChatMessage {
  type: "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  attachments?: File[];
  question?: string;
  caseId?: string;
}
