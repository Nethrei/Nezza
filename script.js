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
