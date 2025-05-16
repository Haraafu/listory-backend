import { Request, Response } from "express";
import { getAllBooks, getBookById, createBook, updateBook, deleteBook, searchAndFilterBooks } from "./book.service";
import { imagekit } from "../../utils/imagekit";

export const getBooks = async (_: Request, res: Response): Promise<void> => {
  const books = await getAllBooks();
  res.status(200).json({ success: true, data: books });
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const book = await getBookById(id);
  if (!book) {
    res.status(404).json({ success: false, message: "Book not found" });
    return;
  }
  res.status(200).json({ success: true, data: book });
};

export const postBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    let coverUrl: string | undefined;

    if (file) {
      const base64File = file.buffer.toString("base64");
      const mimeType = file.mimetype;

      const uploadResponse = await imagekit.upload({
        file: `data:${mimeType};base64,${base64File}`,
        fileName: file.originalname,
        folder: "/listory/books",
      });

      coverUrl = uploadResponse.url;
    }

    // Destructure & parse
    const {
      title,
      author,
      publisher,
      genre,
      releaseYear,
      rating,
      synopsis
    } = req.body;

    const book = await createBook({
      title,
      author,
      publisher,
      synopsis,
      genre: genre?.split(',').map((g: string) => g.trim()) ?? [],
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      rating: rating ? Number(rating) : undefined,
      coverUrl: coverUrl ?? "https://example.com/default-cover.jpg",
    });

    res.status(201).json({ success: true, data: book });
  } catch (error: any) {
    console.error("Book upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload book",
      error: error?.message || "Unknown error"
    });
  }
};

export const putBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid book ID" });
      return;
    }

    const existing = await getBookById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    let coverUrl = existing.coverUrl;

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/listory/books",
      });
      coverUrl = uploadResponse.url;
    }

    const updated = await updateBook(id, {
      ...req.body,
      coverUrl,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update book" });
  }
};


export const removeBook = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const deleted = await deleteBook(id);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Book not found" });
    return;
  }
  res.status(200).json({ success: true, message: "Book deleted", data: deleted });
};

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await searchAndFilterBooks(req.query);
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to search books" });
  }
};