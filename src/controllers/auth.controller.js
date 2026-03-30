const jwt = require("jsonwebtoken")
const UserDTO = require("../dto/user.dto")
const transporter = require("../config/mail.config")
const crypto = require("crypto")

const users = []

const resetTokens = []

exports.register = (req, res) => {

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" })
  }

  const exists = users.find(u => u.email === email)

  if (exists) {
    return res.status(400).json({ error: "Usuario ya existe" })
  }

  const user = {
    id: users.length + 1,
    email,
    password,
    role: "admin"
  }

  users.push(user)

  res.json({ message: "Usuario registrado" })
}

exports.login = (req, res) => {

  const { email, password } = req.body

  const user = users.find(u => u.email === email)

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Credenciales incorrectas" })
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  res.json({ message: "Login correcto", token })
}

exports.current = (req, res) => {

  res.json(new UserDTO(req.user))

}

exports.recoverPassword = async (req, res) => {

  const { email } = req.body

  const user = users.find(u => u.email === email)

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }

  const token = crypto.randomBytes(20).toString("hex")

  const expiration = Date.now() + 3600000 // 1 hora

  resetTokens.push({
    token,
    userId: user.id,
    expires: expiration
  })

  const resetLink = `http://localhost:8080/api/auth/reset-password/${token}`

  try {

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <h3>Recuperar contraseña</h3>
        <a href="${resetLink}">Restablecer contraseña</a>
      `
    })

  } catch (error) {
    console.log("Error enviando mail (simulado igual):", error.message)
  }

  console.log("LINK DE RECUPERACIÓN:", resetLink)

  res.json({ message: "Email enviado" })
}

exports.resetPassword = (req, res) => {

  const { token } = req.params
  const { newPassword } = req.body

  const tokenData = resetTokens.find(t => t.token === token)

  if (!tokenData) {
    return res.status(400).json({ error: "Token inválido" })
  }

  if (Date.now() > tokenData.expires) {
    return res.status(400).json({ error: "Token expirado" })
  }

  const user = users.find(u => u.id === tokenData.userId)

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }

  if (user.password === newPassword) {
    return res.status(400).json({ error: "No podés usar la misma contraseña" })
  }

  user.password = newPassword

  res.json({ message: "Contraseña actualizada" })
}