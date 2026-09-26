const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export async function getApiStatus() {
  const response = await fetch(`${API_BASE_URL}/v1/status`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export function getCurrentUser() {
  return requestJson("/v1/auth/me");
}

export function register(email, password, display_name) {
  return requestJson("/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, display_name }),
  });
}

export function login(email, password) {
  return requestJson("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return requestJson("/v1/auth/logout", { method: "POST" });
}

export function updateProfile(profile) {
  return requestJson("/v1/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
}

export async function getDashboardSummary() {
  return requestJson("/v1/dashboard/summary");
}

export function getCategories() {
  return requestJson("/v1/categories");
}

export function createCategory(name) {
  return requestJson("/v1/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? `API request failed with status ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export function getTransactions() {
  return requestJson("/v1/transactions");
}

export function createTransaction(transaction) {
  return requestJson("/v1/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
}

export function updateTransaction(id, transaction) {
  return requestJson(`/v1/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });
}

export function deleteTransaction(id) {
  return requestJson(`/v1/transactions/${id}`, { method: "DELETE" });
}

export function getBudgets() {
  return requestJson("/v1/budgets");
}

export function createBudget(budget) {
  return requestJson("/v1/budgets", {
    method: "POST",
    body: JSON.stringify(budget),
  });
}

export function deleteBudget(id) {
  return requestJson(`/v1/budgets/${id}`, { method: "DELETE" });
}

export function getReports() {
  return requestJson("/v1/reports");
}

export function getTransactionsExportUrl() {
  return `${API_BASE_URL}/v1/transactions/export`;
}

export function getExpenseExportUrl() {
  return `${API_BASE_URL}/v1/transactions/export?type=expense`;
}

export function getExcelExportUrl() {
  return `${API_BASE_URL}/v1/transactions/export.xlsx`;
}

export function getExpenseExcelExportUrl() {
  return `${API_BASE_URL}/v1/transactions/export.xlsx?type=expense`;
}
