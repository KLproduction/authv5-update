"use server";

import { signOut } from "@/auth";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function signOutAction() {
  const user = await currentUser();
  console.log("signOutAction", user);
  if (!user) return { error: "Unauthorized" };

  if (user.isGuest) {
    await db.user.delete({ where: { id: user.id } });
  }

  return signOut();
}
