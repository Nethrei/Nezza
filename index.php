<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#07152f">
<title>Nezuro • Blue Memories</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<canvas id="bg-canvas"></canvas>
<div id="cursor-glow"></div>
<div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>

<audio id="bg-music" src="Backstreet Boys - Shape of My Heart (Lyrics) - FirePlay (128k).mp3" loop></audio>

<div id="landing-page">
  <div class="landing-orbit"></div>
  <div class="sonic-stage landing-sonic"><canvas id="sonic-canvas" width="360" height="360"></canvas></div>
  <div class="landing-content">
    <span class="eyebrow">A LITTLE BLUE UNIVERSE</span>
    <h1>For Someone<br><span>Special.</span></h1>
    <p>Masuk ke dunia kecil yang dibuat Nezuro ✦</p>
    <button id="enter-btn"><span>Open the memory</span><b>→</b></button>
  </div>
</div>

<header class="topbar">
  <button id="menu-btn" class="glass-btn" aria-label="Buka menu"><i></i><i></i><i></i></button>
  <div class="brand"><span class="brand-dot"></span> NEZURO</div>
  <button id="music-toggle-btn" class="glass-btn" aria-label="Musik">♫</button>
</header>

<div id="sidebar-overlay"></div>
<aside id="sidebar-menu">
  <div class="sidebar-top"><strong>NEZURO</strong><button id="close-sidebar">×</button></div>
  <p class="side-label">EXPLORE</p>
  <nav>
    <button class="nav-item active" data-target="home-view">⌂ <span>Home</span></button>
    <button class="nav-item" data-target="album-view">▣ <span>Album</span></button>
    <button class="nav-item" data-target="about-view">✦ <span>Our Story</span></button>
  </nav>
  <div class="side-card"><small>BLUE NOTE</small><p>“Setiap momen kecil punya tempatnya sendiri.”</p></div>
</aside>

<main id="content-area">
  <section id="home-view" class="view-page active">
    <div class="hero-grid">
      <div class="hero-copy reveal">
        <span class="eyebrow">WELCOME TO OUR SPACE</span>
        <h2>Kenangan yang<br><em>nggak biasa.</em></h2>
        <p>Satu halaman untuk menyimpan foto, cerita, dan momen yang ingin tetap diingat.</p>
        <button class="primary-btn" data-go="album-view">Lihat album <span>↗</span></button>
      </div>
      <div class="hero-visual reveal">
        <div class="photo-glow"></div>
        <div class="photo-card tilt-card"><img src="IMG_20260731_204858.jpg" alt="Foto utama Nezuro"><span class="photo-tag">MEMORY 01</span></div>
        <div class="sonic-float"><canvas id="sonic-small" width="220" height="220"></canvas></div>
        <div class="hero-orbit orbit-a"></div><div class="hero-orbit orbit-b"></div>
      </div>
    </div>
    <div class="stats-row reveal">
      <div><strong>01</strong><span>PHOTO<br>ARCHIVE</span></div>
      <div><strong>∞</strong><span>GOOD<br>MEMORIES</span></div>
      <div><strong>✦</strong><span>MADE BY<br>NEZURO</span></div>
    </div>
    <div class="quote-card reveal"><span>✦</span><p>“Bukan tentang seberapa banyak foto yang tersimpan, tapi tentang cerita di balik setiap foto.”</p></div>
  </section>

  <section id="album-view" class="view-page">
    <div class="section-head reveal"><span class="eyebrow">MEMORY ARCHIVE</span><h2>Album <em>Foto.</em></h2><p>Geser card atau tekan tombol untuk melihat koleksi.</p></div>
    <div class="slider-wrap reveal">
      <button class="slider-arrow prev" aria-label="Sebelumnya">←</button>
      <div class="card-slider" id="card-slider">
        <article class="memory-card"><div class="card-image"><img src="IMG_20260731_204858.jpg" alt="Memory 01"><span>01 / MEMORY</span></div><div class="card-body"><small>THE FIRST FRAME</small><h3>Awal yang indah.</h3><p>Satu foto, satu cerita, satu alasan untuk tersenyum.</p></div></article>
        <article class="memory-card"><div class="card-image"><img src="IMG_20260731_204858.jpg" alt="Memory 02"><span>02 / MEMORY</span></div><div class="card-body"><small>BLUE MOMENT</small><h3>Sesederhana itu.</h3><p>Momen biasa yang berubah jadi kenangan luar biasa.</p></div></article>
        <article class="memory-card"><div class="card-image"><img src="IMG_20260731_204858.jpg" alt="Memory 03"><span>03 / MEMORY</span></div><div class="card-body"><small>STAY HERE</small><h3>Keep this moment.</h3><p>Karena beberapa momen memang pantas disimpan lebih lama.</p></div></article>
        <article class="memory-card"><div class="card-image"><img src="IMG_20260731_204858.jpg" alt="Memory 04"><span>04 / MEMORY</span></div><div class="card-body"><small>FOREVER BLUE</small><h3>One more chapter.</h3><p>Album ini masih punya ruang untuk cerita berikutnya.</p></div></article>
      </div>
      <button class="slider-arrow next" aria-label="Berikutnya">→</button>
    </div>
    <div class="slider-meta"><span id="slider-counter">01 / 04</span><div class="progress"><i id="slider-progress"></i></div><span>SWIPE →</span></div>
  </section>

  <section id="about-view" class="view-page">
    <div class="story-card reveal"><span class="eyebrow">OUR STORY</span><h2>Made with<br><em>blue feelings.</em></h2><p>Web ini dibuat sebagai ruang kecil yang hidup: background bergerak mengikuti cursor, bintang-bintang melayang, Sonic berlari, dan navigasi bawah mengikuti halaman yang sedang dibuka.</p><button class="primary-btn" data-go="home-view">Kembali home <span>↗</span></button></div>
    <div class="sonic-panel reveal"><canvas id="sonic-about" width="360" height="260"></canvas><div><small>RUN WITH THE MEMORIES</small><h3>Keep moving.</h3><p>Tap layar, gerakkan cursor, lalu lihat dunianya bereaksi.</p></div></div>
  </section>
</main>

<nav id="liquid-nav" aria-label="Navigasi utama">
  <div class="liquid-pill"></div>
  <button class="liquid-item active" data-target="home-view"><span>⌂</span><b>Home</b></button>
  <button class="liquid-item" data-target="album-view"><span>▣</span><b>Album</b></button>
  <button class="liquid-item" data-target="about-view"><span>✦</span><b>Story</b></button>
</nav>
<div id="toast">Memory mode on ✦</div>
<footer class="site-footer">NEZURO <span>•</span> BLUE MEMORIES</footer>
<script src="script.js"></script>
</body>
</html>