require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const pinoHttp = require("pino-http")

import cors from "cors"

const rotasAutenticacao = require("./rotas/rotasAutenticacao")
const exigirToken = require("./middlewares/exigirToken")
const tratarErros = require("./middlewares/tratarErros")
const rotasTarefas = require("./rotas/rotasTarefas")

const app = express()
app.use(pinoHttp())
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.get("/health", (req, res) => res.json({ ok: true }))

app.use("/auth", rotasAutenticacao)

app.use("/tarefas", exigirToken, rotasTarefas);

app.get("/protegido", exigirToken, (req, res) => {
  res.json({ ok: true, usuario: req.usuario })
})

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

app.use(tratarErros)

app.use(cors({
  origin: "*"
}))

module.exports = app