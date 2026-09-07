/*
 * NEZZA — Main interactions
 * Lightweight controller: no Three.js / WebGL / heavy background engine.
 */

(() => {
    'use strict';

    const $ = (selector, parent = document) => parent?.querySelector(selector);
    const $$ = (selector, parent = document) => [...(parent || document).querySelectorAll(selector)];

    const landing = $('#landing-page');
    const content = $('#content-area');
    const enterButton = $('#enter-btn');
    const music = $('#bg-music');
    const musicButton = $('#music-toggle-btn');
    const pages = $$('.view-page');
    const navItems = $$('.nav-item');
    const indicator = $('#liquid-indicator');
    const slider = $('#card-slider');
    const cards = $$('.memory-card', slider || document);

    function moveIndicator(item) {
        if (!indicator || !item) return;
        const nav = item.closest('.liquid-nav');
        if (!nav) return;
        const navRect = nav.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const size = window.innerWidth <= 480 ? 50 : 56;
        indicator.style.width = `${size}px`;
        indicator.style.height = `${size}px`;
        indicator.style.transform = `translateX(${itemRect.left - navRect.left + itemRect.width / 2 - size / 2}px)`;
    }

    function showView(id, updateHash = true) {
        const page = document.getElementById(id);
        if (!page) return;
        pages.forEach(item => item.classList.toggle('active', item === page));
        navItems.forEach(item => item.classList.toggle('active', item.dataset.target === id));
        moveIndicator(navItems.find(item => item.dataset.target === id));
        if (updateHash) history.replaceState(null, '', `#${id.replace('-view', '')}`);
        $$('.reveal', page).forEach((element, index) => {
            element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
            element.classList.add('revealed');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => item.addEventListener('click', () => showView(item.dataset.target)));
    $$('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));

    enterButton?.addEventListener('click', async () => {
        try { await music?.play(); } catch {}
        landing?.classList.add('hide');
        window.setTimeout(() => {
            if (landing) landing.style.display = 'none';
            content?.classList.add('active');
            moveIndicator($('.nav-item.active'));
        }, 700);
    });

    musicButton?.addEventListener('click', () => {
        if (!music) return;
        music.muted = !music.muted;
        musicButton.textContent = music.muted ? '🔇' : '♪';
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
        if (sliderCount) sliderCount.textContent = String(safeIndex + 1).padStart(2, '0');
        if (sliderBar) sliderBar.style.width = `${((safeIndex + 1) / cards.length) * 100}%`;
        if (previousButton) previousButton.disabled = safeIndex === 0;
        if (nextButton) nextButton.disabled = safeIndex === cards.length - 1;
    }

    previousButton?.addEventListener('click', () => slider?.scrollBy({ left: -sliderStep(), behavior: 'smooth' }));
    nextButton?.addEventListener('click', () => slider?.scrollBy({ left: sliderStep(), behavior: 'smooth' }));
    slider?.addEventListener('scroll', updateSlider, { passive: true });

    updateSlider();

    // Keep only the useful lightweight interaction modules.
    import('./scroll-effects.js').catch(error => console.error('Unable to load scroll story:', error));
    import('./global-scroll.js').catch(error => console.error('Unable to load global scroll animations:', error));
    import('./layout-fix.js').catch(error => console.error('Unable to load responsive layout:', error));

    const initialView = window.location.hash ? `${window.location.hash.slice(1)}-view` : 'home-view';
    if (document.getElementById(initialView)) showView(initialView, false);
})();
