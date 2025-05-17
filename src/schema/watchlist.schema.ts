import { pgTable, serial, integer, boolean } from "drizzle-orm/pg-core";

export const movieWatchlist = pgTable("movie_watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  movieId: integer("movie_id").notNull(),
  isAdded: boolean("is_added").default(false),
});