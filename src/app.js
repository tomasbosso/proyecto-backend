const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()

const passport = require("./config/passport.config")

const app = express()

app.use(express.json())
app.use(passport.initialize())

// Routers
app.use("/api/auth", require("./routers/auth.router"))
app.use("/api/products", require("./routers/products.router"))
app.use("/api/carts", require("./routers/carts.router"))

app.get("/", (req,res)=>{
  res.send("Servidor funcionando")
})

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Mongo conectado"))

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>console.log("Servidor en puerto " + PORT))