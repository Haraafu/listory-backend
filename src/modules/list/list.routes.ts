import { Router } from "express";
import { addMovieToWatchlist, getWatchlist, deleteMovieFromWatchlist, addBookToReadlist, getReadlist, deleteBookFromReadlist } from "./list.controller";

const router = Router();

router.post("/movies", addMovieToWatchlist);
router.get("/movies/:userId", getWatchlist);
router.delete("/movies/:userId/:movieId", deleteMovieFromWatchlist);

router.post("/books", addBookToReadlist);
router.get("/books/:userId", getReadlist);
router.delete("/books/:userId/:bookId", deleteBookFromReadlist);

export default router;
