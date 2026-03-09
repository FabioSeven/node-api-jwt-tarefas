const express = require("express")
const c = require("../controladores/controladorTarefas")

const r = express.Router()

r.get("/listar", c.listar)
r.get("/:id", c.buscarPorId)
r.post("/registrar", c.registrar)
r.put("/:id", c.alterar)
r.patch("/:id", c.alterar)
r.delete("/:id", c.remover)

module.exports = r
