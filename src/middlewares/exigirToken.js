const jwt = require("jsonwebtoken")
const { obterSegredoJwt } = require("../utils/tokens")

module.exports = function exigirToken(req, res, next) {
  const cab = req.headers.authorization
  if (!cab) return res.status(401).json({ erro: "Authorization ausente" })

  const [tipo, token] = cab.split(" ")
  if (tipo !== "Bearer" || !token) return res.status(401).json({ erro: "Bearer inválido" })

  try {
    const segredo = obterSegredoJwt()
    if (!segredo) {
      return res.status(500).json({ erro: "JWT_ACCESS_SECRET não configurado" })
    }

    req.usuario = jwt.verify(token, segredo)
    return next()
  } catch {
    return res.status(401).json({ erro: "Token expirado ou inválido" })
  }
}
