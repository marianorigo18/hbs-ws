import ProductManager from './classes/ProductManager.class.js'
import { Server } from "socket.io";
import __dirname from './utils.js'
import express from 'express'
import handlebars from 'express-handlebars'
import routerProducts from './routes/products.router.js'
import routerViews from './routes/views.router.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

// configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routers

// Diferencias 

// 1) cuando use el routerViews, como respuesta a la request del cliente, obtengo una vista (html) con los datos (la veo desde el browser)
//    res.render() para enviar la respuesta   
// 2) cuando uso el routerProducts, la respuesta a la request del cliente es información en formato JSON (la veo desde el postman)
//    res.send() para enviar la respusta

// router que renderiza vistas
app.use("/", routerViews);

// routers para apis
app.use("/api/products", routerProducts);

// server start and socket io

const expressServer = app.listen(8080, () => console.log("Servidor levantado"))
const socketServer = new Server(expressServer)

socketServer.on("connection", async (socket) => {

  console.log("nuevo cliente conectado: " + socket.id)

  let productManager = new ProductManager(__dirname + "/files/products.json")

  // le envío todos los productos que tengo al cliente para que muestre en la vista
  socket.emit("update-products", await productManager.getProducts())

  // agrego el producto 
  // le mando la lista de productos actualizada a la vista para que actualice la vista
  socket.on("add-product", async (productData) => {
    await productManager.addProduct(productData)
    socketServer.emit("update-products", await productManager.getProducts())
  })

  // elimina un producto 
  // envío productos a la vista para que actualice 
  socket.on("delete-product", async (productID) => {
    await productManager.deleteProduct(productID)
    socketServer.emit("update-products", await productManager.getProducts())
  })
})