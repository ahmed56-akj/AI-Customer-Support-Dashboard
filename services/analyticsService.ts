import { AnalyticsData } from "@/types";
import { initialAnalytics } from "./mockData";

export async function getAnalytics(range: "today" | "7d" | "30d" | "90d" = "7d"): Promise<AnalyticsData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 250));
  return initialAnalytics[range] || initialAnalytics["7d"];
}
