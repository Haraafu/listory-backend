import { Router } from "express";
import { postMovieReview, postBookReview, getReviewsForMovie, getReviewsForBook } from "./review.controller";

const router = Router();

router.post("/movies/:id", postMovieReview);
router.post("/books/:id", postBookReview);
router.get("/movies/:id", getReviewsForMovie);
router.get("/books/:id", getReviewsForBook);

export default router;