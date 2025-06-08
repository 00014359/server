import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("parfume", 10);

  await prisma.user.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin user seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
