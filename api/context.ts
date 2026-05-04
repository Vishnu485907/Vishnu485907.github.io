import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth-router";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

export type UnifiedUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  avatar?: string | null;
  source: "oauth" | "local";
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: UnifiedUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    const oauthUser = await authenticateRequest(opts.req.headers);
    if (oauthUser) {
      ctx.user = {
        id: oauthUser.id,
        name: oauthUser.name,
        email: oauthUser.email,
        role: oauthUser.role as "user" | "admin",
        avatar: oauthUser.avatar,
        source: "oauth",
      };
      return ctx;
    }
  } catch {
    // OAuth not available, try local auth
  }

  // Try local auth
  try {
    const localToken = opts.req.headers.get("x-local-auth-token");
    if (localToken) {
      const payload = await verifyLocalToken(localToken);
      if (payload) {
        const db = getDb();
        const foundUsers = await db
          .select()
          .from(localUsers)
          .where(eq(localUsers.id, payload.userId))
          .limit(1);

        if (foundUsers.length > 0) {
          const localUser = foundUsers[0];
          ctx.user = {
            id: localUser.id,
            name: localUser.displayName || localUser.username,
            email: localUser.email,
            role: localUser.role as "user" | "admin",
            source: "local",
          };
        }
      }
    }
  } catch {
    // Local auth not available
  }

  return ctx;
}
