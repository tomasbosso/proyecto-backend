const express = require('express');
const productsRouter = require('./src/routers/products.router');
const cartsRouter = require('./src/routers/carts.router');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta raíz simple
app.get('/', (req, res) => {
  res.send({ message: 'API de tienda funcionando. Usa /api/products y /api/carts' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
