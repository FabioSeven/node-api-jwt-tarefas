const express = require("express")
const c = require("../controladores/controladorTarefas")
const r = express.Router()

r.post("/registrar", c.registrar)
r.get("/listar", c.listar)
//r.get("/buscar/:id", c.atualizarToken)
//r.put("/alterar/:id", c.logout)
//r.delete("/excluir/:id",)

module.exports = r