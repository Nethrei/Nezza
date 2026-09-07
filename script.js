/* =========================================================
   NEZZA — INTERACTIONS
   Vanilla JavaScript, no dependencies.
   ========================================================= */

(() => {
  'use strict';

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

  function updateIndicator(activeItem) {
    if (!indicator || !activeItem) return;
    const nav = activeItem.closest('.liquid-nav');
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const indicatorSize = window.innerWidth <= 480 ? 52 : 56;
    const center = itemRect.left - navRect.left + itemRect.width / 2;
    indicator.style.width = `${indicatorSize}px`;
    indicator.style.height = `${indicatorSize}px`;
    indicator.style.transform = `translateX(${center - indicatorSize / 2}px)`;
  }

  function showView(target, updateHash = true) {
    const targetPage = document.getElementById(target);
    if (!targetPage) return;
    pages.forEach((page) => page.classList.toggle('active', page === targetPage));
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.target === target));
    updateIndicator(navItems.find((item) => item.dataset.target === target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (updateHash) history.replaceState(null, '', `#${target.replace('-view', '')}`);
    revealVisibleElements(targetPage);
  }

  navItems.forEach((item) => item.addEventListener('click', () => showView(item.dataset.target)));
  $$('[data-go]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.go)));

  enterButton?.addEventListener('click', async () => {
    try { await music?.play(); } catch {}
    landing?.classList.add('hide');
    window.setTimeout(() => {
      if (landing) landing.style.display = 'none';
      content?.classList.add('active');
      updateIndicator($('.nav-item.active'));
      revealVisibleElements($('.view-page.active'));
    }, 800);
  });

  let musicMuted = false;
  musicButton?.addEventListener('click', () => {
    if (!music) return;
    musicMuted = !musicMuted;
    music.muted = musicMuted;
    musicButton.textContent = musicMuted ? '🔇' : '♪';
    musicButton.classList.toggle('muted', musicMuted);
    musicButton.setAttribute('aria-label', musicMuted ? 'Nyalakan musik' : 'Matikan musik');
  });

  $$('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg) rotate(2deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  const slider = $('#card-slider');
  const cards = $$('.memory-card', slider || document);
  const previousButton = $('#prev-card');
  const nextButton = $('#next-card');
  const counter = $('#slider-count');
  const progressBar = $('#slider-bar');
  let currentCard = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  function getCardStep() {
    const card = cards[0];
    if (!card || !slider) return 0;
    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap || '0');
    return card.getBoundingClientRect().width + gap;
  }

  function updateSliderState() {
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
    slider.scrollBy({ left: getCardStep() * direction, behavior: 'smooth' });
  }
  previousButton?.addEventListener('click', () => moveSlider(-1));
  nextButton?.addEventListener('click', () => moveSlider(1));
  slider?.addEventListener('scroll', updateSliderState, { passive: true });
  slider?.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    isDragging = true;
    dragStartX = event.clientX;
    dragStartScroll = slider.scrollLeft;
    slider.classList.add('dragging');
    slider.setPointerCapture?.(event.pointerId);
  });
  slider?.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    slider.scrollLeft = dragStartScroll - (event.clientX - dragStartX) * 1.15;
  });
  function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    slider?.classList.remove('dragging');
  }
  slider?.addEventListener('pointerup', stopDragging);
  slider?.addEventListener('pointercancel', stopDragging);
  slider?.addEventListener('pointerleave', stopDragging);

  function revealVisibleElements(root = document) {
    $$('.reveal', root).forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
      element.classList.add('revealed');
    });
  }

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

  function drawSpace() {
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
    animationFrame = requestAnimationFrame(drawSpace);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    updateIndicator($('.nav-item.active'));
    updateSliderState();
  });

  resizeCanvas();
  drawSpace();

  const hash = window.location.hash.replace('#', '');
  const initialTarget = hash === 'album' ? 'album-view' : hash === 'story' ? 'story-view' : 'home-view';
  showView(initialTarget, false);
  updateSliderState();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationFrame);
    else animationFrame = requestAnimationFrame(drawSpace);
  });
})();

/* ---------- Doraemon interaction: animated, reactive and able to speak ---------- */
(() => {
  const stage = document.getElementById('dora-stage');
  const dora = document.getElementById('doraemon');
  const bubble = document.getElementById('dora-bubble');
  if (!stage || !dora) return;

  const lines = [
    'Halo Nezuro! 👋 Selamat datang di cerita kecil ini!',
    'Dorayaki time! 💙 Jangan lupa bahagia hari ini ya!',
    'Aku Doraemon! Siap menemani kamu menjelajah.',
    'Pintu ke mana saja siap! 🚪 Kita mulai petualangan!',
    'Ada yang butuh bantuan? ✨ Klik aku lagi!',
    'Wah, kenangan ini bagus banget! ✦',
    'Ayo simpan momen-momen terbaik di sini! 💙'
  ];
  let timer;
  let speechTimer;

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.02;
    utterance.pitch = 1.25;
    utterance.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => /id-ID|indonesian/i.test(`${v.lang} ${v.name}`));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  function react() {
    const text = lines[Math.floor(Math.random() * lines.length)];
    stage.classList.remove('talk', 'running', 'bounce', 'spin-gadget');
    void stage.offsetWidth;
    stage.classList.add('talk', 'running', 'bounce', 'spin-gadget');
    if (bubble) bubble.textContent = text;
    speak(text);
    clearTimeout(timer);
    clearTimeout(speechTimer);
    timer = setTimeout(() => stage.classList.remove('running', 'bounce', 'spin-gadget'), 2200);
    speechTimer = setTimeout(() => stage.classList.remove('talk'), 5000);
  }

  dora.addEventListener('click', react);
  dora.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      react();
    }
  });

  document.addEventListener('mousemove', event => {
    if (stage.classList.contains('running')) return;
    const r = dora.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const x = Math.max(-9, Math.min(9, (event.clientX - cx) * 0.035));
    const y = Math.max(-6, Math.min(6, (event.clientY - cy) * 0.02));
    dora.style.transform = `translateX(-50%) translateY(${y}px) rotateY(${x}deg)`;
  });

  window.speechSynthesis?.addEventListener?.('voiceschanged', () => {});
})();
