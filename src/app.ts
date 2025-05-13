import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./modules/user/user.routes";
import movieRoutes from "./modules/movie/movie.routes";
import bookRoutes from "./modules/book/book.routes";
import listRoutes from "./modules/list/list.routes";
import reviewRoutes from "./modules/review/review.routes";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/list", listRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (_: Request, res: Response) => {
  res.send("Listory API is running!");
});

export default app;