// import { api } from "@/services/api";

// import { ChatRequest } from "@/models/ChatCompletionModel";
// import { AxiosHeaders } from "axios";

// export async function completeChat(payload: ChatRequest): Promise<string> {
//   const formData = new FormData();

//   // Messages (array of objects)

//   payload.messages.forEach((msg, index) => {
//     formData.append(`messages[${index}].type`, msg.type);

//     formData.append(`messages[${index}].content`, msg.content);
//   });

//   // Attachments (files)

//   if (payload.attachments?.length) {
//     payload.attachments.forEach((file) => {
//       formData.append("Attachments", file);
//     });
//   }

//   // Question

//   if (payload.question) {
//     formData.append("Question", payload.question);
//   }

//   // CaseId

//   if (payload.caseId) {
//     formData.append("CaseId", payload.caseId);
//   }

//   const response = await api.post<string>(
//     "/api/ChatCompletion/Complete",

//     formData,

//     {
//       headers: AxiosHeaders.from({
//         "Content-Type": "multipart/form-data",
//       }),
//     },
//   );
//   const fullData = response.data;
//   return fullData;
// }

import { api } from "@/services/api";
import { ChatRequest } from "@/models/ChatCompletionModel";
import { AxiosHeaders } from "axios";

export interface ChatResponse {
  sessionId: string;
  state: string;
  message: string;
}

export async function completeChat(
  payload: ChatRequest,
): Promise<ChatResponse> {
  const formData = new FormData();

  console.log("Payload received:", payload); // ADD THIS
  console.log("Attachments in payload:", payload.attachments); // ADD THIS
  console.log("Attachments length:", payload.attachments?.length); // ADD THIS
  formData.append("sessionId", payload.sessionId);
  formData.append("Message", payload.message);

  // if (payload.attachments && payload.attachments.length > 0) {
  //   console.log("About to append files"); // ADD THIS
  //   payload.attachments.forEach((file, index) => {
  //     console.log(`Appending file ${index}:`, file.name, file instanceof File);
  //     formData.append("Attachments", file);
  //   });
  // } else {
  //   console.log("No attachments to append"); // ADD THIS
  // }
  if (payload.attachments?.length) {
    payload.attachments.forEach((file) => {
      formData.append("Attachments", file);
    });
  }

  console.log("FormData contents:", Array.from(formData.entries()));

  //   const response = await api.post<ChatResponse>("/api/msdf/MsdfChat", formData);

  //   return response.data;
  // }
  const response = await api.post<ChatResponse>(
    "/api/msdf/MsdfChat",

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
