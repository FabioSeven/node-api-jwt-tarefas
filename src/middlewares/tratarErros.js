module.exports = function tratarErros(err, req, res, next) {
  const status = err.status || 500
  const mensagem = err.mensagem || "Erro interno"
  res.status(status).json({ erro: mensagem })
}