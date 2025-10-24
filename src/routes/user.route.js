import express from "express";
import { cadastrarUsuario } from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/cadastrar", cadastrarUsuario);
