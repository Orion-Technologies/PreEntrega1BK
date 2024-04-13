//importando la dependencia
//const express = require('express');
import express from 'express';
const app = express();
const PUERTO = 8080;
import exphbs from 'express-handlebars';
//import socket from 'socket.io';
import {createServer} from 'http'; // Importando createServer de http
import {Server} from 'socket.io';
//Vinculando rutas:
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from './controllers/ProductManager.js';

//* Asignando la funcion express a app

//const httpServer = createServer() // Crea un servidor HTTP con Express


//** Asignando el numero de puerto a una constante */


//Middleware
// Travajar con datos complejos
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("./src/public"));

//configurando Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//* productsRouter trae la ruta /api/products
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

/*
app.get("/", (request, response) => {
    response.send("Probando el servidor");
});
*/

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto http//locarhost:${PUERTO}`);
})

const io = new Server(httpServer); // creando una instancia de Server de Socket.io

//obtengo el array de productos
const productManager = new ProductManager("src/models/productos.json");

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