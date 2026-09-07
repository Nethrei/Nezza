// Kontrol halaman awal
const enterBtn = document.getElementById('enter-btn');
const landingPage = document.getElementById('landing-page');
const contentArea = document.getElementById('content-area');
const hamburgerBtn = document.getElementById('hamburger-btn');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const bgMusic = document.getElementById('bg-music');

enterBtn.addEventListener('click', () => {
    bgMusic.play().catch(error => console.log('Audio tidak dapat diputar:', error));
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'scale(1.2)';

    setTimeout(() => {
        landingPage.style.display = 'none';
        hamburgerBtn.style.display = 'flex';
        musicToggleBtn.style.display = 'flex';
        contentArea.classList.add('active');
        showView('home-view');
    }, 600);
});

// Sidebar
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebar = document.getElementById('close-sidebar');

function openMenu() {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('open');
}

function closeMenu() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

hamburgerBtn.addEventListener('click', openMenu);
closeSidebar.addEventListener('click', closeMenu);
sidebarOverlay.addEventListener('click', closeMenu);

// Navigasi halaman
const allViews = document.querySelectorAll('.view-page');
const navItems = document.querySelectorAll('.nav-item');

function showView(targetId) {
    allViews.forEach(view => view.classList.remove('active'));
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        showView(item.dataset.target);
        closeMenu();
    });
});

// Scrapbook
const pages = document.querySelectorAll('.page');
pages.forEach((page, index) => {
    page.style.zIndex = pages.length - index;
    page.addEventListener('click', () => {
        const flipped = page.classList.toggle('flipped');
        if (flipped) {
            setTimeout(() => page.style.zIndex = '1', 400);
        } else {
            setTimeout(() => page.style.zIndex = String(pages.length - index), 400);
        }
    });
});

// Musik
let isMuted = false;
musicToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    musicToggleBtn.textContent = isMuted ? '🔇' : '🎵';
    musicToggleBtn.classList.toggle('muted', isMuted);
});
