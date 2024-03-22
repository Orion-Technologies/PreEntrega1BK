//! Importo la dependencia
//const express = require('express');
import express from 'express';


//** Asigno la funcion express a app
const app = express();

//** Asigno el numero de puerto a una constante
const PUERTO = 8080;

// Para trabajar con datos complejos
app.use(express.urlencoded({extended:true}))

// Vinculando las rutas
import productsRouter from "./routes/products.router.js";
app.use(express.json());
//* productsRouter trea la ruta "/api/products"
app.use("/", productsRouter);

app.get("/", (request, response) => {
    response.send("Probando el servidor");
})




app.listen(PUERTO, () => {
    console.log(`Escuchando el en puerto http//localhost:${PUERTO}`);
})