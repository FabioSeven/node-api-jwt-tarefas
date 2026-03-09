require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const pinoHttp = require("pino-http")
const cors = require("cors")

const prisma = require("./banco/prisma")
const rotasAutenticacao = require("./rotas/rotasAutenticacao")
const rotasTarefas = require("./rotas/rotasTarefas")
const exigirToken = require("./middlewares/exigirToken")
const tratarErros = require("./middlewares/tratarErros")
const { getCorsConfig } = require("./config/ambiente")

const app = express()
const { allowedOrigins, hasConfiguredOrigins } = getCorsConfig()

app.set("trust proxy", 1)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      if (!hasConfiguredOrigins) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error("Origem não permitida pelo CORS"))
    },
    credentials: hasConfiguredOrigins
  })
)

app.use(pinoHttp())
app.use(helmet())
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({
    nome: "api-jwt-refresh-pro",
    status: "ok"
  })
})

app.get("/health", async (req, res) => {
  const payload = {
    status: "ok",
    api: "ok",
    database: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    return res.status(200).json(payload)
  } catch (erro) {
    if (req.log) {
      req.log.error({ err: erro }, "health check falhou ao consultar o banco")
    }

    return res.status(503).json({
      ...payload,
      status: "degradado",
      database: "indisponível"
    })
  }
})

app.use("/auth", rotasAutenticacao)
app.use("/tarefas", exigirToken, rotasTarefas)

app.get("/protegido", exigirToken, (req, res) => {
  res.json({ ok: true, usuario: req.usuario })
})

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" })
})

app.use(tratarErros)

module.exports = app
