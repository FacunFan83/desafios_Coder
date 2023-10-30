import express from 'express'
import { ProductManager } from './app.js'
import { Producto } from './app.js'
const pm = new ProductManager
const app = express()

app.listen(8080, ()=>{
    console.log('servidor ON')
})

app.get('/products', async (req, res) => {
    const limite = req.query.limit
    console.log (limite)
    const cantProductos = pm.products.length
    let productos
    try {
        if (!limite) {
            console.log(limite)
            productos = await pm.getProducts()
            console.log(productos)
        } else {
            const oldproductos = await pm.getProducts()
            productos = oldproductos.splice(0,parseInt(limite))
            console.log(limite, productos)
        }
        res.json(productos)
        // res.send('Limite : '+limite)
    } catch (err) {
        res.json({
            status: 'Error',
            message: err.message
        })
    }
})

app.get("/products/:pid", async (req, res) => {
    const id = parseInt(req.params.pid)
    try {
        const product = await pm.getProductsById(id)
        res.json(product)
    } catch (err) {
        res.json({
            status: 'Error',
            message: err.message
        })
    }

}) 

async function main() {
    await pm.init()
    const p1 = new Producto
    try {
        p1.newProd({ title: 'Producto Prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc124', stock: 25 })
    } catch (err) { console.log(err.message) }

    // Crea el producto 2
    const p2 = new Producto
    try {
        p2.newProd({ title: 'Producto Prueba II', description: 'Otro producto prueba', price: 450, thumbnail: 'Sin imagen', code: 'def457', stock: 10 })
    } catch (err) { console.log(err.message) }

    const p3 = new Producto
    try {
        p3.newProd({ title: 'Producto Prueba III', description: 'Otro producto prueba mas', price: 1540, thumbnail: 'Sin imagen', code: 'zaq963', stock: 40 })
    } catch (err) { console.log(err.message) }

    // Agrega el Producto al ProductManager
    try { await pm.addProduct(p1) } catch (err) { console.log(err.message) }
    // Agrega el Producto al ProductManager
    try { await pm.addProduct(p2) } catch (err) { console.log(err.message) }
    // Agrega el Producto al ProductManager
    try { await pm.addProduct(p3) } catch (err) { console.log(err.message) }

}

main ()