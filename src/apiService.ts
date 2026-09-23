const API_URL = "https://math-ninja-btcg.onrender.com";

// Helper to get auth headers with JWT token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// 1. Sign Up
export async function signUp(
  fullName: string,
  email: string,
  password: string,
) {
  const response = await fetch(`${API_URL}/signUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error registering user");

  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

// 2. Sign In
export async function signIn(email: string, password: string) {
  const response = await fetch(`${API_URL}/signIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Invalid email or password");

  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

// 3. Update Profile
export async function updateProfile(fullName: string, password?: string) {
  const response = await fetch(`${API_URL}/updateProfile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ fullName, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update profile");
  return data;
}

// 4. Delete Account
export async function deleteAccount(password: string) {
  const response = await fetch(`${API_URL}/deleteAccount`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete account");
  return data;
}

// 5. Get Scores (Supports optional filtering by level or dates)
export async function getScores(
  levelId?: number | string,
  startDate?: string,
  endDate?: string,
) {
  const params = new URLSearchParams();
  if (levelId) params.append("levelId", levelId.toString());
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await fetch(`${API_URL}/api/scores?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error fetching scores");
  return data;
}

// 6. Save Game Result
export async function saveScore(
  correctAnswers: number,
  durationSeconds: number,
  levelId: number,
) {
  const response = await fetch(`${API_URL}/api/saveScore`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ correctAnswers, durationSeconds, levelId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error saving score");
  return data;
}

// Logout helper
export function logout() {
  localStorage.removeItem("token");
}
