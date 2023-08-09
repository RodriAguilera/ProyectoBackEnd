import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { Server } from "socket.io";
import { ProductManager } from "./dao/managers/fileSystem/productManager.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import {config} from "./config/config.js"
import { connectDB } from "./config/dbConnection.js";
import { chatModel } from "./dao/models/chat.model.js"

const port = config.server.port;
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// Configuración del motor de vistas Handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));



//conexión a la base de datos
connectDB();

// Guardar el servidor HTTP express en una variable
const httpServer = app.listen(port, () =>
  console.log(`Servidor ok en el puerto ${port}`)
);

//Servidor Websocket
const io = new Server(httpServer);// Conectar servidor con websocket

//socket server realTimeProducts
const productService = new ProductManager("products.json");

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  // socket.on("mensaje", (data) =>{console.log(`Datos recibidos del cliente: ${data}`);})

  socket.on('addProduct', async (productData) => {
    try {
      const { title, price } = productData;
      const newProduct = await productService.save({ title, price });
      io.emit('newProduct', newProduct);
    } catch (error) {
      console.log(error.message);
    }
  });

    // Escuchar evento 'deleteProduct' del cliente
    socket.on('deleteProduct', async (productId) => { 
      try {
        await productService.deleteProduct(productId); 
        io.emit('productDeleted', productId);
      } catch (error) {
        console.log(error.message);
      }
    });
  });





  //socket server Chat

io.on("connection",(socket)=>{
  console.log("Nuevo cliente conectado al chat");

  socket.on("authenticated",async(msg)=>{
      const messages = await chatModel.find();
      socket.emit("messageHistory", messages);
      socket.broadcast.emit("newUser", msg);
  });

  //recibir el mensaje del cliente
  socket.on("message",async(data)=>{
      console.log("data", data);
      const messageCreated = await chatModel.create(data);
      const messages = await chatModel.find();
      //cada vez que recibamos este mensaje, enviamos todos los mensajes actualizados a todos los clientes conectados
      io.emit("messageHistory", messages);
  })
});







// Rutas
app.use("/api/products", productsRouter);
app.use("/api/products/:pid", productsRouter);
app.use("/api/carts", cartsRouter);



app.use(viewsRouter);
export default app;
