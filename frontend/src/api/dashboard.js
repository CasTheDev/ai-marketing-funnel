const API_URL = "http://127.0.0.1:8000";

export async function getDashboardSummary() {
  const response = await fetch(`${API_URL}/dashboard-summary`);

  if (!response.ok) {
    throw new Error("Failed to load dashboard summary");
  }

  return await response.json();
}