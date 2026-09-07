/*
 * NEZZA — Main interactions
 * Lightweight: HTML + CSS + JavaScript only. No WebGL / Three.js.
 */

(() => {
    'use strict';

    const $ = (selector, parent = document) => parent?.querySelector(selector);
    const $$ = (selector, parent = document) => [...(parent || document).querySelectorAll(selector)];

    // Remove leftovers from the old 3D/universe version.
    // This keeps the existing HTML compatible while preventing empty/heavy
    // visual layers from taking space or triggering compositor work.
    function cleanOldVisuals() {
        ['#space-canvas', '#dora-stage', '.ambient', '.orbit'].forEach(selector => {
            $$(selector).forEach(el => el.remove());
        });
    }

    // Mobile-first performance/layout patch.
    function applyMobileLayout() {
        if (!document.getElementById('nezza-mobile-performance')) {
            const style = document.createElement('style');
            style.id = 'nezza-mobile-performance';
            style.textContent = `
                /* Keep the important content immediately visible on phones. */
                @media (max-width: 760px) {
                    body {
                        overflow-x: hidden;
                        background: linear-gradient(180deg, #061a3d 0%, #0b4e9b 52%, #7bdcff 100%);
                    }

                    .hero-grid {
                        display: block !important;
                        min-height: auto !important;
                        padding: 28px 16px 115px !important;
                    }

                    .hero-visual {
                        display: none !important;
                    }

                    .hero-copy {
                        display: block !important;
                        order: 1 !important;
                        width: 100% !important;
                        max-width: 720px !important;
                        margin: 0 auto !important;
                        text-align: center !important;
                    }

                    .hero-copy .eyebrow {
                        font-size: 11px !important;
                        letter-spacing: .18em !important;
                    }

                    .hero-copy h2 {
                        margin: 12px auto 16px !important;
                        font-size: clamp(42px, 12vw, 62px) !important;
                        line-height: .94 !important;
                    }

                    .hero-copy > p {
                        max-width: 520px !important;
                        margin: 0 auto !important;
                        font-size: 13px !important;
                        line-height: 1.65 !important;
                    }

                    .hero-actions {
                        margin-top: 22px !important;
                        display: flex !important;
                        flex-wrap: wrap !important;
                        align-items: center !important;
                        justify-content: center !important;
                        gap: 12px !important;
                    }

                    .scroll-note {
                        width: 100% !important;
                        text-align: center !important;
                    }

                    /* Keep the navigation glass simple on low-power phones. */
                    .liquid-nav {
                        backdrop-filter: none !important;
                        -webkit-backdrop-filter: none !important;
                        background: rgba(93, 183, 255, .92) !important;
                        box-shadow: 0 10px 28px rgba(0, 20, 80, .22) !important;
                    }

                    .welcome-ticker {
                        backdrop-filter: none !important;
                        -webkit-backdrop-filter: none !important;
                        background: rgba(8, 39, 87, .72) !important;
                    }

                    .floating-chip,
                    .ambient,
                    .orbit,
                    #space-canvas,
                    #dora-stage {
                        display: none !important;
                    }
                }

                @media (max-width: 480px) {
                    .welcome-ticker {
                        height: 38px !important;
                        margin-top: 10px !important;
                    }

                    .welcome-ticker-track {
                        gap: 55px !important;
                        animation-duration: 22s !important;
                    }

                    .welcome-ticker-track span {
                        font-size: 11px !important;
                    }

                    .hero-grid {
                        padding: 30px 14px 108px !important;
                    }

                    .hero-copy h2 {
                        font-size: clamp(40px, 12.5vw, 54px) !important;
                    }

                    .primary-btn {
                        min-height: 52px !important;
                    }

                    .liquid-nav {
                        bottom: 10px !important;
                        width: calc(100vw - 20px) !important;
                        height: 60px !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .welcome-ticker-track {
                        animation: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    cleanOldVisuals();
    applyMobileLayout();

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

    // Keep only the useful story + responsive modules.
    import('./scroll-effects.js').catch(() => {});
    import('./layout-fix.js').catch(() => {});

    const initialView = window.location.hash ? `${window.location.hash.slice(1)}-view` : 'home-view';
    if (document.getElementById(initialView)) showView(initialView, false);
})();
