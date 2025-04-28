/** @format */

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const listNav = document.querySelector('.list-nav');

mobileMenuBtn.addEventListener('click', () => {
    listNav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-menu-btn') && !e.target.closest('.list-nav')) {
        listNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            // Close mobile menu after clicking a link
            listNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
});

// Header scroll behavior
let lastScroll = 0;
const mainHeader = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        mainHeader.classList.remove('scrolled');
        return;
    }

    if (currentScroll > lastScroll && !mainHeader.classList.contains('scrolled')) {
        // Scrolling down
        mainHeader.classList.add('scrolled');
    } else if (currentScroll < lastScroll && mainHeader.classList.contains('scrolled')) {
        // Scrolling up
        mainHeader.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.innerHTML = isDarkMode
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
});

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');

    elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;

        if (elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Form validation
const forms = document.querySelectorAll('form');
forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic form validation
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach((input) => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (isValid) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Form submitted successfully!';
            form.appendChild(successMessage);

            // Reset form
            form.reset();

            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });
});

// Product filtering
const filterButtons = document.querySelectorAll('.filters_menu li');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove('active_menu'));
        // Add active class to clicked button
        button.classList.add('active_menu');

        const category = button.getAttribute('data-category');

        productCards.forEach((card) => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 100);
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    });
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach((img) => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach((img) => imageObserver.observe(img));
    }
});

// Cart Class
class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.items || [];
            this.total = cartData.total || 0;
            this.updateCartUI();
        }
    }

    saveCart() {
        localStorage.setItem(
            'cart',
            JSON.stringify({
                items: this.items,
                total: this.total,
            })
        );
    }

    setupEventListeners() {
        // Cart icon click
        document.querySelector('.cart-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCart();
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-dropdown') && !e.target.closest('.cart-icon')) {
                this.closeCart();
            }
        });

        // Add to cart buttons for products
        document.querySelectorAll('.product-card .btn-primary').forEach((button) => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.id;
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(
                    productCard.querySelector('.price').textContent.replace('$', '')
                );
                const productImage = productCard.querySelector('img').src;

                this.addItem({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    type: 'product',
                });
            });
        });

        // Add to cart buttons for offers
        document.querySelectorAll('.offer-card .order-now').forEach((button) => {
            button.addEventListener('click', (e) => {
                const offerCard = e.target.closest('.offer-card');
                const offerId =
                    'offer-' +
                    offerCard.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
                const offerName = offerCard.querySelector('h3').textContent;
                const offerPrice = parseFloat(
                    offerCard.querySelector('.discounted-price').textContent.replace('$', '')
                );
                const offerImage = offerCard.querySelector('img').src;
                const offerBadge = offerCard.querySelector('.offer-badge').textContent;

                this.addItem({
                    id: offerId,
                    name: offerName,
                    price: offerPrice,
                    image: offerImage,
                    quantity: 1,
                    type: 'offer',
                    badge: offerBadge,
                });
            });
        });
    }

    toggleCart() {
        const dropdown = document.querySelector('.cart-dropdown');
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            this.updateCartUI();
        }
    }

    closeCart() {
        document.querySelector('.cart-dropdown').classList.remove('active');
    }

    addItem(item) {
        const existingItem = this.items.find((i) => i.id === item.id);

        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification(`${item.name} quantity updated to ${existingItem.quantity}`);
        } else {
            this.items.push(item);
            this.showNotification(`${item.name} added to cart`);
        }

        this.updateCart();
    }

    removeItem(productId) {
        const itemIndex = this.items.findIndex((item) => item.id === productId);
        if (itemIndex !== -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.showNotification(`${removedItem.name} removed from cart`);
            this.updateCart();
        }
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find((item) => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.showNotification(`${item.name} quantity updated to ${newQuantity}`);
                this.updateCart();
            }
        }
    }

    updateCart() {
        this.calculateTotal();
        this.updateCartUI();
        this.saveCart();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span:last-child');

        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items
        if (this.items.length === 0) {
            cartItems.innerHTML =
                '<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
        } else {
            cartItems.innerHTML = this.items
                .map(
                    (item) => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        ${
                            item.type === 'offer'
                                ? `<div class="offer-badge">${item.badge}</div>`
                                : ''
                        }
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove"><i class="fas fa-times"></i></button>
                </div>
            `
                )
                .join('');

            // Add event listeners to quantity buttons and remove buttons
            this.addCartItemListeners();
        }

        // Update total
        cartTotal.textContent = `$${this.total.toFixed(2)}`;
    }

    addCartItemListeners() {
        document.querySelectorAll('.cart-item').forEach((item) => {
            const productId = item.dataset.id;
            const quantityElement = item.querySelector('.quantity');
            const minusButton = item.querySelector('.minus');
            const plusButton = item.querySelector('.plus');
            const removeButton = item.querySelector('.cart-item-remove');

            minusButton.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityElement.textContent);
                this.updateQuantity(productId, currentQuantity - 1);
            });

            plusButton.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityElement.textContent);
                this.updateQuantity(productId, currentQuantity + 1);
            });

            removeButton.addEventListener('click', () => {
                this.removeItem(productId);
            });
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new Cart();
