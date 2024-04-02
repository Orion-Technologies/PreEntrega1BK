//* Importando el servidor
import express from "express";

//Guardando la ruta en router
const router = express.Router();
//Importando la clase
import ProductManager from "../controllers/ProductManager.js";
//Creando la instancia de la clase
const productManager = new ProductManager("./models/productos.json");

router.get("/products/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let limit = parseInt(req.query.limit);
        if(limit >= 0) {
            let newArrayProducts = products.slice(0, limit);
            res.send(newArrayProducts);
        } else {
            res.send(products);
        }
    } catch (error) {
        console.log("Error al obtener los productos: ", error.message);
        res.status(500).json({error: "Error interno del servidor"})
        //res.send("Error al obtener los productos.");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
       //! Todos los datos que se recuperan de los params son Strings, hay que parsearlos
        const products = await productManager.getProducts();
        // el parametro tiene que llamarse igual que en la ruta /products/:ipd para llamarlo así desde params
        let pid = parseInt(req.params.pid);
        let product = products.find(product => product.id === pid);
        if (product) {
            res.send(product);
        } else {
            res.send(product);
        }
    } catch (error) {
        console.log("Error al obtener el producto ", error.message);
        res.status(500).json({error: "Error al obtener el ID del producto"});
        //res.send("Error al obtener el ID del Producto");
    }
});

router.post("/products/", async (req, res) => {
    const newProduct = req.body;
    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({message: "Producto agregado exitosamente"})
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"});
    }
});

router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const newProduct = req.body;
    try {
        const updateProduct =  await productManager.updateProduct(parseInt(id), newProduct.title, newProduct.description, newProduct.price);
        res.status(200).json({message: "Producto actualizado exitosamente", updateProduct});
    } catch (error) {
        console.log("Error al actualizar el producto", error);
        res.status(500).json({error: "Error interno del servidor al actualizar el producto"});
    }
});

router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;
   try {
    const deleteProduct = await productManager.deleteProduct(parseInt(id));
    res.status(200).json({message: "Producto eliminado"}, deleteProduct)
   } catch (error) {
    console.log("Error al borrar el producto");
    res.status(500).json({error: "Error interno del servidor al borrar el producto"});
   }
});

export default router;