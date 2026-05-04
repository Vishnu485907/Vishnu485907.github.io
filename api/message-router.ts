import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { messages } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const messageRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(messages).values({
        name: input.name,
        email: input.email,
        content: input.content,
      });
      const newMessage = await db
        .select()
        .from(messages)
        .where(eq(messages.id, Number(result[0].insertId)))
        .limit(1);
      return { success: true, message: newMessage[0] };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(messages).orderBy(desc(messages.createdAt));
  }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(messages).where(eq(messages.id, input.id));
      return { success: true };
    }),
});
