import { Request, Response } from "express";
import { addMovieReview, addBookReview, getMovieReviews, getBookReviews, deleteBookReview, deleteMovieReview } from "./review.service";
import { movies, books, movieReviews, bookReviews } from "../../schema";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";

export const postMovieReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, movieId, rating, review } = req.body;

    if (!userId || !movieId || !rating || !review) {
      res.status(400).json({ success: false, message: "userId, movieId, rating, and review are required" });
      return;
    }

    if (rating < 1 || rating > 10) {
      res.status(400).json({ success: false, message: "Rating must be between 1 and 10" });
      return;
    }

    const movieExists = await db.select().from(movies).where(eq(movies.id, movieId));
    if (movieExists.length === 0) {
      res.status(404).json({ success: false, message: "Movie not found" });
      return;
    }

    const existingReview = await db.select().from(movieReviews).where(
      and(eq(movieReviews.userId, userId), eq(movieReviews.movieId, movieId))
    );
    if (existingReview.length > 0) {
      res.status(400).json({ success: false, message: "You have already reviewed this movie" });
      return;
    }

    const result = await addMovieReview(userId, movieId, rating, review);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error posting movie review:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const postBookReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookId, rating, review } = req.body;

    if (!userId || !bookId || !rating || !review) {
      res.status(400).json({ success: false, message: "userId, bookId, rating, and review are required" });
      return;
    }

    if (rating < 1 || rating > 10) {
      res.status(400).json({ success: false, message: "Rating must be between 1 and 10" });
      return;
    }

    const bookExists = await db.select().from(books).where(eq(books.id, bookId));
    if (bookExists.length === 0) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    const existingReview = await db.select().from(bookReviews).where(
      and(eq(bookReviews.userId, userId), eq(bookReviews.bookId, bookId))
    );
    if (existingReview.length > 0) {
      res.status(400).json({ success: false, message: "You have already reviewed this book" });
      return;
    }

    const result = await addBookReview(userId, bookId, rating, review);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error posting book review:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getReviewsForMovie = async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  if (isNaN(movieId)) {
    res.status(400).json({ success: false, message: "Invalid movie ID" });
    return;
  }

  const movie = await db.select().from(movies).where(eq(movies.id, movieId));
  if (movie.length === 0) {
    res.status(404).json({ success: false, message: "Movie not found" });
    return;
  }

  const result = await getMovieReviews(movieId);
  res.status(200).json({ success: true, data: result });
};

export const getReviewsForBook = async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);

  if (isNaN(bookId)) {
    res.status(400).json({ success: false, message: "Invalid book ID" });
    return;
  }

  const book = await db.select().from(books).where(eq(books.id, bookId));
  if (book.length === 0) {
    res.status(404).json({ success: false, message: "Book not found" });
    return;
  }

  const result = await getBookReviews(bookId);
  res.status(200).json({ success: true, data: result });
};

export const deleteMovieReviewHandler = async (req: Request, res: Response): Promise<void> => {
  const movieId = parseInt(req.params.id);
  const userId = parseInt(req.params.userId);

  if (isNaN(movieId) || isNaN(userId)) {
    res.status(400).json({ success: false, message: "Invalid movieId or userId" });
    return;
  }

  const deleted = await deleteMovieReview(userId, movieId);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Review not found" });
    return;
  }

  res.status(200).json({ success: true, message: "Movie review deleted" });
};

export const deleteBookReviewHandler = async (req: Request, res: Response): Promise<void> => {
  const bookId = parseInt(req.params.id);
  const userId = parseInt(req.params.userId);

  if (isNaN(bookId) || isNaN(userId)) {
    res.status(400).json({ success: false, message: "Invalid bookId or userId" });
    return;
  }

  const deleted = await deleteBookReview(userId, bookId);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Review not found" });
    return;
  }

  res.status(200).json({ success: true, message: "Book review deleted" });
};