import { supabase } from "../supabaseClient.js";

// GET /api/produtos
export async function listarProdutos(req, res) {
  try {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("ativo", true)
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("Erro ao listar produtos:", error);
      return res.status(500).json({ erro: "Erro ao listar produtos" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Erro listarProdutos:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// GET /api/produtos/:id
export async function buscarProdutoPorId(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar produto:", error);
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Erro buscarProdutoPorId:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// POST /api/produtos
export async function criarProduto(req, res) {
  try {
    const {
      nome,
      descricao,
      preco,
      categoria,
      imagem_url,
      estoque,
      ativo
    } = req.body;

    if (!nome || !categoria || preco === undefined || estoque === undefined) {
      return res.status(400).json({ erro: "Preencha os campos obrigatórios" });
    }

    const { data, error } = await supabase
      .from("produtos")
      .insert([
        {
          nome: String(nome).trim(),
          descricao: descricao ? String(descricao).trim() : "",
          preco: Number(preco),
          categoria: String(categoria).trim(),
          imagem_url: imagem_url ? String(imagem_url).trim() : "",
          estoque: Number(estoque),
          ativo: ativo !== undefined ? Boolean(ativo) : true,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao criar produto:", error);
      return res.status(500).json({ erro: "Erro ao criar produto" });
    }

    return res.status(201).json({
      ok: true,
      produto: data,
    });
  } catch (err) {
    console.error("Erro criarProduto:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// PUT /api/produtos/:id
export async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;

    const payload = {};

    if (req.body.nome !== undefined) payload.nome = String(req.body.nome).trim();
    if (req.body.descricao !== undefined) payload.descricao = String(req.body.descricao).trim();
    if (req.body.preco !== undefined) payload.preco = Number(req.body.preco);
    if (req.body.categoria !== undefined) payload.categoria = String(req.body.categoria).trim();
    if (req.body.imagem_url !== undefined) payload.imagem_url = String(req.body.imagem_url).trim();
    if (req.body.estoque !== undefined) payload.estoque = Number(req.body.estoque);
    if (req.body.ativo !== undefined) payload.ativo = Boolean(req.body.ativo);

    const { data, error } = await supabase
      .from("produtos")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao atualizar produto:", error);
      return res.status(500).json({ erro: "Erro ao atualizar produto" });
    }

    return res.json({
      ok: true,
      produto: data,
    });
  } catch (err) {
    console.error("Erro atualizarProduto:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// DELETE /api/produtos/:id
export async function deletarProduto(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar produto:", error);
      return res.status(500).json({ erro: "Erro ao deletar produto" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro deletarProduto:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}