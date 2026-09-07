/*
 * NEZZA — Main interactions
 * Homepage-focused controller + interactive procedural 3D planet.
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

    const spaceCanvas = $('#space-canvas');
    const spaceContext = spaceCanvas?.getContext('2d');
    let particles = [];
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    window.addEventListener('pointermove', (event) => {
        pointer.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
        pointer.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    }, { passive: true });

    function resizeBackground() {
        if (!spaceCanvas || !spaceContext) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        spaceCanvas.width = window.innerWidth * ratio;
        spaceCanvas.height = window.innerHeight * ratio;
        spaceCanvas.style.width = `${window.innerWidth}px`;
        spaceCanvas.style.height = `${window.innerHeight}px`;
        spaceContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        const amount = Math.min(120, Math.max(50, Math.floor(window.innerWidth / 13)));
        particles = Array.from({ length: amount }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            baseX: Math.random() * window.innerWidth,
            baseY: Math.random() * window.innerHeight,
            radius: Math.random() * 1.7 + .35,
            speedX: (Math.random() - .5) * .22,
            speedY: Math.random() * .20 + .03,
            alpha: Math.random() * .45 + .12,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function animateBackground() {
        if (!spaceContext) return;
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
            const driftX = pointer.x * 12 + Math.sin(particle.phase) * 2;
            const driftY = pointer.y * 8;
            const x = particle.x + driftX;
            const y = particle.y + driftY;
            const alpha = particle.alpha + (Math.sin(particle.phase) + 1) * .12;
            spaceContext.beginPath();
            spaceContext.arc(x, y, particle.radius, 0, Math.PI * 2);
            spaceContext.fillStyle = `rgba(190, 240, 255, ${alpha})`;
            spaceContext.fill();
        });
        requestAnimationFrame(animateBackground);
    }

    resizeBackground();
    animateBackground();
    window.addEventListener('resize', resizeBackground, { passive: true });

    import('./planet3d.js').catch((error) => console.error('Unable to load the 3D planet:', error));
    import('./scroll-effects.js').catch((error) => console.error('Unable to load the scroll story:', error));
    import('./global-scroll.js').catch((error) => console.error('Unable to load global scroll animations:', error));
    import('./layout-fix.js').catch((error) => console.error('Unable to load responsive layout:', error));

    updateSlider();
    const initialView = window.location.hash ? `${window.location.hash.slice(1)}-view` : 'home-view';
    if (document.getElementById(initialView)) showView(initialView, false);
})();
