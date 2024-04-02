import * as fs from "node:fs";

class CartManager {
  
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.id = 0;

    //Cargar los carritos almacenados en el archivo
    this.loadCarts();

  }

  async initCartArray() {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(this.path, "[]");
        console.log("El archivo de Cart fue creado");
      } else {
        //comprobando si el archivo esta vacio
        const readCartFronJSON = await fs.promises.readFile(this.path, "utf-8");
        if (readCartFronJSON.length === 0) {
          await fs.promises.writeFile(this.path, "[]");
          console.log("Archivo vacio, se creo el array: []");
        }
      }
    } catch (error) {
      console.log("Error al iniciar CartManager: ", error);
    }
  }

  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
      if(this.carts.length > 0) {
        //Verificando que almenos haya un carrito
        //con map creo un arrar que solo tenga los identificadores del carrito y con Math.max obtengo el mayor.
        this.id = Math.max(...this.carts.map(cart => cart.id));
      }
    } catch (error) {
      console.log("Error al crear los carritos");
      await this.saveCarts();
    }
  }

  async saveCarts() {
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async makeCart() {
    const newCart = {
      id: ++this.id,
      products: []
    }
    this.carts.push(newCart);
    //Guardamos el array en el archivo
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    try {
      const cart = this.carts.find(cart => cart.id === id);
      if(!cart) {
        console.log("No hay carritos con ese id");
        return;
      }
      return cart;
    } catch (error) {
      console.log("Error al obtener un carrito por id: ", error)
    }
  }

  async agregarProductoAlCarrito(id, productId, quantity = 1) {
    const cart = await this.getCartById(id);
    const existeProducto = cart.products.find(producto => producto.product === productId);
    if(existeProducto) {
      existeProducto.quantity += quantity;
    } else {
      cart.products.push({product: productId, quantity});
    }
    await this.saveCarts();
    return cart;
  }
}

export default CartManager;
