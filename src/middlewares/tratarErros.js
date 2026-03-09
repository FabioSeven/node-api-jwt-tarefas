const { Prisma } = require("@prisma/client")

module.exports = function tratarErros(err, req, res, next) {
  if (err && err.message === "Origem não permitida pelo CORS") {
    return res.status(403).json({ erro: err.message })
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    if (req.log) {
      req.log.error({ err }, "falha ao inicializar conexão com banco")
    }

    return res.status(503).json({
      erro: "banco de dados indisponível"
    })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ erro: "registro duplicado" })
    }

    if (err.code === "P2025") {
      return res.status(404).json({ erro: "registro não encontrado" })
    }
  }

  const status = err.status || 500
  const resposta = { erro: err.mensagem || err.message || "Erro interno" }

  if (err.detalhes) {
    resposta.detalhes = err.detalhes
  }

  if (status >= 500 && req.log) {
    req.log.error({ err }, "erro interno na aplicação")
  }

  return res.status(status).json(resposta)
}
