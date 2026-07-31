const enterBtn = document.getElementById('enter-btn');
const landingPage = document.getElementById('landing-page');
const mainPage = document.getElementById('main-page');

// Animasi tombol saat diklik & perpindahan halaman
enterBtn.addEventListener('click', () => {
    // Efek zoom out & pudar pada landing page
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
        landingPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    }, 700); 
});

// Logika Scrapbook (Buku Halaman yang Bisa Dibalik)
const pages = document.querySelectorAll('.page');

pages.forEach((page, index) => {
    // Mengatur urutan tumpukan halaman dari depan ke belakang
    page.style.zIndex = pages.length - index;
    
    page.addEventListener('click', function() {
        let isFlipped = this.classList.contains('flipped');
        
        if (isFlipped) {
            // Tutup halaman kembali ke kanan
            this.classList.remove('flipped');
            setTimeout(() => {
                this.style.zIndex = pages.length - index;
            }, 400);
        } else {
            // Buka halaman ke kiri
            this.classList.add('flipped');
            setTimeout(() => {
                this.style.zIndex = 1;
            }, 400);
        }
    });
});

