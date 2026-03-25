import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =============================
// 🛒 LISTAR
// =============================
export const listarCarrinho = async (req, res) => {
  try {
    const usuario_id = Number(req.headers["user-id"]);

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
    const usuario_id = Number(req.headers["user-id"]);
    const produto_id = req.body.produto_id; // ✅ NÃO CONVERTE PRA NUMBER

    if (!usuario_id || !produto_id) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    // 🔍 PROCURA ITEM EXISTENTE
    const itemExistente = await prisma.carrinho.findFirst({
      where: {
        usuario_id,
        produto_id // ✅ STRING (UUID)
      }
    });

    // 🔁 SE JÁ EXISTE → SOMA QUANTIDADE
    if (itemExistente) {
      const atualizado = await prisma.carrinho.update({
        where: { id: itemExistente.id },
        data: {
          quantidade: itemExistente.quantidade + 1
        }
      });

      return res.json(atualizado);
    }

    // 🆕 NOVO ITEM
    const novoItem = await prisma.carrinho.create({
      data: {
        usuario_id,
        produto_id, // ✅ STRING
        quantidade: 1
      }
    });

    res.json(novoItem);

  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    res.status(500).json({ erro: "Erro ao adicionar ao carrinho" });
  }
};

// =============================
// ❌ REMOVER
// =============================
export const removerCarrinho = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    await prisma.carrinho.delete({
      where: { id }
    });

    res.json({ mensagem: "Item removido" });

  } catch (error) {
    console.error("Erro ao remover:", error);
    res.status(500).json({ erro: "Erro ao remover item" });
  }
};