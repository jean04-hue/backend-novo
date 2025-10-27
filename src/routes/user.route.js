// src/routes/user.route.js
import express from "express";
import {
  cadastrarUsuario,
  loginUsuario,
  verificarUsuario,
  atualizarUsuario,
  logout,
  cancelarConta
} from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/cadastrar", cadastrarUsuario);
userRouter.post("/login", loginUsuario);
userRouter.get("/verificar-usuario", verificarUsuario);
userRouter.put("/atualizar-usuario", atualizarUsuario);
userRouter.post("/logout", logout);
userRouter.delete("/cancelar-conta", cancelarConta);
