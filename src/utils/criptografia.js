const bcrypt = require("bcryptjs")
async function gerarHash(texto) { return bcrypt.hash(texto, 10) }
async function compararHash(texto, hash) { return bcrypt.compare(texto, hash) }
module.exports = { gerarHash, compararHash }
