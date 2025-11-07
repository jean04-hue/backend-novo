import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "https://lojatetse.netlify.app", // produção
  "http://127.0.0.1:5501",        // testes locais
  "http://localhost:5501"          // alternativa local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições sem "origin" (como do Postman ou ApiDog)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS bloqueado para: " + origin));
    },
    credentials: true, // necessário para cookies
  })
);

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
