import { Router } from "express"
import ProductManager from '../classes/ProductManager.class.js'
import __dirname from "../utils.js"

let path = __dirname + "/files/products.json"

let productManager = new ProductManager(path)

const router = Router()

router.get('/', async (req, res) => {
  let limit = Number(req.query.limit)

  let products = await productManager.getProducts(limit)

  res.send({products}) // Se envian los productos en forma de objeto como pide la consigna
})

router.get('/:pid', async (req, res) => {
  let id = req.params.pid

  let product = await productManager.getProductById(id)

  if (!product) {
    res.send("No se encontró el producto")
    return
  }

  res.send(product) // Se envian los productos en forma de objeto como pide la consigna
})

router.post('/', async (req, res) => {
  let newProduct = req.body

  await productManager.addProduct(newProduct)

  res.send({status: "success"})
})

router.put('/:pid', async (req, res) => {
  let id = req.params.pid
  let newProduct = req.body

  await productManager.updateProduct(id, newProduct)

  res.send({status: "success"})
})

router.delete('/:pid', async (req, res) => {
  let id = req.params.pid
  
  await productManager.deleteProduct(id)

  res.send({status: "success"})
})

export default router