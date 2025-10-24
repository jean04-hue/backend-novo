// src/controllers/user.controller.js
import bcrypt from "bcryptjs";
import { supabase } from "../supabaseClient.js";

export async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    // Verifica se já existe
    const { data: exists, error: errExists } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (errExists) {
      console.error("Erro checking user:", errExists);
      return res.status(500).json({ erro: "Erro ao verificar usuário" });
    }

    if (exists && exists.length > 0) {
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nome, email: email.toLowerCase(), senha: senhaHash }])
      .select("id, nome, email")
      .single();

    if (error) {
      console.error("Erro ao inserir usuário:", error);
      return res.status(500).json({ erro: "Erro ao cadastrar" });
    }

    return res.status(201).json({ usuario: data });
  } catch (err) {
    console.error("Erro no cadastrarUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha e-mail e senha" });
    }

    const { data: rows, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, senha")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ erro: "Erro ao buscar usuário" });
    }

    const usuario = rows && rows[0];
    if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado." });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: "Senha incorreta." });

    // Não retornar a senha
    return res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}
