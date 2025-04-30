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
    }, 500);
}

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
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
        }
    });
});
