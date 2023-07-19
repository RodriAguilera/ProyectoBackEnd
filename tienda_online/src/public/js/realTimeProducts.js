// Conectar al servidor de sockets
const socketClient = io(); //Socket del lado del cliente


const productForm = document.getElementById('createProductForm');
productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const productTitulo = formData.get('title');
  const productPrecio = formData.get('price');

  socketClient.emit('addProduct', { title: productTitulo, price: productPrecio });
  productForm.reset();
});

// Escuchar evento 'newProduct' del servidor
socketClient.on('newProduct', (newProduct) => {
  const productList = document.getElementById('productList');
  
  const titleElement = document.createElement('li');
  titleElement.textContent = newProduct.title;

  const priceElement = document.createElement('li');
  priceElement.textContent = `$${newProduct.price}`;

  productList.appendChild(titleElement);
  productList.appendChild(priceElement);
});

//Eliminar product
document.getElementById('productList').addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    const productId = event.target.dataset.id;
    socketClient.emit('deleteProduct', productId);
  }
});

socketClient.on('productDeleted', (productId) => {
  const productList = document.getElementById('productList');
  const productToRemove = productList.querySelector(`[data-id="${productId}"]`);
  if (productToRemove) {
    productList.removeChild(productToRemove.parentElement);
  }
});
