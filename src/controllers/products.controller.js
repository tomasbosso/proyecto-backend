const ProductRepository = require("../repository/product.repository")

const service = new ProductRepository()

exports.getProducts = async (req, res) => {
  try {
    const products = await service.getAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const product = await service.create(req.body)
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}