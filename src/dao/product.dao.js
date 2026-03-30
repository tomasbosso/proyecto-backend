const Product = require("../models/Product")

class ProductDAO {

  getAll = () => Product.find()

  create = (data) => Product.create(data)

}

module.exports = ProductDAO