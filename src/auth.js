// src/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "emilyloja_token";

export function gerarToken(payload) {
  // expire em 7 dias por exemplo
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verificarTokenDoCookie(req) {
  const token = req.cookies?.[COOKIE_NAME] || null;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

// middleware express
export function requireAuth(req, res, next) {
  const decoded = verificarTokenDoCookie(req);
  if (!decoded) return res.status(401).json({ erro: "Não autenticado" });
  req.user = decoded; // { id, email, nome } conforme gerarmos
  next();
}
