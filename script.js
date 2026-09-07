/*
 * NEZZA — Interactions + Procedural Three.js Doraemon
 * ---------------------------------------------------
 * Main website interactions, background particles, memory slider,
 * music controls, navigation, and the interactive 3D Doraemon.
 */

(() => {
    'use strict';

    /* ================================================================
       DOM HELPERS & COMMON ELEMENTS
       ================================================================ */

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [
        ...parent.querySelectorAll(selector),
    ];

    const landing = $('#landing-page');
    const content = $('#content-area');
    const enterButton = $('#enter-btn');
    const music = $('#bg-music');
    const musicButton = $('#music-toggle-btn');

    const pages = $$('.view-page');
    const navItems = $$('.nav-item');
    const indicator = $('#liquid-indicator');
    const sidebar = $('#liquid-sidebar');
    const sidebarToggle = $('#sidebar-toggle');

    /* ================================================================
       SMALL STYLE OVERRIDES
       ================================================================ */

    const styleOverride = document.createElement('style');

    styleOverride.textContent = `
        .main-photo-card {
            display: none !important;
        }

        .dora-stage {
            overflow: visible !important;
            position: relative !important;
            display: block !important;
            perspective: 1000px !important;
            transform-style: preserve-3d !important;
        }

        .dora-3d-wrap {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: visible !important;
        }

        .dora-3d-wrap canvas {
            touch-action: none !important;
        }

        .dora-stage .dora-bubble {
            z-index: 30 !important;
        }
    `;

    document.head.appendChild(styleOverride);

    /* ================================================================
       LIQUID NAVIGATION
       ================================================================ */

    function moveIndicator(item) {
        if (!indicator || !item) return;

        const nav = item.closest('.liquid-nav');
        const navRect = nav?.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (!navRect) return;

        const size = window.innerWidth <= 480 ? 52 : 56;
        const left =
            itemRect.left - navRect.left + itemRect.width / 2 - size / 2;

        indicator.style.width = `${size}px`;
        indicator.style.height = `${size}px`;
        indicator.style.transform = `translateX(${left}px)`;
    }

    function showView(id, updateHash = true) {
        const page = document.getElementById(id);

        if (!page) return;

        pages.forEach((item) => {
            item.classList.toggle('active', item === page);
        });

        navItems.forEach((item) => {
            item.classList.toggle('active', item.dataset.target === id);
        });

        $$('.sidebar-link').forEach((item) => {
            item.classList.toggle('active', item.dataset.target === id);
        });

        moveIndicator(navItems.find((item) => item.dataset.target === id));

        if (updateHash) {
            history.replaceState(
                null,
                '',
                `#${id.replace('-view', '')}`,
            );
        }

        $$('.reveal', page).forEach((element, index) => {
            element.style.setProperty(
                '--reveal-delay',
                `${Math.min(index * 70, 350)}ms`,
            );
            element.classList.add('revealed');
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        sidebar?.classList.remove('open');
        sidebarToggle?.classList.remove('active');
    }

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            showView(item.dataset.target);
        });
    });

    $$('[data-go]').forEach((button) => {
        button.addEventListener('click', () => {
            showView(button.dataset.go);
        });
    });

    $$('.sidebar-link[data-target]').forEach((item) => {
        item.addEventListener('click', () => {
            showView(item.dataset.target);
        });
    });

    sidebarToggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        sidebarToggle?.classList.toggle('active');
    });

    /* ================================================================
       MUSIC CONTROLS
       ================================================================ */

    $('#sidebar-music')?.addEventListener('click', () => {
        if (!music) return;

        music.paused ? music.play() : music.pause();
    });

    enterButton?.addEventListener('click', async () => {
        try {
            await music?.play();
        } catch {
            // Browser autoplay restrictions are ignored intentionally.
        }

        landing?.classList.add('hide');

        setTimeout(() => {
            if (landing) {
                landing.style.display = 'none';
            }

            content?.classList.add('active');
            moveIndicator($('.nav-item.active'));
        }, 800);
    });

    musicButton?.addEventListener('click', () => {
        if (!music) return;

        music.muted = !music.muted;
        musicButton.textContent = music.muted ? '🔇' : '♪';
    });

    /* ================================================================
       MEMORY SLIDER
       ================================================================ */

    const slider = $('#card-slider');
    const cards = $$('.memory-card', slider || document);
    const previousButton = $('#prev-card');
    const nextButton = $('#next-card');
    const sliderCount = $('#slider-count');
    const sliderBar = $('#slider-bar');

    function getSliderStep() {
        const firstCard = cards[0];

        if (!firstCard) return 0;

        const gap = parseFloat(getComputedStyle(slider).gap) || 0;
        return firstCard.getBoundingClientRect().width + gap;
    }

    function updateSliderState() {
        if (!slider || !cards.length) return;

        const step = getSliderStep();
        const index = Math.max(
            0,
            Math.min(
                cards.length - 1,
                Math.round(slider.scrollLeft / step),
            ),
        );

        if (sliderCount) {
            sliderCount.textContent = String(index + 1).padStart(2, '0');
        }

        if (sliderBar) {
            sliderBar.style.width = `${((index + 1) / cards.length) * 100}%`;
        }

        if (previousButton) {
            previousButton.disabled = index === 0;
        }

        if (nextButton) {
            nextButton.disabled = index === cards.length - 1;
        }
    }

    previousButton?.addEventListener('click', () => {
        slider?.scrollBy({
            left: -getSliderStep(),
            behavior: 'smooth',
        });
    });

    nextButton?.addEventListener('click', () => {
        slider?.scrollBy({
            left: getSliderStep(),
            behavior: 'smooth',
        });
    });

    slider?.addEventListener('scroll', updateSliderState, {
        passive: true,
    });

    /* ================================================================
       BACKGROUND STAR PARTICLES
       ================================================================ */

    const spaceCanvas = $('#space-canvas');
    const spaceContext = spaceCanvas?.getContext('2d');

    let particles = [];
    let particleAnimationFrame;

    function resizeStars() {
        if (!spaceCanvas || !spaceContext) return;

        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        spaceCanvas.width = window.innerWidth * ratio;
        spaceCanvas.height = window.innerHeight * ratio;
        spaceCanvas.style.width = `${window.innerWidth}px`;
        spaceCanvas.style.height = `${window.innerHeight}px`;

        spaceContext.setTransform(ratio, 0, 0, ratio, 0, 0);

        const amount = Math.min(
            110,
            Math.max(45, Math.floor(window.innerWidth / 14)),
        );

        particles = Array.from({ length: amount }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.5 + 0.35,
            speedX: (Math.random() - 0.5) * 0.18,
            speedY: Math.random() * 0.18 + 0.03,
            alpha: Math.random() * 0.45 + 0.1,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function animateStars() {
        if (!spaceContext) return;

        spaceContext.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight,
        );

        particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y -= particle.speedY;
            particle.phase += 0.012;

            if (particle.x < -10) particle.x = window.innerWidth + 10;
            if (particle.x > window.innerWidth + 10) particle.x = -10;
            if (particle.y < -10) particle.y = window.innerHeight + 10;

            spaceContext.beginPath();
            spaceContext.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2,
            );

            const alpha =
                particle.alpha +
                (Math.sin(particle.phase) + 1) * 0.12;

            spaceContext.fillStyle = `rgba(120, 215, 255, ${alpha})`;
            spaceContext.fill();
        });

        particleAnimationFrame = requestAnimationFrame(animateStars);
    }

    resizeStars();
    animateStars();

    window.addEventListener('resize', () => {
        resizeStars();
        moveIndicator($('.nav-item.active'));
        updateSliderState();
    });

    const currentHash = location.hash.replace('#', '');

    showView(
        currentHash === 'album'
            ? 'album-view'
            : currentHash === 'story'
                ? 'story-view'
                : 'home-view',
        false,
    );

    updateSliderState();

    /* ================================================================
       PROCEDURAL THREE.JS DORAEMON
       ================================================================ */

    (async () => {
        const stage = $('#dora-stage');

        if (!stage) return;

        try {
            const THREE = await import(
                'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js'
            );

            stage.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = 'dora-3d-wrap';
            stage.appendChild(wrapper);

            /* --------------------------------------------------------
               Scene, camera & renderer
               -------------------------------------------------------- */

            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(
                27,
                1,
                0.1,
                100,
            );

            camera.position.set(0, 1.05, 7.6);
            camera.lookAt(0, 0.82, 0);

            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
            });

            renderer.setPixelRatio(
                Math.min(window.devicePixelRatio || 1, 2),
            );
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setClearColor(0, 0);

            Object.assign(renderer.domElement.style, {
                width: '100%',
                height: '100%',
                display: 'block',
            });

            wrapper.appendChild(renderer.domElement);

            /* --------------------------------------------------------
               Lighting
               -------------------------------------------------------- */

            scene.add(
                new THREE.HemisphereLight(
                    0xb9e9ff,
                    0x08162d,
                    2.2,
                ),
            );

            const keyLight = new THREE.DirectionalLight(
                0xffffff,
                3.6,
            );

            keyLight.position.set(-3.5, 5.5, 5.5);
            keyLight.castShadow = true;
            scene.add(keyLight);

            const fillLight = new THREE.PointLight(
                0x55b9ff,
                2.3,
                12,
            );

            fillLight.position.set(3, 1.5, 4);
            scene.add(fillLight);

            const warmLight = new THREE.PointLight(
                0xffe2a2,
                1.1,
                8,
            );

            warmLight.position.set(-2, -0.5, 3);
            scene.add(warmLight);

            /* --------------------------------------------------------
               Materials & reusable geometry
               -------------------------------------------------------- */

            const root = new THREE.Group();
            root.position.y = -0.25;
            scene.add(root);

            const blueMaterial = new THREE.MeshStandardMaterial({
                color: 0x0798ed,
                roughness: 0.3,
                metalness: 0.02,
            });

            const blueDarkMaterial = new THREE.MeshStandardMaterial({
                color: 0x045b9b,
                roughness: 0.34,
            });

            const whiteMaterial = new THREE.MeshStandardMaterial({
                color: 0xf7fafc,
                roughness: 0.28,
            });

            const darkMaterial = new THREE.MeshStandardMaterial({
                color: 0x0b1420,
                roughness: 0.2,
            });

            const redMaterial = new THREE.MeshStandardMaterial({
                color: 0xd61f3b,
                roughness: 0.3,
            });

            const yellowMaterial = new THREE.MeshStandardMaterial({
                color: 0xffca28,
                roughness: 0.22,
                metalness: 0.15,
            });

            const blackMaterial = new THREE.MeshStandardMaterial({
                color: 0x15191e,
                roughness: 0.25,
            });

            const sphereGeometry = new THREE.SphereGeometry(
                1,
                56,
                40,
            );

            function addMesh(
                geometry,
                material,
                position,
                scale,
                parent = root,
            ) {
                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.set(...position);

                if (scale) {
                    mesh.scale.set(...scale);
                }

                mesh.castShadow = true;
                mesh.receiveShadow = true;
                parent.add(mesh);

                return mesh;
            }

            /* --------------------------------------------------------
               Body
               -------------------------------------------------------- */

            addMesh(
                sphereGeometry,
                blueMaterial,
                [0, 0.15, 0],
                [1.03, 1.18, 0.84],
            );

            addMesh(
                sphereGeometry,
                blueDarkMaterial,
                [0, 0.10, -0.34],
                [0.78, 0.92, 0.42],
            );

            addMesh(
                sphereGeometry,
                whiteMaterial,
                [0, 0.34, 0.72],
                [0.64, 0.74, 0.20],
            );

            /* --------------------------------------------------------
               Head & face
               -------------------------------------------------------- */

            addMesh(
                sphereGeometry,
                blueMaterial,
                [0, 1.62, 0],
                [1.39, 1.39, 1.27],
            );

            addMesh(
                sphereGeometry,
                blueDarkMaterial,
                [0, 1.57, -0.28],
                [1.27, 1.29, 0.95],
            );

            addMesh(
                sphereGeometry,
                whiteMaterial,
                [0, 1.48, 1.04],
                [1.04, 0.90, 0.34],
            );

            [-0.34, 0.34].forEach((x) => {
                addMesh(
                    sphereGeometry,
                    whiteMaterial,
                    [x, 1.80, 1.38],
                    [0.275, 0.365, 0.19],
                );

                addMesh(
                    sphereGeometry,
                    darkMaterial,
                    [x, 1.80, 1.555],
                    [0.105, 0.15, 0.055],
                );
            });

            addMesh(
                sphereGeometry,
                redMaterial,
                [0, 1.45, 1.535],
                [0.145, 0.145, 0.125],
            );

            addMesh(
                sphereGeometry,
                redMaterial,
                [0, 1.455, 1.64],
                [0.048, 0.048, 0.035],
            );

            /* --------------------------------------------------------
               Mouth & whiskers
               -------------------------------------------------------- */

            function createCurve(points, material, radius) {
                const curve = new THREE.CatmullRomCurve3(points);
                const geometry = new THREE.TubeGeometry(
                    curve,
                    28,
                    radius,
                    10,
                    false,
                );

                return new THREE.Mesh(geometry, material);
            }

            const mouth = createCurve(
                [
                    new THREE.Vector3(-0.29, 1.23, 1.37),
                    new THREE.Vector3(-0.16, 1.12, 1.47),
                    new THREE.Vector3(0, 1.09, 1.49),
                    new THREE.Vector3(0.16, 1.12, 1.47),
                    new THREE.Vector3(0.29, 1.23, 1.37),
                ],
                darkMaterial,
                0.026,
            );

            mouth.castShadow = true;
            root.add(mouth);

            [-1, 1].forEach((side) => {
                [
                    { y: 1.48, endX: 1.10, endY: 1.43 },
                    { y: 1.57, endX: 1.11, endY: 1.61 },
                    { y: 1.38, endX: 1.09, endY: 1.28 },
                ].forEach((line) => {
                    const whisker = createCurve(
                        [
                            new THREE.Vector3(
                                side * 0.57,
                                line.y,
                                1.28,
                            ),
                            new THREE.Vector3(
                                side * 0.84,
                                (line.y + line.endY) / 2,
                                1.28,
                            ),
                            new THREE.Vector3(
                                side * line.endX,
                                line.endY,
                                1.24,
                            ),
                        ],
                        darkMaterial,
                        0.016,
                    );

                    root.add(whisker);
                });
            });

            /* --------------------------------------------------------
               Collar & bell
               -------------------------------------------------------- */

            const collar = addMesh(
                new THREE.TorusGeometry(0.86, 0.105, 20, 72),
                redMaterial,
                [0, 1.00, 0],
            );

            collar.rotation.x = Math.PI / 2;

            addMesh(
                sphereGeometry,
                yellowMaterial,
                [0, 0.84, 0.86],
                [0.205, 0.205, 0.15],
            );

            const bellHole = addMesh(
                new THREE.CylinderGeometry(0.026, 0.026, 0.15, 16),
                blackMaterial,
                [0, 0.74, 1.00],
            );

            bellHole.rotation.z = Math.PI / 2;

            /* --------------------------------------------------------
               3D pocket
               -------------------------------------------------------- */

            const pocketShape = new THREE.Shape();

            pocketShape.moveTo(-0.55, 0.28);
            pocketShape.lineTo(0.55, 0.28);
            pocketShape.lineTo(0.55, -0.04);
            pocketShape.bezierCurveTo(
                0.55,
                -0.40,
                0.28,
                -0.58,
                0,
                -0.58,
            );
            pocketShape.bezierCurveTo(
                -0.28,
                -0.58,
                -0.55,
                -0.40,
                -0.55,
                -0.04,
            );
            pocketShape.closePath();

            const pocketGeometry = new THREE.ExtrudeGeometry(
                pocketShape,
                {
                    depth: 0.18,
                    bevelEnabled: true,
                    bevelSegments: 3,
                    steps: 2,
                    bevelSize: 0.045,
                    bevelThickness: 0.035,
                },
            );

            pocketGeometry.center();

            const pocket = new THREE.Mesh(
                pocketGeometry,
                whiteMaterial,
            );

            pocket.position.set(0, 0.38, 0.91);
            pocket.scale.set(0.78, 0.70, 1);
            pocket.castShadow = true;
            pocket.receiveShadow = true;
            root.add(pocket);

            /* --------------------------------------------------------
               Arms & feet
               -------------------------------------------------------- */

            const leftArm = addMesh(
                sphereGeometry,
                blueMaterial,
                [-1.03, 0.15, 0.02],
                [0.40, 0.54, 0.42],
            );

            leftArm.rotation.z = -0.35;

            const rightArm = addMesh(
                sphereGeometry,
                blueMaterial,
                [1.03, 0.15, 0.02],
                [0.40, 0.54, 0.42],
            );

            rightArm.rotation.z = 0.35;

            addMesh(
                sphereGeometry,
                whiteMaterial,
                [-1.18, -0.02, 0.37],
                [0.28, 0.30, 0.28],
            );

            addMesh(
                sphereGeometry,
                whiteMaterial,
                [1.18, -0.02, 0.37],
                [0.28, 0.30, 0.28],
            );

            addMesh(
                sphereGeometry,
                blueMaterial,
                [-0.48, -0.83, 0.03],
                [0.58, 0.38, 0.65],
            );

            addMesh(
                sphereGeometry,
                blueMaterial,
                [0.48, -0.83, 0.03],
                [0.58, 0.38, 0.65],
            );

            addMesh(
                sphereGeometry,
                whiteMaterial,
                [-0.55, -0.92, 0.54],
                [0.54, 0.27, 0.32],
            );

            addMesh(
                sphereGeometry,
                whiteMaterial,
                [0.55, -0.92, 0.54],
                [0.54, 0.27, 0.32],
            );

            /* --------------------------------------------------------
               Propeller
               -------------------------------------------------------- */

            const propeller = new THREE.Group();
            propeller.position.set(0, 3.05, 0.02);
            root.add(propeller);

            const propellerShaft = new THREE.Mesh(
                new THREE.CylinderGeometry(0.075, 0.075, 0.42, 24),
                yellowMaterial,
            );

            propellerShaft.castShadow = true;
            propeller.add(propellerShaft);

            const propellerCap = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 28, 18),
                yellowMaterial,
            );

            propellerCap.position.y = 0.22;
            propellerCap.castShadow = true;
            propeller.add(propellerCap);

            const bladeGeometry = new THREE.CapsuleGeometry(
                0.14,
                0.66,
                10,
                20,
            );

            const leftBlade = new THREE.Mesh(
                bladeGeometry,
                yellowMaterial,
            );

            leftBlade.rotation.z = Math.PI / 2;
            leftBlade.scale.set(0.72, 0.23, 0.16);
            leftBlade.position.set(-0.38, 0.26, 0);
            leftBlade.castShadow = true;
            propeller.add(leftBlade);

            const rightBlade = new THREE.Mesh(
                bladeGeometry,
                yellowMaterial,
            );

            rightBlade.rotation.z = Math.PI / 2;
            rightBlade.scale.set(0.72, 0.23, 0.16);
            rightBlade.position.set(0.38, 0.26, 0);
            rightBlade.castShadow = true;
            propeller.add(rightBlade);

            /* --------------------------------------------------------
               Ground shadow
               -------------------------------------------------------- */

            const shadowMaterial = new THREE.MeshBasicMaterial({
                color: 0x0a1d35,
                transparent: true,
                opacity: 0.16,
                depthWrite: false,
            });

            const ground = new THREE.Mesh(
                new THREE.CircleGeometry(1.18, 48),
                shadowMaterial,
            );

            ground.rotation.x = -Math.PI / 2;
            ground.position.set(0, -1.22, 0.05);
            ground.scale.set(1.45, 0.62, 1);
            scene.add(ground);

            /* --------------------------------------------------------
               Interaction & voice
               -------------------------------------------------------- */

            let targetX = 0;
            let targetY = 0;
            let rotationX = 0;
            let rotationY = 0;
            let bounce = 0;
            let clickSpin = 0;

            const bubble = $('#dora-bubble');

            const sounds = [
                'Wah!',
                'Hehehe!',
                'Waaah!',
                'Ayo!',
                'Asyik!',
                'Hore!',
            ];

            function getIndonesianVoice() {
                if (!('speechSynthesis' in window)) return null;

                const voices = speechSynthesis.getVoices();

                return (
                    voices.find((voice) =>
                        /^id(-|_)/i.test(voice.lang),
                    ) ||
                    voices.find((voice) =>
                        /indonesian|bahasa/i.test(voice.name),
                    ) ||
                    null
                );
            }

            function speak(text) {
                if (!('speechSynthesis' in window)) return;

                speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                const voice = getIndonesianVoice();

                if (voice) {
                    utterance.voice = voice;
                }

                utterance.lang = voice?.lang || 'id-ID';
                utterance.rate = 0.78;
                utterance.pitch = 1.65;
                utterance.volume = 1;

                speechSynthesis.speak(utterance);
            }

            function react() {
                const text =
                    sounds[Math.floor(Math.random() * sounds.length)];

                if (bubble) {
                    bubble.textContent = '✦';
                }

                bounce = 1;
                clickSpin = 1;
                speak(text);

                setTimeout(() => {
                    if (bubble) {
                        bubble.textContent = '✦';
                    }
                }, 450);
            }

            wrapper.addEventListener(
                'pointermove',
                (event) => {
                    const rect = wrapper.getBoundingClientRect();
                    const x = event.clientX / rect.width -
                        rect.left / rect.width - 0.5;
                    const y = event.clientY / rect.height -
                        rect.top / rect.height - 0.5;

                    targetY = Math.max(-1, Math.min(1, x)) * 0.18;
                    targetX = Math.max(-1, Math.min(1, y)) * 0.10;
                },
                { passive: true },
            );

            wrapper.addEventListener('pointerleave', () => {
                targetX = 0;
                targetY = 0;
            });

            wrapper.addEventListener('click', react);

            /* --------------------------------------------------------
               Responsive renderer
               -------------------------------------------------------- */

            function fitRenderer() {
                const rect = wrapper.getBoundingClientRect();
                const width = Math.max(1, rect.width);
                const height = Math.max(1, rect.height);

                renderer.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }

            fitRenderer();
            window.addEventListener('resize', fitRenderer);

            /* --------------------------------------------------------
               Animation loop
               -------------------------------------------------------- */

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);

                const time = clock.getElapsedTime();

                propeller.rotation.z = Math.sin(time * 1.7) * 0.035;
                propeller.rotation.y = time * 7.5;

                if (clickSpin) {
                    propeller.rotation.y += clickSpin * 1.2;
                    clickSpin *= 0.90;

                    if (clickSpin < 0.01) {
                        clickSpin = 0;
                    }
                }

                bounce += (0 - bounce) * 0.065;

                const floating = Math.sin(time * 1.7) * 0.035;

                root.position.y =
                    -0.25 + floating + bounce * 0.20;

                rotationX += (targetX - rotationX) * 0.06;
                rotationY += (targetY - rotationY) * 0.06;

                root.rotation.x = rotationX;
                root.rotation.y = rotationY;

                renderer.render(scene, camera);
            }

            animate();
        } catch (error) {
            console.warn('Three.js Doraemon failed:', error);
        }
    })();
})();
