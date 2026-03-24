import express from "express";
import {
  listarCarrinho,
  adicionarCarrinho,
  removerCarrinho,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", listarCarrinho);
router.post("/", adicionarCarrinho);
router.delete("/:id", removerCarrinho);

export default router;