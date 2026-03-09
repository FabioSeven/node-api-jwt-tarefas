function parseLista(valor) {
  return String(valor || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function getCookieSameSite() {
  const valor = String(process.env.COOKIE_SAMESITE || "lax").toLowerCase()
  if (["lax", "strict", "none"].includes(valor)) return valor
  return "lax"
}

function getCorsConfig() {
  const allowedOrigins = parseLista(process.env.CORS_ORIGIN)
  return {
    allowedOrigins,
    hasConfiguredOrigins: allowedOrigins.length > 0
  }
}

module.exports = {
  parseLista,
  getCookieSameSite,
  getCorsConfig
}
