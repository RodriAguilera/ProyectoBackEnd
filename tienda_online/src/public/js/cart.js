function addToCart(cartId, productId) {
    fetch(`/carts/${cartId}/product/${productId}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = `/carts/${cartId}`; // Redirige a la página de carrito
    })
    .catch(error => {
        console.error('Error al agregar al carrito:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('[data-id]');

    addToCartButtons.forEach(button => {
        const cartId = button.getAttribute('data-cartid');
        const productId = button.getAttribute('data-id');
      
        button.addEventListener('click', () => {
            addToCart(cartId, productId);
        });
    });
});
