import { pgTable, serial, integer, real, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { movies } from "./movie.schema";
import { books } from "./book.schema";

export const movieReviews = pgTable("movie_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  rating: real("rating").notNull(),
  review: text("review"),
  isReview: boolean("is_review").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookReviews = pgTable("book_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  rating: real("rating").notNull(),
  review: text("review"),
  isReview: boolean("is_review").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});