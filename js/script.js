/** @format */

function showToast(message) {
    const toast = document.querySelector('.toast');
    const toastMessage = toast.querySelector('.toast-message');

    // Reset any existing animations
    toast.style.animation = 'none';
    toast.offsetHeight;
    toast.style.animation = null;

    // Set the message and show the toast
    toastMessage.textContent = message;
    toast.style.display = 'flex';
    toast.style.animation = 'slideIn 0.5s ease-in-out';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.5s ease-in-out';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 2000);
}

// Navbar Scroll Effect and Active Link
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile menu when clicking a link
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    });
});
