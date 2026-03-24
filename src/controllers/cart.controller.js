import { supabase } from "../supabaseClient.js";

// GET /api/carrinho
export async function listarCarrinho(req, res) {
  try {
    const usuario_id = req.headers["user-id"];

    if (!usuario_id) {
      return res.status(400).json({ erro: "Usuário não identificado" });
    }

    const { data, error } = await supabase
      .from("carrinho")
      .select(`
        id,
        quantidade,
        produtos (
          id,
          nome,
          preco,
          imagem_url,
          estoque
        )
      `)
      .eq("usuario_id", usuario_id);

    if (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao buscar carrinho" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
}

// POST /api/carrinho
export async function adicionarCarrinho(req, res) {
  try {
    const usuario_id = req.headers["user-id"];
    const { produto_id, quantidade } = req.body;

    if (!usuario_id || !produto_id) {
      return res.status(400).json({ erro: "Dados obrigatórios" });
    }

    // verifica se já existe
    const { data: existente } = await supabase
      .from("carrinho")
      .select("*")
      .eq("usuario_id", usuario_id)
      .eq("produto_id", produto_id)
      .single();

    if (existente) {
      const { data, error } = await supabase
        .from("carrinho")
        .update({
          quantidade: existente.quantidade + (quantidade || 1),
        })
        .eq("id", existente.id)
        .select()
        .single();

      if (error) throw error;

      return res.json(data);
    }

    const { data, error } = await supabase
      .from("carrinho")
      .insert([
        {
          usuario_id,
          produto_id,
          quantidade: quantidade || 1,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao adicionar ao carrinho" });
  }
}

// DELETE /api/carrinho/:id
export async function removerCarrinho(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("carrinho")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover" });
  }
}