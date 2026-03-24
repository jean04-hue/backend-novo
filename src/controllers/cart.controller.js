import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔎 LISTAR CARRINHO
export async function listarCarrinho(req, res) {
  try {
    const userId = req.headers["user-id"];

    if (!userId) {
      return res.status(400).json({ erro: "Usuário não identificado" });
    }

    const carrinho = await prisma.carrinho.findMany({
      where: {
        usuario_id: Number(userId),
      },
      include: {
        produtos: true, // 🔥 IMPORTANTE pro front
      },
    });

    return res.json(carrinho);
  } catch (error) {
    console.error("Erro ao listar carrinho:", error);
    return res.status(500).json({ erro: "Erro ao listar carrinho" });
  }
}

// ➕ ADICIONAR AO CARRINHO
export async function adicionarCarrinho(req, res) {
  try {
    const userId = req.headers["user-id"];
    const { produto_id, quantidade } = req.body;

    if (!userId) {
      return res.status(400).json({ erro: "Usuário não identificado" });
    }

    if (!produto_id) {
      return res.status(400).json({ erro: "Produto obrigatório" });
    }

    // 🔁 VERIFICA SE JÁ EXISTE
    const itemExistente = await prisma.carrinho.findFirst({
      where: {
        usuario_id: Number(userId),
        produto_id: Number(produto_id),
      },
    });

    if (itemExistente) {
      const atualizado = await prisma.carrinho.update({
        where: { id: itemExistente.id },
        data: {
          quantidade: itemExistente.quantidade + (quantidade || 1),
        },
      });

      return res.json(atualizado);
    }

    // 🆕 CRIA NOVO ITEM
    const novoItem = await prisma.carrinho.create({
      data: {
        usuario_id: Number(userId),
        produto_id: Number(produto_id),
        quantidade: quantidade || 1,
      },
    });

    return res.status(201).json(novoItem);
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    return res.status(500).json({ erro: "Erro ao adicionar ao carrinho" });
  }
}

// ❌ REMOVER ITEM
export async function removerCarrinho(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ erro: "ID do item obrigatório" });
    }

    await prisma.carrinho.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({ mensagem: "Item removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover item:", error);
    return res.status(500).json({ erro: "Erro ao remover item" });
  }
}