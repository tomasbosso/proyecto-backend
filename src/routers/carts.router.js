const router = require("express").Router()

const controller = require("../controllers/carts.controller")
const auth = require("../middlewares/auth.middleware")

router.get("/:cid", auth(["user", "admin"]), controller.getCart)
router.post("/", auth(["user", "admin"]), controller.createCart)
router.post("/:cid/products/:pid", auth(["user", "admin"]), controller.addProduct)
router.post("/:cid/purchase", auth(["user", "admin"]), controller.purchase)

module.exports = router