// importando el servidor
import express from "express";

//Guardando la ruta en router
const router = express.Router();

//Importando la clase
import CartManager from "../controllers/CartManager.js";
// Creando la instancia de la clase
const cartManager = new CartManager("./models/carritos.json");

router.post("/carts/", async (req, res) => {
    try {
        const newCart = await cartManager.makeCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"});
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({error: "Error interno del server"});
    }
});

router.post("/carts/:cid/products/:pid", async (req, res) => {
    const id = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const cartUpdate = await cartManager.agregarProductoAlCarrito(id, productId, quantity);
        res.json(cartUpdate.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})

export default router;