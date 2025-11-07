// ===============================
// 📁 server.js — Backend LojaTeste
// ===============================

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Cria app Express
const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// 🌍 CONFIGURAÇÃO DE CORS
// ===============================
const allowedOrigins = [
  "https://lojatetse.netlify.app", // produção (Netlify)
  "http://127.0.0.1:5501",         // testes locais
  "http://localhost:5501"          // alternativa local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições sem "origin" (ex: Postman ou ApiDog)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`🚫 CORS bloqueado para origem: ${origin}`);
        return callback(new Error("Não autorizado pelo CORS."));
      }
    },
    credentials: true, // Necessário para cookies de sessão
  })
);

// ===============================
// 🧩 MIDDLEWARES GERAIS
// ===============================
app.use(express.json());
app.use(cookieParser());

// ===============================
// 🧠 SIMULAÇÃO DE USUÁRIO LOGADO
// (Exemplo básico para testar o front)
// ===============================
let usuarioSimulado = {
  nome: "Nei Junior",
  email: "nei@example.com",
  telefone: "(11) 99999-9999",
  endereco: "Rua das Flores, 123"
};

// ===============================
// 🔐 ROTAS DE AUTENTICAÇÃO E USUÁRIO
// ===============================

// Verificar usuário logado
app.get("/api/verificar-usuario", (req, res) => {
  try {
    // Simulação: se tiver cookie "usuarioLogado", retorna dados
    const usuarioCookie = req.cookies.usuarioLogado;

    if (!usuarioCookie) {
      // Usuário não logado
      return res.status(401).json({ erro: "Usuário não logado." });
    }

    // Retorna dados do usuário simulado
    return res.json(usuarioSimulado);
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Simular login e criar cookie
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;

  // Validação simples (substituir por banco de dados real)
  if (email === "nei@example.com" && senha === "123456") {
    res.cookie("usuarioLogado", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.json({ mensagem: "Login realizado com sucesso!" });
  }

  return res.status(401).json({ erro: "Credenciais inválidas." });
});

// Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("usuarioLogado", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.json({ mensagem: "Logout efetuado com sucesso." });
});

// ===============================
// 🚀 INICIALIZA SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente ativo: ${process.env.NODE_ENV || "desenvolvimento"}`);
});
