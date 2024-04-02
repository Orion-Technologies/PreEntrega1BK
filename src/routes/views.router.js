import express from "express";
import ProductManager from "../controllers/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager("./models/productos.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", {productos:products});
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});

export default router;