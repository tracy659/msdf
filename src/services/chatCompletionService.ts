import { api } from "@/services/api";

import { ChatCompletionRequest } from "@/models/ChatCompletionModel";
import { AxiosHeaders } from "axios";

export async function completeChat(
  payload: ChatCompletionRequest,
): Promise<string> {
  const formData = new FormData();

  // Messages (array of objects)

  payload.messages.forEach((msg, index) => {
    formData.append(`messages[${index}].type`, msg.type);

    formData.append(`messages[${index}].content`, msg.content);
  });

  // Attachments (files)

  if (payload.attachments?.length) {
    payload.attachments.forEach((file) => {
      formData.append("Attachments", file);
    });
  }

  // Question

  if (payload.question) {
    formData.append("Question", payload.question);
  }

  // CaseId

  if (payload.caseId) {
    formData.append("CaseId", payload.caseId);
  }

  const response = await api.post<string>(
    "/api/ChatCompletion/Complete",

    formData,

    {
      headers: AxiosHeaders.from({
        "Content-Type": "multipart/form-data",
      }),
    },
  );
  const fullData = response.data;
  return fullData;
}
