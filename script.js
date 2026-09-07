/*
 * NEZZA — Main interactions
 * Lightweight: HTML + CSS + JavaScript only.
 */

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
        if (document.getElementById('nezza-mobile-performance')) return;
        const style = document.createElement('style');
        style.id = 'nezza-mobile-performance';
        style.textContent = `
            @media (max-width: 760px) {
                body { overflow-x:hidden; background:linear-gradient(180deg,#050a16 0%,#071a3b 52%,#0b3f78 100%); }
                .hero-grid { display:block!important; min-height:auto!important; padding:28px 16px 115px!important; }
                .hero-visual { display:none!important; }
                .hero-copy { display:block!important; width:100%!important; max-width:720px!important; margin:0 auto!important; text-align:center!important; }
                .hero-copy h2 { margin:12px auto 16px!important; font-size:clamp(42px,12vw,62px)!important; line-height:.94!important; }
                .hero-copy > p { max-width:520px!important; margin:0 auto!important; font-size:13px!important; line-height:1.65!important; }
                .hero-actions { margin-top:22px!important; display:flex!important; flex-wrap:wrap!important; justify-content:center!important; gap:12px!important; }
                .scroll-note { width:100%!important; text-align:center!important; }
                .liquid-nav { backdrop-filter:none!important; -webkit-backdrop-filter:none!important; }
                .welcome-ticker { backdrop-filter:none!important; -webkit-backdrop-filter:none!important; }
            }

            /* ===== MOBILE COMPACT LIQUID NAV ===== */
            @media (max-width:600px) {
                .liquid-nav {
                    left:auto!important;
                    right:10px!important;
                    bottom:max(10px, env(safe-area-inset-bottom))!important;
                    transform:none!important;
                    width:58px!important;
                    height:58px!important;
                    padding:5px!important;
                    display:flex!important;
                    flex-direction:row!important;
                    align-items:center!important;
                    justify-content:flex-end!important;
                    gap:3px!important;
                    overflow:hidden!important;
                    border:1px solid rgba(77,135,190,.34)!important;
                    border-radius:999px!important;
                    background:#050a16!important;
                    box-shadow:0 12px 34px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.06)!important;
                    transition:width .34s cubic-bezier(.2,.8,.2,1), background .25s ease, box-shadow .25s ease!important;
                    backdrop-filter:none!important;
                    -webkit-backdrop-filter:none!important;
                }

                .liquid-nav.open {
                    width:min(360px,calc(100vw - 20px))!important;
                    background:#060d1b!important;
                    box-shadow:0 16px 42px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.07)!important;
                }

                .liquid-indicator { display:none!important; }

                .nav-item {
                    flex:1 1 0!important;
                    min-width:0!important;
                    width:auto!important;
                    height:48px!important;
                    margin:0!important;
                    display:flex!important;
                    flex-direction:column!important;
                    align-items:center!important;
                    justify-content:center!important;
                    gap:3px!important;
                    padding:0!important;
                    border:1px solid transparent!important;
                    border-radius:16px!important;
                    background:transparent!important;
                    color:#7d8da7!important;
                    font-size:17px!important;
                    line-height:1!important;
                    opacity:0!important;
                    visibility:hidden!important;
                    transform:translateX(14px) scale(.9)!important;
                    pointer-events:none!important;
                    transition:opacity .22s ease, transform .3s cubic-bezier(.2,.8,.2,1), color .2s ease, background .2s ease, border-color .2s ease!important;
                }

                .liquid-nav.open .nav-item {
                    opacity:1!important;
                    visibility:visible!important;
                    transform:translateX(0) scale(1)!important;
                    pointer-events:auto!important;
                }

                .nav-item small {
                    font-size:8px!important;
                    font-weight:700!important;
                    letter-spacing:.04em!important;
                    color:inherit!important;
                }

                .nav-item.active {
                    color:#06152b!important;
                    background:linear-gradient(145deg,#ffffff 0%,#bdefff 100%)!important;
                    border-color:rgba(255,255,255,.72)!important;
                    box-shadow:0 5px 16px rgba(63,190,255,.18), inset 0 1px 0 #fff!important;
                }

                .nav-item.music-playing {
                    color:#06152b!important;
                    background:linear-gradient(145deg,#72dcff 0%,#d8f8ff 100%)!important;
                }

                .nav-item:active { transform:scale(.93)!important; }

                .mobile-nav-toggle {
                    order:99!important;
                    flex:0 0 48px!important;
                    width:48px!important;
                    height:48px!important;
                    display:grid!important;
                    place-items:center!important;
                    position:relative!important;
                    border:1px solid rgba(86,139,190,.38)!important;
                    border-radius:16px!important;
                    background:#0b1628!important;
                    color:#d9eaff!important;
                    font-size:21px!important;
                    cursor:pointer!important;
                    transition:transform .25s ease, background .25s ease, color .25s ease!important;
                }

                .mobile-nav-toggle:active { transform:scale(.91)!important; }
                .mobile-nav-toggle .toggle-icon { transition:transform .3s ease!important; }
                .liquid-nav.open .mobile-nav-toggle {
                    background:#168cff!important;
                    color:#fff!important;
                    border-color:#48bfff!important;
                }
                .liquid-nav.open .mobile-nav-toggle .toggle-icon { transform:rotate(45deg)!important; }

                .welcome-ticker { height:38px!important; margin-top:10px!important; }
                .welcome-ticker-track { gap:55px!important; animation-duration:22s!important; }
                .welcome-ticker-track span { font-size:11px!important; }
                .hero-grid { padding:30px 14px 108px!important; }
                .hero-copy h2 { font-size:clamp(40px,12.5vw,54px)!important; }
            }

            @media (max-width:380px) {
                .liquid-nav.open { width:calc(100vw - 16px)!important; right:8px!important; }
                .nav-item { font-size:15px!important; }
                .nav-item small { font-size:7px!important; }
                .mobile-nav-toggle { flex-basis:46px!important; width:46px!important; height:46px!important; }
            }

            @media (prefers-reduced-motion:reduce) {
                .welcome-ticker-track { animation:none!important; }
                .liquid-nav, .nav-item, .mobile-nav-toggle, .mobile-nav-toggle .toggle-icon { transition:none!important; }
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
    const nav = $('.liquid-nav');
    const navItems = $$('.nav-item');
    const indicator = $('#liquid-indicator');
    const slider = $('#card-slider');
    const cards = $$('.memory-card', slider || document);

    // Mobile-only compact menu button. It sits on the right and reveals the 5 functions to the left.
    let mobileToggle = $('.mobile-nav-toggle', nav || document);
    if (nav && !mobileToggle) {
        mobileToggle = document.createElement('button');
        mobileToggle.type = 'button';
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.setAttribute('aria-label', 'Buka navigasi');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<span class="toggle-icon">＋</span>';
        nav.appendChild(mobileToggle);
    }

    function moveIndicator(item) {
        if (!indicator || !item || window.innerWidth <= 600) return;
        const navBox = item.closest('.liquid-nav');
        if (!navBox) return;
        const navRect = navBox.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const size = window.innerWidth <= 600 ? 54 : 56;
        indicator.style.width = `${size}px`;
        indicator.style.height = `${size}px`;
        indicator.style.transform = `translateX(${itemRect.left - navRect.left + itemRect.width / 2 - size / 2}px)`;
    }

    function setActive(item) {
        navItems.forEach(navItem => navItem.classList.toggle('active', navItem === item));
        if (item?.dataset.target) moveIndicator(item);
    }

    function closeMobileNav() {
        if (!nav || window.innerWidth > 600) return;
        nav.classList.remove('open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        mobileToggle?.setAttribute('aria-label', 'Buka navigasi');
    }

    function showView(id, updateHash = true, activeItem = null) {
        const page = document.getElementById(id);
        if (!page) return;
        pages.forEach(item => item.classList.toggle('active', item === page));
        const targetItem = activeItem || navItems.find(item => item.dataset.target === id);
        setActive(targetItem);
        if (updateHash) history.replaceState(null, '', `#${id.replace('-view', '')}`);
        window.scrollTo({ top:0, behavior:'smooth' });
    }

    mobileToggle?.addEventListener('click', () => {
        const isOpen = nav?.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
        mobileToggle.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
    });

    navItems.forEach(item => {
        item.addEventListener('click', async () => {
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
                closeMobileNav();
                return;
            }

            if (action === 'top') {
                const home = navItems.find(navItem => navItem.dataset.target === 'home-view');
                showView('home-view', true, home);
                closeMobileNav();
                return;
            }

            if (item.dataset.target) {
                showView(item.dataset.target);
                closeMobileNav();
            }
        });
    });

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
        const gap = parseFloat(getComputedStyle(slider).gap) || 0;
        return cards[0].getBoundingClientRect().width + gap;
    }

    function updateSlider() {
        if (!slider || !cards.length) return;
        const step = sliderStep();
        const index = step ? Math.round(slider.scrollLeft / step) : 0;
        const safeIndex = Math.max(0, Math.min(cards.length - 1, index));
        if (sliderCount) sliderCount.textContent = String(safeIndex + 1).padStart(2,'0');
        if (sliderBar) sliderBar.style.width = `${((safeIndex + 1) / cards.length) * 100}%`;
        if (previousButton) previousButton.disabled = safeIndex === 0;
        if (nextButton) nextButton.disabled = safeIndex === cards.length - 1;
    }

    previousButton?.addEventListener('click', () => slider?.scrollBy({ left:-sliderStep(), behavior:'smooth' }));
    nextButton?.addEventListener('click', () => slider?.scrollBy({ left:sliderStep(), behavior:'smooth' }));
    slider?.addEventListener('scroll', updateSlider, { passive:true });
    updateSlider();

    import('./scroll-effects.js').catch(() => {});
    import('./layout-fix.js').catch(() => {});

    const initialView = window.location.hash ? `${window.location.hash.slice(1)}-view` : 'home-view';
    if (document.getElementById(initialView)) showView(initialView, false);

    window.addEventListener('resize', () => {
        const active = navItems.find(item => item.classList.contains('active'));
        if (active?.dataset.target) moveIndicator(active);
        if (window.innerWidth > 600) closeMobileNav();
    }, { passive:true });
})();
