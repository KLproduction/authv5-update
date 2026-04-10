import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUser(params: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isGuest: boolean;
  guestExpiresAt: Date | null;
}) {
  const hashedPassword = await bcrypt.hash(params.password, 10);

  await prisma.user.upsert({
    where: { email: params.email },
    update: {
      name: params.name,
      password: hashedPassword,
      role: params.role,
      emailVerified: new Date(),
      isGuest: params.isGuest,
      guestExpiresAt: params.guestExpiresAt,
    },
    create: {
      email: params.email,
      name: params.name,
      password: hashedPassword,
      role: params.role,
      emailVerified: new Date(),
      isGuest: params.isGuest,
      guestExpiresAt: params.guestExpiresAt,
    },
  });
}

async function main() {
  const guestExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await seedUser({
    email: "admin@authkit.local",
    name: "Auth Kit Admin",
    password: "Admin123!",
    role: UserRole.ADMIN,
    isGuest: false,
    guestExpiresAt: null,
  });

  await seedUser({
    email: "user@authkit.local",
    name: "Auth Kit User",
    password: "User123!",
    role: UserRole.USER,
    isGuest: false,
    guestExpiresAt: null,
  });

  await seedUser({
    email: "guest@authkit.local",
    name: "Auth Kit Guest",
    password: "Guest123!",
    role: UserRole.USER,
    isGuest: true,
    guestExpiresAt,
  });

  console.log("Seed complete:");
  console.log("- admin@authkit.local / Admin123!");
  console.log("- user@authkit.local / User123!");
  console.log("- guest@authkit.local / Guest123!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
