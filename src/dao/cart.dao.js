const Cart = require("../models/cart")

class CartDAO {

  create = () => Cart.create({products:[]})

  getById = (id) => Cart.findById(id).populate("products.product")

  save = (cart) => cart.save()

}

module.exports = CartDAO