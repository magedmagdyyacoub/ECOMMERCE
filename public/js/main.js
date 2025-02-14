
  const carouselContainer = document.querySelector('.carousel-container');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentIndex = 0;

  const updateCarousel = () => {
    const width = carouselContainer.offsetWidth;
    carouselContainer.style.transform = `translateX(-${currentIndex * width}px)`;
  };

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : 3;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < 3) ? currentIndex + 1 : 0;
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);
  document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.querySelector('.btn-cart');
    const quantityInput = document.querySelector('.quantity-input');
  
    addToCartButton.addEventListener('click', function () {
      const quantity = quantityInput.value;
      const productId = window.location.pathname.split('/').pop(); // Assuming product ID is in URL
      console.log(`Product ID: ${productId}, Quantity: ${quantity}`);
      
      // You can implement the add to cart functionality here (e.g., sending to the backend)
      // For now, let's just alert the details
      alert(`Added ${quantity} of Product ${productId} to the cart.`);
    });
  });

  function removeFromCart(productId) {
    // Redirect to the route that handles removing the item from the cart
    window.location.href = `/cart/remove/${productId}`;
  }

  