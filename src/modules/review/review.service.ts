import { db } from "../../db";
import { movieReviews, bookReviews } from "@/schema";
import { eq } from "drizzle-orm";

export const addMovieReview = async (userId: number, movieId: number, rating: number, review: string) => {
  return await db.insert(movieReviews).values({ userId, movieId, rating, review }).returning();
};

export const addBookReview = async (userId: number, bookId: number, rating: number, review: string) => {
  return await db.insert(bookReviews).values({ userId, bookId, rating, review }).returning();
};

export const getMovieReviews = async (movieId: number) => {
  return await db.select().from(movieReviews).where(eq(movieReviews.movieId, movieId));
};

export const getBookReviews = async (bookId: number) => {
  return await db.select().from(bookReviews).where(eq(bookReviews.bookId, bookId));
};
