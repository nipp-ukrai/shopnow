let products = [
    { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 79.99 },
    { id: 2, name: 'Smart Watch Pro', category: 'electronics', price: 199.99 },
    { id: 3, name: 'Premium Backpack', category: 'accessories', price: 49.99 },
    { id: 4, name: 'Running Shoes', category: 'clothing', price: 89.99 },
    { id: 5, name: 'Designer Sunglasses', category: 'accessories', price: 129.99 },
    { id: 6, name: 'Laptop Stand', category: 'electronics', price: 39.99 },
    { id: 7, name: 'Cotton T-Shirt', category: 'clothing', price: 24.99 },
    { id: 8, name: 'Bluetooth Speaker', category: 'electronics', price: 59.99 }
];

let cart = [];
let currentCategory = 'all';

function getProductNames() {
    return products.map(product => product.name);
}

function getSearchValue() {
    const searchInput = document.querySelector('.search-input');
    return searchInput.value.toLowerCase().trim();   
}

function showSuggestions(searchValue){
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const productNames = getProductNames();

    if (!searchValue) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('active');
        return;
    }
    
    const filteredProducts = productNames.filter(productName => 
        productName.toLowerCase().includes(searchValue)
    );
    
    if (filteredProducts.length === 0) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('active');
        return;
    } 
    
    suggestionsContainer.innerHTML = '';
    filteredProducts.forEach(productName => {
        const suggestionProduct = document.createElement('div');
        suggestionProduct.className = 'suggestion-item';
        suggestionProduct.textContent = productName;
        
        suggestionProduct.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input');
            searchInput.value = productName;
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.remove('active');
        });
        suggestionsContainer.appendChild(suggestionProduct);
    });
    suggestionsContainer.classList.add('active');
}


function addToCart(productId) {
    const product = products.find(product => product.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 0;
        } else {
            cart.push({ ...product, quantity: 1});
        }

        console.log(`${product.name} added to cart!`);
        console.log('Current cart:', cart);
        updateCartCount();
        updateCartDisplay();
    } else {
        console.log('Product not found');
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Add event listeners to all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
});

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    console.log('Removed from the cart:', cart);
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function filterProducts(category) {
    currentCategory = category;
    const productsGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productCategory = card.querySelector('.product-category').textContent.toLowerCase();
        const categoryMap = {
            'all': true,
            'electronics': 'electronics',
            'clothing': 'clothing',
            'accessories': 'accessories',
            'home-garden': 'home & garden'
        };
        
        if (category === 'all' || productCategory === categoryMap[category]) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function updateCartDisplay() {
    const checkoutContent = document.getElementById('checkoutContent');
    const totalAmount = document.getElementById('totalAmount');
    
    if (cart.length === 0) {
        checkoutContent.innerHTML = `
            <div class="empty-cart">
                
                <p class="empty-cart-text">Your cart is empty</p>
            </div>
        `;
        totalAmount.textContent = 'Total: $0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-control">
                        <button class="qnt-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qnt-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    });
    
    checkoutContent.innerHTML = html;
    totalAmount.textContent = `Total: $${total.toFixed(2)}`;
}

// Checkout modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
    
    // Close checkout modal
    const closeCheckout = document.getElementById('closeCheckout');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const cartBtn = document.getElementById('cartBtn');

    if (closeCheckout && checkoutOverlay) {
        closeCheckout.addEventListener('click', function() {
            checkoutOverlay.style.display = 'none';
        });

        checkoutOverlay.addEventListener('click', function(e) {
            if (e.target === checkoutOverlay) {
                checkoutOverlay.style.display = 'none';
            }
        });
    }

    // Open checkout modal
    if (cartBtn && checkoutOverlay) {
        cartBtn.addEventListener('click', function() {
            updateCartDisplay();
            checkoutOverlay.style.display = 'flex';
        });
    }
});
