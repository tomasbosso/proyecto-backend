const CartRepository = require("../repository/cart.repository")

const service = new CartRepository()

exports.createCart = async (req,res)=>{
  const data = await service.create()
  res.json(data)
}

exports.getCart = async (req,res)=>{
  const data = await service.getById(req.params.cid)
  res.json(data)
}

exports.addProduct = async (req,res)=>{
  const data = await service.addProduct(req.params.cid,req.params.pid)
  res.json(data)
}

exports.purchase = async (req,res)=>{
  const data = await service.purchase(req.params.cid,req.user)
  res.json(data)
}