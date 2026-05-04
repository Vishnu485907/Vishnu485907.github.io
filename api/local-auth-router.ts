import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode(
  process.env.APP_SECRET || "default-secret-key-change-me"
);

async function createToken(userId: number, username: string, role: string) {
  return new SignJWT({ userId, username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyLocalToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    return payload as { userId: number; username: string; role: string };
  } catch {
    return null;
  }
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        displayName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const existingUsername = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);
      if (existingUsername.length > 0) {
        throw new Error("Username already taken");
      }

      const existingEmail = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.email, input.email))
        .limit(1);
      if (existingEmail.length > 0) {
        throw new Error("Email already registered");
      }

      const passwordHash = await bcrypt.hash(input.password, 10);

      const result = await db.insert(localUsers).values({
        username: input.username,
        email: input.email,
        passwordHash,
        displayName: input.displayName || input.username,
      });

      const userId = Number(result[0].insertId);
      const token = await createToken(userId, input.username, "user");

      return {
        token,
        user: {
          id: userId,
          username: input.username,
          displayName: input.displayName || input.username,
          email: input.email,
          role: "user" as const,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const foundUsers = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);

      if (foundUsers.length === 0) {
        throw new Error("Invalid username or password");
      }

      const user = foundUsers[0];
      const validPassword = await bcrypt.compare(
        input.password,
        user.passwordHash
      );

      if (!validPassword) {
        throw new Error("Invalid username or password");
      }

      const token = await createToken(user.id, user.username, user.role);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName || user.username,
          email: user.email,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const token =
      ctx.req.headers.get("x-local-auth-token") || "";
    if (!token) return null;

    const payload = await verifyLocalToken(token);
    if (!payload) return null;

    const db = getDb();
    const foundUsers = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, payload.userId))
      .limit(1);

    if (foundUsers.length === 0) return null;

    const user = foundUsers[0];
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      name: user.displayName || user.username,
      email: user.email,
      role: user.role,
    };
  }),
});
