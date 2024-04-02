//importando la dependencia
//const express = require('express');
import express from 'express';
import exphbs from 'express-handlebars';
import {createServer} from 'http'; // Importando createServer de http
import {Server} from 'socket.io';
//Vinculando rutas:
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from './controllers/ProductManager.js';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);


//* Asignando la funcion express a app
const app = express();
const httpServer = createServer(app) // Crea un servidor HTTP con Express
const io = new Server(httpServer); // creando una instancia de Server de Socket.io


//** Asignando el numero de puerto a una constante */
const PUERTO = 8080;

//Middleware
// Travajar con datos complejos
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("./src/public"));
//app.use(express.static("./src/public"));

//configurando Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../src/views"));
//app.set("views", path.join(__dirname, "./views"));

//* productsRouter trae la ruta /api/products
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);
/*
app.get("/", (request, response) => {
    response.send("Probando el servidor");
});
*/


//obtengo el array de productos
const productManager = new ProductManager("./models/productos.json");


io.on("connection", async(socket) => {
    console.log("Un cliente conectado");

    //Enviamos el array de productos al cliente:
    socket.emit("productos", await productManager.getProducts());

    //Recibimos el evento "delete" desde el cliente
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        //eviamos el array de productos actualizados
        socket.emit("productos", await productManager.getProducts());
    })

    //recibimos el evento "agregarProductos" desde el cliente
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        socket.emit("productos", await productManager.getProducts());
    })
})

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto http//locarhost:${PUERTO}`);
})