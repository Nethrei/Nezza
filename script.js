// 1. Logika Masuk Web & Mainkan Musik Latar
document.getElementById('enter-btn').addEventListener('click', function() {
    // Jalankan musik (browser hanya mengizinkan play audio jika ada interaksi klik dari user)
    const bgMusic = document.getElementById('bg-music');
    bgMusic.play().catch(error => console.log("Audio play digagalkan oleh browser:", error));

    // Animasi menghilangkan halaman depan
    const landingPage = document.getElementById('landing-page');
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'scale(1.2)';
    
    // Tunggu animasi selesai lalu ganti tampilan
    setTimeout(() => {
        landingPage.style.display = 'none'; 
        
        // Tampilkan area konten, tombol menu, & tombol musik
        document.getElementById('hamburger-btn').style.display = 'flex';
        document.getElementById('music-toggle-btn').style.display = 'flex';
        document.getElementById('content-area').style.display = 'flex';
        
        // Tampilkan halaman utama saja
        document.getElementById('home-view').style.display = 'flex';
        document.getElementById('album-view').style.display = 'none';
        document.getElementById('kosong1-view').style.display = 'none';
        document.getElementById('kosong2-view').style.display = 'none';
    }, 600); 
});

// 2. Logika Sidebar Menu
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function openMenu() {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('open');
}

function closeMenu() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

document.getElementById('hamburger-btn').addEventListener('click', openMenu);
document.getElementById('close-sidebar').addEventListener('click', closeMenu);
sidebarOverlay.addEventListener('click', closeMenu);

// 3. Logika Pindah Halaman lewat Menu
const navItems = document.querySelectorAll('.nav-item');
const allViews = document.querySelectorAll('.view-page');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        const targetId = this.getAttribute('data-target');
        
        // Sembunyikan SEMUA halaman
        allViews.forEach(view => {
            view.style.display = 'none';
        });
        
        // Tampilkan hanya halaman yang diklik
        document.getElementById(targetId).style.display = 'flex';
        
        // Otomatis tutup menu
        closeMenu();
        
        // Scroll kembali ke atas saat ganti halaman
        window.scrollTo(0, 0);
    });
});

// 4. Logika Buku Kenangan (Scrapbook)
const pages = document.querySelectorAll('.page');

pages.forEach((page, index) => {
    // Atur lapisan supaya buku rapi
    page.style.zIndex = pages.length - index;
    
    page.addEventListener('click', function() {
        let isFlipped = this.classList.contains('flipped');
        
        if (isFlipped) {
            // Membalik ke Kanan (Tutup)
            this.classList.remove('flipped');
            setTimeout(() => {
                this.style.zIndex = pages.length - index;
            }, 400);
        } else {
            // Membalik ke Kiri (Buka)
            this.classList.add('flipped');
            setTimeout(() => {
                this.style.zIndex = 1;
            }, 400);
        }
    });
});

// 5. Logika Tombol Mute/Unmute Musik di Pojok Kanan Atas
const musicToggleBtn = document.getElementById('music-toggle-btn');
const bgMusic = document.getElementById('bg-music');
let isMuted = false;

musicToggleBtn.addEventListener('click', function() {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    
    if (isMuted) {
        musicToggleBtn.textContent = '🔇';
        musicToggleBtn.classList.add('muted');
    } else {
        musicToggleBtn.textContent = '🎵';
        musicToggleBtn.classList.remove('muted');
    }
});
