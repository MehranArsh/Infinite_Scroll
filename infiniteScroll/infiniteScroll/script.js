const productContainer = document.getElementById('product-container');
const loader = document.getElementById('loader');

let currentPage = 1;
const limit = 5; // Number of products per page
let isLoading = false;

// Function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Helper function to add delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to fetch product details from the API
async function fetchProducts(page, limit) {
  if (isLoading) return; // Prevent multiple calls

  try {
    isLoading = true;
    loader.style.display = 'flex'; // Show loader below the last product

    // Ensure loader is displayed for at least 1 second
    await delay(1000);

    const response = await fetch(`https://api.escuelajs.co/api/v1/products?offset=${(page - 1) * limit}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    isLoading = true;
    loader.style.display = 'hidden';
    renderProducts(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    if (page === 1) {
      productContainer.innerHTML = "<p>Error loading product details. Please try again later.</p>";
    }
  } finally {
    loader.style.display = 'none'; // Hide loader after data is rendered
    isLoading = false;
  }
}

// Function to render product details in the DOM
function renderProducts(products) {
  // Append new products to the existing content
  productContainer.innerHTML += products.map(product => `
    <div class="product-card">
      <img src="https://static.cilory.com/681508-thickbox_default/nologo-white-navy-checked-casual-shirt.jpg" alt="${product.title}" class="product-image">
      <div class="product-info">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <p class="product-description">${product.description}</p>
        <div class="category-info">
          ${product.category?.image ? `<img src="${product.category.image}" alt="${product.category.name}">` : ''}
          <div>
            <p class="category-name">${product.category?.name || 'Unknown Category'}</p>
            <p class="date-info">Created on: ${formatDate(product.creationAt)}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');
 
}

// Function to check if the user has reached the bottom of the page
function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60 && !isLoading) {
    currentPage++;
    fetchProducts(currentPage, limit);
  }
}

// Initialize the product fetch with the first page
fetchProducts(currentPage, limit);

// Add an event listener to handle scrolling for infinite scroll
window.addEventListener('scroll', handleScroll);
