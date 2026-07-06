import api from "./apiClient";

// POST /api/transaction/createTransaction
export async function createTransaction(payload) {
  const { data } = await api.post("/transaction/createTransaction", payload);
  return data;
}

// GET /api/transaction/getTransaction
export async function getTransactions(params = {}) {
  const { data } = await api.get("/transaction/getTransaction", { params });
  return data;
}

// GET /api/transaction/getTransactionById/:id
export async function getTransactionById(id) {
  const { data } = await api.get(`/transaction/getTransactionById/${id}`);
  return data;
}

// PUT /api/transaction/updateTransaction/:id
export async function updateTransaction(id, payload) {
  const { data } = await api.put(`/transaction/updateTransaction/${id}`, payload);
  return data;
}

// DELETE /api/transaction/deleteTransaction/:id
export async function deleteTransaction(id) {
  const { data } = await api.delete(`/transaction/deleteTransaction/${id}`);
  return data;
}

// GET /api/transaction/summary
export async function getSummary() {
  const { data } = await api.get("/transaction/summary");
  return data;
}
