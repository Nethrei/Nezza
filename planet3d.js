/*
 * NEZZA — Interactive 3D planet + immersive universe background.
 * Mobile optimized: lower geometry, DPR, star count and render rate.
 */

(() => {
    'use strict';

    const CDN = 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';
    const FALLBACK = 'https://unpkg.com/three@0.186.0/build/three.module.js';
    const isMobile = window.matchMedia('(max-width: 700px)').matches;

    function injectUniverseStyle() {
        if (document.getElementById('universe-effect-style')) return;

        const style = document.createElement('style');
        style.id = 'universe-effect-style';
        style.textContent = `
            html, body { background: #010714 !important; }
            body {
                --mx: 0px;
                --my: 0px;
                overflow-x: hidden !important;
                position: relative;
            }
            body::before {
                content: '' !important;
                position: fixed !important;
                inset: -18% !important;
                z-index: -3 !important;
                pointer-events: none !important;
                background:
                    radial-gradient(circle at 18% 35%, rgba(0,119,255,.28), transparent 24%),
                    radial-gradient(circle at 76% 22%, rgba(78,218,255,.20), transparent 22%),
                    radial-gradient(circle at 52% 78%, rgba(20,66,190,.24), transparent 30%),
                    radial-gradient(circle at 88% 76%, rgba(0,155,255,.18), transparent 22%);
                filter: blur(34px);
                transform: translate3d(calc(var(--mx) * .35), calc(var(--my) * .35), 0) scale(1.05);
                animation: universeNebula 16s ease-in-out infinite alternate;
                will-change: transform;
            }
            body::after {
                content: '' !important;
                position: fixed !important;
                inset: 0 !important;
                z-index: -2 !important;
                pointer-events: none !important;
                background:
                    radial-gradient(ellipse at center, transparent 30%, rgba(0,4,16,.30) 100%),
                    linear-gradient(180deg, rgba(0,8,28,.28), rgba(0,18,55,.10));
            }
            #space-canvas {
                z-index: -1 !important;
                opacity: .95 !important;
                mix-blend-mode: screen !important;
            }
            .ambient {
                filter: blur(110px) !important;
                opacity: .22 !important;
                transform: translate3d(var(--mx), var(--my), 0);
                transition: transform 1.2s ease-out;
            }
            .welcome-ticker {
                position: fixed !important;
                top: 0 !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                height: 48px !important;
                border-radius: 0 !important;
                border-left: 0 !important;
                border-right: 0 !important;
                border-top: 0 !important;
                z-index: 900 !important;
                background: rgba(2,14,39,.36) !important;
                box-shadow: 0 8px 40px rgba(0,60,180,.10), inset 0 -1px 0 rgba(255,255,255,.10) !important;
            }
            .welcome-ticker-track { height: 48px !important; }
            .app-shell { padding-top: 48px !important; }
            .chip-two { font-size: 0 !important; }
            .chip-two::after {
                content: 'OUR UNIVERSE ✦';
                font-size: 9px;
                letter-spacing: .08em;
            }
            @keyframes universeNebula {
                0% { transform: translate3d(calc(var(--mx) * .35 - 2%), calc(var(--my) * .35 - 1%), 0) scale(1); }
                50% { transform: translate3d(calc(var(--mx) * .55 + 2%), calc(var(--my) * .55 + 2%), 0) scale(1.08); }
                100% { transform: translate3d(calc(var(--mx) * .35 - 1%), calc(var(--my) * .35 + 3%), 0) scale(1.14); }
            }
            @media (max-width: 600px) {
                .welcome-ticker, .welcome-ticker-track { height: 42px !important; }
                .app-shell { padding-top: 42px !important; }
            }
            @media (prefers-reduced-motion: reduce) {
                body::before { animation: none !important; }
            }
        `;
        document.head.appendChild(style);
    }

    function setupUniverseInteraction() {
        if (isMobile) return;

        const updatePointer = (x, y) => {
            const px = (x / window.innerWidth - .5) * 2;
            const py = (y / window.innerHeight - .5) * 2;
            document.body.style.setProperty('--mx', `${px * 28}px`);
            document.body.style.setProperty('--my', `${py * 28}px`);
        };

        window.addEventListener('pointermove', event => {
            updatePointer(event.clientX, event.clientY);
        }, { passive: true });

        window.addEventListener('pointerleave', () => {
            updatePointer(window.innerWidth / 2, window.innerHeight / 2);
        });
    }

    async function loadThree() {
        try {
            return await import(CDN);
        } catch (error) {
            console.warn('Primary Three.js CDN failed. Trying fallback.', error);
            return await import(FALLBACK);
        }
    }

    async function initPlanet() {
        const stage = document.querySelector('#dora-stage');
        if (!stage || stage.dataset.planetReady === 'true') return;

        stage.dataset.planetReady = 'true';

        try {
            const THREE = await loadThree();
            stage.replaceChildren();

            const wrapper = document.createElement('div');
            wrapper.className = 'planet-3d-wrap';
            wrapper.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;';
            stage.appendChild(wrapper);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
            camera.position.set(0, 0.25, 7.2);
            camera.lookAt(0, 0.15, 0);

            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: !isMobile,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.setClearColor(0, 0);
            renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
            wrapper.appendChild(renderer.domElement);

            scene.add(new THREE.HemisphereLight(0xdff8ff, 0x06132e, 2.1));

            const sun = new THREE.DirectionalLight(0xffffff, 4.5);
            sun.position.set(-4, 4, 6);
            scene.add(sun);

            const blueLight = new THREE.PointLight(0x35aaff, 2.8, 12);
            blueLight.position.set(4, 0, 4);
            scene.add(blueLight);

            const planetGroup = new THREE.Group();
            planetGroup.position.set(0, 0.1, 0);
            scene.add(planetGroup);

            const sphereSegments = isMobile ? 32 : 56;
            const sphereRings = isMobile ? 20 : 36;
            const cloudSegments = isMobile ? 24 : 40;
            const cloudRings = isMobile ? 12 : 20;
            const islandSegments = isMobile ? 12 : 20;
            const islandRings = isMobile ? 8 : 12;
            const ringSegments = isMobile ? 48 : 72;
            const moonSegments = isMobile ? 14 : 24;

            const planet = new THREE.Mesh(
                new THREE.SphereGeometry(1.55, sphereSegments, sphereRings),
                new THREE.MeshStandardMaterial({
                    color: 0x167dff,
                    roughness: 0.48,
                    metalness: 0.04,
                }),
            );
            planetGroup.add(planet);

            const cloudBands = [];
            [
                { y: 0.55, scale: [1.48, 0.16, 1.50], rot: 0.22 },
                { y: -0.25, scale: [1.52, 0.12, 1.48], rot: -0.34 },
                { y: -0.78, scale: [1.34, 0.10, 1.38], rot: 0.18 },
            ].forEach(band => {
                const mesh = new THREE.Mesh(
                    new THREE.SphereGeometry(1, cloudSegments, cloudRings),
                    new THREE.MeshStandardMaterial({
                        color: 0xeaf9ff,
                        transparent: true,
                        opacity: 0.19,
                        roughness: 0.65,
                        depthWrite: false,
                    }),
                );
                mesh.position.y = band.y;
                mesh.scale.set(...band.scale);
                mesh.rotation.z = band.rot;
                cloudBands.push(mesh);
                planetGroup.add(mesh);
            });

            const land = new THREE.Group();
            planetGroup.add(land);
            const landMaterial = new THREE.MeshStandardMaterial({ color: 0x5de1ff, roughness: 0.72 });

            [
                [-0.65, 0.55, 1.34, 0.34, 0.20],
                [0.45, 0.78, 1.27, 0.30, 0.14],
                [0.70, -0.20, 1.38, 0.42, 0.16],
                [-0.35, -0.62, 1.38, 0.38, 0.14],
                [0.15, 0.10, 1.52, 0.24, 0.12],
            ].forEach(([x, y, z, sx, sy]) => {
                const island = new THREE.Mesh(
                    new THREE.SphereGeometry(1, islandSegments, islandRings),
                    landMaterial,
                );
                island.position.set(x, y, z);
                island.scale.set(sx, sy, 0.035);
                land.add(island);
            });

            planetGroup.add(new THREE.Mesh(
                new THREE.SphereGeometry(1.68, isMobile ? 32 : 56, isMobile ? 20 : 36),
                new THREE.MeshBasicMaterial({
                    color: 0x55dfff,
                    transparent: true,
                    opacity: 0.10,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                }),
            ));

            const ringGroup = new THREE.Group();
            ringGroup.rotation.x = THREE.MathUtils.degToRad(67);
            ringGroup.rotation.z = THREE.MathUtils.degToRad(-18);
            planetGroup.add(ringGroup);

            [
                [2.05, 2.26, 0xffffff, 0.72],
                [2.30, 2.44, 0x65d9ff, 0.50],
                [2.48, 2.62, 0x238cff, 0.34],
            ].forEach(([inner, outer, color, opacity]) => {
                ringGroup.add(new THREE.Mesh(
                    new THREE.RingGeometry(inner, outer, ringSegments),
                    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide }),
                ));
            });

            const moonOrbit = new THREE.Group();
            planetGroup.add(moonOrbit);
            const moon = new THREE.Mesh(
                new THREE.SphereGeometry(0.22, moonSegments, Math.max(8, Math.floor(moonSegments * .65))),
                new THREE.MeshStandardMaterial({ color: 0xf3fbff, roughness: 0.7 }),
            );
            moon.position.set(2.65, 0.35, 0);
            moonOrbit.add(moon);

            const starCount = isMobile ? 100 : 420;
            const starPositions = new Float32Array(starCount * 3);
            for (let i = 0; i < starCount; i += 1) {
                const radius = 5 + Math.random() * 8;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                starPositions[i * 3 + 1] = radius * Math.cos(phi);
                starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            }

            const starGeometry = new THREE.BufferGeometry();
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            const stars = new THREE.Points(
                starGeometry,
                new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: isMobile ? 0.035 : 0.028,
                    transparent: true,
                    opacity: 0.82,
                }),
            );
            scene.add(stars);

            const pointer = { x: 0, y: 0 };
            const target = { x: 0, y: 0 };

            if (!isMobile) {
                function onPointerMove(event) {
                    const rect = renderer.domElement.getBoundingClientRect();
                    target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
                    target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
                }

                renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true });
                renderer.domElement.addEventListener('pointerleave', () => {
                    target.x = 0;
                    target.y = 0;
                });
            }

            function resize() {
                const width = Math.max(1, stage.clientWidth);
                const height = Math.max(1, stage.clientHeight);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }

            window.addEventListener('resize', resize, { passive: true });
            resize();

            const clock = new THREE.Clock();
            let lastFrame = 0;
            let running = true;

            const visibilityObserver = new IntersectionObserver(entries => {
                running = entries[0]?.isIntersecting ?? true;
            }, { threshold: 0.01 });
            visibilityObserver.observe(stage);

            function animate(timestamp) {
                requestAnimationFrame(animate);
                if (!running || document.hidden) return;

                const frameInterval = isMobile ? 33 : 0;
                if (frameInterval && timestamp - lastFrame < frameInterval) return;
                lastFrame = timestamp;

                const time = clock.getElapsedTime();
                pointer.x += (target.x - pointer.x) * 0.045;
                pointer.y += (target.y - pointer.y) * 0.045;

                planetGroup.rotation.y = time * 0.18 + pointer.x * 0.20;
                planetGroup.rotation.x = Math.sin(time * 0.35) * 0.035 + pointer.y * 0.08;
                moonOrbit.rotation.y = time * 0.55;
                ringGroup.rotation.z = THREE.MathUtils.degToRad(-18) + Math.sin(time * 0.22) * 0.04;

                if (!isMobile) {
                    stars.rotation.y = time * 0.008;
                    cloudBands.forEach((band, index) => {
                        band.rotation.y = time * (0.025 + index * 0.012);
                    });
                }

                renderer.render(scene, camera);
            }

            requestAnimationFrame(animate);
        } catch (error) {
            stage.dataset.planetReady = 'false';
            console.error('3D planet failed to initialize:', error);
        }
    }

    injectUniverseStyle();
    setupUniverseInteraction();

    const startPlanet = () => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(initPlanet, { timeout: 1200 });
        } else {
            setTimeout(initPlanet, 350);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startPlanet, { once: true });
    } else {
        startPlanet();
    }
})();
