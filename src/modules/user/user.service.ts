import { db } from "@/db";
import { users } from "@/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function registerUser(username: string, email: string, password: string) {
  const existing = await db.select().from(users).where(eq(users.email, email));

  if (existing.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.insert(users).values({
    username,
    email,
    password: hashedPassword,
  }).returning();

  return result[0];
}

export async function loginUser(email: string, password: string) {
  const result = await db.select().from(users).where(eq(users.email, email));

  if (result.length === 0) {
    throw new Error("User not found");
  }

  const valid = await bcrypt.compare(password, result[0].password);
  if (!valid) {
    throw new Error("Incorrect password");
  }

  return result[0];
}

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0]; 
}

export async function updateUser(id: number, data: Partial<{ username: string; email: string }>) {
  const result = await db.update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function deleteUser(id: number) {
  const result = await db.delete(users).where(eq(users.id, id)).returning();
  return result[0];
}