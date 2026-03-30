const CartDAO = require("../dao/cart.dao")
const Product = require("../models/Product")
const Ticket = require("../models/ticket")

class CartRepository {

  constructor(){
    this.dao = new CartDAO()
  }

  create = () => this.dao.create()

  getById = (id) => this.dao.getById(id)

  addProduct = async (cid,pid)=>{
    const cart = await this.dao.getById(cid)

    cart.products.push({product:pid,quantity:1})

    return await this.dao.save(cart)
  }

  purchase = async (cid,user)=>{

    const cart = await this.dao.getById(cid)

    let total=0

    for(const item of cart.products){

      if(item.product.stock >= item.quantity){

        item.product.stock -= item.quantity
        await item.product.save()

        total += item.product.price * item.quantity
      }

    }

    const ticket = await Ticket.create({
      code: Math.random().toString(36),
      amount: total,
      purchaser: user.email
    })

    cart.products=[]
    await this.dao.save(cart)

    return ticket
  }

}

module.exports = CartRepository