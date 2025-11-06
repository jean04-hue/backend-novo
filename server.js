// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.route.js";

dotenv.config();
const app = express();

// 🟢 FRONTEND hospedado no Netlify
const FRONTEND_URL = process.env.FRONTEND_URL || "https://lojatetse.netlify.app";

app.use(cors({
  origin: FRONTEND_URL, // libera apenas o seu site
  credentials: true // necessário para enviar cookies
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Rota simples para teste
app.get("/", (req, res) => res.send("🚀 API da EmilyLoja está online e conectada!"));

// ✅ Rotas de usuário
app.use("/api", userRouter);

// ✅ Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ Inicializa servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
