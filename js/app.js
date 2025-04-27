/** @format */

var nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carousel'),
    list = document.querySelector('.list'),
    item = document.querySelectorAll('.item'),
    runningTime = document.querySelector('.carousel .timeRunning');

let timeRunning = 2000;
let timeAutoNext = 5000;
let isAnimating = false;

let runTimeOut;

let runNextAuto = setTimeout(() => {
    nextBtn.click();
}, timeAutoNext);

function resetTimeAnimation() {
    runningTime.style.animation = 'none';
    runningTime.offsetHeight; /* trigger reflow */
    runningTime.style.animation = null;
    runningTime.style.animation = `runningTime ${timeAutoNext}ms linear 1 forwards`;
}

function showSlider(type) {
    if (isAnimating) return;
    isAnimating = true;

    let sliderItemsDom = list.querySelectorAll('.carousel .list .item');
    if (type === 'next') {
        list.appendChild(sliderItemsDom[0]);
        carousel.classList.add('next');
    } else {
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        carousel.classList.add('prev');
    }

    clearTimeout(runTimeOut);

    runTimeOut = setTimeout(() => {
        carousel.classList.remove('next');
        carousel.classList.remove('prev');
        isAnimating = false;
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        nextBtn.click();
    }, timeAutoNext);

    resetTimeAnimation();
}

nextBtn.addEventListener('click', () => showSlider('next'));
prevBtn.addEventListener('click', () => showSlider('prev'));

resetTimeAnimation();
runNextAuto = setTimeout(() => {
    nextBtn.click();
}, timeAutoNext);

// Language Switcher
const languageSwitcher = {
    init() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach((btn) => {
            btn.addEventListener('click', () => this.switchLanguage(btn));
        });
    },

    switchLanguage(btn) {
        const lang = btn.dataset.lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update active button
        document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content based on language
        this.updateContent(lang);
    },

    updateContent(lang) {
        // Add your translations here
        const translations = {
            en: {
                home: 'Home',
                menu: 'Menu',
                services: 'Services',
                about: 'About',
                contact: 'Contact',
                // Add more translations as needed
            },
            ar: {
                home: 'الرئيسية',
                menu: 'القائمة',
                services: 'الخدمات',
                about: 'من نحن',
                contact: 'اتصل بنا',
                // Add more translations as needed
            },
        };

        // Update navigation links
        document.querySelectorAll('.nav-link').forEach((link) => {
            const key = link.getAttribute('data-translate');
            if (key && translations[lang][key]) {
                link.textContent = translations[lang][key];
            }
        });
    },
};

// Carousel
const carousel = {
    currentSlide: 0,
    slides: null,
    indicators: null,
    interval: null,

    init() {
        this.slides = document.querySelectorAll('.carousel .item');
        this.indicators = document.querySelectorAll('.carousel-indicators .indicator');

        // Set up event listeners
        document.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.next').addEventListener('click', () => this.nextSlide());

        // Set up indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Start auto-slide
        this.startAutoSlide();
    },

    showSlide(index) {
        // Remove active class from all slides and indicators
        this.slides.forEach((slide) => slide.classList.remove('active'));
        this.indicators.forEach((indicator) => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');

        // Update current slide index
        this.currentSlide = index;
    },

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    },

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    },

    goToSlide(index) {
        this.showSlide(index);
    },

    startAutoSlide() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    },

    stopAutoSlide() {
        clearInterval(this.interval);
    },
};

// Header Scroll Effect
const header = {
    init() {
        const mainHeader = document.querySelector('.main-header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll && currentScroll > 100) {
                mainHeader.style.transform = 'translateY(-100%)';
            } else {
                mainHeader.style.transform = 'translateY(0)';
            }

            if (currentScroll > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    },
};

// Mobile Menu
const mobileMenu = {
    init() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.list-nav');

        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    },
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Language switcher is initialized in language.js
    carousel.init();
    header.init();
    mobileMenu.init();
});
