/** @format */

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const listNav = document.querySelector('.list-nav');
const navLinks = document.querySelectorAll('.nav-link');

// Cart Elements
const cartIcon = document.querySelector('.cart-icon');
const cartDropdown = document.querySelector('.cart-dropdown');
const closeCartBtn = document.querySelector('.close-cart');
const themeToggle = document.querySelector('.theme-toggle');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');

// Initialize cart instance
const cart = new Cart();

// Add animation delay to nav links
navLinks.forEach((link, index) => {
    link.style.setProperty('--item-index', index);
});

// Function to handle menu state
function toggleMenu(e) {
    if (e) e.stopPropagation();
    listNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    mobileMenuBtn.classList.toggle('active');

    // Reset animations when closing
    if (!listNav.classList.contains('active')) {
        navLinks.forEach((link) => {
            link.style.animation = 'none';
            link.offsetHeight; // Trigger reflow
            link.style.animation = null;
        });
    }

    // Close cart if open
    if (cartDropdown.classList.contains('active')) {
        closeCart();
    }
}

// Function to close menu
function closeMenu() {
    listNav.classList.remove('active');
    document.body.classList.remove('menu-open');
    mobileMenuBtn.classList.remove('active');

    // Reset animations
    navLinks.forEach((link) => {
        link.style.animation = 'none';
        link.offsetHeight; // Trigger reflow
        link.style.animation = null;
    });
}

// Function to toggle cart
function toggleCart(e) {
    if (e) e.stopPropagation();
    cartDropdown.classList.toggle('active');
    document.body.classList.toggle('cart-open');

    // Close menu if open
    if (listNav.classList.contains('active')) {
        closeMenu();
    }

    // Update cart UI when opening
    if (cartDropdown.classList.contains('active')) {
        cart.updateCartUI();
    }
}

// Function to close cart
function closeCart(e) {
    if (e) e.stopPropagation();
    cartDropdown.classList.remove('active');
    document.body.classList.remove('cart-open');
}

// Theme Toggle Functionality
const body = document.body;

// Function to set theme
function setTheme(isDark) {
    body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);

    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';

    // Show notification
    showToast(isDark ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري');
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    setTheme(true);
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark-mode');
    setTheme(isDark);
});

// Event Listeners
mobileMenuBtn.addEventListener('click', toggleMenu);
cartIcon.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', closeCart);

// Close menu when clicking on a link
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Close menu and cart when clicking outside
document.addEventListener('click', (e) => {
    const isMenuOpen = listNav.classList.contains('active');
    const isCartOpen = cartDropdown.classList.contains('active');

    if (isMenuOpen && !e.target.closest('.list-nav') && !e.target.closest('.mobile-menu-btn')) {
        closeMenu();
    }

    if (isCartOpen && !e.target.closest('.cart-dropdown') && !e.target.closest('.cart-icon')) {
        closeCart();
    }
});

// Prevent closing when clicking inside menu or cart
listNav.addEventListener('click', (e) => e.stopPropagation());
cartDropdown.addEventListener('click', (e) => e.stopPropagation());

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
        closeCart();
    }
});

// Handle scroll
window.addEventListener('scroll', () => {
    if (listNav.classList.contains('active')) {
        closeMenu();
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

// Handle scroll for header and mobile menu
let lastScrollPosition = 0;
const scrollThreshold = 100;
const mainHeader = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Handle header scroll
    if (currentScroll <= 0) {
        mainHeader.classList.remove('scrolled');
    } else if (currentScroll > lastScrollPosition && !mainHeader.classList.contains('scrolled')) {
        mainHeader.classList.add('scrolled');
    } else if (currentScroll < lastScrollPosition && mainHeader.classList.contains('scrolled')) {
        mainHeader.classList.remove('scrolled');
    }

    // Handle mobile menu button
    if (currentScroll > lastScrollPosition && currentScroll > scrollThreshold) {
        mobileMenuBtn.style.opacity = '0';
        mobileMenuBtn.style.visibility = 'hidden';
    } else {
        mobileMenuBtn.style.opacity = '1';
        mobileMenuBtn.style.visibility = 'visible';
    }

    lastScrollPosition = currentScroll;
});

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

// Initialize Bootstrap tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Cart functionality
class Cart {
    constructor() {
        this.items = [];
        this.cartItemsContainer = document.querySelector('.cart-items');
        this.cartTotal = document.querySelector('.total-amount');
        this.cartCount = document.querySelector('.cart-count');
        this.loadCart();
        this.setupEventListeners();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartCount();
            this.updateCartUI();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        this.cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }

    addItem(id, name, price, image) {
        const existingItem = this.items.find((item) => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
            showToast(`${name} quantity increased to ${existingItem.quantity}`);
        } else {
            this.items.push({
                id,
                name,
                price,
                image,
                quantity: 1,
            });
            showToast(`${name} added to cart`);
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeItem(id) {
        const item = this.items.find((item) => item.id === id);
        if (item) {
            showToast(`${item.name} removed from cart`);
        }
        this.items = this.items.filter((item) => item.id !== id);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(id, change) {
        const item = this.items.find((item) => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                showToast(`${item.name} quantity updated to ${item.quantity}`);
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        if (this.items.length === 0) {
            this.cartItemsContainer.innerHTML = '<p class="empty-cart">السلة فارغة</p>';
            this.cartTotal.textContent = '$0.00';
            return;
        }

        this.cartItemsContainer.innerHTML = this.items
            .map(
                (item) => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                        <button class="remove-item">×</button>
                    </div>
                </div>
            </div>
        `
            )
            .join('');

        const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        this.cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                const id = productCard.dataset.id;
                const name = productCard.querySelector('.product-name').textContent;
                const price = parseFloat(productCard.querySelector('.price').dataset.price);
                const image = productCard.querySelector('.product-image').src;

                this.addItem(id, name, price, image);
                cartDropdown.classList.add('active');
            });
        });

        // Cart item controls
        this.cartItemsContainer.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const id = cartItem.dataset.id;

            if (e.target.classList.contains('plus')) {
                this.updateQuantity(id, 1);
            } else if (e.target.classList.contains('minus')) {
                this.updateQuantity(id, -1);
            } else if (e.target.classList.contains('remove-item')) {
                this.removeItem(id);
            }
        });
    }
}

// Function to show theme change notification
function showThemeToast(isDark) {
    const message = isDark ? 'تم التحويل للوضع الليلي' : 'تم التحويل للوضع النهاري';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }, 100);
}

// Function to show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }, 100);
}
