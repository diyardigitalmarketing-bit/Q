import bcrypt from "bcryptjs"

type LoginResult =
  | {
      success: true
      user: {
        name: string
        email: string
        role: string
      }
    }
  | {
      success: false
      message: string
    }

const DEFAULT_USER = {
  email: "receptionist@qih.com",
  password: "$2a$10$7QJQmZCj7FVGHvXZHzVvzOv9q24apqYh6gMPkTFogyXv3gZH/BqhG",
  name: "Receptionist",
  role: "receptionist"
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    if (!email || !password) {
      return { success: false, message: "Email and password required" }
    }

    if (email !== DEFAULT_USER.email) {
      return { success: false, message: "Invalid email or password" }
    }

    const passwordMatch = await bcrypt.compare(password, DEFAULT_USER.password)

    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" }
    }

    return {
      success: true,
      user: {
        name: DEFAULT_USER.name,
        email: DEFAULT_USER.email,
        role: DEFAULT_USER.role
      }
    }
  } catch (error) {
    console.error("Login error:", error)

    return {
      success: false,
      message: "Login failed"
    }
  }
}

export function initializeReceptionist() {
  console.log("Receptionist initialized")
}
