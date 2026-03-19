import bcrypt from "bcryptjs";
import { supabase } from "../supabaseClient.js";
import { gerarToken, verificarTokenDoCookie } from "../middlewares/auth.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "emilyloja_token";
const IS_PROD = process.env.NODE_ENV === "production";

<<<<<<< HEAD
// Para Netlify(front) -> Render(back) com credentials/include,
// o cookie precisa ser SameSite=None + Secure em produção.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function normalizarEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validarEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function respostaErroSupabase(res, contexto, error) {
  console.error(`Erro ${contexto}:`, error);
  return res.status(500).json({ erro: `Erro ao ${contexto}` });
}

// POST /api/cadastrar
=======
// ✅ POST /api/cadastrar
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96
export async function cadastrarUsuario(req, res) {
  try {
    const nome = String(req.body?.nome || "").trim();
    const email = normalizarEmail(req.body?.email);
    const senha = String(req.body?.senha || "");

<<<<<<< HEAD
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ erro: "E-mail inválido" });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres" });
    }

    const { data: existeUsuario, error: erroBusca } = await supabase
=======
    const { data: exists } = await supabase
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .limit(1);

<<<<<<< HEAD
    if (erroBusca) {
      return respostaErroSupabase(res, "verificar usuário", erroBusca);
    }

    if (existeUsuario && existeUsuario.length > 0) {
=======
    if (exists && exists.length > 0)
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nome,
          email,
          senha: senhaHash,
        },
      ])
      .select("id, nome, email")
      .single();

    if (error) {
      return respostaErroSupabase(res, "cadastrar usuário", error);
    }

    const token = gerarToken({
      id: data.id,
      nome: data.nome,
      email: data.email,
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.status(201).json({
      ok: true,
      usuario: data,
    });
  } catch (err) {
    console.error("Erro cadastrarUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// ✅ POST /api/login
export async function loginUsuario(req, res) {
  try {
    const email = normalizarEmail(req.body?.email);
    const senha = String(req.body?.senha || "");

<<<<<<< HEAD
    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha e-mail e senha" });
    }

    const { data: usuarios, error } = await supabase
=======
    const { data: rows } = await supabase
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96
      .from("usuarios")
      .select("id, nome, email, senha, telefone, endereco")
      .eq("email", email)
      .limit(1);

<<<<<<< HEAD
    if (error) {
      return respostaErroSupabase(res, "buscar usuário", error);
    }

    const usuario = usuarios?.[0];

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }
=======
    const usuario = rows && rows[0];
    if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado." });
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = gerarToken({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.json({
      ok: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || null,
        endereco: usuario.endereco || null,
      },
    });
  } catch (err) {
    console.error("Erro loginUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// ✅ GET /api/verificar-usuario
export async function verificarUsuario(req, res) {
  try {
    const decoded = verificarTokenDoCookie(req);

<<<<<<< HEAD
    if (!decoded) {
      return res.status(401).json({ erro: "Não autenticado" });
    }

    const { data: usuarios, error } = await supabase
=======
    const { data } = await supabase
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96
      .from("usuarios")
      .select("id, nome, email, telefone, endereco, criado_em")
      .eq("id", decoded.id)
      .limit(1);

<<<<<<< HEAD
    if (error) {
      return respostaErroSupabase(res, "buscar usuário", error);
    }
=======
    if (!data || data.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96

    const usuario = usuarios?.[0];

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.json(usuario);
  } catch (err) {
    console.error("Erro verificarUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// ✅ PUT /api/atualizar-usuario
export async function atualizarUsuario(req, res) {
  try {
    const decoded = verificarTokenDoCookie(req);

    if (!decoded) {
      return res.status(401).json({ erro: "Não autenticado" });
    }

    const payload = {};

    if (req.body?.nome !== undefined) {
      payload.nome = String(req.body.nome).trim();
    }

    if (req.body?.telefone !== undefined) {
      payload.telefone = String(req.body.telefone).trim();
    }

    if (req.body?.endereco !== undefined) {
      payload.endereco = String(req.body.endereco).trim();
    }

    if (req.body?.email !== undefined) {
      const emailNormalizado = normalizarEmail(req.body.email);

      if (!validarEmail(emailNormalizado)) {
        return res.status(400).json({ erro: "E-mail inválido" });
      }

      payload.email = emailNormalizado;
    }

    if (req.body?.senha !== undefined && req.body.senha !== "") {
      const senha = String(req.body.senha);

      if (senha.length < 6) {
        return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres" });
      }

      payload.senha = await bcrypt.hash(senha, 10);
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ erro: "Nada para atualizar" });
    }

    if (payload.email) {
      const { data: existeEmail, error: erroEmail } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", payload.email)
        .limit(1);
<<<<<<< HEAD

      if (erroEmail) {
        return respostaErroSupabase(res, "verificar e-mail", erroEmail);
      }

      if (existeEmail && existeEmail.length > 0 && existeEmail[0].id !== decoded.id) {
        return res.status(400).json({ erro: "E-mail já em uso" });
      }
=======
      if (exists && exists.length > 0 && exists[0].id !== decoded.id)
        return res.status(400).json({ erro: "E-mail já em uso" });
      payload.email = payload.email.toLowerCase();
>>>>>>> 14b33b5911260b482c8506dd8e46796402f08f96
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update(payload)
      .eq("id", decoded.id)
      .select("id, nome, email, telefone, endereco")
      .single();

    if (error) {
      return respostaErroSupabase(res, "atualizar usuário", error);
    }

    const token = gerarToken({
      id: data.id,
      nome: data.nome,
      email: data.email,
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.json({
      ok: true,
      usuario: data,
    });
  } catch (err) {
    console.error("Erro atualizarUsuario:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// ✅ POST /api/logout
export async function logout(req, res) {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? "none" : "lax",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro logout:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// ✅ DELETE /api/cancelar-conta
export async function cancelarConta(req, res) {
  try {
    const decoded = verificarTokenDoCookie(req);

    if (!decoded) {
      return res.status(401).json({ erro: "Não autenticado" });
    }

    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", decoded.id);

    if (error) {
      return respostaErroSupabase(res, "cancelar conta", error);
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? "none" : "lax",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro cancelarConta:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
}