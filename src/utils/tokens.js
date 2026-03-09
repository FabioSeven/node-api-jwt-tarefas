const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { v4: uuidv4 } = require("uuid")

function obterSegredoJwt() {
  return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRETO
}

function gerarAccessToken(usuario) {
  const segredo = obterSegredoJwt()
  if (!segredo) {
    throw new Error("JWT_ACCESS_SECRET (ou JWT_SECRETO) não configurado")
  }

  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    segredo,
    { expiresIn: process.env.JWT_EXPIRA_EM || "15m" }
  )
}

function gerarRefreshToken() {
  const id = uuidv4()
  const segredo = crypto.randomBytes(48).toString("hex")
  return { id, token: `${id}.${segredo}`, segredo }
}

function extrairIdESegredo(refreshToken) {
  const [id, segredo] = (refreshToken || "").split(".")
  if (!id || !segredo) return null
  return { id, segredo }
}

function calcularDataExpiracaoEmDias(dias) {
  const d = new Date()
  d.setDate(d.getDate() + Number(dias || 7))
  return d
}

module.exports = { gerarAccessToken, gerarRefreshToken, extrairIdESegredo, calcularDataExpiracaoEmDias, obterSegredoJwt }
