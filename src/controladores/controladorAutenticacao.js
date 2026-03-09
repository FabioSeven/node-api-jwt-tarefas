const servico = require("../servicos/servicoAutenticacao")

function setarCookie(res, refreshToken) {
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
    path: "/auth",
    maxAge: Number(process.env.REFRESH_EXPIRA_DIAS || 7) * 24 * 60 * 60 * 1000
  })
}

function limparCookie(res) {
  res.clearCookie("refresh_token", { path: "/auth" })
}

exports.registrar = async (req, res, next) => {
  try { res.status(201).json(await servico.registrar(req.body)) }
  catch (e) { next(e) }
}

exports.login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await servico.login(req.body)
    setarCookie(res, refreshToken)
    res.json({ accessToken })
  } catch (e) { next(e) }
}

exports.atualizarToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token
    const { accessToken, refreshToken: novo } = await servico.atualizarToken(refreshToken)
    setarCookie(res, novo)
    res.json({ accessToken })
  } catch (e) {
    limparCookie(res)
    next(e)
  }
}

exports.logout = async (req, res, next) => {
  try {
    await servico.logout(req.cookies.refresh_token)
    limparCookie(res)
    res.json({ ok: true })
  } catch (e) { next(e) }
}
