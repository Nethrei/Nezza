/*
 * NEZZA — Main interactions
 * Clean homepage controller + reliable procedural Three.js character.
 */

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
    const slider = $('#card-slider');
    const cards = $$('.memory-card', slider || document);

    /* ---------------------------------------------------------------
       Navigation
       --------------------------------------------------------------- */

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

        if (updateHash) {
            history.replaceState(null, '', `#${id.replace('-view', '')}`);
        }

        if (page) {
            $$('.reveal', page).forEach((element, index) => {
                element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
                element.classList.add('revealed');
            });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach((item) => {
        item.addEventListener('click', () => showView(item.dataset.target));
    });

    $$('[data-go]').forEach((button) => {
        button.addEventListener('click', () => showView(button.dataset.go));
    });

    /* ---------------------------------------------------------------
       Landing + music
       --------------------------------------------------------------- */

    enterButton?.addEventListener('click', async () => {
        try {
            await music?.play();
        } catch {
            // Audio requires a user gesture; the page still opens normally.
        }

        landing?.classList.add('hide');

        setTimeout(() => {
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

    /* ---------------------------------------------------------------
       Memory slider
       --------------------------------------------------------------- */

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

    previousButton?.addEventListener('click', () => {
        slider?.scrollBy({ left: -sliderStep(), behavior: 'smooth' });
    });

    nextButton?.addEventListener('click', () => {
        slider?.scrollBy({ left: sliderStep(), behavior: 'smooth' });
    });

    slider?.addEventListener('scroll', updateSlider, { passive: true });

    /* ---------------------------------------------------------------
       Animated background particles
       --------------------------------------------------------------- */

    const spaceCanvas = $('#space-canvas');
    const spaceContext = spaceCanvas?.getContext('2d');
    let particles = [];

    function resizeBackground() {
        if (!spaceCanvas || !spaceContext) return;

        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        spaceCanvas.width = window.innerWidth * ratio;
        spaceCanvas.height = window.innerHeight * ratio;
        spaceCanvas.style.width = `${window.innerWidth}px`;
        spaceCanvas.style.height = `${window.innerHeight}px`;
        spaceContext.setTransform(ratio, 0, 0, ratio, 0, 0);

        const amount = Math.min(100, Math.max(45, Math.floor(window.innerWidth / 15)));

        particles = Array.from({ length: amount }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.7 + .35,
            speedX: (Math.random() - .5) * .22,
            speedY: Math.random() * .20 + .03,
            alpha: Math.random() * .45 + .12,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function animateBackground() {
        if (!spaceContext) return;

        spaceContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

        particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y -= particle.speedY;
            particle.phase += .012;

            if (particle.x < -10) particle.x = window.innerWidth + 10;
            if (particle.x > window.innerWidth + 10) particle.x = -10;
            if (particle.y < -10) particle.y = window.innerHeight + 10;

            const alpha = particle.alpha + (Math.sin(particle.phase) + 1) * .12;
            spaceContext.beginPath();
            spaceContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            spaceContext.fillStyle = `rgba(190, 240, 255, ${alpha})`;
            spaceContext.fill();
        });

        requestAnimationFrame(animateBackground);
    }

    resizeBackground();
    animateBackground();

    /* ---------------------------------------------------------------
       Reliable Three.js loader
       --------------------------------------------------------------- */

    async function loadThree() {
        try {
            return await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js');
        } catch (firstError) {
            console.warn('jsDelivr Three.js failed, trying unpkg.', firstError);
            return await import('https://unpkg.com/three@0.186.0/build/three.module.js');
        }
    }

    /* ---------------------------------------------------------------
       Procedural 3D character
       --------------------------------------------------------------- */

    async function createDoraemon() {
        const stage = $('#dora-stage');
        if (!stage) return;

        try {
            const THREE = await loadThree();

            stage.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = 'dora-3d-wrap';
            stage.appendChild(wrapper);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
            camera.position.set(0, 1.0, 7.2);
            camera.lookAt(0, .8, 0);

            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
            });

            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.setClearColor(0, 0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.display = 'block';
            renderer.domElement.style.touchAction = 'none';
            wrapper.appendChild(renderer.domElement);

            scene.add(new THREE.HemisphereLight(0xdff7ff, 0x061630, 2.5));

            const key = new THREE.DirectionalLight(0xffffff, 4);
            key.position.set(-3, 5, 6);
            key.castShadow = true;
            scene.add(key);

            const blueFill = new THREE.PointLight(0x42baff, 2.5, 12);
            blueFill.position.set(3, 1.5, 4);
            scene.add(blueFill);

            const warmFill = new THREE.PointLight(0xffffff, 1.2, 8);
            warmFill.position.set(-2, 0, 3);
            scene.add(warmFill);

            const root = new THREE.Group();
            root.position.y = -.25;
            scene.add(root);

            const blue = new THREE.MeshStandardMaterial({ color: 0x0799ed, roughness: .32 });
            const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .26 });
            const dark = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: .22 });
            const red = new THREE.MeshStandardMaterial({ color: 0xe12645, roughness: .3 });
            const yellow = new THREE.MeshStandardMaterial({ color: 0xffd23f, roughness: .2, metalness: .08 });
            const blueDark = new THREE.MeshStandardMaterial({ color: 0x045a98, roughness: .34 });
            const sphere = new THREE.SphereGeometry(1, 48, 32);

            function mesh(geometry, material, position, scale, parent = root) {
                const item = new THREE.Mesh(geometry, material);
                item.position.set(...position);
                if (scale) item.scale.set(...scale);
                item.castShadow = true;
                item.receiveShadow = true;
                parent.add(item);
                return item;
            }

            /* Body */
            mesh(sphere, blue, [0, .1, 0], [1.02, 1.16, .82]);
            mesh(sphere, blueDark, [0, .1, -.35], [.78, .88, .38]);
            mesh(sphere, white, [0, .32, .72], [.63, .72, .18]);

            /* Head */
            mesh(sphere, blue, [0, 1.58, 0], [1.38, 1.38, 1.25]);
            mesh(sphere, white, [0, 1.45, 1.03], [1.05, .91, .34]);

            [-.34, .34].forEach((x) => {
                mesh(sphere, white, [x, 1.78, 1.38], [.28, .36, .19]);
                mesh(sphere, dark, [x, 1.78, 1.55], [.105, .15, .055]);
            });

            mesh(sphere, red, [0, 1.44, 1.55], [.145, .145, .125]);
            mesh(sphere, red, [0, 1.45, 1.66], [.045, .045, .035]);

            /* Face */
            function tube(points, material, radius) {
                const curve = new THREE.CatmullRomCurve3(points);
                const geometry = new THREE.TubeGeometry(curve, 24, radius, 8, false);
                const item = new THREE.Mesh(geometry, material);
                item.castShadow = true;
                return item;
            }

            root.add(tube([
                new THREE.Vector3(-.28, 1.22, 1.37),
                new THREE.Vector3(-.14, 1.12, 1.48),
                new THREE.Vector3(0, 1.09, 1.49),
                new THREE.Vector3(.14, 1.12, 1.48),
                new THREE.Vector3(.28, 1.22, 1.37),
            ], dark, .025));

            [-1, 1].forEach((side) => {
                [[1.48, 1.43], [1.57, 1.61], [1.38, 1.28]].forEach(([startY, endY]) => {
                    root.add(tube([
                        new THREE.Vector3(side * .56, startY, 1.27),
                        new THREE.Vector3(side * .83, (startY + endY) / 2, 1.27),
                        new THREE.Vector3(side * 1.1, endY, 1.23),
                    ], dark, .015));
                });
            });

            /* Collar and bell */
            const collar = mesh(new THREE.TorusGeometry(.86, .105, 18, 64), red, [0, .98, 0]);
            collar.rotation.x = Math.PI / 2;
            mesh(sphere, yellow, [0, .82, .87], [.21, .21, .15]);
            mesh(new THREE.CylinderGeometry(.025, .025, .14, 16), dark, [0, .74, 1.0]).rotation.z = Math.PI / 2;

            /* Pocket */
            const pocketShape = new THREE.Shape();
            pocketShape.moveTo(-.55, .28);
            pocketShape.lineTo(.55, .28);
            pocketShape.lineTo(.55, -.02);
            pocketShape.bezierCurveTo(.55, -.38, .28, -.58, 0, -.58);
            pocketShape.bezierCurveTo(-.28, -.58, -.55, -.38, -.55, -.02);
            pocketShape.closePath();

            const pocketGeometry = new THREE.ExtrudeGeometry(pocketShape, {
                depth: .18,
                bevelEnabled: true,
                bevelSegments: 3,
                bevelSize: .04,
                bevelThickness: .03,
                steps: 2,
            });
            pocketGeometry.center();
            const pocket = new THREE.Mesh(pocketGeometry, white);
            pocket.position.set(0, .36, .91);
            pocket.scale.set(.78, .7, 1);
            pocket.castShadow = true;
            root.add(pocket);

            /* Arms and feet */
            const leftArm = mesh(sphere, blue, [-1.02, .12, .02], [.4, .53, .4]);
            const rightArm = mesh(sphere, blue, [1.02, .12, .02], [.4, .53, .4]);
            leftArm.rotation.z = -.35;
            rightArm.rotation.z = .35;
            mesh(sphere, white, [-1.18, -.02, .38], [.28, .3, .28]);
            mesh(sphere, white, [1.18, -.02, .38], [.28, .3, .28]);
            mesh(sphere, blue, [-.48, -.82, .03], [.58, .38, .64]);
            mesh(sphere, blue, [.48, -.82, .03], [.58, .38, .64]);
            mesh(sphere, white, [-.55, -.91, .53], [.54, .27, .32]);
            mesh(sphere, white, [.55, -.91, .53], [.54, .27, .32]);

            /* Propeller — horizontal and centered */
            const propeller = new THREE.Group();
            propeller.position.set(0, 3.02, .02);
            root.add(propeller);

            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .42, 20), yellow);
            shaft.castShadow = true;
            propeller.add(shaft);

            const cap = new THREE.Mesh(new THREE.SphereGeometry(.12, 24, 16), yellow);
            cap.position.y = .22;
            propeller.add(cap);

            const blade = new THREE.CapsuleGeometry(.13, .66, 8, 16);
            [-.38, .38].forEach((x) => {
                const item = new THREE.Mesh(blade, yellow);
                item.rotation.z = Math.PI / 2;
                item.scale.set(.72, .22, .15);
                item.position.set(x, .26, 0);
                item.castShadow = true;
                propeller.add(item);
            });

            /* Soft ground shadow */
            const shadow = new THREE.Mesh(
                new THREE.CircleGeometry(1.2, 48),
                new THREE.MeshBasicMaterial({ color: 0x041b3c, transparent: true, opacity: .18, depthWrite: false }),
            );
            shadow.rotation.x = -Math.PI / 2;
            shadow.position.set(0, -1.2, .05);
            shadow.scale.set(1.45, .62, 1);
            scene.add(shadow);

            let targetX = 0;
            let targetY = 0;
            let currentX = 0;
            let currentY = 0;
            let bounce = 0;

            wrapper.addEventListener('pointermove', (event) => {
                const rect = wrapper.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
                const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
                targetY = Math.max(-1, Math.min(1, x)) * .2;
                targetX = Math.max(-1, Math.min(1, y)) * .1;
            });

            wrapper.addEventListener('pointerleave', () => {
                targetX = 0;
                targetY = 0;
            });

            wrapper.addEventListener('click', () => {
                bounce = 1;
                if ('speechSynthesis' in window) {
                    speechSynthesis.cancel();
                    const voice = new SpeechSynthesisUtterance('Wah! Hehehe! Ayo!');
                    voice.lang = 'id-ID';
                    voice.rate = .8;
                    voice.pitch = 1.55;
                    speechSynthesis.speak(voice);
                }
            });

            function resizeRenderer() {
                const rect = wrapper.getBoundingClientRect();
                const width = Math.max(1, rect.width);
                const height = Math.max(1, rect.height);
                renderer.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }

            resizeRenderer();
            window.addEventListener('resize', resizeRenderer);

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);
                const time = clock.getElapsedTime();

                propeller.rotation.y = time * 8;
                bounce += (0 - bounce) * .08;
                root.position.y = -.25 + Math.sin(time * 1.8) * .035 + bounce * .18;
                currentX += (targetX - currentX) * .06;
                currentY += (targetY - currentY) * .06;
                root.rotation.x = currentX;
                root.rotation.y = currentY;

                renderer.render(scene, camera);
            }

            animate();
        } catch (error) {
            console.error('Three.js failed:', error);
            stage.innerHTML = '<div style="display:grid;place-items:center;height:100%;color:rgba(255,255,255,.7);font-size:12px;letter-spacing:.12em">3D sedang dimuat…</div>';
        }
    }

    /* ---------------------------------------------------------------
       Initial state
       --------------------------------------------------------------- */

    const hash = location.hash.replace('#', '');
    showView(hash === 'album' ? 'album-view' : hash === 'story' ? 'story-view' : 'home-view', false);
    updateSlider();
    window.addEventListener('resize', () => {
        resizeBackground();
        moveIndicator($('.nav-item.active'));
        updateSlider();
    });

    createDoraemon();
})();
