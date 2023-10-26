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
import { chatModel } from "./dao/models/chat.model.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import {sessionsRouter} from "./routes/sessions.routes.js";
import { initializePassport } from "./config/passportConfig.js";
import passport from "passport";
import { generateProducts } from "./utils.js";
import { errorHandler } from "./dao/middlewares/errorHandler.js";
import { usersRouter } from "./routes/users.routes.js";
import { addLogger } from "./helpers/logger.js";

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



// Guardar el servidor HTTP express en una variable

const httpServer = app.listen(port, () => {
  const logger = addLogger();
  logger.info(`Servidor ok en el puerto ${port}`);
});
//Servidor Websocket
const io = new Server(httpServer);// Conectar servidor con websocket

//socket server realTimeProducts
const productsDao = new ProductManager("products.json");

io.on("connection", (socket) => {
  const logger = addLogger();
  logger.info(`Nuevo cliente conectado ${socket.id}`);

  socket.on('addProduct', async (productData) => {
    try {
      const { title, price } = productData;
      const newProduct = await productsDao.save({ title, price });
      io.emit('newProduct', newProduct);
    } catch (error) {
      console.log(error.message);
    }
  });

    // Escuchar evento 'deleteProduct' del cliente
    socket.on('deleteProduct', async (productId) => { 
      try {
        await productsDao.deleteProduct(productId); 
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



//configuracion de las sessiones en el servidor
app.use(session({
  store:MongoStore.create({
      mongoUrl:config.mongo.url
  }),
  secret:config.server.secretSession,
  resave:true,
  saveUninitialized:true
}));


//configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/products/:pid", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.get("/mockingproducts", (req, res) => {
  const cant = parseInt(req.query.cant) || 100;
  const products = generateProducts(cant); 
  res.json({ status: "success", data: products });
});


//logger
const logger = addLogger(); 

app.get("/loggerTest", (req, res) => {
  logger.debug("Esto es un mensaje de depuración.");
  logger.info("Esto es un mensaje de información.");
  logger.warning("Esto es una advertencia.");
  logger.error("Esto es un error.");
  logger.fatal("Esto es un error fatal.");
  res.send("Verifica la consola o el archivo de registro para ver los mensajes.");
});

app.use(errorHandler);
app.use(viewsRouter);
export default app;
