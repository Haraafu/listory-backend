import { pgTable, serial, integer, boolean } from "drizzle-orm/pg-core";

export const bookReadlist = pgTable("book_readlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  isAdded: boolean("is_added").default(false),
});
