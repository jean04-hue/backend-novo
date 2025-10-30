// src/middlewares/auth.js
import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_temporario";
const COOKIE_NAME = process.env.COOKIE_NAME || "emilyloja_token";

// 🔐 Verifica o token do cookie
export function verificarTokenDoCookie(req) {
  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies[COOKIE_NAME];
    if (!token) return null;

    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return null;
  }
}

// ✅ Middleware de autenticação
export function autenticar(req, res, next) {
  const decoded = verificarTokenDoCookie(req);
  if (!decoded) return res.status(401).json({ erro: "Não autenticado" });
  req.usuario = decoded;
  next();
}

// 🧾 Gera novo token JWT
export function gerarToken(dados) {
  return jwt.sign(dados, JWT_SECRET, { expiresIn: "7d" });
}
