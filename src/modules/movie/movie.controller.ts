import { Request, Response } from "express";
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie, searchAndFilterMovies } from "./movie.service";
import { imagekit } from "../../utils/imagekit";

export const getMovies = async (_: Request, res: Response) => {
  const movies = await getAllMovies();
  res.status(200).json({ success: true, data: movies });
};

export const getMovie = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid movie ID" });
    return;
  }

  try {
    const movie = await getMovieById(id);
    if (!movie) {
      res.status(404).json({ success: false, message: "Movie not found" });
      return;
    }

    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const postMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    let posterUrl: string | undefined;

    if (file) {
      const base64File = file.buffer.toString("base64");
      const mimeType = file.mimetype;

      const uploadResponse = await imagekit.upload({
        file: `data:${mimeType};base64,${base64File}`,
        fileName: file.originalname,
        folder: "/listory/movies",
      });

      posterUrl = uploadResponse.url;
    }

    const {
      title,
      director,
      genre,
      cast,
      synopsis,
      releaseYear,
      rating,
      linkYoutube
    } = req.body;

    const movie = await createMovie({
      title,
      director,
      genre: genre.split(',').map((g: string) => g.trim()),
      cast: cast ? cast.split(',').map((c: string) => c.trim()) : [],
      synopsis,
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      rating: rating ? Number(rating) : undefined,
      posterUrl,
      linkYoutube: linkYoutube ?? null,
    });

    res.status(201).json({ success: true, data: movie });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export const putMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const existing = await getMovieById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Movie not found" });
      return;
    }

    let posterUrl = existing.posterUrl;
    const file = req.file;

    if (file) {
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "/listory/movies",
      });
      posterUrl = uploadResponse.url;
    }

    const updated = await updateMovie(id, {
      ...req.body,
      posterUrl,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update movie" });
  }
};

export const removeMovie = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const deleted = await deleteMovie(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: "Movie not found" });
    return;
  }

  res.status(200).json({ success: true, message: "Movie deleted", data: deleted });
};

export const searchMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await searchAndFilterMovies(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to search movies" });
  }
};