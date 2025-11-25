const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

// HOME (LISTA ESTÁTICA)
router.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

// REAL TIME PRODUCTS
router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
});

module.exports = router;
