const app = require("./app")
const prisma = require("./banco/prisma")

const PORT = Number(process.env.PORT || 3000)

const servidor = app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`)

  try {
    await prisma.$queryRaw`SELECT 1`
    console.log("Banco conectado com sucesso")
  } catch (erro) {
    console.error("Falha ao validar conexão inicial com o banco:", erro?.message || erro)
  }
})

async function encerrar(signal) {
  console.log(`Recebido ${signal}. Encerrando aplicação...`)

  servidor.close(async () => {
    try {
      await prisma.$disconnect()
      process.exit(0)
    } catch (erro) {
      console.error("Erro ao desconectar Prisma", erro)
      process.exit(1)
    }
  })
}

process.on("SIGTERM", () => encerrar("SIGTERM"))
process.on("SIGINT", () => encerrar("SIGINT"))
