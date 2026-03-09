const servicoTarefas = require("../servicos/servicoTarefas")

async function listar(req, res, next) {
  try {
    const resultado = await servicoTarefas.listarTarefas({
      usuarioId: req.usuario.id,
      query: req.query
    })

    return res.json(resultado)
  } catch (erro) {
    next(erro)
  }
}

async function buscarPorId(req, res, next) {
  try {
    const resultado = await servicoTarefas.buscarTarefa({
      usuarioId: req.usuario.id,
      tarefaId: req.params.id
    })

    return res.json(resultado)
  } catch (erro) {
    next(erro)
  }
}

async function registrar(req, res, next) {
  try {
    const resultado = await servicoTarefas.registrarTarefa({
      usuarioId: req.usuario.id,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      status: req.body.status
    })

    return res.status(201).json(resultado)
  } catch (erro) {
    next(erro)
  }
}

async function alterar(req, res, next) {
  try {
    const resultado = await servicoTarefas.alterarTarefa({
      usuarioId: req.usuario.id,
      tarefaId: req.params.id,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      status: req.body.status
    })

    return res.json(resultado)
  } catch (erro) {
    next(erro)
  }
}

async function remover(req, res, next) {
  try {
    const resultado = await servicoTarefas.removerTarefa({
      usuarioId: req.usuario.id,
      tarefaId: req.params.id
    })

    return res.json(resultado)
  } catch (erro) {
    next(erro)
  }
}

module.exports = {
  listar,
  buscarPorId,
  registrar,
  alterar,
  remover
}
