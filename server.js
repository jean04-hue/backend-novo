import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", userRouter);

// Rota de teste
app.get("/", (req, res) => {
  res.send("🚀 API Backend está rodando!");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado em http://localhost:${PORT}`);
});
