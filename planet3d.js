/*
 * NEZZA — Interactive 3D planet for the homepage hero.
 * Uses procedural Three.js geometry only: no external 3D model required.
 */

(() => {
    'use strict';

    const CDN = 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';
    const FALLBACK = 'https://unpkg.com/three@0.186.0/build/three.module.js';

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

            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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

            const planet = new THREE.Mesh(
                new THREE.SphereGeometry(1.55, 64, 48),
                new THREE.MeshStandardMaterial({
                    color: 0x167dff,
                    roughness: 0.48,
                    metalness: 0.04,
                }),
            );
            planetGroup.add(planet);

            // Bright white/blue cloud bands made from slightly offset transparent spheres.
            const cloudMaterial = new THREE.MeshStandardMaterial({
                color: 0xeaf9ff,
                transparent: true,
                opacity: 0.19,
                roughness: 0.65,
                depthWrite: false,
            });

            const cloudBands = [];
            [
                { y: 0.55, scale: [1.48, 0.16, 1.50], rot: 0.22 },
                { y: -0.25, scale: [1.52, 0.12, 1.48], rot: -0.34 },
                { y: -0.78, scale: [1.34, 0.10, 1.38], rot: 0.18 },
            ].forEach((band) => {
                const mesh = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 48, 24),
                    cloudMaterial.clone(),
                );
                mesh.position.y = band.y;
                mesh.scale.set(...band.scale);
                mesh.rotation.z = band.rot;
                cloudBands.push(mesh);
                planetGroup.add(mesh);
            });

            // Procedural continents / islands: small flattened spheres give the planet more depth.
            const landMaterial = new THREE.MeshStandardMaterial({
                color: 0x5de1ff,
                roughness: 0.72,
                metalness: 0,
            });

            const land = new THREE.Group();
            planetGroup.add(land);

            const islands = [
                [-0.65, 0.55, 1.34, 0.34, 0.20],
                [0.45, 0.78, 1.27, 0.30, 0.14],
                [0.70, -0.20, 1.38, 0.42, 0.16],
                [-0.35, -0.62, 1.38, 0.38, 0.14],
                [0.15, 0.10, 1.52, 0.24, 0.12],
            ];

            islands.forEach(([x, y, z, sx, sy]) => {
                const island = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 24, 16),
                    landMaterial,
                );
                island.position.set(x, y, z);
                island.scale.set(sx, sy, 0.035);
                land.add(island);
            });

            // Glowing atmosphere around the planet.
            const atmosphere = new THREE.Mesh(
                new THREE.SphereGeometry(1.68, 64, 48),
                new THREE.MeshBasicMaterial({
                    color: 0x55dfff,
                    transparent: true,
                    opacity: 0.10,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                }),
            );
            planetGroup.add(atmosphere);

            // Saturn-like rings, rotated for a premium 3D silhouette.
            const ringGroup = new THREE.Group();
            ringGroup.rotation.x = THREE.MathUtils.degToRad(67);
            ringGroup.rotation.z = THREE.MathUtils.degToRad(-18);
            planetGroup.add(ringGroup);

            const ringMaterials = [
                new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.72, side: THREE.DoubleSide }),
                new THREE.MeshBasicMaterial({ color: 0x65d9ff, transparent: true, opacity: 0.50, side: THREE.DoubleSide }),
                new THREE.MeshBasicMaterial({ color: 0x238cff, transparent: true, opacity: 0.34, side: THREE.DoubleSide }),
            ];

            [
                [2.05, 2.26, ringMaterials[0]],
                [2.30, 2.44, ringMaterials[1]],
                [2.48, 2.62, ringMaterials[2]],
            ].forEach(([inner, outer, material]) => {
                ringGroup.add(new THREE.Mesh(new THREE.RingGeometry(inner, outer, 96), material));
            });

            // Small moon orbiting the planet.
            const moonOrbit = new THREE.Group();
            planetGroup.add(moonOrbit);

            const moon = new THREE.Mesh(
                new THREE.SphereGeometry(0.22, 32, 24),
                new THREE.MeshStandardMaterial({ color: 0xf3fbff, roughness: 0.7 }),
            );
            moon.position.set(2.65, 0.35, 0);
            moonOrbit.add(moon);

            // Tiny star particles behind the planet.
            const starPositions = new Float32Array(420 * 3);
            for (let i = 0; i < 420; i += 1) {
                const radius = 5 + Math.random() * 5;
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
                new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.7 }),
            );
            scene.add(stars);

            const pointer = { x: 0, y: 0 };
            const target = { x: 0, y: 0 };

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

            function animate() {
                const time = clock.getElapsedTime();
                pointer.x += (target.x - pointer.x) * 0.045;
                pointer.y += (target.y - pointer.y) * 0.045;

                planetGroup.rotation.y = time * 0.18 + pointer.x * 0.20;
                planetGroup.rotation.x = Math.sin(time * 0.35) * 0.035 + pointer.y * 0.08;
                moonOrbit.rotation.y = time * 0.55;
                ringGroup.rotation.z = THREE.MathUtils.degToRad(-18) + Math.sin(time * 0.22) * 0.04;
                stars.rotation.y = time * 0.008;
                cloudBands.forEach((band, index) => {
                    band.rotation.y = time * (0.025 + index * 0.012);
                });

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }

            animate();

            // If the old character renderer inserts its canvas later, remove it.
            const observer = new MutationObserver(() => {
                const foreignNodes = [...stage.children].filter((child) => child !== wrapper);
                if (foreignNodes.length) foreignNodes.forEach((child) => child.remove());
            });
            observer.observe(stage, { childList: true });
        } catch (error) {
            stage.dataset.planetReady = 'false';
            console.error('3D planet failed to initialize:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlanet, { once: true });
    } else {
        initPlanet();
    }
})();
