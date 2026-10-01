import "dotenv/config";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const admins = [
  { name: "Zahraa Mannoun", email: "zahraa@admin.com" },
  { name: "Ahmad", email: "ahmad@admin.com" },
  { name: "Zakaria", email: "zakaria@admin.com" },
];

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  for (const admin of admins) {
    const user = await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        passwordHash,
        role: "ADMIN",
      },
      create: {
        name: admin.name,
        email: admin.email,
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log(user.email);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
