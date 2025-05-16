import { db } from "../../db";
import { bookReviews, books } from "../../schema";
import { and, ilike, eq, gte, asc, desc, sql } from "drizzle-orm";

export async function getAllBooks() {
  return await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      publisher: books.publisher,
      genre: books.genre,
      rating: books.rating,
      releaseYear: books.releaseYear,
      coverUrl: books.coverUrl,
      averageRating: sql<number>`AVG(${bookReviews.rating})`.mapWith(Number),
    })
    .from(books)
    .leftJoin(bookReviews, eq(books.id, bookReviews.bookId))
    .groupBy(books.id);
}

export async function getBookById(id: number) {
  const [book] = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      publisher: books.publisher,
      genre: books.genre,
      rating: books.rating,
      releaseYear: books.releaseYear,
      coverUrl: books.coverUrl,
      description: books.description,
    })
    .from(books)
    .where(eq(books.id, id));

  if (!book) return null;

  const [{ average }] = await db
    .select({ average: sql<number>`AVG(${bookReviews.rating})` })
    .from(bookReviews)
    .where(eq(bookReviews.bookId, id));

  return { ...book, averageRating: average ?? 0 };
}

export async function createBook(data: {
  title: string;
  author: string;
  publisher?: string;
  synopsis?: string;
  releaseYear?: number;
  rating?: number;
  genre?: string[];
  coverUrl?: string;
}) {
  const result = await db.insert(books).values(data).returning();
  return result[0];
}

export async function updateBook(id: number, data: Partial<typeof books["_"]["columns"]>) {
  const result = await db.update(books).set(data).where(eq(books.id, id)).returning();
  return result[0];
}

export async function deleteBook(id: number) {
  const result = await db.delete(books).where(eq(books.id, id)).returning();
  return result[0];
}

export async function searchAndFilterBooks(query: {
  search?: string;
  genre?: string;
  publisher?: string;
  releaseYear?: number;
  minRating?: number;
  sort?: "releaseYear" | "rating";
  order?: "asc" | "desc";
}) {
  const { search, genre, publisher, releaseYear, minRating, sort, order } = query;

  const whereClauses = [];

  if (search) {
    whereClauses.push(ilike(books.title, `%${search}%`));
  }

  if (genre) {
    whereClauses.push(sql`${sql.raw(`'${genre}'`)} = ANY (${books.genre})`);
  }

  if (publisher) {
    whereClauses.push(ilike(books.publisher, `%${publisher}%`));
  }

  if (releaseYear) {
    whereClauses.push(eq(books.releaseYear, releaseYear));
  }

  if (minRating) {
    whereClauses.push(gte(books.rating, minRating));
  }

  let dbQuery = db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      publisher: books.publisher,
      genre: books.genre,
      rating: books.rating,
      releaseYear: books.releaseYear,
      coverUrl: books.coverUrl,
      averageRating: sql<number>`AVG(${bookReviews.rating})`.mapWith(Number),
    })
    .from(books)
    .leftJoin(bookReviews, eq(books.id, bookReviews.bookId))
    .groupBy(books.id)
    .where(whereClauses.length ? and(...whereClauses) : undefined);

  if (sort === "rating" || sort === "releaseYear") {
    dbQuery.orderBy(
      order === "desc" ? desc(books[sort]) : asc(books[sort])
    );
  }

  return await dbQuery;
}

export async function getBookAverageRating(bookId: number) {
  const result = await db
    .select({ average: sql<number>`AVG(${bookReviews.rating})` })
    .from(bookReviews)
    .where(eq(bookReviews.bookId, bookId));

  return result[0]?.average ?? 0;
}
