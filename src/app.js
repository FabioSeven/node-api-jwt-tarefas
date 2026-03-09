
require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const pinoHttp = require("pino-http")
const cors = require("cors")

const rotasAutenticacao = require("./rotas/rotasAutenticacao")
const rotasTarefas = require("./rotas/rotasTarefas")
const exigirToken = require("./middlewares/exigirToken")
const tratarErros = require("./middlewares/tratarErros")
<<<<<<< HEAD
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

=======

const app = express()

app.use(cors({ origin: "*" }))
>>>>>>> 8ebf7b9cd33e3b2137ebca37a374cbd91e0d7874
app.use(pinoHttp())
app.use(helmet())
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.json({
    nome: "api-jwt-refresh-pro",
    status: "ok"
  })
})

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.use("/auth", rotasAutenticacao)
app.use("/tarefas", exigirToken, rotasTarefas)

app.get("/protegido", exigirToken, (req, res) => {
  res.json({ ok: true, usuario: req.usuario })
})

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" })
=======
app.get("/health", (req,res)=>{
  res.json({status:"ok"})
})

app.use("/auth", rotasAutenticacao)
app.use("/tarefas", exigirToken, rotasTarefas)

app.get("/protegido", exigirToken, (req,res)=>{
  res.json({ok:true, usuario:req.usuario})
>>>>>>> 8ebf7b9cd33e3b2137ebca37a374cbd91e0d7874
})

app.use(tratarErros)

module.exports = app
