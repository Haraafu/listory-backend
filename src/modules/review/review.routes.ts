import { Router } from "express";
import { postMovieReview, postBookReview, getReviewsForMovie, getReviewsForBook, deleteMovieReviewHandler, deleteBookReviewHandler } from "./review.controller";

const router = Router();

router.post("/movies", postMovieReview);
router.post("/books", postBookReview);
router.get("/movies/:id", getReviewsForMovie);
router.get("/books/:id", getReviewsForBook);
router.delete("/movies/:id/:userId", deleteMovieReviewHandler);
router.delete("/books/:id/:userId", deleteBookReviewHandler);

export default router;