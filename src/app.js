//app.js

import express from "express";
import exphbs from "express-handlebars";
import { Server } from 'socket.io';
import "./database.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js"
import MessageModel from "./models/mesagge.model.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/session.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";

const app = express();
const PUERTO = 8080;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//nuevo
app.use(cookieParser());
app.use(express.static("./src/public"));
//Session
app.use(session({
  store:MongoStore.create({
    mongoUrl:"mongodb+srv://abelarchila:BlackBelt7008@backend.j4hzu56.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=BackEnd",
    ttl:100,
  }),
  secret:"secretCoder",
  resave: true, 
  saveUninitialized:true,   
}))
//Cambios passport: 
app.use(passport.initialize());
app.use(passport.session());
initializePassport(); 


//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);
//nuevo
app.use("/", userRouter);




//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

// chat en el ecommerce: 

const io = new Server(httpServer);

io.on("connection",  (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async (data) => {

      //Guardo el mensaje en MongoDB: 
      await MessageModel.create(data);
console.log("Mensaje recibido", data)
      //Obtengo los mensajes de MongoDB y se los paso al cliente: 
      const messages = await MessageModel.find();
      console.log(messages);
      io.sockets.emit("messagesLogs", messages);
   
  })
})