import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.route.js";
import { productRouter } from "./src/routes/product.route.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://lojatetse.netlify.app",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origem não permitida pelo CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("🚀 API da EmilyLoja está online!");
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    app: "EmilyLoja API",
    env: process.env.NODE_ENV || "development",
  });
});

app.use("/api", userRouter);
app.use("/api", productRouter);

app.use((err, req, res, next) => {
  console.error("Erro global:", err);

  if (err.message === "Origem não permitida pelo CORS") {
    return res.status(403).json({ erro: "Origem não permitida" });
  }

  return res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});