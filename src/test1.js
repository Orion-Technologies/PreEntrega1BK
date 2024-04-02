//import ProductManager from "./controllers/ProductManager.js";
import CartManager from "./controllers/CartManager.js";

//const product = new ProductManager("./src/models/productos.json");
const cart = new CartManager("./models/carritos.json");

//await product.getProducts();
//await product.initProductArray();
await cart.initCartArray();

//await product.addProduct({title: "T-Shirt", description: "T-Shirt Video Juegos", price: 350, thumbnail: "url", code: "TS1", stock: 50});
//await product.addProduct({title: "Gorra RedBull", description: "Gorra Edición Especial", price: 350, thumbnail: "url", code: "GRBEE", stock: 10});
//await product.addProduct({title: "Consola PS5", description: "Sony PS5 WOG Edition", price: 7500, thumbnail: "url", code: "SPS5", stock: 30});

//await product.getProducts();

//await product.getProductById(3);
//await product.updateProduct(3, "Consola PS6", "Sony PS6 WOG Edition", 9500);
//await product.deleteProduct(1);

//await product.addProduct({title: "T-Shirt", description: "T-Shirt Iron Maiden", price: 450, thumbnail: "url", code: "TS2", stock: 15});
//await product.addProduct({title: "Mortal Kombat 1", description: "Juego PS5", price: 800, thumbnail: "url", code: "JPS5MK", stock: 15});
//await product.addProduct({title: "Call Of Duty", description: "Juego PS5", price: 800, thumbnail: "url", code: "JPS5COD", stock: 15});