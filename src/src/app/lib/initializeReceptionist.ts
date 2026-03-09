// Frontend-only authentication utility

export type User = {
  name: string
  email: string
  role: string
}

export type LoginResult =
  | { success: true; user: User }
  | { success: false; message: string }

// Hardcoded receptionist account
const DEFAULT_USER = {
  email: "receptionist@qih.com",
  password: "123456",
  name: "Receptionist",
  role: "receptionist",
}

// Login function
export function loginUser(email: string, password: string): LoginResult {

  const cleanEmail = email.trim()
  const cleanPassword = password.trim()

  if (!cleanEmail || !cleanPassword) {
    return {
      success: false,
      message: "Email and password required",
    }
  }

  if (
    cleanEmail !== DEFAULT_USER.email ||
    cleanPassword !== DEFAULT_USER.password
  ) {
    return {
      success: false,
      message: "Invalid email or password",
    }
  }

  return {
    success: true,
    user: {
      name: DEFAULT_USER.name,
      email: DEFAULT_USER.email,
      role: DEFAULT_USER.role,
    },
  }
}

// Save login session
export function saveUserSession(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// Get logged-in user
export function getUserSession(): User | null {
  if (typeof window === "undefined") return null

  const storedUser = localStorage.getItem("user")

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

// Logout function
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}