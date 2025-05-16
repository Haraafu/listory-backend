import { db } from "../../db";
import { movieReviews, bookReviews } from "../../schema";
import { eq, and } from "drizzle-orm";

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

export const deleteMovieReview = async (userId: number, movieId: number) => {
  const result = await db.delete(movieReviews)
    .where(and(eq(movieReviews.userId, userId), eq(movieReviews.movieId, movieId)))
    .returning();
  return result[0]; 
};

export const deleteBookReview = async (userId: number, bookId: number) => {
  const result = await db.delete(bookReviews)
    .where(and(eq(bookReviews.userId, userId), eq(bookReviews.bookId, bookId)))
    .returning();
  return result[0]; 
};