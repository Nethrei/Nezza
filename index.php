<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spesial Untukmu 💙</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <audio id="bg-music" src="Backstreet Boys - Shape of My Heart (Lyrics) - FirePlay (128k).mp3" loop></audio>

    <div id="landing-page">
        <div class="landing-content">
            <h1>Hai Kesayangan... ✨</h1>
            <p>Ada sesuatu yang spesial nih buat kamu</p>
            <button id="enter-btn">Klik untuk Masuk</button>
        </div>
    </div>

    <button id="hamburger-btn" style="display:none" aria-label="Buka menu">
        <span></span><span></span><span></span>
    </button>

    <button id="music-toggle-btn" style="display:none" aria-label="Kontrol musik">🎵</button>

    <div id="sidebar-overlay"></div>
    <aside id="sidebar-menu">
        <div class="sidebar-header">
            <h3>Menu Kita</h3>
            <button id="close-sidebar" aria-label="Tutup menu">&times;</button>
        </div>
        <ul class="sidebar-links">
            <li><a href="#" class="nav-item" data-target="home-view">🏠 Halaman Utama</a></li>
            <li><a href="#" class="nav-item" data-target="album-view">📸 Album Foto</a></li>
            <li><a href="#" class="nav-item" data-target="kosong1-view">✨ Kosong</a></li>
            <li><a href="#" class="nav-item" data-target="kosong2-view">✨ Kosong</a></li>
        </ul>
        <div class="sidebar-footer">
            <p>Dibuat dengan 💙 oleh <strong>Nezuro</strong></p>
        </div>
    </aside>

    <main id="content-area" style="display:none">
        <section id="home-view" class="view-page">
            <header class="hero-section">
                <div class="main-photo-frame">
                    <img src="IMG_20260731_204858.jpg" alt="Foto Utama">
                </div>
                <div class="hero-text">
                    <h2>Teruntuk Kamu, Rumah Pulangku 💙</h2>
                    <p>Terima kasih ya udah jadi alasan aku tersenyum setiap hari. Web ini sengaja aku buat khusus untuk ngerangkum momen-momen indah kita.</p>
                    <div class="badge-love">Forever with you</div>
                </div>
            </header>

            <div class="section-title">
                <h2>Buku Kenangan Kita 📖</h2>
                <p>Sentuh halamannya untuk membuka ceritanya</p>
            </div>

            <section class="scrapbook-section">
                <div class="book-wrapper">
                    <div class="book">
                        <div class="page" id="page3">
                            <div class="front paper">
                                <img src="https://via.placeholder.com/200x200/0074D9/ffffff?text=Foto+3" alt="Foto 3">
                                <p class="caption">Momen seru bareng kamu!</p>
                            </div>
                            <div class="back paper end-page">
                                <h3>The End</h3>
                                <p>I Love You Forever! 🤍</p>
                            </div>
                        </div>

                        <div class="page" id="page2">
                            <div class="front paper">
                                <img src="https://via.placeholder.com/200x200/004b93/ffffff?text=Foto+2" alt="Foto 2">
                                <p class="caption">Jalan-jalan berdua ☕</p>
                            </div>
                            <div class="back paper">
                                <h4 class="page-title">Catatan Kecil</h4>
                                <p class="page-desc">Ngobrol sama kamu selalu jadi obat paling ampuh buat aku.</p>
                            </div>
                        </div>

                        <div class="page" id="page1">
                            <div class="front cover">
                                <div class="cover-icon">📖</div>
                                <h3>Album Kita</h3>
                                <p class="click-hint">Sentuh untuk buka</p>
                            </div>
                            <div class="back paper">
                                <img src="https://via.placeholder.com/200x200/001f3f/ffffff?text=Foto+1" alt="Foto 1">
                                <p class="caption">Awal mula kita ✨</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>

        <section id="album-view" class="view-page" style="display:none">
            <div class="section-title">
                <h2>Album Foto Kita 📸</h2>
                <p>Kumpulan kenangan manis berdua</p>
            </div>
            <div class="photo-grid">
                <img src="https://via.placeholder.com/200/0074D9/ffffff?text=Foto+A" alt="Grid 1">
                <img src="https://via.placeholder.com/200/004b93/ffffff?text=Foto+B" alt="Grid 2">
                <img src="https://via.placeholder.com/200/001f3f/ffffff?text=Foto+C" alt="Grid 3">
                <img src="https://via.placeholder.com/200/0074D9/ffffff?text=Foto+D" alt="Grid 4">
            </div>
        </section>

        <section id="kosong1-view" class="view-page" style="display:none">
            <div class="section-title">
                <h2>Halaman Kosong 1</h2>
                <p>Nanti bisa diisi sesuatu di sini...</p>
            </div>
        </section>

        <section id="kosong2-view" class="view-page" style="display:none">
            <div class="section-title">
                <h2>Halaman Kosong 2</h2>
                <p>Nanti bisa diisi sesuatu di sini...</p>
            </div>
        </section>

        <footer class="site-footer">
            <p>Created by <strong>Nezuro</strong> ✨</p>
        </footer>
    </main>

    <script src="script.js"></script>
</body>
</html>
