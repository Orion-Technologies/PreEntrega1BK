//products-manager-db.js

import ProductsModel from "../models/products.model.js";

class ProductManager {

   
    async addProduct({title, description, price, thumbnail = [], code, stock, status, category}) {
        try {
            if(!title|| !description || !price || !code || !stock || !status || !category) {
                return { status: false, msg: "Error al agregar el producto, por favor completar los campos faltantes " };
            }
            const existeProducto = await ProductsModel.findOne({code: code});
            if(existeProducto) {
                return { status: false, msg: `Error al agregar el producto, ${code} repetido: ` };
            };

            const nuevoProducto = new ProductsModel({
                title, 
                description, 
                price,
                code,
                stock, 
                category, 
                status: true, 
                thumbnail: thumbnail || []
            });
           
            await nuevoProducto.save(); 
            return { status: true, product: nuevoProducto, msg: "Producto agregado exitosamente" };
        } catch (error) {
            return { status: false, msg: "Error al agregar el producto: " + error.message };
        }
    }
    
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const options = {
              page,
              limit,
              lean: true, // Devuelve objetos JavaScript "planos"
            };
      
            if (sort) {
              options.sort = { price: sort === 'asc' ? 1 : -1 };
            }
      
            if (query) {
              options.query = { category: query };
            }
      
            const productList = await ProductsModel.paginate({}, options);
      
            return productList; // Devuelve directamente el resultado de paginación
          } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error;
          }
    }

    /*async getProduct({ page = 1, limit = 2 }) {
        try {
          const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true, // para obtener objetos JavaScript "planos"
          };
          const productos = await ProductsModel.paginate({}, options); // usando paginación
          return productos; // debería tener una propiedad 'docs' que es un array
        } catch (error) {
          throw new Error("Error al obtener la lista de productos: " + error.message);
        }
      }*/
   /* async getProduct() {
        try {
            const productos = await ProductsModel.find().lean();
           return productos;
        } catch (error) {
            return { status: false, msg: "Error al obtener la lista de productos: " + error.message };
        };

    };
    */
    async getProductById(id) {
        try {
            const producto = await ProductsModel.findById(id);
            if (!producto) {
                return { status: false, msg: `Producto con ID ${id} no encontrado` };
            } else {
                return { status: true, product: producto, msg: `Producto ID: ${id} encontrado exitosamente` };
            }
        } catch (error) {
            return { status: false, msg: `Producto con ID ${id} no encontrado` + error.message };
        }
    };

    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductsModel.findByIdAndDelete(id);
            if (!deleteProduct) {
                return { status: false, msg: `Producto con ID  ${id} no encontrado` };
            }
            return { status: true, delete:deleteProduct, msg: `Producto con ID ${id} eliminado correctamente` };
        } catch (error) {
            return { status: false, msg: "Error al intentar borrar el producto: " + error.message };
        }
    }
    async updateProduct(id, productoActualizado) {
        try {
            const updateProduct =  await ProductsModel.findByIdAndUpdate(id, productoActualizado, { new: true }); 
            if(!updateProduct) {
                return { status: false, msg: `Producto con ID ${id} no encontrado` };
            }
            
            return { status: true, product: updateProduct, msg: `Producto con ID ${id} actualizado correctamente` };
        } catch (error) {
            return { status: false, msg: "Error al intentar modificar el producto: " + error.message };
        }
    }
};

export default ProductManager;