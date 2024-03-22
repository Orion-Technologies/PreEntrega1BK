//* Importando el servidor
import express from "express";

// Guardando la ruta en router
const router = express.Router();

//! Importo la clase de ProductManager
//const ProductManager =  require('./ProductManager')
//import ProductManager from "./ProductManager.js";
import ProductManager from "../ProductManager.js";

//! Creando la Instancia de la clase ProductManager
const productManager = new ProductManager();


router.get("/api/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let limit = parseInt(req.query.limit)

        if(limit >= 0) {
            let newArrayProducts = products.slice(0, limit);

            res.send(newArrayProducts);
        } else {
            res.send(products);
        }

    } catch (error) {
        console.log("Error al obtener los productos: ", error.message);
        res.send("Error al obtener los productos.")
    }
})

router.get("/api/products/:pid", async (req, res) => {
    //! Todos los datos que se recuperan de los params son Strings, hay que parsearlos
    const products = await productManager.getProducts();

    // el parametro tiene que llamarse igual que en la ruta /products/:pid para llamarlo así desde params
    let pid = parseInt(req.params.pid);
    let product = products.find(product => product.id === pid);

    if(product) {
        res.send(product)
    } else {
        res.send("Producto no encontrado.")
    }
})

export default router;