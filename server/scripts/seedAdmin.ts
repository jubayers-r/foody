import * as bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
// Better Auth usually expects a specific ID format or nanoid
import { nanoid } from "nanoid";
import { UserRoles } from "../generated/prisma/enums";

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@foody.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  console.log("--- 🚀 Checking for Admin User ---");

  try {
    // 1. Check if the admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(
        `⚠️  Admin (${adminEmail}) already exists. Skipping admin seeding.`,
      );
      return; // Exit the function early
    }

    // 2. If it doesn't exist, proceed with creation
    console.log(`Creating fresh admin: ${adminEmail}...`);

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = nanoid();

    // Use a Transaction to ensure both User and Account are created together
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: userId,
          email: adminEmail,
          name: "System Admin",
          role: UserRoles.ADMIN,
          emailVerified: true,
        },
      });

      await tx.account.create({
        data: {
          id: nanoid(),
          userId: user.id,
          accountId: adminEmail,
          providerId: "credential",
          password: hashedPassword,
        },
      });
    });

    console.log("✅ Admin seeded successfully!");
  } catch (error) {
    console.error("❌ Admin seeding failed:", error);
  }
}
