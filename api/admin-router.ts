import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, localUsers, contacts, messages } from "@db/schema";
import { sql, desc } from "drizzle-orm";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const [localUserCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(localUsers);
    const [contactCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contacts);
    const [messageCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages);

    return {
      totalUsers: userCount.count,
      totalLocalUsers: localUserCount.count,
      totalContacts: contactCount.count,
      totalMessages: messageCount.count,
    };
  }),

  users: adminQuery.query(async () => {
    const db = getDb();
    const oauthUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
    const localUsersList = await db
      .select()
      .from(localUsers)
      .orderBy(desc(localUsers.createdAt));

    const unified = [
      ...oauthUsers.map((u) => ({
        id: u.id,
        name: u.name || "Unknown",
        email: u.email || "",
        role: u.role,
        source: "oauth" as const,
        createdAt: u.createdAt,
      })),
      ...localUsersList.map((u) => ({
        id: u.id,
        name: u.displayName || u.username,
        email: u.email,
        role: u.role,
        source: "local" as const,
        createdAt: u.createdAt,
      })),
    ];

    return unified.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }),
});
