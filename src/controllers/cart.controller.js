import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =============================
// 🛒 LISTAR
// =============================
export const listarCarrinho = async (req, res) => {
  try {
    const usuario_id = req.headers["user-id"]; // ✅ STRING

    if (!usuario_id) {
      return res.status(400).json({ erro: "Usuário não informado" });
    }

    const carrinho = await prisma.carrinho.findMany({
      where: { usuario_id },
      include: { produtos: true }
    });

    res.json(carrinho);
  } catch (error) {
    console.error("Erro ao listar carrinho:", error);
    res.status(500).json({ erro: "Erro ao listar carrinho" });
  }
};

// =============================
// ➕ ADICIONAR (CORRIGIDO)
// =============================
export const adicionarCarrinho = async (req, res) => {
  try {
    const usuario_id = req.headers["user-id"];
    const { produto_id, quantidade, tamanho, cor } = req.body;

    if (!usuario_id || !produto_id) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    const itemExistente = await prisma.carrinho.findFirst({
      where: {
        usuario_id,
        produto_id,
        tamanho,
        cor
      }
    });

    if (itemExistente) {
      const atualizado = await prisma.carrinho.update({
        where: { id: itemExistente.id },
        data: {
          quantidade: itemExistente.quantidade + quantidade
        }
      });

      return res.json(atualizado);
    }

    const novoItem = await prisma.carrinho.create({
      data: {
        usuario_id,
        produto_id,
        quantidade,
        tamanho,
        cor
      }
    });

    res.json(novoItem);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao adicionar ao carrinho" });
  }
};

// =============================
// ❌ REMOVER
// =============================
export const removerCarrinho = async (req, res) => {
  try {
    const id = req.params.id; // ✅ UUID
    const usuario_id = req.headers["user-id"];

    if (!id || !usuario_id) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    // 🔥 GARANTE QUE O ITEM É DO USUÁRIO
    const item = await prisma.carrinho.findFirst({
      where: {
        id,
        usuario_id
      }
    });

    if (!item) {
      return res.status(404).json({ erro: "Item não encontrado ou não pertence ao usuário" });
    }

    await prisma.carrinho.delete({
      where: { id }
    });

    res.json({ mensagem: "Item removido com sucesso" });

  } catch (error) {
    console.error("Erro ao remover:", error);

    res.status(500).json({ erro: "Erro ao remover item" });
  }
};