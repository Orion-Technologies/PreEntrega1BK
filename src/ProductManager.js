// Esto simplifica el código, ya no hace falta poner "fs.promises" en el código
//const fs = require("fs").promises;
//** '* as fs' importa todo el modulo de fs y lo asign a la variable 'fs' */
import * as fs from "fs/promises";

//! Solución encontrada en "https://www.codecademy.com/article/getting-user-input-in-node-js"
//const prompt = require('prompt-sync')();


class ProductManager {
    static id = 1;

    constructor() {
        this.products = [];
        //! Tengo que poner la ruta raiz cuando exporto la clase.
        this.path = './src/productos.json';
    }

    //! Inicializando la lectura de archivos
    async init() {
        try {
            //** comprobando que exista la ruta
            if(fs.existsSync(this.path)){
                const readProductctsFromJSON = await fs.readFile(this.path, 'utf-8');
                this.products = JSON.parse(readProductctsFromJSON);
            } else {
                //** Si no existe se creata
                await fs.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
            }
        } catch (error){
            console.log("Error al iniciar ProductManager: ", error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        //! Tengo que ir a leer el archivo JSON
        const readProductsJSON = await fs.readFile(this.path, 'utf-8');
        //! compruebo que tengo algo y lo tengo que parsear a formato de array
        if(readProductsJSON) {
            this.products = JSON.parse(readProductsJSON);
        }

        const codeValidation = productCode => productCode.code === code;

        if (this.products.some(codeValidation)) {
            return console.log('El producto ya existe');
        } else if (!title || title.trim() === '' || !description || description.trim() === '' || price === null || price === undefined || price === '' || !code || code.trim() === '' || stock === null || stock === undefined || stock === '') {
            return console.log('Todos los campos son obligatorios');
        } else {

            /**
             * ?? Hice un nuevo objeto con todos los argumentos de la funcion para entender mejor la creación de objetos y en cada objeto creado aumento el id
             * @type {{thumbnail, code, price, description, id: number, title, stock}}
             */
            const newProduct = {
                id: ProductManager.id++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            //** Hago push al array de objetos con los nuevos objetos creados
            this.products.push(newProduct);
            //! Esto convierte el array de objetos a formato JSON y aplico un trucazo de la naza XD
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            //console.log('Producto agregado: ', newProduct);
            return ProductManager.id;
        }
    }

    async  getProducts() {
        try {
            //** Leer archivos y almacenarlos en una constante
            const readProductsJSON = await fs.readFile(this.path, 'utf-8');
            //?? Compruebo que no este vacia la constante
            if (readProductsJSON.length > 0) {
                //?? Convierto a formato array
                this.products = JSON.parse(readProductsJSON);
                console.log(this.products);
                return this.products;
            } else {
                console.log("JSON file is empty");
                return [];
            }
        } catch (error) {
            console.log("(getProduct) Error reading or parsing JSON file: ", error.message);
        }
    }

    async getProductById(id) {
        try {
            //** Leer archivos y almacenarlos en una constante
            const readProductsJSON = await fs.readFile(this.path, 'utf-8');
            //?? Compruebo que no este vacia la constante
            if (!readProductsJSON || readProductsJSON.trim() === "") {
                console.log("JSON is empty");
                return 'JSON is empty';
            }
            //?? Convierto a formato array
            this.products = JSON.parse(readProductsJSON);
            //?? Busco por ID
            const foundProduct = this.products.find(product => product.id == id);
            if (foundProduct) {
                console.log(foundProduct)
                return foundProduct;
            } else {
                console.log("Not found");
                return 'Not found';
            }
        } catch (error) {
            console.log("(getProductById) Error reading or parsing JSON file: ", error.message);
        }
    }

    async updateProduct(id, title, description){
        const updateProduct = await this.getProductById(id);
        console.log('Producto encontrado: ', updateProduct);

        updateProduct.title = title;
        updateProduct.description = description;
        console.log('Producto actualizado: ', updateProduct);

        const productIndex = this.products.findIndex(product => product.id === id);
        if(productIndex !== -1) {
            this.products[productIndex] = updateProduct;
        } else {
            console.log("Producto no encontrado con ID: ", id);
        }

        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        console.log('Nuevo Array ', this.products);
        }

        async deleteProduct(id) {
        const readProductsJSON = await fs.readFile(this.path, 'utf-8');

            //?? Compruebo que no este vacia la constante
            if (readProductsJSON.length > 0) {
                //?? Convierto a formato array
                this.products = JSON.parse(readProductsJSON);
            } else {
                console.log("JSON file is empty");
                return [];
            }

            //! En base a la funcion update hice la delete
            function deleteProduct(array, idProduct) {
              //! Retorno el resultado del filter para posterios guardarlo en this.products
              return array.filter(object => object.id !== idProduct);
            }

            this.products = deleteProduct(this.products, id);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log('Array sin producto ', this.products);
        }
}


/*


producto.addProduct('T-Shirt', 'T-Shirt Cartoon', 350, "url", "T1", 50);
producto.addProduct("Gorra", 'Popeye', 250, "url", "G1", 50);
producto.addProduct("Consola", 'PS5', 7500, "url", "C1", 75);
producto.addProduct("SmartPhone", 'iPhone 15', 11500, "url", "SP1", 75);
producto.addProduct("Tablet", 'iPad', 9500, "url", "TB1", 75);
producto.addProduct("SmartPhone", 'SamSung', 10000, "url", "SPS1", 75);
producto.addProduct("Monitor", 'ASUS 4K Gamer', 11500, "url", "M1", 75);
producto.addProduct("Monitor", 'LG 4k', 11500, "url", "M2", 75);
producto.addProduct("PC", 'PC Razer Gamer', 16000, "url", "PC1", 75);
producto.addProduct("PC", 'PC Razer Gamer Core i9', 20000, "url", "PC2", 75);

*/

//! Con esto exporto toda la clase
//module.exports = ProductManager;

//** Importamos la class por default
export default ProductManager;

const producto = new ProductManager();

// Producto con code repetido para hacer pruebas.
//producto.addProduct("Smart Phone", 'iPhone 14', 11500, "url", "SP1", 75);

//producto.getProducts();
//producto.getProductById(1);
//producto.updateProduct(2, "Gorra", "Gorra Gamming");
//producto.deleteProduct(1);


