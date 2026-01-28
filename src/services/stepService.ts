import { StepModelItem } from "../models/StepModel";
import { api } from "./api";

const STEP_API_URL = `/administration-dashboard/overview`;

export async function fetchSteps(): Promise<StepModelItem> {
  try {
    const response = await api.get<{ result: StepModelItem }>(STEP_API_URL);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching steps data:", error);
    throw error;
  }
}
