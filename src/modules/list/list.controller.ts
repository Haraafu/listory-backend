import { Request, Response } from "express";
import { addWatchlist, getUserWatchlist, removeWatchlist, addReadlist, getUserReadlist, removeReadlist } from "./list.service";

export const addMovieToWatchlist = async (req: Request, res: Response): Promise<void> => {
  const { userId, movieId } = req.body;
  const result = await addWatchlist(userId, movieId);
  res.status(201).json({ success: true, message: "Movie added to watchlist", data: result });
};

export const getWatchlist = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.userId);
  const result = await getUserWatchlist(userId);
  res.status(200).json({ success: true, data: result });
};

export const deleteMovieFromWatchlist = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.userId);
  const movieId = parseInt(req.params.movieId);
  await removeWatchlist(userId, movieId);
  res.status(200).json({ success: true, message: "Movie removed from watchlist" });
};

export const addBookToReadlist = async (req: Request, res: Response): Promise<void> => {
  const { userId, bookId } = req.body;
  const result = await addReadlist(userId, bookId);
  res.status(201).json({ success: true, message: "Book added to readlist", data: result });
};

export const getReadlist = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.userId);
  const result = await getUserReadlist(userId);
  res.status(200).json({ success: true, data: result });
};

export const deleteBookFromReadlist = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.userId);
  const bookId = parseInt(req.params.bookId);
  await removeReadlist(userId, bookId);
  res.status(200).json({ success: true, message: "Book removed from readlist" });
};
