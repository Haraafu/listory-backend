import { db } from "@/db";
import { movieWatchlist, bookReadlist, movies, books } from "@/schema";
import { and, eq } from "drizzle-orm";

export async function addWatchlist(userId: number, movieId: number) {
  const result = await db.insert(movieWatchlist).values({ userId, movieId }).returning();
  return result[0];
}

export async function getUserWatchlist(userId: number) {
  return await db.select({
    id: movies.id,
    title: movies.title,
    director: movies.director,
    genre: movies.genre,
    rating: movies.rating
  })
    .from(movieWatchlist)
    .innerJoin(movies, eq(movieWatchlist.movieId, movies.id))
    .where(eq(movieWatchlist.userId, userId));
}

export async function removeWatchlist(userId: number, movieId: number) {
  await db.delete(movieWatchlist)
    .where(and(eq(movieWatchlist.userId, userId), eq(movieWatchlist.movieId, movieId)));
}

export async function addReadlist(userId: number, bookId: number) {
  const result = await db.insert(bookReadlist).values({ userId, bookId }).returning();
  return result[0];
}

export async function getUserReadlist(userId: number) {
  return await db.select({
    id: books.id,
    title: books.title,
    author: books.author,
    genre: books.genre,
    rating: books.rating
  })
    .from(bookReadlist)
    .innerJoin(books, eq(bookReadlist.bookId, books.id))
    .where(eq(bookReadlist.userId, userId));
}

export async function removeReadlist(userId: number, bookId: number) {
  await db.delete(bookReadlist)
    .where(and(eq(bookReadlist.userId, userId), eq(bookReadlist.bookId, bookId)));
}
