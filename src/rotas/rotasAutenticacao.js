const express = require("express")
const c = require("../controladores/controladorAutenticacao")
const r = express.Router()

r.post("/registrar", c.registrar)
r.post("/login", c.login)
r.post("/atualizar-token", c.atualizarToken)
r.post("/logout", c.logout)

module.exports = r