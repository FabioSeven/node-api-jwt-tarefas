
const prisma = require("../banco/prisma")

function erro(status,mensagem){
 const e = new Error(mensagem)
 e.status=status
 return e
}

async function listarTarefas({usuarioId,query}){

 const page = Math.max(parseInt(query.page || "1"),1)
 const limit = Math.min(parseInt(query.limit || "10"),50)
 const skip = (page-1)*limit

 const where={
  usuarioId,
  removidoEm:null
 }

 if(query.status){
  where.status=query.status
 }

 if(query.q){
  where.OR=[
   {titulo:{contains:query.q,mode:"insensitive"}},
   {descricao:{contains:query.q,mode:"insensitive"}}
  ]
 }

 const [total,tarefas]=await Promise.all([
  prisma.tarefa.count({where}),
  prisma.tarefa.findMany({
   where,
   skip,
   take:limit,
   orderBy:{criadoEm:"desc"}
  })
 ])

 return {page,limit,total,itens:tarefas}
}

async function registrarTarefa({usuarioId,titulo,descricao}){

 if(!usuarioId) throw erro(400,"Usuário não autenticado")
 if(!titulo) throw erro(400,"Título não pode ser vazio")

 const tarefa = await prisma.tarefa.create({
  data:{usuarioId,titulo,descricao}
 })

 return tarefa
}

module.exports={
 listarTarefas,
 registrarTarefa
}
