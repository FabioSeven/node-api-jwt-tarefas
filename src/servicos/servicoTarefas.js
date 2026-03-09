const prisma = require("../banco/prisma")
const { criarErro } = require("../utils/erros")

const STATUS_VALIDOS = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]

function normalizarId(valor) {
  const id = Number.parseInt(valor, 10)
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(400, "id da tarefa inválido")
  }
  return id
}

function normalizarTexto(valor) {
  if (valor === undefined || valor === null) return undefined
  return String(valor).trim()
}

function validarStatus(status) {
  if (status === undefined) return undefined
  const statusNormalizado = String(status).trim().toUpperCase()
  if (!STATUS_VALIDOS.includes(statusNormalizado)) {
    throw criarErro(400, `status inválido. Use: ${STATUS_VALIDOS.join(", ")}`)
  }
  return statusNormalizado
}

async function buscarTarefaDoUsuario({ usuarioId, tarefaId }) {
  const tarefa = await prisma.tarefa.findFirst({
    where: {
      id: tarefaId,
      usuarioId,
      removidoEm: null
    }
  })

  if (!tarefa) throw criarErro(404, "tarefa não encontrada")
  return tarefa
}

async function listarTarefas({ usuarioId, query }) {
  if (!usuarioId) throw criarErro(401, "usuário não autenticado")

  const page = Math.max(Number.parseInt(query.page || "1", 10), 1)
  const limit = Math.min(Math.max(Number.parseInt(query.limit || "10", 10), 1), 50)
  const skip = (page - 1) * limit

  const where = {
    usuarioId,
    removidoEm: null
  }

  if (query.status) {
    where.status = validarStatus(query.status)
  }

  if (query.q) {
    const termo = String(query.q).trim()
    if (termo) {
      where.OR = [
        { titulo: { contains: termo, mode: "insensitive" } },
        { descricao: { contains: termo, mode: "insensitive" } }
      ]
    }
  }

  const [total, tarefas] = await Promise.all([
    prisma.tarefa.count({ where }),
    prisma.tarefa.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ atualizadoEm: "desc" }, { id: "desc" }]
    })
  ])

  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
    itens: tarefas
  }
}

async function buscarTarefa({ usuarioId, tarefaId }) {
  if (!usuarioId) throw criarErro(401, "usuário não autenticado")
  const id = normalizarId(tarefaId)
  return buscarTarefaDoUsuario({ usuarioId, tarefaId: id })
}

async function registrarTarefa({ usuarioId, titulo, descricao, status }) {
  if (!usuarioId) throw criarErro(401, "usuário não autenticado")

  const tituloNormalizado = normalizarTexto(titulo)
  const descricaoNormalizada = normalizarTexto(descricao)
  const statusNormalizado = validarStatus(status) || "PENDENTE"

  if (!tituloNormalizado) throw criarErro(400, "título não pode ser vazio")
  if (tituloNormalizado.length > 150) throw criarErro(400, "título deve ter no máximo 150 caracteres")
  if (descricaoNormalizada && descricaoNormalizada.length > 1000) {
    throw criarErro(400, "descrição deve ter no máximo 1000 caracteres")
  }

  return prisma.tarefa.create({
    data: {
      usuarioId,
      titulo: tituloNormalizado,
      descricao: descricaoNormalizada || null,
      status: statusNormalizado
    }
  })
}

async function alterarTarefa({ usuarioId, tarefaId, titulo, descricao, status }) {
  if (!usuarioId) throw criarErro(401, "usuário não autenticado")

  const id = normalizarId(tarefaId)
  await buscarTarefaDoUsuario({ usuarioId, tarefaId: id })

  const data = {}

  if (titulo !== undefined) {
    const tituloNormalizado = normalizarTexto(titulo)
    if (!tituloNormalizado) throw criarErro(400, "título não pode ser vazio")
    if (tituloNormalizado.length > 150) throw criarErro(400, "título deve ter no máximo 150 caracteres")
    data.titulo = tituloNormalizado
  }

  if (descricao !== undefined) {
    const descricaoNormalizada = normalizarTexto(descricao)
    if (descricaoNormalizada && descricaoNormalizada.length > 1000) {
      throw criarErro(400, "descrição deve ter no máximo 1000 caracteres")
    }
    data.descricao = descricaoNormalizada || null
  }

  if (status !== undefined) {
    data.status = validarStatus(status)
  }

  if (Object.keys(data).length === 0) {
    throw criarErro(400, "nenhum campo válido informado para alteração")
  }

  return prisma.tarefa.update({
    where: { id },
    data
  })
}

async function removerTarefa({ usuarioId, tarefaId }) {
  if (!usuarioId) throw criarErro(401, "usuário não autenticado")

  const id = normalizarId(tarefaId)
  await buscarTarefaDoUsuario({ usuarioId, tarefaId: id })

  await prisma.tarefa.update({
    where: { id },
    data: { removidoEm: new Date() }
  })

  return { ok: true, mensagem: "tarefa removida com sucesso" }
}

module.exports = {
  STATUS_VALIDOS,
  listarTarefas,
  buscarTarefa,
  registrarTarefa,
  alterarTarefa,
  removerTarefa
}
