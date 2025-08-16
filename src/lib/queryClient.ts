const MOCK_API_BASE = 'http://localhost:3001/api/v1';

export async function apiRequest(method: string, url: string, data?: any) {
  // If it's a mock API request (starts with /api), use the mock backend
  const fullUrl = url.startsWith('/api') 
    ? `${MOCK_API_BASE}${url.replace('/api', '')}`
    : url;
    
  const res = await fetch(fullUrl, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`);
  }
  return res;
}

// Mock Backend API Functions
export async function getUsers() {
  const response = await apiRequest('GET', `${MOCK_API_BASE}/users`);
  return response.json();
}

export async function getUser(userId: string) {
  const response = await apiRequest('GET', `${MOCK_API_BASE}/users/${userId}`);
  return response.json();
}

export async function getUserBalance(userId: string) {
  const response = await apiRequest('GET', `${MOCK_API_BASE}/users/${userId}/balance`);
  return response.json();
}

export async function transferMoney(from: string, to: string, amount: number) {
  const response = await apiRequest('POST', `${MOCK_API_BASE}/transfer`, {
    from, to, amount
  });
  return response.json();
}

export async function getTransactions(params?: {
  limit?: number;
  offset?: number;
  status?: 'completed' | 'failed';
  userId?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.userId) queryParams.append('userId', params.userId);

  const endpoint = `${MOCK_API_BASE}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await apiRequest('GET', endpoint);
  return response.json();
}

export async function getUserTransactions(userId: string, limit?: number) {
  const endpoint = `${MOCK_API_BASE}/transactions/user/${userId}${limit ? `?limit=${limit}` : ''}`;
  const response = await apiRequest('GET', endpoint);
  return response.json();
}

export async function getTransaction(transactionId: string) {
  const response = await apiRequest('GET', `${MOCK_API_BASE}/transactions/${transactionId}`);
  return response.json();
}

export async function getTransactionStatistics() {
  const response = await apiRequest('GET', `${MOCK_API_BASE}/transactions/statistics`);
  return response.json();
}

export async function checkBackendHealth() {
  const response = await apiRequest('GET', `${MOCK_API_BASE}/health`);
  return response.json();
}