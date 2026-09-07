/* NEZZA — Lightweight interactions */
(() => {
    'use strict';

    const $ = (selector, parent = document) => parent?.querySelector(selector);
    const $$ = (selector, parent = document) => [...(parent || document).querySelectorAll(selector)];

    function cleanOldVisuals() {
        ['#space-canvas', '#dora-stage', '.ambient', '.orbit'].forEach(selector => {
            $$(selector).forEach(el => el.remove());
        });
    }

    function applyMobileLayout() {
        if ($('#nezza-mobile-performance')) return;

        const style = document.createElement('style');
        style.id = 'nezza-mobile-performance';
        style.textContent = `
            @media(max-width:760px){
                body{overflow-x:hidden}
                .hero-grid{display:block!important;min-height:auto!important;padding:28px 16px 115px!important}
                .hero-visual{display:none!important}
                .hero-copy{display:block!important;width:100%!important;max-width:720px!important;margin:0 auto!important;text-align:center!important}
                .hero-copy h2{margin:12px auto 16px!important;font-size:clamp(42px,12vw,62px)!important;line-height:.94!important}
                .hero-copy>p{max-width:520px!important;margin:0 auto!important;font-size:13px!important;line-height:1.65!important}
                .hero-actions{margin-top:22px!important;display:flex!important;flex-wrap:wrap!important;justify-content:center!important;gap:12px!important}
                .scroll-note{width:100%!important;text-align:center!important}
                .liquid-nav,.welcome-ticker{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
            }

            /* =========================================================
               MOBILE LIQUID NAV
               CLOSED  = one small button on the LEFT
               OPEN    = menu grows from LEFT -> RIGHT
               ========================================================= */
            @media(max-width:600px){
                #liquid-nav.liquid-nav{
                    position:fixed!important;
                    left:12px!important;
                    right:auto!important;
                    bottom:max(10px,env(safe-area-inset-bottom))!important;
                    transform:none!important;
                    width:58px!important;
                    height:58px!important;
                    padding:5px!important;
                    margin:0!important;
                    display:flex!important;
                    flex-direction:row!important;
                    align-items:center!important;
                    justify-content:flex-start!important;
                    gap:4px!important;
                    overflow:hidden!important;
                    box-sizing:border-box!important;
                    border:1px solid rgba(74,129,184,.38)!important;
                    border-radius:999px!important;
                    background:#050914!important;
                    box-shadow:0 14px 38px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.07)!important;
                    transition:width .38s cubic-bezier(.2,.85,.2,1),background .3s ease,box-shadow .3s ease!important;
                    backdrop-filter:none!important;
                    -webkit-backdrop-filter:none!important;
                }

                #liquid-nav.liquid-nav.open{
                    width:min(356px,calc(100vw - 24px))!important;
                    background:#060c19!important;
                    box-shadow:0 18px 48px rgba(0,0,0,.56),inset 0 1px 0 rgba(255,255,255,.08)!important;
                }

                #liquid-nav .nav-toggle{
                    order:1!important;
                    flex:0 0 48px!important;
                    width:48px!important;
                    height:48px!important;
                    margin:0!important;
                    display:grid!important;
                    place-items:center!important;
                    border:1px solid rgba(95,145,194,.34)!important;
                    border-radius:50%!important;
                    background:#0b1425!important;
                    color:#e6f1ff!important;
                    font-size:22px!important;
                    line-height:1!important;
                    cursor:pointer!important;
                    box-shadow:0 6px 18px rgba(0,0,0,.34)!important;
                    transition:background .28s ease,color .28s ease,transform .38s cubic-bezier(.2,.85,.2,1)!important;
                }

                #liquid-nav .nav-toggle.open{
                    background:linear-gradient(145deg,#ffffff 0%,#7cddff 100%)!important;
                    color:#06101e!important;
                    transform:rotate(90deg)!important;
                }

                #liquid-nav .nav-items{
                    order:2!important;
                    flex:0 0 0!important;
                    width:0!important;
                    min-width:0!important;
                    height:48px!important;
                    display:flex!important;
                    align-items:center!important;
                    gap:3px!important;
                    overflow:hidden!important;
                    opacity:0!important;
                    transform:translateX(-12px)!important;
                    pointer-events:none!important;
                    transition:flex-basis .38s cubic-bezier(.2,.85,.2,1),width .38s cubic-bezier(.2,.85,.2,1),opacity .2s ease,transform .38s cubic-bezier(.2,.85,.2,1)!important;
                }

                #liquid-nav.open .nav-items{
                    flex:1 1 auto!important;
                    width:auto!important;
                    opacity:1!important;
                    transform:translateX(0)!important;
                    pointer-events:auto!important;
                }

                #liquid-nav .nav-item{
                    flex:1 1 0!important;
                    min-width:0!important;
                    width:auto!important;
                    height:48px!important;
                    margin:0!important;
                    padding:4px 2px!important;
                    display:flex!important;
                    flex-direction:column!important;
                    align-items:center!important;
                    justify-content:center!important;
                    gap:2px!important;
                    border:1px solid transparent!important;
                    border-radius:15px!important;
                    background:transparent!important;
                    color:#78869e!important;
                    font-size:18px!important;
                    line-height:1!important;
                    cursor:pointer!important;
                    transform:none!important;
                    transition:background .22s ease,color .22s ease,transform .22s ease,border-color .22s ease!important;
                }

                #liquid-nav .nav-item small{
                    display:block!important;
                    color:inherit!important;
                    font-size:7px!important;
                    line-height:1!important;
                    font-weight:800!important;
                    letter-spacing:.04em!important;
                }

                #liquid-nav .nav-item.active{
                    color:#06111f!important;
                    background:linear-gradient(145deg,#ffffff 0%,#a7edff 100%)!important;
                    border-color:rgba(255,255,255,.7)!important;
                    box-shadow:0 5px 17px rgba(74,205,255,.25),inset 0 1px 0 #fff!important;
                    transform:translateY(-1px)!important;
                }

                #liquid-nav .nav-item.music-playing:not(.active){
                    color:#9de9ff!important;
                    background:rgba(29,151,220,.13)!important;
                }

                #liquid-nav .nav-item:active{transform:scale(.92)!important}
                #liquid-nav .liquid-indicator{display:none!important}

                .welcome-ticker{height:38px!important;margin-top:10px!important}
                .welcome-ticker-track{gap:55px!important;animation-duration:22s!important}
                .welcome-ticker-track span{font-size:11px!important}
                .hero-grid{padding:30px 14px 108px!important}
                .hero-copy h2{font-size:clamp(40px,12.5vw,54px)!important}
            }

            @media(max-width:380px){
                #liquid-nav.liquid-nav{left:8px!important;width:56px!important;height:56px!important}
                #liquid-nav.liquid-nav.open{left:8px!important;width:calc(100vw - 16px)!important}
                #liquid-nav .nav-toggle{flex-basis:46px!important;width:46px!important;height:46px!important}
                #liquid-nav .nav-item{font-size:16px!important}
                #liquid-nav .nav-item small{font-size:6.5px!important}
            }

            /* =========================================================
               ALBUM — STACKED PAPER SLIDER
               Cards overlap like a small pile of photographs.
               ========================================================= */
            .slider-wrap{
                position:relative!important;
                display:grid!important;
                grid-template-columns:46px minmax(0,1fr) 46px!important;
                align-items:center!important;
                gap:12px!important;
                width:min(760px,100%)!important;
                margin:0 auto!important;
            }
            .card-slider{
                position:relative!important;
                display:block!important;
                width:100%!important;
                height:520px!important;
                overflow:hidden!important;
                padding:28px 0 35px!important;
                scroll-snap-type:none!important;
                cursor:default!important;
                overscroll-behavior:contain!important;
                isolation:isolate!important;
            }
            .memory-card{
                position:absolute!important;
                left:50%!important;
                top:28px!important;
                width:min(360px,78%)!important;
                height:455px!important;
                margin:0!important;
                flex:none!important;
                overflow:hidden!important;
                border:1px solid rgba(255,255,255,.2)!important;
                border-radius:24px!important;
                background:linear-gradient(150deg,rgba(22,48,91,.96),rgba(5,13,31,.98))!important;
                box-shadow:0 26px 55px rgba(0,0,0,.34),0 4px 0 rgba(255,255,255,.035) inset!important;
                transform:translateX(-50%) rotate(0deg)!important;
                transform-origin:50% 92%!important;
                transition:transform .45s cubic-bezier(.2,.8,.2,1),filter .35s ease,opacity .35s ease,box-shadow .35s ease!important;
            }
            .memory-card:nth-child(1){z-index:3!important;transform:translateX(-50%) rotate(-3.5deg)!important}
            .memory-card:nth-child(2){z-index:2!important;transform:translateX(-50%) translate(18px,10px) rotate(4.5deg) scale(.96)!important}
            .memory-card:nth-child(3){z-index:1!important;transform:translateX(-50%) translate(-17px,20px) rotate(-6deg) scale(.92)!important}
            .memory-card:hover{transform:translateX(-50%) translateY(-5px) rotate(-2deg)!important}
            .memory-card img{height:310px!important;object-fit:cover!important}
            .card-info{padding:22px!important}
            .card-info h3{margin:8px 0!important;font-size:24px!important}
            .card-info p{font-size:11px!important}
            .card-number{z-index:4!important}
            .slider-arrow{position:relative!important;z-index:10!important;width:46px!important;height:46px!important}
            .slider-progress{width:min(700px,calc(100% - 30px))!important;margin:4px auto 0!important}

            @media(max-width:600px){
                .slider-wrap{grid-template-columns:38px minmax(0,1fr) 38px!important;gap:5px!important}
                .card-slider{height:470px!important;padding:22px 0 30px!important}
                .memory-card{top:22px!important;width:min(310px,78vw)!important;height:410px!important;border-radius:22px!important}
                .memory-card:nth-child(1){transform:translateX(-50%) rotate(-3deg)!important}
                .memory-card:nth-child(2){transform:translateX(-50%) translate(13px,9px) rotate(4deg) scale(.95)!important}
                .memory-card:nth-child(3){transform:translateX(-50%) translate(-12px,18px) rotate(-5deg) scale(.9)!important}
                .memory-card img{height:275px!important}
                .card-info{padding:18px!important}
                .card-info h3{font-size:21px!important}
                .slider-arrow{width:38px!important;height:38px!important;font-size:14px!important}
            }

            @media(max-width:380px){
                .card-slider{height:440px!important}
                .memory-card{width:min(285px,76vw)!important;height:385px!important}
                .memory-card img{height:255px!important}
            }

            @media(prefers-reduced-motion:reduce){
                .welcome-ticker-track{animation:none!important}
                #liquid-nav,#liquid-nav .nav-items,#liquid-nav .nav-item,#liquid-nav .nav-toggle,.memory-card{transition:none!important}
            }
        `;
        document.head.appendChild(style);
    }

    cleanOldVisuals();
    applyMobileLayout();

    const landing = $('#landing-page');
    const content = $('#content-area');
    const enterButton = $('#enter-btn');
    const music = $('#bg-music');
    const pages = $$('.view-page');
    const nav = $('#liquid-nav');
    const navItems = $$('.nav-item');
    const toggle = $('#nav-toggle');
    const slider = $('#card-slider');
    const cards = $$('.memory-card', slider || document);

    function setActive(item) {
        navItems.forEach(button => button.classList.toggle('active', button === item));
    }

    function closeNav() {
        if (!nav || !toggle) return;
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Buka navigasi');
        toggle.textContent = '＋';
    }

    function toggleNav() {
        if (!nav || !toggle) return;
        const open = nav.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
        toggle.textContent = open ? '×' : '＋';
    }

    toggle?.addEventListener('click', toggleNav);

    function showView(id, updateHash = true, activeItem = null) {
        const page = document.getElementById(id);
        if (!page) return;
        pages.forEach(item => item.classList.toggle('active', item === page));
        setActive(activeItem || navItems.find(item => item.dataset.target === id));
        if (updateHash) history.replaceState(null, '', `#${id.replace('-view', '')}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeNav();
    }

    navItems.forEach(item => item.addEventListener('click', async () => {
        const action = item.dataset.action;

        if (action === 'music') {
            if (!music) return;
            try {
                if (music.paused) await music.play();
                else music.pause();
            } catch {}
            item.classList.toggle('music-playing', !music.paused);
            const label = item.querySelector('small');
            if (label) label.textContent = music.paused ? 'Music' : 'Playing';
            closeNav();
            return;
        }

        if (action === 'top') {
            const home = navItems.find(button => button.dataset.target === 'home-view');
            showView('home-view', true, home);
            return;
        }

        if (item.dataset.target) showView(item.dataset.target);
    }));

    $$('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));

    enterButton?.addEventListener('click', async () => {
        try { await music?.play(); } catch {}
        landing?.classList.add('hide');
        window.setTimeout(() => {
            if (landing) landing.style.display = 'none';
            content?.classList.add('active');
            setActive(navItems.find(item => item.dataset.target === 'home-view'));
        }, 700);
    });

    const previousButton = $('#prev-card');
    const nextButton = $('#next-card');
    const sliderCount = $('#slider-count');
    const sliderBar = $('#slider-bar');

    /* The album is now a stacked-paper deck.
       Arrows bring the selected card to the front instead of scrolling a row. */
    let albumIndex = 0;

    function renderAlbumDeck() {
        if (!cards.length) return;

        cards.forEach((card, index) => {
            const offset = (index - albumIndex + cards.length) % cards.length;
            card.classList.remove('deck-front','deck-mid','deck-back');
            card.style.zIndex = String(cards.length - offset);

            if (offset === 0) {
                card.classList.add('deck-front');
                card.style.transform = 'translateX(-50%) rotate(-2.5deg)';
                card.style.opacity = '1';
                card.style.filter = 'none';
            } else if (offset === 1) {
                card.classList.add('deck-mid');
                card.style.transform = 'translateX(-50%) translate(16px,10px) rotate(4deg) scale(.96)';
                card.style.opacity = '.96';
                card.style.filter = 'brightness(.9)';
            } else {
                card.classList.add('deck-back');
                card.style.transform = 'translateX(-50%) translate(-15px,20px) rotate(-5deg) scale(.92)';
                card.style.opacity = '.88';
                card.style.filter = 'brightness(.76)';
            }
        });

        if (sliderCount) sliderCount.textContent = String(albumIndex + 1).padStart(2, '0');
        if (sliderBar) sliderBar.style.width = `${((albumIndex + 1) / cards.length) * 100}%`;
        if (previousButton) previousButton.disabled = cards.length < 2;
        if (nextButton) nextButton.disabled = cards.length < 2;
    }

    function moveAlbum(direction) {
        if (!cards.length) return;
        albumIndex = (albumIndex + direction + cards.length) % cards.length;
        renderAlbumDeck();
    }

    previousButton?.addEventListener('click', () => moveAlbum(-1));
    nextButton?.addEventListener('click', () => moveAlbum(1));
    renderAlbumDeck();

    import('./scroll-effects.js').catch(() => {});
    import('./layout-fix.js').catch(() => {});

    const initialView = window.location.hash ? `${window.location.hash.slice(1)}-view` : 'home-view';
    if (document.getElementById(initialView)) showView(initialView, false);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) closeNav();
    }, { passive: true });
})();
