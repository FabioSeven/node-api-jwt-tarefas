function criarErro(status, mensagem, detalhes) {
  const erro = new Error(mensagem)
  erro.status = status
  erro.mensagem = mensagem
  if (detalhes) erro.detalhes = detalhes
  return erro
}

module.exports = { criarErro }
