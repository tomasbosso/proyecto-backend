const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const productsRouter = require('./src/routers/products.router');
const cartsRouter = require('./src/routers/carts.router');
const viewsRouter = require('./src/routers/views.router');
const ProductManager = require('./src/managers/ProductManager');

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Routers HTTP
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Websockets
const { Server } = require("socket.io");
const io = new Server(httpServer);

const productManager = new ProductManager();

// SOCKET.IO
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("products", products);
});

// Exportar io para usarlo en products.router.js
module.exports = { io };
