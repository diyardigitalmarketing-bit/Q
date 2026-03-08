import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export async function initializeReceptionist() {
  try {
    const email = "receptionist@qih.com"
    const password = "123456"

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10)

      await prisma.user.create({
        data: {
          name: "Receptionist",
          email: email,
          password: hashedPassword,
          roles: {
            create: [
              {
                name: "receptionist"
              }
            ]
          }
        }
      })

      console.log("✅ Default Receptionist Created")
      console.log("Email: receptionist@qih.com")
      console.log("Password: 123456")
    } else {
      console.log("Receptionist already exists")
    }
  } catch (error) {
    console.error("Error creating receptionist:", error)
  }
}
