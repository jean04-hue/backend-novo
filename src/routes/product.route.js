import express from "express";
import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "../controllers/product.controller.js";

export const productRouter = express.Router();

productRouter.get("/produtos", listarProdutos);
productRouter.get("/produtos/:id", buscarProdutoPorId);
productRouter.post("/produtos", criarProduto);
productRouter.put("/produtos/:id", atualizarProduto);
productRouter.delete("/produtos/:id", deletarProduto);