import { Request, Response } from "express";
import { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } from "./user.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: "Invalid email format" });
      return;
    }

    if (!passwordRegex.test(password)) {
      res.status(400).json({ success: false, message: "Password must be at least 8 characters and include letters and numbers" });
      return;
    }

    const user = await registerUser(username, email, password);
    res.status(201).json({ success: true, message: "User registered", data: user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, message: "Login successful", data: user, token });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Current user",
    data: req.user,
  });
};

export const getUsers = async (_: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json({ success: true, data: users });
};

export const getUserByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const user = await getUserById(id); 

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, data: user });
};

export const updateUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updated = await updateUser(id, req.body);
  res.status(200).json({ success: true, data: updated });
};

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const deleted = await deleteUser(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, message: "User deleted", data: deleted });
};
