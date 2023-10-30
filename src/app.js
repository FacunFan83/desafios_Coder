// const internal = require('stream')
import fs from 'fs/promises'
export class ProductManager {
    // Inicializa vacio
    static id = 0
    static #ruta = "./db/products.json"
    products = []

    /**
     * Inicia el Manager. Valida la existencia del archivo y si no exite, lo crea
     */
    async init() {
        try {
            const savedProducts = await this.getProducts() // comprueba que que el archivo exista
            savedProducts.forEach(el => {
                this.products.push(el)
            });
        } catch (error) {
            await this.#saveProduct() // Si no existe el archivo, lo crea con un array vacío
        }
    }

    /**
     * escribe la propiedad 'products' del PM en el archivo
     */
    async #saveProduct() {
        await fs.writeFile(ProductManager.#ruta, JSON.stringify(this.products))
    }

    /**
     * Obtiene todos los productos guardados en el archivo
     * @returns {Object} Array de Productos
     */
    async getProducts() {
        // Consulta los productos guadados en el archivo
        const savedProducts = await fs.readFile(ProductManager.#ruta, "utf-8")
        return JSON.parse(savedProducts)
    }

    /**
     * Elimina un Producto del Archivo por ID de Producto
     * @param {number} id 
     */
    async deleteProduct(id) {
        const savedProducts = await this.getProducts() // GETTER de los productos guardados
        const idPosition = savedProducts.findIndex(el => el.id === id) // Busca en el array el ID a eliminar
        if (idPosition < 0) { // Valida si idPosition es -1 (id no encontrado)
            throw new Error(`El ID no se encuentra registrado`) // Devuelve error si el ID no está en el archivo
        } else { // Si el ID existe ...
            savedProducts.splice(idPosition, 1) // altera el array eliminado el ID seleccionado
            this.products = savedProducts // define la propiedad "products" del class con el nuevo array
            this.#saveProduct() // SETTER del nuevo array en el archivo
        }
    }

    /**
     * Agrega un Producto al ProductManager y lo guarda en el arhicvo
     * @param {Object} product 
     */
    async addProduct(product) {
        const productCode = this.products.find(el => el.code === product.code) // Valida que el código no exita
        if (productCode) { // si existe, devuelve error
            throw new Error(`El codigo ${product.code} ya existe y no puede estar duplicado`) // console.log(`ERROR: El código de producto ${product.code} ya existe en la Base de Datos`)
        } else { // si no existe pushea el producto en la propiedad "products"
            this.products.push(product)
            await this.#saveProduct()
        }
    }

    /**
     * Actualiza el contenido de un Producto
     * @param {Number} id 
     * @param {Object} product 
     */
    async updateProduct(id, product) {
        // Actualiza un producto
        const productos = await this.getProducts() // guarda en variable los productos
        const productoBuscado = productos.findIndex(el => el.id === id) // busca la posición en el array del producto buscado
        if (productoBuscado != -1) { // Si el producto existe
            this.products[productoBuscado] = product // Reemplaza el producto existente por el nuevo
            await this.#saveProduct() // Guarda el producto en el archivo
        } else {
            throw new Error("El ID del producto no existe") // Si el producto no esta en el archivo, devuelve error
        }
    }

    /**
     * Obtiene un Producto por ID de Producto del archivo
     * @param {Number} id 
     * @returns {Object} Producto Buscado
     */
    async getProductsById(id) {
        const savedProducts = await this.getProducts()
        const idExist = savedProducts.find(el => el.id === parseInt(id)) // comprueba que el Id exista
        if (idExist) {
            // Si existe retorna el objeto
            return savedProducts.filter(el => el.id === id)
        } else {
            // Si no existe retora el error
            throw new Error(`El ID: ${id} no existe`)
        }
    }
}

export class Producto {
    newProd({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios")
        }
        if (stock < 0) throw new Error("El stock no puede ser negativo")
        this.id = ++ ProductManager.id
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}
