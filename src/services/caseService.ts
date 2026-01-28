import { CaseModelItem } from "../models/CaseModel";
import { api } from "./api";

const CASE_API_URL = `/administration-dashboard/overview`;

export async function fetchCases(): Promise<CaseModelItem> {
  try {
    const response = await api.get<{ result: CaseModelItem }>(CASE_API_URL);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching cases data:", error);
    throw error;
  }
}
