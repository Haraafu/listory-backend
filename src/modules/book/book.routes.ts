import { Router } from "express";
import upload from "../../middlewares/upload";
import { getBooks, getBook, postBook, putBook, removeBook, searchBooks } from "./book.controller";

const router = Router();

router.get("/search", searchBooks);
router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", upload.single("cover"), postBook);
router.put("/:id", upload.single("cover"), putBook);
router.delete("/:id", removeBook);

export default router;
