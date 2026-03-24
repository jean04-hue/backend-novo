import express from "express";
import {
  listarCarrinho,
  adicionarCarrinho,
  removerCarrinho,
} from "../controllers/cart.controller.js";

const router = express.Router();

// LISTAR ITENS DO CARRINHO
router.get("/", listarCarrinho);

// ADICIONAR ITEM
router.post("/", adicionarCarrinho);

// REMOVER ITEM
router.delete("/:id", removerCarrinho);

export default router;