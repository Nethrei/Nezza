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

    /* STANDING PHOTO BESIDE THE HOMEPAGE TITLE */
    .hero-grid.nezza-hero-with-photo {
      grid-template-columns:minmax(0,1fr) minmax(220px,360px)!important;
      gap:clamp(20px,4vw,70px)!important;
      align-items:center!important;
    }
    .nezza-hero-photo {
      position:relative;
      width:100%;
      height:min(72vh,610px);
      min-height:330px;
      display:flex;
      align-items:flex-end;
      justify-content:center;
      pointer-events:none;
      z-index:2;
      overflow:visible;
    }
    .nezza-hero-photo::before {
      content:'';
      position:absolute;
      width:220px;
      height:220px;
      right:12%;
      bottom:5%;
      border-radius:50%;
      background:radial-gradient(circle,rgba(91,218,255,.24),rgba(91,218,255,0) 68%);
      filter:blur(12px);
      z-index:-1;
    }
    .nezza-hero-photo img {
      display:block;
      width:auto;
      height:100%;
      max-width:100%;
      object-fit:contain;
      object-position:center bottom;
      filter:drop-shadow(0 28px 35px rgba(0,0,0,.35));
      user-select:none;
    }

    @media (max-width: 760px) {
      html, body { width:100%; min-width:0; max-width:100%; overflow-x:hidden!important; }
      .app-shell { box-sizing:border-box; width:100%; max-width:100vw; padding:54px 10px calc(var(--nav-height,72px) + 20px); }
      .view-page,.hero-grid,.hero-copy,.hero-visual { min-width:0; max-width:100%; }
      .view-page { width:100%; }
      .hero-grid { box-sizing:border-box; width:100%; min-height:calc(100dvh - 126px); height:auto; grid-template-columns:minmax(0,1.08fr) minmax(0,.82fr); gap:6px; align-items:center; }
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
        grid-template-columns:minmax(0,1.08fr) minmax(105px,.72fr)!important;
        gap:4px!important;
        min-height:calc(100dvh - 116px)!important;
      }
      .nezza-hero-photo { height:min(68vh,470px); min-height:260px; }
      .nezza-hero-photo img { max-width:120%; }
    }

    @media (max-width:480px) {
      .app-shell { padding-inline:8px; padding-top:48px; }
      .hero-grid { grid-template-columns:minmax(0,1.12fr) minmax(0,.72fr); gap:3px; min-height:calc(100dvh - 116px); }
      .hero-copy h2,.page-heading h2 { font-size:clamp(25px,8.35vw,36px); }
      .hero-copy>p { font-size:8px; line-height:1.5; }
      .hero-visual { min-height:245px; height:50vw; max-height:315px; }
      .main-photo-card { width:94%; border-radius:18px; }
      .liquid-nav { width:calc(100vw - 16px)!important; max-width:430px; }
      .hero-grid.nezza-hero-with-photo { grid-template-columns:minmax(0,1.16fr) minmax(100px,.66fr)!important; gap:2px!important; }
      .nezza-hero-photo { min-height:230px; height:60vw; max-height:330px; }
    }

    @media (max-width:360px) {
      .hero-grid { grid-template-columns:minmax(0,1.16fr) minmax(0,.66fr); }
      .hero-copy h2,.page-heading h2 { font-size:27px; }
      .hero-copy>p { font-size:7.5px; }
      .hero-visual { min-height:220px; }
      .hero-grid.nezza-hero-with-photo { grid-template-columns:minmax(0,1.18fr) minmax(88px,.62fr)!important; }
      .nezza-hero-photo { min-height:205px; }
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
    #album-view .fotobar-photo img {
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }
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

    /* Make repository photos feel like real paper snapshots */
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
    if (!grid || !copy || grid.querySelector('.nezza-hero-photo')) return;

    grid.classList.add('nezza-hero-with-photo');
    const visual = document.createElement('div');
    visual.className = 'nezza-hero-photo';
    visual.innerHTML = `<img src="Proyek Baru [D604282].png" alt="Nezuro berdiri" loading="eager" decoding="async">`;
    grid.appendChild(visual);
  }

  function addAlbumMedia() {
    const album = document.querySelector('#album-view');
    const slider = document.querySelector('#album-view #card-slider');
    const wrap = document.querySelector('#album-view .slider-wrap');
    if (!album || !slider || !wrap || album.querySelector('.album-fotobar')) return;

    const photos = [
      'IMG-20260828-WA0013.jpg',
      'IMG-20260830-WA0003.jpg',
      'IMG_20260809_123134.jpg',
      'IMG_20260809_135935.jpg'
    ];

    const fotobar = document.createElement('div');
    fotobar.className = 'album-fotobar';
    fotobar.innerHTML = `<span class="album-fotobar-title">FOTOBAR · OUR FAVORITE FRAMES</span>${photos.map((src,i) => `<div class="fotobar-photo"><img src="${src}" alt="Foto bersama ${i+1}" loading="lazy"></div>`).join('')}`;
    wrap.parentNode.insertBefore(fotobar, wrap);

    const deckPhotos = [
      'IMG_20260810_211253_277.jpg',
      'IMG_20260812_180948_720.jpg',
      'IMG_20260817_124324.jpg'
    ];
    slider.querySelectorAll('.memory-card').forEach((card,i) => {
      const img = card.querySelector('img');
      if (img && deckPhotos[i]) {
        img.src = deckPhotos[i];
        img.alt = `Kenangan ${i+1}`;
      }
    });
  }

  addHeroPhoto();
  addAlbumMedia();
})();
