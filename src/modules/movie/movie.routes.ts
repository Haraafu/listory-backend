import { Router } from "express";
import { getMovies, getMovie, postMovie, putMovie, removeMovie, searchMovies } from "./movie.controller";
import upload from "@/middlewares/upload";

const router = Router();

router.get("/search", searchMovies);
router.get("/", getMovies);
router.get("/:id", getMovie);
router.post("/", upload.single("poster"), postMovie); 
router.put("/:id", upload.single("poster"), putMovie);
router.delete("/:id", removeMovie);

export default router;
