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

  /* ---------- Liquid navigation ---------- */
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

  /* ---------- Landing ---------- */
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

  /* ---------- Music ---------- */
  let musicMuted = false;
  musicButton?.addEventListener('click', () => {
    if (!music) return;
    musicMuted = !musicMuted;
    music.muted = musicMuted;
    musicButton.textContent = musicMuted ? '🔇' : '♪';
    musicButton.classList.toggle('muted', musicMuted);
    musicButton.setAttribute('aria-label', musicMuted ? 'Nyalakan musik' : 'Matikan musik');
  });

  /* ---------- Photo tilt ---------- */
  $$('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg) rotate(2deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  /* ---------- Album slider ---------- */
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
    currentCard = Math.max(0, Math.min(cards.length - 1, Math.round(slider.scrollLeft / step)));
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

  /* ---------- Reveal animation ---------- */
  function revealVisibleElements(root = document) {
    $$('.reveal', root).forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
      element.classList.add('revealed');
    });
  }

  /* ---------- Interactive space background ---------- */
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

  /* ---------- 3D Sonic hero ---------- */
  function initSonic3D() {
    const heroGrid = $('.hero-grid');
    const heroCopy = $('.hero-copy', heroGrid || document);
    if (!heroGrid || !heroCopy || document.getElementById('sonic-3d-stage')) return;

    const stage = document.createElement('div');
    stage.id = 'sonic-3d-stage';
    stage.className = 'sonic-3d-stage reveal';
    stage.innerHTML = `
      <div class="sonic-3d-glow"></div>
      <canvas id="sonic-3d-canvas" aria-label="Sonic 3D interaktif"></canvas>
      <div class="sonic-speed-ring"></div>
      <div class="sonic-3d-hint">MOVE YOUR CURSOR · CLICK SONIC</div>
    `;
    heroGrid.insertBefore(stage, heroCopy);

    const style = document.createElement('style');
    style.textContent = `
      .hero-grid{grid-template-columns:minmax(230px,.72fr) minmax(0,1.08fr) minmax(220px,.62fr)!important;align-items:center!important}
      .sonic-3d-stage{position:relative;width:100%;height:390px;min-width:0;display:flex;align-items:center;justify-content:center;overflow:visible;cursor:pointer;filter:drop-shadow(0 22px 35px rgba(0,65,150,.24))}
      #sonic-3d-canvas{width:100%;height:100%;display:block;touch-action:none}
      .sonic-3d-glow{position:absolute;width:210px;height:210px;border-radius:50%;background:radial-gradient(circle,rgba(34,151,255,.42),rgba(34,151,255,.12) 45%,transparent 72%);filter:blur(12px);pointer-events:none;animation:sonicGlow 3s ease-in-out infinite}
      .sonic-speed-ring{position:absolute;width:210px;height:70px;border:1px solid rgba(93,201,255,.34);border-radius:50%;bottom:38px;transform:rotate(-7deg);box-shadow:0 0 30px rgba(31,144,255,.16);pointer-events:none;animation:sonicRing 2.2s ease-in-out infinite}
      .sonic-3d-hint{position:absolute;bottom:5px;left:50%;transform:translateX(-50%);font-size:7px;letter-spacing:.17em;font-weight:800;color:rgba(255,255,255,.58);white-space:nowrap;pointer-events:none}
      @keyframes sonicGlow{0%,100%{transform:scale(.94);opacity:.7}50%{transform:scale(1.08);opacity:1}}
      @keyframes sonicRing{0%,100%{transform:translateY(3px) rotate(-7deg);opacity:.35}50%{transform:translateY(-4px) rotate(-7deg);opacity:.8}}
      .sonic-3d-stage.sonic-active .sonic-speed-ring{animation:sonicRingFast .45s ease-in-out infinite}
      @keyframes sonicRingFast{50%{transform:translateY(-7px) rotate(-7deg) scale(1.12);opacity:1}}
      @media(max-width:1100px){.hero-grid{grid-template-columns:minmax(190px,.58fr) minmax(0,1fr)!important}.sonic-3d-stage{grid-row:1 / span 2;height:360px}.hero-visual{grid-column:2}.hero-copy{grid-column:2}}
      @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.sonic-3d-stage,.hero-copy,.hero-visual{grid-column:auto}.sonic-3d-stage{grid-row:auto;height:300px;order:1}.hero-copy{order:2}.hero-visual{order:3}}
      @media(max-width:600px){.sonic-3d-stage{height:250px;margin-top:-8px}.sonic-3d-hint{font-size:6px}.sonic-speed-ring{width:170px;height:56px;bottom:24px}}
    `;
    document.head.appendChild(style);

    const canvas3d = $('#sonic-3d-canvas');
    if (!canvas3d) return;

    const load = () => {
      if (!window.THREE || !window.THREE.GLTFLoader) return;
      const THREE = window.THREE;
      const renderer = new THREE.WebGLRenderer({canvas: canvas3d, alpha: true, antialias: true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(canvas3d.clientWidth, canvas3d.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, canvas3d.clientWidth / canvas3d.clientHeight, .1, 100);
      camera.position.set(0, 1.35, 5.2);

      scene.add(new THREE.HemisphereLight(0x8fd7ff, 0x06152e, 2.4));
      const key = new THREE.DirectionalLight(0xffffff, 3.2);
      key.position.set(2.5, 4.5, 4);
      key.castShadow = true;
      scene.add(key);
      const rim = new THREE.PointLight(0x249cff, 7, 8);
      rim.position.set(-2, 1.4, 2);
      scene.add(rim);

      const loader = new window.THREE.GLTFLoader();
      let model = null;
      let mixer = null;
      let activeAction = null;
      let pointerX = 0;
      let pointerY = 0;
      let targetX = 0;
      let targetY = 0;
      let clicked = false;
      let clickTimer = 0;
      const clock = new THREE.Clock();

      loader.load('https://raw.githubusercontent.com/baronwatts/models/master/sonic.glb', (gltf) => {
        model = gltf.scene;
        model.scale.setScalar(1.22);
        model.position.set(0, -.95, 0);
        model.rotation.y = Math.PI;
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) node.material.roughness = Math.min(node.material.roughness ?? .7, .72);
          }
        });
        scene.add(model);
        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(model);
          activeAction = mixer.clipAction(gltf.animations[0]);
          activeAction.play();
        }
      }, undefined, (error) => console.warn('Sonic 3D gagal dimuat:', error));

      function resize3D() {
        const w = canvas3d.clientWidth || 1;
        const h = canvas3d.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }

      function animate() {
        requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), .04);
        if (mixer) mixer.update(dt);
        pointerX += (targetX - pointerX) * .055;
        pointerY += (targetY - pointerY) * .055;
        if (model) {
          model.rotation.y = Math.PI + pointerX * .42;
          model.rotation.x = pointerY * .12;
          const bob = Math.sin(performance.now() * .0022) * .035;
          model.position.y = -.95 + bob + (clicked ? Math.sin(performance.now() * .012) * .07 : 0);
          model.position.x = pointerX * .08;
        }
        if (clicked && performance.now() - clickTimer > 800) {
          clicked = false;
          stage.classList.remove('sonic-active');
        }
        renderer.render(scene, camera);
      }

      stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        targetX = ((event.clientX - rect.left) / rect.width - .5) * 2;
        targetY = ((event.clientY - rect.top) / rect.height - .5) * -2;
      });
      stage.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
      stage.addEventListener('click', () => {
        clicked = true;
        clickTimer = performance.now();
        stage.classList.add('sonic-active');
        if (activeAction && mixer) activeAction.reset().play();
      });
      window.addEventListener('resize', resize3D);
      resize3D();
      animate();
    };

    if (!window.THREE) {
      const three = document.createElement('script');
      three.src = 'https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.min.js';
      three.onload = () => {
        const loaderScript = document.createElement('script');
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.182.0/examples/js/loaders/GLTFLoader.js';
        loaderScript.onload = load;
        document.head.appendChild(loaderScript);
      };
      document.head.appendChild(three);
    } else load();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    updateIndicator($('.nav-item.active'));
    updateSliderState();
  });

  resizeCanvas();
  drawSpace();
  initSonic3D();

  /* ---------- Initial state ---------- */
  const hash = window.location.hash.replace('#', '');
  const initialTarget = hash === 'album' ? 'album-view' : hash === 'story' ? 'story-view' : 'home-view';
  showView(initialTarget, false);
  updateSliderState();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationFrame);
    else animationFrame = requestAnimationFrame(drawSpace);
  });
})();
