import { Request, Response } from "express";
import { addWatchlist, getUserWatchlist, removeWatchlist, addReadlist, getUserReadlist, removeReadlist } from "./list.service";
import { db } from "../../db";
import { users } from "../../schema";
import { eq } from "drizzle-orm";

export const addMovieToWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      res.status(400).json({ success: false, message: "userId and movieId are required" });
      return;
    }

    const result = await addWatchlist(userId, movieId);
    res.status(201).json({ success: true, message: "Movie added to watchlist", data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: "Invalid userId" });
      return;
    }

    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const result = await getUserWatchlist(userId);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Failed to get watchlist" });
  }
};

export const deleteMovieFromWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const movieId = parseInt(req.params.movieId);

    if (isNaN(userId) || isNaN(movieId)) {
      res.status(400).json({ success: false, message: "Invalid userId or movieId" });
      return;
    }

    await removeWatchlist(userId, movieId);
    res.status(200).json({ success: true, message: "Movie removed from watchlist" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Failed to remove movie from watchlist" });
  }
};

export const addBookToReadlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      res.status(400).json({ success: false, message: "userId and bookId are required" });
      return;
    }

    const result = await addReadlist(userId, bookId);
    res.status(201).json({ success: true, message: "Book added to readlist", data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getReadlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: "Invalid userId" });
      return;
    }

    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const result = await getUserReadlist(userId);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Failed to get readlist" });
  }
};

export const deleteBookFromReadlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);

    if (isNaN(userId) || isNaN(bookId)) {
      res.status(400).json({ success: false, message: "Invalid userId or bookId" });
      return;
    }

    await removeReadlist(userId, bookId);
    res.status(200).json({ success: true, message: "Book removed from readlist" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Failed to remove book from readlist" });
  }
};