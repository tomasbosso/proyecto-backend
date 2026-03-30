const router = require("express").Router()
const passport = require("passport")

const controller = require("../controllers/auth.controller")

router.post("/register", controller.register)

router.post("/login", controller.login)

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  controller.current
)

router.post("/recover", controller.recoverPassword)

router.post("/reset-password/:token", controller.resetPassword)

module.exports = router