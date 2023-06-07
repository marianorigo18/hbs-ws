const socket = io();

let addProductBtn = document.getElementById("add-product-btn")

// cuando recibo el evento "update-products", actulizo la vista
socket.on("update-products", (products) => {
  let productsContainer = document.getElementById("products-container")
  productsContainer.innerHTML = ""

  for (let product of products) {
    let productElement = document.createElement("div");
    productElement.innerHTML = `
      <p> Title: ${product.title} </p>
      <p> Description: ${product.description} </p>
      <p> Price: ${product.price} </p>
      <button id=${product.id} onclick="deleteProduct(this)"> Borrar </button>
    `

    productElement.setAttribute("style", "border: 1px solid #000; border-radius: 1rem; padding: 1rem; margin-bottom: 1rem")
    productsContainer.appendChild(productElement)
  }

})

// handler del evento "click" para agregar un producto 
addProductBtn.addEventListener("click", (e) => {
  e.preventDefault()

  // obtengo los inputs
  let titleInput = document.getElementById("title")
  let descriptionInput = document.getElementById("description")
  let priceInput = document.getElementById("price")
  let codeInput = document.getElementById("code")
  let stockInput = document.getElementById("stock")
  let categoryInput = document.getElementById("category")
  let statusInput = document.getElementById("status")

  // creo el producto a partir de los valores de los inputs
  let productData = {
    title: titleInput.value,
    description: descriptionInput.value,
    price: Number(priceInput.value),
    code: Number(codeInput.value),
    stock: Number(stockInput.value),
    category: categoryInput.value,
    status: (statusInput.value.toLowerCase() === "true")
  }

  // emito el evento "add-product" que va a escuchar el server
  socket.emit("add-product", productData)

  // reseteo los inputs
  titleInput.value = ""
  descriptionInput.value = ""
  priceInput.value = ""
  codeInput.value = ""
  stockInput.value = ""
  categoryInput.value = ""
  statusInput.value = ""

})

// Declaracion de funciones auxiliares
function deleteProduct(button) {
  socket.emit("delete-product", button.id) // El id del boton es del producto
}