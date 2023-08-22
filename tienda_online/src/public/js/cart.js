document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('[data-id]');

    addToCartButtons.forEach(button => {
        const cartId = button.getAttribute('data-cartid');
        const productId = button.getAttribute('data-id');

        button.addEventListener('click', () => {
            console.log(`Cart ID: ${cartId}`);
            console.log(`Product ID: ${productId}`);
            addToCart(cartId, productId);
        });
    });
});

function addToCart(cartId, productId) {
    console.log(`addToCart - Cart ID: ${cartId}`);
    console.log(`addToCart - Product ID: ${productId}`);
    fetch(`/carts/${cartId}/product/${productId}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = `/carts/${cartId}`;
    })
    .catch(error => {
        console.error('Error al agregar al carrito:', error);
    });
}
