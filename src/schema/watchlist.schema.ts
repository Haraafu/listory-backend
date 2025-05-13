import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const movieWatchlist = pgTable("movie_watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  movieId: integer("movie_id").notNull(),
});