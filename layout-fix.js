/*
 * NEZZA — Responsive layout lock + album media + hero photo
 */
(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'nezza-layout-fix';
  style.textContent = `
    .hero-grid {
      width: 100%;
      max-width: 1120px;
      margin-inline: auto;
    }

    /* STANDING PHOTO DIRECTLY BESIDE "SMALL MOMENTS" */
    .hero-grid.nezza-hero-with-photo {
      grid-template-columns:1fr!important;
      gap:0!important;
      align-items:center!important;
    }
    .hero-title-row {
      position:relative;
      width:fit-content;
      max-width:100%;
      margin:0 auto;
    }
    .hero-title-row h2 {
      position:relative;
      z-index:1;
      margin:0!important;
      padding-right:clamp(150px,16vw,235px)!important;
    }
    .nezza-hero-photo {
      position:absolute;
      z-index:3;
      right:-8px;
      top:-52px;
      width:clamp(125px,16vw,230px);
      height:clamp(180px,31vw,390px);
      display:flex;
      align-items:flex-end;
      justify-content:center;
      pointer-events:none;
      overflow:visible;
    }
    .nezza-hero-photo img {
      display:block;
      width:auto;
      height:100%;
      max-width:140%;
      object-fit:contain;
      object-position:center bottom;
      filter:drop-shadow(0 22px 28px rgba(0,0,0,.34));
      user-select:none;
    }

    @media (max-width: 760px) {
      html, body { width:100%; min-width:0; max-width:100%; overflow-x:hidden!important; }
      .app-shell { box-sizing:border-box; width:100%; max-width:100vw; padding:54px 10px calc(var(--nav-height,72px) + 20px); }
      .view-page,.hero-grid,.hero-copy,.hero-visual { min-width:0; max-width:100%; }
      .view-page { width:100%; }
      .hero-grid { box-sizing:border-box; width:100%; min-height:calc(100dvh - 126px); height:auto; grid-template-columns:1fr; gap:6px; align-items:center; }
      .hero-copy { width:100%; overflow-wrap:break-word; }
      .hero-copy h2,.page-heading h2 { max-width:100%; font-size:clamp(27px,8.6vw,42px); line-height:.98; letter-spacing:-.055em; margin-bottom:12px; }
      .hero-copy>p { max-width:95%; margin-bottom:14px; font-size:9px; line-height:1.55; }
      .hero-actions { gap:7px; flex-wrap:wrap; }
      .hero-actions .primary-btn { min-height:36px; padding:8px 12px; font-size:9px; }
      .scroll-note { font-size:7px; }
      .hero-visual { box-sizing:border-box; width:100%; min-height:270px; height:min(52vw,360px); max-height:360px; overflow:visible; }
      #dora-stage { width:100%!important; height:100%!important; min-height:0!important; max-width:100%; }
      .main-photo-card { width:min(230px,92%); max-width:100%; }
      .topbar { max-width:100vw; padding-inline:10px; }
      .brand strong { font-size:9px; }
      .brand small { display:none; }
      #space-canvas { opacity:.25!important; }

      .hero-grid.nezza-hero-with-photo {
        grid-template-columns:1fr!important;
        min-height:calc(100dvh - 116px)!important;
      }
      .hero-title-row { width:100%; max-width:100%; }
      .hero-title-row h2 { padding-right:clamp(82px,22vw,125px)!important; }
      .nezza-hero-photo { width:clamp(82px,22vw,125px); height:clamp(125px,38vw,205px); right:-2px; top:-22px; }
      .nezza-hero-photo img { max-width:145%; }
    }

    @media (max-width:480px) {
      .app-shell { padding-inline:8px; padding-top:48px; }
      .hero-grid { grid-template-columns:1fr; gap:3px; min-height:calc(100dvh - 116px); }
      .hero-copy h2,.page-heading h2 { font-size:clamp(25px,8.35vw,36px); }
      .hero-copy>p { font-size:8px; line-height:1.5; }
      .hero-visual { min-height:245px; height:50vw; max-height:315px; }
      .main-photo-card { width:94%; border-radius:18px; }
      .hero-title-row h2 { padding-right:clamp(76px,23vw,108px)!important; }
      .nezza-hero-photo { width:clamp(76px,23vw,108px); height:clamp(118px,39vw,180px); top:-17px; right:0; }
      .liquid-nav { left:10px!important; right:auto!important; bottom:max(9px,env(safe-area-inset-bottom))!important; width:56px!important; height:56px!important; }
      .liquid-nav.open { left:10px!important; right:auto!important; width:calc(100vw - 20px)!important; }
      .nav-toggle { flex-basis:46px!important; width:46px!important; height:46px!important; }
      .nav-item { height:46px!important; border-radius:14px!important; font-size:17px!important; }
      .nav-item small { font-size:7px!important; }
    }

    @media(max-width:360px) {
      .hero-grid { grid-template-columns:1fr; }
      .hero-copy h2,.page-heading h2 { font-size:27px; }
      .hero-copy>p { font-size:7.5px; }
      .hero-visual { min-height:220px; }
      .hero-title-row h2 { padding-right:82px!important; }
      .nezza-hero-photo { width:82px; height:130px; top:-12px; }
      .liquid-nav{left:7px!important;right:auto!important;width:56px!important;height:56px!important}
      .liquid-nav.open{left:7px!important;right:auto!important;width:calc(100vw - 14px)!important}
      .nav-item{font-size:16px!important}.nav-item small{font-size:6.5px!important}
      #album-view #card-slider.card-slider{height:440px!important}
      #album-view #card-slider .memory-card{width:min(285px,76vw)!important;height:385px!important}
      #album-view #card-slider .memory-card img{height:255px!important}
    }

    /* FOTOBAR — foto bersama di atas album, dibuat seperti tumpukan kertas */
    #album-view .album-fotobar {
      position:relative;
      width:min(700px,94vw);
      height:250px;
      margin:0 auto 34px;
      isolation:isolate;
    }
    #album-view .album-fotobar-title {
      position:absolute;
      left:0;
      top:-30px;
      color:#72d8ff;
      font-size:9px;
      font-weight:800;
      letter-spacing:.22em;
    }
    #album-view .fotobar-photo {
      position:absolute;
      left:50%;
      top:18px;
      width:190px;
      height:220px;
      padding:7px 7px 28px;
      border:1px solid rgba(10,25,50,.14);
      background:#f7f9fc;
      box-shadow:0 18px 38px rgba(0,0,0,.28);
      transform-origin:50% 85%;
      transition:transform .4s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease;
    }
    #album-view .fotobar-photo img { width:100%; height:100%; object-fit:cover; display:block; }
    #album-view .fotobar-photo:nth-child(2) { transform:translateX(-50%) rotate(-10deg) translate(-105px,10px); z-index:1; }
    #album-view .fotobar-photo:nth-child(3) { transform:translateX(-50%) rotate(7deg) translate(104px,12px); z-index:2; }
    #album-view .fotobar-photo:nth-child(4) { transform:translateX(-50%) rotate(-4deg) translate(-38px,2px); z-index:4; }
    #album-view .fotobar-photo:nth-child(5) { transform:translateX(-50%) rotate(5deg) translate(42px,5px); z-index:3; }
    #album-view .fotobar-photo:hover { z-index:10!important; transform:translateX(-50%) translateY(-8px) rotate(0deg) scale(1.04)!important; box-shadow:0 28px 55px rgba(0,0,0,.38); }
    #album-view .album-fotobar + .slider-wrap { margin-top:8px; }
    #album-view .page-heading p { font-size:0; }
    #album-view .page-heading p::after { content:'Foto bersama dan kenangan yang tersimpan seperti lembaran kecil.'; font-size:13px; }

    @media(max-width:760px) {
      #album-view .album-fotobar { width:94vw; height:205px; margin-bottom:26px; }
      #album-view .album-fotobar-title { top:-24px; font-size:8px; }
      #album-view .fotobar-photo { width:140px; height:170px; padding:5px 5px 22px; top:15px; }
      #album-view .fotobar-photo:nth-child(2) { transform:translateX(-50%) rotate(-10deg) translate(-76px,7px); }
      #album-view .fotobar-photo:nth-child(3) { transform:translateX(-50%) rotate(7deg) translate(75px,8px); }
      #album-view .fotobar-photo:nth-child(4) { transform:translateX(-50%) rotate(-4deg) translate(-27px,1px); }
      #album-view .fotobar-photo:nth-child(5) { transform:translateX(-50%) rotate(5deg) translate(29px,3px); }
      #album-view .album-fotobar + .slider-wrap { margin-top:5px; }
      #album-view .page-heading p::after { font-size:11px; }
    }

    #album-view .memory-card { border-radius:5px!important; background:#f7f9fc!important; border:1px solid rgba(0,0,0,.1)!important; box-shadow:0 24px 55px rgba(0,0,0,.38)!important; padding:8px 8px 30px!important; }
    #album-view .memory-card img { border-radius:1px!important; }
    #album-view .card-info { color:#07152d; }
    #album-view .card-info span { color:#168cff!important; }
    #album-view .card-info h3 { color:#07152d; }
    #album-view .card-info p { color:#52627a; }
    #album-view .card-number { color:#168cff; }
  `;
  document.head.appendChild(style);

  function addHeroPhoto() {
    const home = document.querySelector('#home-view');
    const grid = home?.querySelector('.hero-grid');
    const copy = grid?.querySelector('.hero-copy');
    const title = copy?.querySelector('h2');
    if (!grid || !copy || !title || grid.querySelector('.nezza-hero-photo')) return;

    grid.classList.add('nezza-hero-with-photo');

    const row = document.createElement('div');
    row.className = 'hero-title-row';
    title.parentNode.insertBefore(row, title);
    row.appendChild(title);

    const visual = document.createElement('div');
    visual.className = 'nezza-hero-photo';
    visual.innerHTML = `<img src="Proyek Baru [D604282].png" alt="Nezuro berdiri" loading="eager" decoding="async">`;
    row.appendChild(visual);
  }

  function addAlbumMedia() {
    const album = document.querySelector('#album-view');
    const slider = document.querySelector('#album-view #card-slider');
    const wrap = document.querySelector('#album-view .slider-wrap');
    if (!album || !slider || !wrap || album.querySelector('.album-fotobar')) return;

    const photos = ['IMG-20260828-WA0013.jpg','IMG-20260830-WA0003.jpg','IMG_20260809_123134.jpg','IMG_20260809_135935.jpg'];
    const fotobar = document.createElement('div');
    fotobar.className = 'album-fotobar';
    fotobar.innerHTML = `<span class="album-fotobar-title">FOTOBAR · OUR FAVORITE FRAMES</span>${photos.map((src,i) => `<div class="fotobar-photo"><img src="${src}" alt="Foto bersama ${i+1}" loading="lazy"></div>`).join('')}`;
    wrap.parentNode.insertBefore(fotobar, wrap);

    const deckPhotos = ['IMG_20260810_211253_277.jpg','IMG_20260812_180948_720.jpg','IMG_20260817_124324.jpg'];
    slider.querySelectorAll('.memory-card').forEach((card,i) => {
      const img = card.querySelector('img');
      if (img && deckPhotos[i]) { img.src = deckPhotos[i]; img.alt = `Kenangan ${i+1}`; }
    });
  }

  addHeroPhoto();
  addAlbumMedia();
})();
