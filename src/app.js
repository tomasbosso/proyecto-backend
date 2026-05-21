const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()

const passport = require("./config/passport.config")

const swaggerUi = require("swagger-ui-express")
const swaggerJSDoc = require("swagger-jsdoc")

const app = express()

app.use(express.json())
app.use(passport.initialize())

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0"
    }
  },
  apis: ["./src/routers/*.js"]
})

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/api/auth", require("./routers/auth.router"))
app.use("/api/products", require("./routers/products.router"))
app.use("/api/carts", require("./routers/carts.router"))

app.get("/", (req, res) => {
  res.send("Servidor funcionando")
})

if (process.env.NODE_ENV !== "test") {

  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongo conectado"))
    .catch(err => console.log(err))

  const PORT = process.env.PORT || 8080

  app.listen(PORT, () => {
    console.log("Servidor en puerto " + PORT)
  })
}

module.exports = app