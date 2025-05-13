import { Request, Response } from "express";
import { addMovieReview, addBookReview, getMovieReviews, getBookReviews } from "./review.service";

export const postMovieReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, movieId, rating, review } = req.body;

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
    const { userId, bookId, rating, review } = req.body;

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
  const result = await getMovieReviews(movieId);
  res.status(200).json({ success: true, data: result });
};

export const getReviewsForBook = async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  const result = await getBookReviews(bookId);
  res.status(200).json({ success: true, data: result });
};
