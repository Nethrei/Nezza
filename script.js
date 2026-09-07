/* =========================================================
   NEZZA — INTERACTIONS
   Vanilla JavaScript / no dependencies
   ========================================================= */

(() => {
  'use strict';

  // ---------- DOM helpers ----------
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const landing = $('#landing-page');
  const content = $('#content-area');
  const enterButton = $('#enter-btn');
  const music = $('#bg-music');
  const musicButton = $('#music-toggle-btn');
  const pages = $$('.view-page');
  const navItems = $$('.nav-item');
  const indicator = $('#liquid-indicator');

  // ---------- Navigation ----------
  function updateIndicator(activeItem) {
    if (!indicator || !activeItem) return;

    const nav = activeItem.closest('.liquid-nav');
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    indicator.style.width = `${itemRect.width}px`;
    indicator.style.transform = `translateX(${itemRect.left - navRect.left}px)`;
  }

  function revealElements(root = document) {
    $$('.reveal', root).forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
      element.classList.add('revealed');
    });
  }

  function showView(target, updateHash = true) {
    const page = document.getElementById(target);
    if (!page) return;

    pages.forEach((item) => item.classList.toggle('active', item === page));
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.target === target));

    updateIndicator(navItems.find((item) => item.dataset.target === target));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHash) {
      history.replaceState(null, '', `#${target.replace('-view', '')}`);
    }

    revealElements(page);
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => showView(item.dataset.target));
  });

  $$('[data-go]').forEach((button) => {
    button.addEventListener('click', () => showView(button.dataset.go));
  });

  // ---------- Landing ----------
  enterButton?.addEventListener('click', async () => {
    try {
      await music?.play();
    } catch {
      // Browser autoplay restrictions are ignored.
    }

    landing?.classList.add('hide');

    window.setTimeout(() => {
      if (landing) landing.style.display = 'none';
      content?.classList.add('active');
      updateIndicator($('.nav-item.active'));
      revealElements($('.view-page.active'));
    }, 800);
  });

  // ---------- Music ----------
  let muted = false;

  musicButton?.addEventListener('click', () => {
    if (!music) return;

    muted = !muted;
    music.muted = muted;
    musicButton.textContent = muted ? '🔇' : '♪';
    musicButton.classList.toggle('muted', muted);
    musicButton.setAttribute('aria-label', muted ? 'Nyalakan musik' : 'Matikan musik');
  });

  // ---------- Photo tilt ----------
  $$('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg) rotate(2deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  // ---------- Album slider ----------
  const slider = $('#card-slider');
  const cards = $$('.memory-card', slider || document);
  const previousButton = $('#prev-card');
  const nextButton = $('#next-card');
  const counter = $('#slider-count');
  const progressBar = $('#slider-bar');

  let currentCard = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  function getCardStep() {
    if (!slider || !cards[0]) return 0;

    const styles = getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap || '0');
    return cards[0].getBoundingClientRect().width + gap;
  }

  function updateSlider() {
    if (!slider || !cards.length) return;

    const step = getCardStep();
    if (!step) return;

    currentCard = Math.round(slider.scrollLeft / step);
    currentCard = Math.max(0, Math.min(cards.length - 1, currentCard));

    if (counter) counter.textContent = String(currentCard + 1).padStart(2, '0');
    if (progressBar) progressBar.style.width = `${((currentCard + 1) / cards.length) * 100}%`;

    if (previousButton) previousButton.disabled = currentCard === 0;
    if (nextButton) nextButton.disabled = currentCard === cards.length - 1;
  }

  function moveSlider(direction) {
    if (!slider) return;

    slider.scrollBy({
      left: getCardStep() * direction,
      behavior: 'smooth'
    });
  }

  previousButton?.addEventListener('click', () => moveSlider(-1));
  nextButton?.addEventListener('click', () => moveSlider(1));
  slider?.addEventListener('scroll', updateSlider, { passive: true });

  slider?.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragging = true;
    dragStartX = event.clientX;
    dragStartScroll = slider.scrollLeft;
    slider.classList.add('dragging');
    slider.setPointerCapture?.(event.pointerId);
  });

  slider?.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    slider.scrollLeft = dragStartScroll - (event.clientX - dragStartX) * 1.15;
  });

  function stopDragging() {
    dragging = false;
    slider?.classList.remove('dragging');
  }

  slider?.addEventListener('pointerup', stopDragging);
  slider?.addEventListener('pointercancel', stopDragging);
  slider?.addEventListener('pointerleave', stopDragging);

  // ---------- Interactive particle background ----------
  const canvas = $('#space-canvas');
  const context = canvas?.getContext('2d');
  let particles = [];
  let animationFrame;

  function resizeCanvas() {
    if (!canvas || !context) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const amount = Math.min(110, Math.max(45, Math.floor(window.innerWidth / 14)));

    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.35,
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: Math.random() * 0.18 + 0.03,
      alpha: Math.random() * 0.45 + 0.1,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawParticles() {
    if (!canvas || !context) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y -= particle.speedY;
      particle.phase += 0.012;

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;

      const pulse = (Math.sin(particle.phase) + 1) * 0.12;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(120, 215, 255, ${particle.alpha + pulse})`;
      context.fill();
    });

    animationFrame = requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    updateIndicator($('.nav-item.active'));
    updateSlider();
  });

  resizeCanvas();
  drawParticles();

  // ---------- Initial state ----------
  const hash = window.location.hash.replace('#', '');
  const initialView = hash === 'album'
    ? 'album-view'
    : hash === 'story'
      ? 'story-view'
      : 'home-view';

  showView(initialView, false);
  updateSlider();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      animationFrame = requestAnimationFrame(drawParticles);
    }
  });
})();
