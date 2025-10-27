// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.route.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: true, // ou sua URL do front, ex: "https://sua-front.netlify.app"
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rota simples
app.get("/", (req, res) => res.send("🚀 API da EmilyLoja está online!"));

// Rotas de usuário
app.use("/api", userRouter);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
