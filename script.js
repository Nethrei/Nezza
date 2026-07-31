// ELEMEN HALAMAN
const enterBtn = document.getElementById('enter-btn');
const landingPage = document.getElementById('landing-page');
const mainPage = document.getElementById('main-page');
const hamburgerBtn = document.getElementById('hamburger-btn');

// ELEMEN SIDEBAR MENU
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebar = document.getElementById('close-sidebar');
const navItems = document.querySelectorAll('.nav-item');

// 1. Logika Tombol Masuk Awal
enterBtn.addEventListener('click', () => {
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
        landingPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        // Munculkan tombol menu setelah masuk halaman utama
        hamburgerBtn.classList.add('show-ui');
    }, 700); 
});

// 2. Logika Sidebar Menu
// Buka Menu
hamburgerBtn.addEventListener('click', () => {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('open');
});

// Tutup Menu dengan Tombol X
closeSidebar.addEventListener('click', closeMenu);

// Tutup Menu saat klik area luar gelap (Overlay)
sidebarOverlay.addEventListener('click', closeMenu);

// Tutup Menu saat salah satu link diklik (Biar user experience-nya bagus di HP)
navItems.forEach(item => {
    item.addEventListener('click', closeMenu);
});

function closeMenu() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

// 3. Logika Scrapbook (Buku Halaman yang Bisa Dibalik)
const pages = document.querySelectorAll('.page');

pages.forEach((page, index) => {
    page.style.zIndex = pages.length - index;
    
    page.addEventListener('click', function() {
        let isFlipped = this.classList.contains('flipped');
        
        if (isFlipped) {
            this.classList.remove('flipped');
            setTimeout(() => {
                this.style.zIndex = pages.length - index;
            }, 400);
        } else {
            this.classList.add('flipped');
            setTimeout(() => {
                this.style.zIndex = 1;
            }, 400);
        }
    });
});
                       
