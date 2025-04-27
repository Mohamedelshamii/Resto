/** @format */

// Language Switcher
function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // Update all translatable elements
    updateContent(lang);

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Theme Toggle
document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.querySelector('.theme-toggle');

    function setThemeIcon(isDark) {
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = isDark
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        }
    }

    function applyThemeFromStorage() {
        let isDark = false;
        if (typeof localStorage !== 'undefined') {
            isDark = localStorage.getItem('darkTheme') === 'true';
        }

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        setThemeIcon(isDark);
    }

    function toggleTheme() {
        const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isCurrentlyDark) {
            document.documentElement.removeAttribute('data-theme');
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('darkTheme', 'false');
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('darkTheme', 'true');
            }
        }
        setThemeIcon(!isCurrentlyDark);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    applyThemeFromStorage();
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const initialLanguage = savedLanguage || (browserLang === 'ar' ? 'ar' : 'en');
    switchLanguage(initialLanguage);

    // Add click handlers to language buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });

    // تفعيل الوضع حسب التخزين
    applyThemeFromStorage();
    // تفعيل زر التبديل
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }

    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.list-nav');

    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Smooth scroll for nav links
    const navLinks = document.querySelectorAll('.nav-link, .quick-order-btn');
    navLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

// Update content based on language
function updateContent(lang) {
    // Update all elements with data-translate
    document.querySelectorAll('[data-translate]').forEach((el) => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.lang = 'en';
    document.body.classList.remove('rtl');

    // Update menu items
    const menuItems = document.querySelectorAll('.card-style');
    menuItems.forEach((item) => {
        const title = item.querySelector('.card-title');
        const desc = item.querySelector('.card-body');
        const type = item.querySelector('.card-meal-type');

        if (title && desc) {
            const titleKey = title.textContent.toLowerCase().replace(/\s+/g, '');
            const descKey = `${titleKey}Desc`;

            if (translations[lang][titleKey]) {
                title.textContent = translations[lang][titleKey];
            }
            if (translations[lang][descKey]) {
                desc.textContent = translations[lang][descKey];
            }
        }

        if (type) {
            const typeKey = type.textContent.toLowerCase().replace(/\s+/g, '');
            if (translations[lang][typeKey]) {
                type.textContent = translations[lang][typeKey];
            }
        }
    });

    // Update about section
    const aboutTitle = document.querySelector('.section-title');
    const aboutDesc1 = document.querySelector('.about p:nth-child(1)');
    const aboutDesc2 = document.querySelector('.about p:nth-child(2)');

    if (aboutTitle) aboutTitle.textContent = translations[lang].aboutUs;
    if (aboutDesc1) aboutDesc1.textContent = translations[lang].aboutDesc1;
    if (aboutDesc2) aboutDesc2.textContent = translations[lang].aboutDesc2;

    // Update text alignment for RTL
    if (lang === 'ar') {
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach((element) => {
            element.style.textAlign = 'right';
        });
    } else {
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach((element) => {
            element.style.textAlign = 'left';
        });
    }

    // المنتجات
    const productCards = document.querySelectorAll('.product-card');
    const productKeys = [
        'classicBurger',
        'margheritaPizza',
        'caesarSalad',
        'specialPasta',
        'grilledSalmon',
        'chocolateLavaCake',
    ];
    productCards.forEach((card, i) => {
        const title = card.querySelector('h3');
        const desc = card.querySelector('p');
        if (
            title &&
            desc &&
            translations[lang][productKeys[i]] &&
            translations[lang][productKeys[i] + 'Desc']
        ) {
            title.textContent = translations[lang][productKeys[i]];
            desc.textContent = translations[lang][productKeys[i] + 'Desc'];
        }
    });
    // خدماتنا
    document.querySelectorAll('.service-title').forEach((el, i) => {
        const keys = ['dineIn', 'delivery', 'catering'];
        if (translations[lang][keys[i]]) el.textContent = translations[lang][keys[i]];
    });
    document.querySelectorAll('.service-description').forEach((el, i) => {
        const keys = ['dineInDesc', 'deliveryDesc', 'cateringDesc'];
        if (translations[lang][keys[i]]) el.textContent = translations[lang][keys[i]];
    });
    // فريقنا
    document.querySelectorAll('.section-title[data-translate="ourTeam"]').forEach((el) => {
        el.textContent = translations[lang].ourTeam;
    });
    document.querySelectorAll('.section-subtitle[data-translate="teamSubtitle"]').forEach((el) => {
        el.textContent = translations[lang].teamSubtitle;
    });
    const teamPositions = ['executiveChef', 'sousChef', 'pastryChef'];
    document.querySelectorAll('.team-position').forEach((el, i) => {
        if (translations[lang][teamPositions[i]])
            el.textContent = translations[lang][teamPositions[i]];
    });
    // وصف الفوتر
    const aboutFooter = document.querySelector('.section-2 p');
    if (aboutFooter) aboutFooter.textContent = translations[lang].aboutFooter;
    // ضبط صور about في العربية
    if (lang === 'ar') {
        document.querySelectorAll('.about .bord.col-6.text-start').forEach((el) => {
            el.classList.remove('text-start');
            el.classList.add('text-end');
        });
        document.querySelectorAll('.about .bord.col-6.text-end').forEach((el) => {
            el.classList.remove('text-end');
            el.classList.add('text-start');
        });
    } else {
        document.querySelectorAll('.about .bord.col-6').forEach((el, idx) => {
            if (idx % 2 === 0) {
                el.classList.add('text-start');
                el.classList.remove('text-end');
            } else {
                el.classList.add('text-end');
                el.classList.remove('text-start');
            }
        });
    }
}

// Carousel
const carousel = document.querySelector('.carousel');
const items = carousel.querySelectorAll('.item');
const dots = carousel.querySelectorAll('.carousel-dot');
let currentIndex = 0;
let autoplayInterval;

function showSlide(index) {
    items.forEach((item) => item.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    items[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
}

function nextSlide() {
    const next = (currentIndex + 1) % items.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentIndex - 1 + items.length) % items.length;
    showSlide(prev);
}

// Add click events to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Start autoplay
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// Pause autoplay on hover
carousel.addEventListener('mouseenter', stopAutoplay);
carousel.addEventListener('mouseleave', startAutoplay);

// Initialize carousel
showSlide(0);
startAutoplay();

// Header scroll effect
const header = document.querySelector('.main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scrolled');
        return;
    }

    if (currentScroll > lastScroll) {
        // Scrolling down
        header.classList.add('scrolled');
    } else {
        // Scrolling up
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});
