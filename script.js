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

            @media(prefers-reduced-motion:reduce){
                .welcome-ticker-track{animation:none!important}
                #liquid-nav,#liquid-nav .nav-items,#liquid-nav .nav-item,#liquid-nav .nav-toggle{transition:none!important}
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

    function sliderStep() {
        if (!slider || !cards.length) return 0;
        return cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(slider).gap) || 0);
    }

    function updateSlider() {
        if (!slider || !cards.length) return;
        const step = sliderStep();
        const index = step ? Math.round(slider.scrollLeft / step) : 0;
        const safeIndex = Math.max(0, Math.min(cards.length - 1, index));
        if (sliderCount) sliderCount.textContent = String(safeIndex + 1).padStart(2, '0');
        if (sliderBar) sliderBar.style.width = `${((safeIndex + 1) / cards.length) * 100}%`;
        if (previousButton) previousButton.disabled = safeIndex === 0;
        if (nextButton) nextButton.disabled = safeIndex === cards.length - 1;
    }

    previousButton?.addEventListener('click', () => slider?.scrollBy({ left: -sliderStep(), behavior: 'smooth' }));
    nextButton?.addEventListener('click', () => slider?.scrollBy({ left: sliderStep(), behavior: 'smooth' }));
    slider?.addEventListener('scroll', updateSlider, { passive: true });
    updateSlider();

    import('./scroll-effects.js').catch(() => {});
    import('./layout-fix.js').catch(() => {});

    const initialView = window.location.hash ? `${window.location.hash.slice(1)}-view` : 'home-view';
    if (document.getElementById(initialView)) showView(initialView, false);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) closeNav();
    }, { passive: true });
})();
