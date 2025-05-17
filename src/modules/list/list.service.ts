import { db } from "../../db";
import { movieWatchlist, bookReadlist, movies, books, users, movieReviews, bookReviews } from "../../schema";
import { and, eq, sql } from "drizzle-orm";

export async function addWatchlist(userId: number, movieId: number) {
  const user = await db.select().from(users).where(eq(users.id, userId));
  if (user.length === 0) {
    throw new Error("User not found");
  }

  const movie = await db.select().from(movies).where(eq(movies.id, movieId));
  if (movie.length === 0) {
    throw new Error("Movie not found");
  }

  const existing = await db
    .select()
    .from(movieWatchlist)
    .where(and(eq(movieWatchlist.userId, userId), eq(movieWatchlist.movieId, movieId)));

  if (existing.length > 0) {
    throw new Error("Movie already in watchlist");
  }

  const result = await db.insert(movieWatchlist)
    .values({ userId, movieId })
    .returning();

  return result[0];
}

export async function getUserWatchlist(userId: number) {
  const results = await db
    .select({
      id: movies.id,
      title: movies.title,
      director: movies.director,
      genre: movies.genre,
      cast: movies.cast,
      synopsis: movies.synopsis,
      releaseYear: movies.releaseYear,
      rating: sql<number>`COALESCE(AVG(${movieReviews.rating}), ${movies.rating})`.mapWith(Number),
      posterUrl: movies.posterUrl,
      linkYoutube: movies.linkYoutube,
    })
    .from(movieWatchlist)
    .innerJoin(movies, eq(movieWatchlist.movieId, movies.id))
    .leftJoin(movieReviews, eq(movieWatchlist.movieId, movieReviews.movieId))
    .where(eq(movieWatchlist.userId, userId))
    .groupBy(movies.id);

  return results.map(movie => ({ ...movie, isAdded: true }));
}

export async function removeWatchlist(userId: number, movieId: number) {
  await db.delete(movieWatchlist)
    .where(and(eq(movieWatchlist.userId, userId), eq(movieWatchlist.movieId, movieId)));
}

export async function addReadlist(userId: number, bookId: number) {
  const user = await db.select().from(users).where(eq(users.id, userId));
  if (user.length === 0) {
    throw new Error("User not found");
  }

  const book = await db.select().from(books).where(eq(books.id, bookId));
  if (book.length === 0) {
    throw new Error("Book not found");
  }

  const existing = await db.select().from(bookReadlist)
    .where(and(eq(bookReadlist.userId, userId), eq(bookReadlist.bookId, bookId)));

  if (existing.length > 0) {
    throw new Error("Book already in readlist");
  }

  const result = await db.insert(bookReadlist)
    .values({ userId, bookId })
    .returning();

  return result[0];
}

export async function getUserReadlist(userId: number) {
  const results = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      publisher: books.publisher,
      description: books.description,
      genre: books.genre,
      releaseYear: books.releaseYear,
      coverUrl: books.coverUrl,
      rating: sql<number>`COALESCE(AVG(${bookReviews.rating}), ${books.rating})`.mapWith(Number),
    })
    .from(bookReadlist)
    .innerJoin(books, eq(bookReadlist.bookId, books.id))
    .leftJoin(bookReviews, eq(books.id, bookReviews.bookId))
    .where(eq(bookReadlist.userId, userId))
    .groupBy(books.id);

  return results.map(book => ({ ...book, isAdded: true }));
}

export async function removeReadlist(userId: number, bookId: number) {
  await db.delete(bookReadlist)
    .where(and(eq(bookReadlist.userId, userId), eq(bookReadlist.bookId, bookId)));
}
