const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filename = 'carts.json') {
    this.path = path.join(__dirname, '..', 'data', filename);
    this._ensureFile();
  }

  async _ensureFile() {
    try {
      await fs.access(this.path);
    } catch (err) {
      await fs.mkdir(path.dirname(this.path), { recursive: true });
      await fs.writeFile(this.path, JSON.stringify([]));
    }
  }

  async _readFile() {
    const content = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(content || '[]');
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async _generateId(carts) {
    if (!carts.length) return 1;
    const numericIds = carts.map(c => {
      const n = Number(c.id);
      return Number.isFinite(n) ? n : null;
    }).filter(x => x !== null);
    if (numericIds.length === 0) return Date.now();
    return Math.max(...numericIds) + 1;
  }

  // Crea nuevo carrito con estructura {id, products: []}
  async createCart() {
    const carts = await this._readFile();
    const id = await this._generateId(carts);
    const newCart = { id, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  // Devuelve carrito por id
  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(cid)) || null;
  }

  // Agrega producto al carrito: si existe incrementa quantity
  // productToAdd: { product: <productId>, quantity: <number> }
  async addProductToCart(cid, productId, quantity = 1) {
    const carts = await this._readFile();
    const idx = carts.findIndex(c => String(c.id) === String(cid));
    if (idx === -1) return null;

    const cart = carts[idx];

    const prodIndex = cart.products.findIndex(p => String(p.product) === String(productId));
    if (prodIndex === -1) {
      cart.products.push({ product: productId, quantity: Number(quantity) });
    } else {
      cart.products[prodIndex].quantity = Number(cart.products[prodIndex].quantity) + Number(quantity);
    }

    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
