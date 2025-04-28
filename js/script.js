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
