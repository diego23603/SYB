document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products');
    const addProductForm = document.getElementById('addProductForm');
  
    // Cargar productos del usuario
    fetch('/products')
      .then((response) => response.json())
      .then((products) => {
        products.forEach((product) => {
          const div = document.createElement('div');
          div.textContent = `${product.name} - $${product.price}`;
          productsContainer.appendChild(div);
        });
      });
  
    // Agregar producto al usuario
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const productId = e.target.productId.value;
  
      fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
        .then((response) => response.text())
        .then((message) => {
          alert(message);
          location.reload();
        });
    });
  });
  