const servicoTarefas = require("../servicos/servicoTarefas")

async function listar(req, res, next) {
  try {
    const usuarioId = req.usuario.id

    const resultado = await servicoTarefas.listarTarefas({
      usuarioId,
      query: req.query
    })

    return res.json(resultado)
  } catch (erro) {
    next(erro)
  }
}

module.exports = {
  listar
}