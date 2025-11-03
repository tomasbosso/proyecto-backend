const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor(filename = 'products.json') {
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

  // Devuelve todos los productos
  async getProducts() {
    return await this._readFile();
  }

  // Devuelve producto por id
  async getProductById(pid) {
    const products = await this._readFile();
    return products.find(p => String(p.id) === String(pid)) || null;
  }

  // Genera id único (busca max id y suma 1)
  async _generateId(products) {
    if (!products.length) return 1;
    // si los ids son numéricos
    const numericIds = products.map(p => {
      const n = Number(p.id);
      return Number.isFinite(n) ? n : null;
    }).filter(x => x !== null);
    if (numericIds.length === 0) {
      // fallback: usar timestamp
      return Date.now();
    }
    return Math.max(...numericIds) + 1;
  }

  // Agrega producto (id autogenerado)
  async addProduct(productData) {
    const required = ['title','description','code','price','status','stock','category','thumbnails'];
    for (const r of required) {
      if (!(r in productData)) {
        throw new Error(`Campo requerido faltante: ${r}`);
      }
    }

    const products = await this._readFile();

    // Validación código único (opcional pero recomendable)
    if (products.some(p => p.code === productData.code)) {
      throw new Error('El campo code debe ser único. Ya existe un producto con ese code.');
    }

    const id = await this._generateId(products);
    const newProduct = {
      id,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: Boolean(productData.status),
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  // Actualiza producto (no permite cambiar id)
  async updateProduct(pid, updateData) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return null;

    // No permitir actualizar id
    if ('id' in updateData) delete updateData.id;

    const updated = { ...products[idx], ...updateData };
    products[idx] = updated;
    await this._writeFile(products);
    return updated;
  }

  // Elimina producto
  async deleteProduct(pid) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
  }
}

module.exports = ProductManager;
