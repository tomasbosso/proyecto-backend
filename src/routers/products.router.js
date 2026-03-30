const router = require("express").Router()
const controller = require("../controllers/products.controller")
const auth = require("../middlewares/auth.middleware")

router.get("/", controller.getProducts)
router.post("/", auth(["admin"]), controller.createProduct)

module.exports = router