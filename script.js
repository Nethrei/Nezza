// ELEMEN DASAR
const enterBtn = document.getElementById('enter-btn');
const landingPage = document.getElementById('landing-page');
const appUI = document.getElementById('app-ui');

// ELEMEN SIDEBAR
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebarBtn = document.getElementById('close-sidebar');

// ELEMEN PERPINDAHAN HALAMAN
const navItems = document.querySelectorAll('.nav-item');
const viewPages = document.querySelectorAll('.view-page');

// 1. Logika Masuk Web (Menghilangkan Halaman Awal)
enterBtn.addEventListener('click', () => {
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
        landingPage.classList.add('hidden');
        appUI.classList.remove('hidden');
    }, 700); 
});

// 2. Logika Sidebar Menu
hamburgerBtn.addEventListener('click', () => {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('open');
});

function closeMenu() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

closeSidebarBtn.addEventListener('click', closeMenu);
sidebarOverlay.addEventListener('click', closeMenu);

// 3. Logika Ganti Halaman (Tanpa Loading)
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Mencegah web scroll ke atas tiba-tiba
        
        // Ambil nama halaman tujuan (contoh: 'home-view' atau 'album-view')
        const targetId = this.getAttribute('data-target');
        
        // Sembunyikan semua halaman
        viewPages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Tampilkan halaman yang dipilih
        const targetPage = document.getElementById(targetId);
        targetPage.classList.add('active');
        
        // Tutup menu otomatis setelah memilih halaman
        closeMenu();
    });
});

// 4. Logika Buku Kenangan (Flipbook)
const pages = document.querySelectorAll('.page');

pages.forEach((page, index) => {
    // Atur lapisan buku
    page.style.zIndex = pages.length - index;
    
    page.addEventListener('click', function() {
        let isFlipped = this.classList.contains('flipped');
        
        if (isFlipped) {
            // Tutup halaman
            this.classList.remove('flipped');
            setTimeout(() => {
                this.style.zIndex = pages.length - index;
            }, 400);
        } else {
            // Buka halaman
            this.classList.add('flipped');
            setTimeout(() => {
                this.style.zIndex = 1;
            }, 400);
        }
    });
});
