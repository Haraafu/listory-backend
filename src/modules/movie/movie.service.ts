import { db } from "../../db";
import { movieReviews, movies } from "../../schema";
import { sql, and, ilike, eq, gte, asc, desc } from "drizzle-orm";

export async function getAllMovies() {
  return await db
    .select({
      id: movies.id,
      title: movies.title,
      director: movies.director,
      genre: movies.genre,
      rating: movies.rating,
      releaseYear: movies.releaseYear,
      posterUrl: movies.posterUrl,
      linkYoutube: movies.linkYoutube, 
      averageRating: sql<number>`AVG(${movieReviews.rating})`.mapWith(Number),
    })
    .from(movies)
    .leftJoin(movieReviews, eq(movies.id, movieReviews.movieId))
    .groupBy(movies.id);
}

export async function getMovieById(id: number) {
  const [movie] = await db.select().from(movies).where(eq(movies.id, id));
  if (!movie) return null;

  const [{ average }] = await db
    .select({ average: sql<number>`AVG(${movieReviews.rating})` })
    .from(movieReviews)
    .where(eq(movieReviews.movieId, id));

  return { ...movie, averageRating: average ?? 0 };
}

export async function createMovie(data: {
  title: string;
  director: string;
  genre: string[];
  synopsis?: string;
  releaseYear?: number;
  rating?: number;
  posterUrl?: string;
  linkYoutube?: string;
  cast?: string[];
}) {
  const result = await db.insert(movies).values({
    ...data,
    linkYoutube: data.linkYoutube ?? null, 
  }).returning();
  return result[0];
}

export async function updateMovie(id: number, data: Partial<typeof movies["_"]["columns"]>) {
  const result = await db.update(movies).set({
    ...data,
    linkYoutube: data.linkYoutube ?? null, 
  }).where(eq(movies.id, id)).returning();
  return result[0];
}

export async function deleteMovie(id: number) {
  const result = await db.delete(movies).where(eq(movies.id, id)).returning();
  return result[0];
}

export async function searchAndFilterMovies(query: {
  search?: string;
  genre?: string;
  releaseYear?: number;
  minRating?: number;
  sort?: "releaseYear" | "rating";
  order?: "asc" | "desc";
}) {
  const { search, genre, releaseYear, minRating, sort, order } = query;

  const whereClauses = [];

  if (search) {
    whereClauses.push(ilike(movies.title, `%${search}%`));
  }

  if (genre) {
    whereClauses.push(sql`${sql.raw(`'${genre}'`)} = ANY (${movies.genre})`);
  }

  if (releaseYear) {
    whereClauses.push(eq(movies.releaseYear, releaseYear));
  }

  if (minRating) {
    whereClauses.push(gte(movies.rating, minRating));
  }

  let dbQuery = db
    .select({
      id: movies.id,
      title: movies.title,
      director: movies.director,
      genre: movies.genre,
      rating: movies.rating,
      releaseYear: movies.releaseYear,
      posterUrl: movies.posterUrl,
      linkYoutube: movies.linkYoutube, 
      averageRating: sql<number>`AVG(${movieReviews.rating})`.mapWith(Number),
    })
    .from(movies)
    .leftJoin(movieReviews, eq(movies.id, movieReviews.movieId))
    .groupBy(movies.id)
    .where(whereClauses.length ? and(...whereClauses) : undefined);

  if (sort === "rating" || sort === "releaseYear") {
    dbQuery.orderBy(
      order === "desc" ? desc(movies[sort]) : asc(movies[sort])
    );
  }

  return await dbQuery;
}

export async function getMovieAverageRating(movieId: number) {
  const result = await db
    .select({ average: sql<number>`AVG(${movieReviews.rating})` })
    .from(movieReviews)
    .where(eq(movieReviews.movieId, movieId));

  return result[0]?.average ?? 0;
}
