const Product = require("../models/product")

class ProductDAO {

  getAll = () => Product.find()

  create = (data) => Product.create(data)

}

module.exports = ProductDAO