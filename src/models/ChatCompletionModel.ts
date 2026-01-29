// export interface ChatMessage {
//   type: "user" | "assistant";
//   content: string;
// }

// export interface ChatCompletionRequest {
//   messages: ChatMessage[];
//   attachments?: File[];
//   question?: string;
//   caseId?: string;
// }

// chat.models.ts

export type BackendChatState =
  | "AwaitingGreeting"
  | "AwaitingServiceSelection"
  | "AwaitingDetails"
  | "AwaitingDocuments"
  | "AwaitingConfirmation"
  | "Completed";

export interface ChatResponse {
  sessionId: string;
  state: BackendChatState;
  message: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  attachments?: File[];
}
