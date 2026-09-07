/*
 * NEZZA — Main interactions
 * Homepage-focused controller + lightweight mobile rendering.
 */

(() => {
    'use strict';

    // Cap the rendering pixel ratio on phones before Three.js is loaded.
    // This keeps the same visual size while greatly reducing GPU workload.
    if (window.innerWidth <= 700) {
        try {
            const dpr = Math.min(window.devicePixelRatio || 1, 1);
            Object.defineProperty(window, 'devicePixelRatio', {
                configurable: true,
                get: () => dpr,
            });
        } catch {}
    }

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
        const left = itemRect.left - navRect.left + itemRect.width / 2 - size / 2;
        indicator.style.width = `${size}px`;
        indicator.style.height = `${size}px`;
        indicator.style.transform = `translateX(${left}px)`;
    }

    function showView(id, updateHash = true) {
        const page = document.getElementById(id);
        if (!page) return;
        pages.forEach((item) => item.classList.toggle('active', item === page));
        navItems.forEach((item) => item.classList.toggle('active', item.dataset.target === id));
        moveIndicator(navItems.find((item) => item.dataset.target === id));
        if (updateHash) history.replaceState(null, '', `#${id.replace('-view', '')}`);
        $$('.reveal', page).forEach((element, index) => {
            element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
            element.classList.add('revealed');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach((item) => item.addEventListener('click', () => showView(item.dataset.target)));
    $$('[data-go]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.go)));

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

    // Lightweight star canvas. Phones use fewer particles, 1x rendering and 30 FPS.
    const spaceCanvas = $('#space-canvas');
    const spaceContext = spaceCanvas?.getContext('2d', { alpha: true });
    let particles = [];
    let backgroundFrame = 0;
    let lastBackgroundFrame = 0;
    let backgroundRunning = true;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    window.addEventListener('pointermove', (event) => {
        pointer.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
        pointer.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    }, { passive: true });

    function resizeBackground() {
        if (!spaceCanvas || !spaceContext) return;
        const mobile = window.innerWidth <= 700;
        const ratio = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.floor(window.innerWidth));
        const height = Math.max(1, Math.floor(window.innerHeight));
        spaceCanvas.width = Math.floor(width * ratio);
        spaceCanvas.height = Math.floor(height * ratio);
        spaceCanvas.style.width = `${width}px`;
        spaceCanvas.style.height = `${height}px`;
        spaceContext.setTransform(ratio, 0, 0, ratio, 0, 0);

        const amount = mobile
            ? Math.min(38, Math.max(24, Math.floor(width / 11)))
            : Math.min(90, Math.max(45, Math.floor(width / 14)));

        particles = Array.from({ length: amount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * (mobile ? 1.35 : 1.7) + .35,
            speedX: (Math.random() - .5) * (mobile ? .15 : .22),
            speedY: Math.random() * (mobile ? .14 : .20) + .03,
            alpha: Math.random() * .45 + .12,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function animateBackground(timestamp = 0) {
        if (!spaceContext) return;
        backgroundFrame = requestAnimationFrame(animateBackground);
        if (!backgroundRunning || timestamp - lastBackgroundFrame < 33) return;
        lastBackgroundFrame = timestamp;

        pointer.x += (pointer.targetX - pointer.x) * .025;
        pointer.y += (pointer.targetY - pointer.y) * .025;
        spaceContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

        particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y -= particle.speedY;
            particle.phase += .012;
            if (particle.x < -10) particle.x = window.innerWidth + 10;
            if (particle.x > window.innerWidth + 10) particle.x = -10;
            if (particle.y < -10) particle.y = window.innerHeight + 10;
            const x = particle.x + pointer.x * 12 + Math.sin(particle.phase) * 2;
            const y = particle.y + pointer.y * 8;
            const alpha = particle.alpha + (Math.sin(particle.phase) + 1) * .12;
            spaceContext.beginPath();
            spaceContext.arc(x, y, particle.radius, 0, Math.PI * 2);
            spaceContext.fillStyle = `rgba(190, 240, 255, ${alpha})`;
            spaceContext.fill();
        });
    }

    document.addEventListener('visibilitychange', () => {
        backgroundRunning = !document.hidden;
        if (document.hidden && backgroundFrame) cancelAnimationFrame(backgroundFrame);
        if (!document.hidden && spaceContext) {
            lastBackgroundFrame = 0;
            backgroundFrame = requestAnimationFrame(animateBackground);
        }
    });

    resizeBackground();
    animateBackground();
    window.addEventListener('resize', resizeBackground, { passive: true });

    import('./planet3d.js').catch((error) => console.error('Unable to load the 3D planet:', error));
    import('./scroll-effects.js').catch((error) => console.error('Unable to load the scroll story:', error));
    import('./global-scroll.js').catch((error) => console.error('Unable to load global scroll animations:', error));
    import('./layout-fix.js').catch((error) => console.error('Unable to load responsive layout:', error));
    import('./universe-bg.js').catch((error) => console.error('Unable to load universe background:', error));

    updateSlider();
    const initialView = window.location.hash ? `${window.location.hash.slice(1)}-view` : 'home-view';
    if (document.getElementById(initialView)) showView(initialView, false);
})();
