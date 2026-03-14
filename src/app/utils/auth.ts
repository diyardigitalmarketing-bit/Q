export type User = {
  name: string
  email: string
  roles: { name: string }[]  // Changed: roles array, not role string
}

const DEFAULT_USER = {
  email: "receptionist@qih.com",
  password: "123456",
  name: "Receptionist",
  roles: [{ name: "receptionist" }]  // Fixed: roles array
}

export function loginUser(email: string, password: string) {
  const cleanEmail = email.trim()
  const cleanPassword = password.trim()

  if (!cleanEmail || !cleanPassword) {
    return { success: false, message: "Email and password required" }
  }

  if (cleanEmail !== DEFAULT_USER.email || cleanPassword !== DEFAULT_USER.password) {
    return { success: false, message: "Invalid email or password" }
  }

  // FIXED: Save to COOKIE (not just localStorage) with correct structure
  const userData = {
    name: DEFAULT_USER.name,
    email: DEFAULT_USER.email,
    roles: DEFAULT_USER.roles  // Middleware expects this exact structure
  }
  
  document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400`;
  localStorage.setItem("user", JSON.stringify(userData)); // Backup
  
  return { success: true, user: userData }
}

export function logoutUser() {
  document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  localStorage.removeItem("user");
}
