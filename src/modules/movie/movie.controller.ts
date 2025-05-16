import { Request, Response } from "express";
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie, searchAndFilterMovies } from "./movie.service";
import { imagekit } from "../../utils/imagekit";

export const getMovies = async (_: Request, res: Response): Promise<void> => {
  const movies = await getAllMovies();
  res.status(200).json({ success: true, data: movies });
};

export const getMovie = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const movie = await getMovieById(id);
  if (!movie) {
    res.status(404).json({ success: false, message: "Movie not found" });
    return;
  }
  res.status(200).json({ success: true, data: movie });
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
      synopsis,
      releaseYear,
      rating,
      linkYoutube,
      genre,
      cast,
    } = req.body;

    const movie = await createMovie({
      title,
      director,
      synopsis,
      releaseYear: releaseYear !== undefined && releaseYear !== null && releaseYear !== "" ? Number(releaseYear) : undefined,
      rating: rating ? Number(rating) : undefined,
      linkYoutube: linkYoutube ?? null,
      genre: typeof genre === "string" ? genre.split(",").map((g: string) => g.trim()) : genre,
      cast: typeof cast === "string" ? cast.split(",").map((c: string) => c.trim()) : cast,
      posterUrl,
    });

    res.status(201).json({ success: true, data: movie });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to upload movie", error: error.message });
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
    if (req.file) {
      const base64File = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;
      const uploadResponse = await imagekit.upload({
        file: `data:${mimeType};base64,${base64File}`,
        fileName: req.file.originalname,
        folder: "/listory/movies",
      });
      posterUrl = uploadResponse.url;
    }

    const {
      title,
      director,
      synopsis,
      releaseYear,
      rating,
      linkYoutube,
      genre,
      cast,
    } = req.body;

    const updated = await updateMovie(id, {
      title,
      director,
      synopsis,
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      rating: rating ? Number(rating) : undefined,
      linkYoutube: linkYoutube ?? null,
      genre: typeof genre === "string" ? genre.split(",").map((g: string) => g.trim()) : genre,
      cast: typeof cast === "string" ? cast.split(",").map((c: string) => c.trim()) : cast,
      posterUrl,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update movie", error: error.message });
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