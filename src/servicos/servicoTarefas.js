const prisma = require("../banco/prisma")

async function listarTarefas({ usuarioId, query }) {

  const page = Math.max(parseInt(query.page || "1"), 1)
  const limit = Math.min(parseInt(query.limit || "10"), 50)
  const skip = (page - 1) * limit

  const status = query.status
  const busca = query.q

  const where = {
    usuarioId,
    removidoEm: null
  }

  if (status) {
    where.status = status
  }

  if (busca) {
    where.OR = [
      { titulo: { contains: busca, mode: "insensitive" } },
      { descricao: { contains: busca, mode: "insensitive" } }
    ]
  }

  const [total, tarefas] = await Promise.all([
    prisma.tarefa.count({ where }),
    prisma.tarefa.findMany({
      where,
      skip,
      take: limit,
      orderBy: { criadoEm: "desc" }
    })
  ])

  return {
    page,
    limit,
    total,
    itens: tarefas
  }
}

module.exports = {
  listarTarefas
}