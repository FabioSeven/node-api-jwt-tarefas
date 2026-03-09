const { Prisma } = require("@prisma/client")
const prisma = require("../banco/prisma")
const { gerarHash, compararHash } = require("../utils/criptografia")
const { gerarAccessToken, gerarRefreshToken, extrairIdESegredo, calcularDataExpiracaoEmDias } = require("../utils/tokens")
const { criarErro } = require("../utils/erros")

function normalizarEmail(email) {
  return String(email || "").trim().toLowerCase()
}

async function registrar({ email, senha }) {
  const emailNormalizado = normalizarEmail(email)

  if (!emailNormalizado || !senha) {
    throw criarErro(400, "email e senha são obrigatórios")
  }

  const senhaHash = await gerarHash(senha)

  try {
    const usuario = await prisma.usuario.create({
      data: { email: emailNormalizado, senhaHash }
    })

    return { id: usuario.id, email: usuario.email }
  } catch (e) {
    console.error("Erro real ao registrar usuário:", {
      code: e?.code,
      message: e?.message,
      meta: e?.meta
    })

    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw criarErro(409, "email já cadastrado")
    }

    throw criarErro(500, "erro interno ao registrar usuário")
  }
}

async function login({ email, senha }) {
  const emailNormalizado = normalizarEmail(email)

  if (!emailNormalizado || !senha) {
    throw criarErro(400, "email e senha são obrigatórios")
  }

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
}

async function atualizarToken(refreshTokenRecebido) {
  const partes = extrairIdESegredo(refreshTokenRecebido)
  if (!partes) throw criarErro(401, "refreshToken inválido")

  const { id, segredo } = partes

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
}

async function logout(refreshTokenRecebido) {
  const partes = extrairIdESegredo(refreshTokenRecebido)
  if (!partes) return { ok: true }

  await prisma.refreshToken.updateMany({
    where: { id: partes.id, revogadoEm: null },
    data: { revogadoEm: new Date() }
  })

  return { ok: true }
}

module.exports = { registrar, login, atualizarToken, logout }
