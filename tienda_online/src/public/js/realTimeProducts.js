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

// Escucha evento 'newProduct' del servidor
socketClient.on('newProduct', (newProduct) => {
  const productList = document.getElementById('productList');

  const productDiv = document.createElement('div');
  productDiv.classList.add('grid', 'grid-cols-1', 'gap-y-2', 'text-center');

  
  const titleElement = document.createElement('p');
  titleElement.textContent = newProduct.title;

  const priceElement = document.createElement('p');
  priceElement.textContent = `$${newProduct.price}`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Eliminar producto';
  deleteButton.classList.add('delete-btn', 'rounded-lg', 'outline', 'outline-offset-2', 'outline-2', 'outline-red-500/70', 'p-1');
  deleteButton.dataset.id = newProduct.id;

  productDiv.appendChild(titleElement);
  productDiv.appendChild(priceElement);
  productDiv.appendChild(deleteButton);


  productList.appendChild(productDiv);
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
