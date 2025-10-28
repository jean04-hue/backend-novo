import bcrypt from "bcryptjs";
import { supabase } from "../supabaseClient.js";
import { gerarToken, verificarTokenDoCookie } from "../middlewares/auth.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "emilyloja_token";
const IS_PROD = process.env.NODE_ENV === "production";

// POST /api/cadastrar
export async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ erro: "Preencha todos os campos" });

    const { data: exists, error: errExists } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (errExists) return res.status(500).json({ erro: "Erro ao verificar usuário" });
    if (exists && exists.length > 0)
      return res.status(400).json({ erro: "E-mail já cadastrado" });

    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nome, email: email.toLowerCase(), senha: senhaHash }])
      .select("id, nome, email")
      .single();

    if (error) return res.status(500).json({ erro: "Erro ao cadastrar" });

    const token = gerarToken({ id: data.id, email: data.email, nome: data.nome });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return res.status(201).json({ usuario: data });
  } catch (err) {
    console.error("Erro cadastrarUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// POST /api/login
export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ erro: "Preencha e-mail e senha" });

    const { data: rows, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, senha")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (error) return res.status(500).json({ erro: "Erro ao buscar usuário" });
    const usuario = rows && rows[0];
    if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado." });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: "Senha incorreta." });

    const token = gerarToken({ id: usuario.id, email: usuario.email, nome: usuario.nome });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error("Erro loginUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// GET /api/verificar-usuario
export async function verificarUsuario(req, res) {
  try {
    const decoded = verificarTokenDoCookie(req);
    if (!decoded) return res.status(401).json({ erro: "Não autenticado" });

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, telefone, endereco, criado_em")
      .eq("id", decoded.id)
      .limit(1);

    if (error) return res.status(500).json({ erro: "Erro ao buscar usuário" });
    if (!data || data.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    return res.json(data[0]);
  } catch (err) {
    console.error("Erro verificarUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// PUT /api/atualizar-usuario
export async function atualizarUsuario(req, res) {
  try {
    const decoded = verificarTokenDoCookie(req);
    if (!decoded) return res.status(401).json({ erro: "Não autenticado" });

    const allowed = ["nome", "telefone", "endereco", "email", "senha"];
    const payload = {};
    for (const k of allowed) {
      if (k in req.body && req.body[k] !== undefined) payload[k] = req.body[k];
    }

    if (Object.keys(payload).length === 0)
      return res.status(400).json({ erro: "Nada para atualizar" });

    if (payload.senha) payload.senha = await bcrypt.hash(payload.senha, 10);

    if (payload.email) {
      const { data: exists } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", payload.email.toLowerCase())
        .limit(1);
      if (exists && exists.length > 0 && exists[0].id !== decoded.id) {
        return res.status(400).json({ erro: "E-mail já em uso" });
      }
      payload.email = payload.email.toLowerCase();
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update(payload)
      .eq("id", decoded.id)
      .select("id, nome, email, telefone, endereco")
      .single();

    if (error) return res.status(500).json({ erro: "Erro ao atualizar" });

    return res.json({ usuario: data });
  } catch (err) {
    console.error("Erro atualizarUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// POST /api/logout
export async function logout(req, res) {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "lax",
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro logout:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// DELETE /api/cancelar-conta
export async function cancelarConta(req, res) {
  try {
    const decoded = verificarTokenDoCookie(req);
    if (!decoded) return res.status(401).json({ erro: "Não autenticado" });

    const { error } = await supabase.from("usuarios").delete().eq("id", decoded.id);
    if (error) return res.status(500).json({ erro: "Erro ao cancelar conta" });

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "lax",
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro cancelarConta:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// 👇 exportações nomeadas (ESSENCIAL)
export {
  cadastrarUsuario,
  loginUsuario,
  verificarUsuario,
  atualizarUsuario,
  logout,
  cancelarConta,
};
