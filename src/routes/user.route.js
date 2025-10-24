// src/routes/user.route.js
import express from "express";
import { cadastrarUsuario, loginUsuario } from "../controllers/user.controller.js";
export const userRouter = express.Router();

userRouter.post("/cadastrar", cadastrarUsuario);
userRouter.post("/login", loginUsuario);