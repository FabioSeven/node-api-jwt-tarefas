<<<<<<< HEAD
const app = require("./app")
const prisma = require("./banco/prisma")
=======

const app = require("./app")
>>>>>>> 8ebf7b9cd33e3b2137ebca37a374cbd91e0d7874

const PORT = Number(process.env.PORT || 3000)

<<<<<<< HEAD
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
=======
app.listen(PORT, ()=>{
  console.log("Servidor rodando na porta "+PORT)
})
>>>>>>> 8ebf7b9cd33e3b2137ebca37a374cbd91e0d7874
