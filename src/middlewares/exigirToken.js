const jwt = require("jsonwebtoken")

module.exports = function exigirToken(req, res, next) {
  const cab = req.headers.authorization
  if (!cab) return res.status(401).json({ erro: "Authorization ausente" })

  const [tipo, token] = cab.split(" ")
  if (tipo !== "Bearer" || !token) return res.status(401).json({ erro: "Bearer inválido" })

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRETO)
    return next()
  } catch {
    return res.status(401).json({ erro: "Token expirado ou inválido" })
  }
}