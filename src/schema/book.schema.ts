import { pgTable, serial, varchar, text, integer, real } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  publisher: varchar("publisher", { length: 100 }), 
  description: text("description"),
  releaseYear: integer("release_year"),
  rating: real("rating"),
  genre: text("genre").array(),
  coverUrl: varchar("cover_url", { length: 500 })
});
