module.exports = function tratarErros(err, req, res, next) {
  if (err && err.message === "Origem não permitida pelo CORS") {
    return res.status(403).json({ erro: err.message })
  }

  const status = err.status || 500
  const mensagem = err.mensagem || "Erro interno"

  if (status >= 500 && req.log) {
    req.log.error({ err }, "erro interno na aplicação")
  }

  return res.status(status).json({ erro: mensagem })
}
