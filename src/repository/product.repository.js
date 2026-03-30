const ProductDAO = require("../dao/product.dao")

class ProductRepository {

  constructor(){
    this.dao = new ProductDAO()
  }

  getAll = () => this.dao.getAll()

  create = (data) => this.dao.create(data)

}

module.exports = ProductRepository