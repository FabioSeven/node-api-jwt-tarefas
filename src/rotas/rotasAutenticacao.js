const express = require("express")
const c = require("../controladores/controladorAutenticacao")
const { limitarAutenticacao } = require("../middlewares/limitarRequisicoes")

const r = express.Router()

r.post("/registrar", limitarAutenticacao, c.registrar)
r.post("/login", limitarAutenticacao, c.login)
r.post("/atualizar-token", limitarAutenticacao, c.atualizarToken)
r.post("/logout", c.logout)

module.exports = r
