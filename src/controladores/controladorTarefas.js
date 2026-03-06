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

async function registrar(req, res, next) {
  try {
    const usuarioId = req.usuario.id
    const titulo = req.body.titulo
    const descricao = req.body.descricao

    const resultado = await servicoTarefas.registrarTarefa({
      usuarioId, titulo, descricao
    })

    return res.status(201).json(resultado)
  } catch (erro) {
    next(erro)
  }
}



module.exports = {
  listar, registrar
}