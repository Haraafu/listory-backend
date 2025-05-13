import { Router } from "express";
import { register, login, getMe, getUsers, getUserByIdHandler, updateUserById, deleteUserById } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.get("/", getUsers);
router.get("/:id", getUserByIdHandler);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
