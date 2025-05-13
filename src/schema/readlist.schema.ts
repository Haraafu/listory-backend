import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const bookReadlist = pgTable("book_readlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
});
