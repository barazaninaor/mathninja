const API_URL = "https://mathninja-btcg.onrender.com";

// Helper to get auth headers with JWT token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// פונקציית עזר לביצוע בקשות מאובטחות עם טיפול בטוקן פג תוקף / שגיאת הרשאה
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error("Please try again in a few seconds, the server is loading");
  }

  // אם השרת זורק 401 או 403 (טוקן פג תוקף או שגוי)
  if (response.status === 401 || response.status === 403) {
    // ניקוי מלא של הנתונים כדי למנוע מצב שקרי שהמשתמש מחובר
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // רענון העמוד כדי לאפס את ה-UI ולהחזיר את המשתמש למסך ההתחברות
    window.location.reload();

    throw new Error("Session expired. Please log in again.");
  }

  return response;
}

// 1. Sign Up
export async function signUp(
  fullName: string,
  email: string,
  password: string,
) {
  let response;
  try {
    response = await fetch(`${API_URL}/signUp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
  } catch {
    throw new Error("Please try again in a few seconds, the server is loading");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Please try again in a few seconds, the server is loading");
  }

  if (!response.ok) throw new Error(data.message || "Error registering user");

  if (data.token) {
    localStorage.setItem("token", data.token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }
  return data;
}

// 2. Sign In
export async function signIn(email: string, password: string) {
  let response;
  try {
    response = await fetch(`${API_URL}/signIn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Please try again in a few seconds, the server is loading");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Please try again in a few seconds, the server is loading");
  }

  if (!response.ok)
    throw new Error(data.message || "Invalid email or password");

  if (data.token) {
    localStorage.setItem("token", data.token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }
  return data;
}

// 3. Update Profile
export async function updateProfile(fullName: string, password?: string) {
  const response = await fetchWithAuth(`${API_URL}/updateProfile`, {
    method: "PUT",
    body: JSON.stringify({ fullName, password }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) throw new Error(data.message || "Failed to update profile");
  return data;
}

// 4. Delete Account
export async function deleteAccount(password: string) {
  const response = await fetchWithAuth(`${API_URL}/deleteAccount`, {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

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

  const response = await fetchWithAuth(
    `${API_URL}/api/scores?${params.toString()}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    let errorMessage = "Error fetching scores";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Server waking up or returned status ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

// 6. Save Game Result with automatic retry for Cold Starts
export async function saveScore(
  correctAnswers: number,
  durationSeconds: number,
  levelId: number,
  retries = 3,
  delay = 3000,
) {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/saveScore`, {
      method: "POST",
      body: JSON.stringify({ correctAnswers, durationSeconds, levelId }),
    });

    if (!response.ok) {
      let errorMessage = "Error saving score";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `Server waking up or returned status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // אם נותרו נסיונות ויש שגיאת רשת/התעוררות (ולא שגיאת 401/403 שמופנית החוצה), נמתין וננסה שוב
    if (retries > 0) {
      console.warn(
        `Server might be waking up. Retrying saveScore in ${delay / 1000}s... (${retries} attempts left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return saveScore(
        correctAnswers,
        durationSeconds,
        levelId,
        retries - 1,
        delay * 1.5,
      );
    }
    throw error;
  }
}

// Logout helper
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
