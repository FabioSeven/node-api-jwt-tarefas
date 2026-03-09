const { Prisma } = require("@prisma/client")
const prisma = require("../banco/prisma")
const { gerarHash, compararHash } = require("../utils/criptografia")
const { criarErro } = require("../utils/erros")
const {
  gerarAccessToken,
  gerarRefreshToken,
  extrairIdESegredo,
  calcularDataExpiracaoEmDias
} = require("../utils/tokens")

function normalizarEmail(email) {
  return String(email || "").trim().toLowerCase()
}

function mapearErroBanco(e) {
  if (e instanceof Prisma.PrismaClientInitializationError) {
    throw criarErro(503, "banco de dados indisponível")
  }

  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    throw criarErro(409, "email já cadastrado")
  }

  throw e
}

async function registrar({ email, senha }) {
  const emailNormalizado = normalizarEmail(email)

  if (!emailNormalizado || !senha) {
    throw criarErro(400, "email e senha são obrigatórios")
  }

  const senhaHash = await gerarHash(senha)

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
      select: { id: true }
    })

    if (usuarioExistente) {
      throw criarErro(409, "email já cadastrado")
    }

    const usuario = await prisma.usuario.create({
      data: { email: emailNormalizado, senhaHash }
    })

    return { id: usuario.id, email: usuario.email }
  } catch (e) {
    console.error("ERRO REAL REGISTRO USUARIO:", {
      name: e?.name,
      code: e?.code,
      message: e?.message,
      meta: e?.meta
    })

    mapearErroBanco(e)
  }
}

async function login({ email, senha }) {
  const emailNormalizado = normalizarEmail(email)

  if (!emailNormalizado || !senha) {
    throw criarErro(400, "email e senha são obrigatórios")
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: emailNormalizado } })
    if (!usuario) throw criarErro(401, "credenciais inválidas")

    const ok = await compararHash(senha, usuario.senhaHash)
    if (!ok) throw criarErro(401, "credenciais inválidas")

    const accessToken = gerarAccessToken(usuario)

    const { id, token: refreshToken, segredo } = gerarRefreshToken()
    const tokenHash = await gerarHash(segredo)

    await prisma.refreshToken.create({
      data: {
        id,
        usuarioId: usuario.id,
        tokenHash,
        expiraEm: calcularDataExpiracaoEmDias(process.env.REFRESH_EXPIRA_DIAS)
      }
    })

    return { accessToken, refreshToken }
  } catch (e) {
    mapearErroBanco(e)
  }
}

async function atualizarToken(refreshTokenRecebido) {
  const partes = extrairIdESegredo(refreshTokenRecebido)
  if (!partes) throw criarErro(401, "refreshToken inválido")

  const { id, segredo } = partes

  try {
    const registro = await prisma.refreshToken.findUnique({
      where: { id },
      include: { usuario: true }
    })
    if (!registro) throw criarErro(401, "refreshToken inválido")

    if (registro.revogadoEm) {
      await prisma.refreshToken.updateMany({
        where: { usuarioId: registro.usuarioId, revogadoEm: null },
        data: { revogadoEm: new Date() }
      })
      throw criarErro(401, "refreshToken reutilizado. Faça login novamente.")
    }

    if (registro.expiraEm <= new Date()) {
      await prisma.refreshToken.update({ where: { id: registro.id }, data: { revogadoEm: new Date() } })
      throw criarErro(401, "refreshToken expirado. Faça login novamente.")
    }

    const confere = await compararHash(segredo, registro.tokenHash)
    if (!confere) throw criarErro(401, "refreshToken inválido")

    const { id: novoId, token: novoRefresh, segredo: novoSegredo } = gerarRefreshToken()
    const novoHash = await gerarHash(novoSegredo)

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: registro.id },
        data: { revogadoEm: new Date(), substituidoPorId: novoId }
      }),
      prisma.refreshToken.create({
        data: {
          id: novoId,
          usuarioId: registro.usuarioId,
          tokenHash: novoHash,
          expiraEm: calcularDataExpiracaoEmDias(process.env.REFRESH_EXPIRA_DIAS)
        }
      })
    ])

    const accessToken = gerarAccessToken(registro.usuario)
    return { accessToken, refreshToken: novoRefresh }
  } catch (e) {
    mapearErroBanco(e)
  }
}

async function logout(refreshTokenRecebido) {
  const partes = extrairIdESegredo(refreshTokenRecebido)
  if (!partes) return { ok: true }

  try {
    await prisma.refreshToken.updateMany({
      where: { id: partes.id, revogadoEm: null },
      data: { revogadoEm: new Date() }
    })

    return { ok: true }
  } catch (e) {
    mapearErroBanco(e)
  }
}

module.exports = { registrar, login, atualizarToken, logout }
