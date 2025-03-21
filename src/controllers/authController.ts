import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.register(name, email, password);
    res.status(201).json(user);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authResponse = await AuthService.login(email, password);
    res.json(authResponse);
    return;
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
};
