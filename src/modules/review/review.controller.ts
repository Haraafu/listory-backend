import { Request, Response } from "express";
import { addMovieReview, addBookReview, getMovieReviews, getBookReviews } from "./review.service";
import { movies, books } from "../../schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export const postMovieReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.id);
    const { userId, rating, review } = req.body;

    if (!userId || !rating || !review) {
      res.status(400).json({ success: false, message: "userId, rating, and review are required" });
      return;
    }

    if (isNaN(movieId)) {
      res.status(400).json({ success: false, message: "Invalid movieId in params" });
      return;
    }

    if (rating < 1 || rating > 10) {
      res.status(400).json({ success: false, message: "Rating must be between 1 and 10" });
      return;
    }

    const result = await addMovieReview(userId, movieId, rating, review);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error posting movie review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const postBookReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.id);
    const { userId, rating, review } = req.body;

    if (!userId || !rating || !review) {
      res.status(400).json({ success: false, message: "userId, rating, and review are required" });
      return;
    }

    if (isNaN(bookId)) {
      res.status(400).json({ success: false, message: "Invalid bookId in params" });
      return;
    }

    if (rating < 1 || rating > 10) {
      res.status(400).json({ success: false, message: "Rating must be between 1 and 10" });
      return;
    }

    const result = await addBookReview(userId, bookId, rating, review);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error posting book review:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
