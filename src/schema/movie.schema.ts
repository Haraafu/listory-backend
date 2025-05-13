import { pgTable, serial, varchar, text, integer, real } from "drizzle-orm/pg-core";

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  director: varchar("director", { length: 100 }).notNull(),
  synopsis: text("synopsis"),
  releaseYear: integer("release_year"),
  rating: real("rating"),
  genre: text("genre").array().notNull(),
  cast: text("cast").array(),
  posterUrl: varchar("poster_url", { length: 255 })
});
