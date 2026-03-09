const app = require("./app")
const prisma = require("./banco/prisma")

const PORT = Number(process.env.PORT || 3000)

const servidor = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
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
