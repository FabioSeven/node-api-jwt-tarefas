const rateLimit = require("express-rate-limit")

const limitarAutenticacao = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTH_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas tentativas. Tente novamente em alguns minutos." }
})

module.exports = {
  limitarAutenticacao
}
