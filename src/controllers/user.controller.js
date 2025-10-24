export async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    console.log("Novo cadastro recebido:", { nome, email, senha });

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: { nome, email }
    });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
}
