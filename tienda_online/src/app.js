import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { Server } from "socket.io";
import { ProductManager } from "./dao/productManager.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";



const port = 8080;
const app = express();

// Configuración del motor de vistas Handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// Guardar el servidor HTTP express en una variable
const httpServer = app.listen(port, () =>
  console.log(`Servidor ok en el puerto ${port}`)
);

//Servidor Websocket
const socketServer = new Server(httpServer);// Conectar servidor con websocket

const productService = new ProductManager("products.json");

socketServer.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  // socket.on("mensaje", (data) =>{console.log(`Datos recibidos del cliente: ${data}`);})

  socket.on('addProduct', async (productData) => {
    try {
      const { title, price } = productData;
      const newProduct = await productService.save({ title, price });
      socketServer.emit('newProduct', newProduct);
    } catch (error) {
      console.log(error.message);
    }
  });

    // Escuchar evento 'deleteProduct' del cliente
    socket.on('deleteProduct', async (productId) => { 
      try {
        await productService.deleteProduct(productId); 
        socketServer.emit('productDeleted', productId);
      } catch (error) {
        console.log(error.message);
      }
    });
  });




// Rutas
app.use("/api/products", productsRouter);
app.use("/api/products/:pid", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/realtimeproducts", viewsRouter);


app.use(viewsRouter);
export default app;
