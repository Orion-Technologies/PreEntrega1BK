import * as fs from "node:fs";

class ProductManager {
  static id = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async initProductArray() {
    try {
        //comprobando si el archivo existe
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(this.path, "[]");
        console.log("El archivo fue creado");
      } else {
        //comprobando si el archivo esta vacio
        const readProductFromJSON = await fs.promises.readFile(this.path, "utf-8");
        
        if(readProductFromJSON.length === 0) {
            await fs.promises.writeFile(this.path, "[]");
            console.log("Archivo vacio, se creo el array: []")
        } 
      }
    } catch (error) {
      console.log("Error al iniciar ProductManager: ", error);
    }
  }

  async addProduct(newProduct) {
    try {
        //leyendo archivo JSON y gardandolo en una constante
      const readProductFromJSON = await fs.promises.readFile(
        this.path,
        "utf-8"
      );
      this.products = JSON.parse(readProductFromJSON);

      //objeto desestructurado (extrayendo las propiedades de newProduct)
      let { title, description, price, thumbnail, code, stock, category, status } = newProduct;

      const codeValidation = (productCode) => productCode.code === code;
      if (this.products.some(codeValidation)) {
        return console.log("El producto ya existe");
      } else if (
        !title ||
        title.trim() === "" ||
        !description ||
        description.trim() === "" ||
        price === null ||
        price === undefined ||
        price === "" ||
        !thumbnail || thumbnail.trim() === "" ||
        !code ||
        code.trim() === "" ||
        stock === null ||
        stock === undefined ||
        stock === "" || 
        !category ||
        category.trim() === "" ||
        status === null ||
        status === undefined

      ) {
        return console.log("Todos los campos son obligatorios");
      }

      if (this.products.length > 0){
       ProductManager.id = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
    }

    //Test id Max
    console.log("ID MAX", ProductManager.id);

      // Incrementando
      ProductManager.id++;
      newProduct.id = ProductManager.id;      

      this.products.push(newProduct);
      //console.log(this.products);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
      return ProductManager.id;
    } catch (error) {
      console.log("Error adding product: ", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      //* Leer archivos y almacenar en una constante
      const readProductFromJSON = await fs.promises.readFile(
        this.path,
        "utf-8"
      );
      if (readProductFromJSON.length > 0) {
        //? Convierto a formato Array
        this.products = JSON.parse(readProductFromJSON);
        console.log(this.products);
        return this.products;
      } else {
        console.log("JSON file file is empty");
        return this.products;
      }
    } catch (error) {
      console.log("Error reading or parsing JSON file: ", error.message);
    }
  }

  async getProductById(id) {
    try {
      //* Leer archivos y almacenarlos en una constante
      const readProductJSON = await fs.promises.readFile(this.path, "utf-8");
      if (!readProductJSON || readProductJSON.trim() === "") {
        console.log("JSON is empty");
        return "JSON is empty";
      }
      //? Convierto a Array
      this.products = JSON.parse(readProductJSON);
      //? Buscar por ID
      const foundProduct = this.products.find((product) => product.id === id);
      if (foundProduct) {
        console.log(foundProduct);
        return foundProduct;
      } else {
        console.log("Not found");
        return "Not found";
      }
    } catch (error) {
      console.log("Error reading or parsing JSON file: ", error.message);
    }
  }

  async updateProduct(id, title, description, price) {
    try {
      const readProductJSON = await fs.promises.readFile(this.path, "utf-8");
      if (!readProductJSON || readProductJSON.trim() === "") {
        console.log("JSON is empty");
        return "JSON is empty";
      }
      //? Convierto a Array
      this.products = JSON.parse(readProductJSON);
      //? Buscar por ID
      const foundProduct = this.products.find((product) => product.id === id);
      if (!foundProduct) {
        console.log("Product not Found");
        return "Product not Found";
      }

      foundProduct.title = title;
      foundProduct.description = description;
      foundProduct.price = price;

      console.log("Producto actualizado: ", foundProduct);

      function replaceObjectById(array, idObject, newObject) {
        const index = array.findIndex((product) => product.id === idObject);
        if (index !== -1) {
          array[index] = newObject;
          return array;
        }
      }

      replaceObjectById(this.products, id, foundProduct);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
      console.log(this.products);
      return this.products;
    } catch (error) {
      console.log("Error updating product: ", error.message);
    }
  }

  async deleteProduct(id) {
    try {
      // leer archivo y guardarlo
      const readProductJSON = await fs.promises.readFile(this.path, "utf-8");

      //comprobar que no este vacio
      if (readProductJSON.length > 0) {
        //Convirtiendo a Array
        this.products = JSON.parse(readProductJSON);
      } else {
        console.log("JSON file is empty");
        return [];
      }

      const deleteProduct = (array, idProduct) => {
        return array.filter((product) => product.id !== idProduct);
      };

      if (this.products.length !== 0) {
        this.products = deleteProduct(this.products, id);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 2)
        );
        return this.products;
      } else {
        console.log("Array sin productos");
        return [];
      }
    } catch (error) {
      console.log("Error al borrar producto");
    }
  }
}

export default ProductManager;
