/*
 * NEZZA — Doraemon 3D
 * A procedural Three.js character with real depth, lighting, shadows,
 * mouse interaction, idle motion, and a spinning propeller.
 */

(async () => {
    'use strict';

    const stage = document.getElementById('dora-stage');
    if (!stage) return;

    try {
        const THREE = await import(
            'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js'
        );

        // Give the older character renderer time to initialize, then replace it.
        await new Promise((resolve) => setTimeout(resolve, 900));
        stage.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'dora-3d-wrap doraemon-premium-3d';
        stage.appendChild(wrapper);

        /* ============================================================
           SCENE
           ============================================================ */

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
        camera.position.set(0, 1.05, 7.8);
        camera.lookAt(0, 0.9, 0);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0, 0);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.cursor = 'pointer';
        wrapper.appendChild(renderer.domElement);

        /* ============================================================
           LIGHTING
           ============================================================ */

        scene.add(new THREE.HemisphereLight(0xdaf5ff, 0x06132a, 2.0));

        const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
        keyLight.position.set(-3.5, 5.5, 6);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 20;
        scene.add(keyLight);

        const blueLight = new THREE.PointLight(0x38aaff, 2.5, 10);
        blueLight.position.set(3, 1.5, 4);
        scene.add(blueLight);

        const warmLight = new THREE.PointLight(0xffd56a, 1.5, 8);
        warmLight.position.set(-2.5, 2.5, 3);
        scene.add(warmLight);

        /* ============================================================
           MATERIALS
           ============================================================ */

        const blue = new THREE.MeshStandardMaterial({
            color: 0x078ee5,
            roughness: 0.34,
            metalness: 0.02,
        });

        const blueDark = new THREE.MeshStandardMaterial({
            color: 0x045b9d,
            roughness: 0.4,
        });

        const white = new THREE.MeshStandardMaterial({
            color: 0xfafcff,
            roughness: 0.25,
        });

        const dark = new THREE.MeshStandardMaterial({
            color: 0x101722,
            roughness: 0.18,
        });

        const red = new THREE.MeshStandardMaterial({
            color: 0xd9233f,
            roughness: 0.28,
        });

        const yellow = new THREE.MeshStandardMaterial({
            color: 0xffc928,
            roughness: 0.2,
            metalness: 0.12,
        });

        /* ============================================================
           HELPERS
           ============================================================ */

        const root = new THREE.Group();
        root.position.y = -0.2;
        scene.add(root);

        const propeller = new THREE.Group();
        propeller.position.set(0, 3.08, 0);
        root.add(propeller);

        const eyes = [];
        const sphere = new THREE.SphereGeometry(1, 64, 48);

        function mesh(geometry, material, position, scale, parent = root) {
            const object = new THREE.Mesh(geometry, material);
            object.position.set(...position);
            object.scale.set(...scale);
            object.castShadow = true;
            object.receiveShadow = true;
            parent.add(object);
            return object;
        }

        function roundedBox(width, height, depth, radius, material, position) {
            const shape = new THREE.Shape();
            const r = Math.min(radius, width / 2, height / 2);

            shape.moveTo(-width / 2 + r, -height / 2);
            shape.lineTo(width / 2 - r, -height / 2);
            shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + r);
            shape.lineTo(width / 2, height / 2 - r);
            shape.quadraticCurveTo(width / 2, height / 2, width / 2 - r, height / 2);
            shape.lineTo(-width / 2 + r, height / 2);
            shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - r);
            shape.lineTo(-width / 2, -height / 2 + r);
            shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + r, -height / 2);

            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth,
                bevelEnabled: true,
                bevelSegments: 4,
                bevelSize: radius * 0.28,
                bevelThickness: radius * 0.22,
            });

            geometry.center();
            return mesh(geometry, material, position, [1, 1, 1]);
        }

        /* ============================================================
           BODY — rounded and layered for visible 3D depth
           ============================================================ */

        mesh(sphere, blue, [0, 0.15, 0], [1.08, 1.23, 0.88]);
        mesh(sphere, blueDark, [0, 0.02, -0.38], [0.86, 0.96, 0.42]);

        // White belly is deliberately forward so it reads as a separate 3D layer.
        mesh(sphere, white, [0, 0.42, 0.73], [0.67, 0.78, 0.23]);

        /* ============================================================
           HEAD + FACE
           ============================================================ */

        mesh(sphere, blue, [0, 1.63, 0], [1.42, 1.42, 1.30]);

        // Face muzzle protrudes slightly from the blue head.
        mesh(sphere, white, [0, 1.57, 1.13], [1.12, 1.04, 0.28]);

        // Eyes: white outer spheres + black pupils with real depth.
        for (const x of [-0.32, 0.32]) {
            const eye = mesh(
                sphere,
                white,
                [x, 1.82, 1.30],
                [0.30, 0.43, 0.18],
            );
            eyes.push(eye);

            mesh(
                sphere,
                dark,
                [x, 1.81, 1.47],
                [0.105, 0.17, 0.075],
            );
        }

        // Red nose.
        mesh(
            sphere,
            red,
            [0, 1.54, 1.52],
            [0.115, 0.115, 0.10],
        );

        // Nose highlight.
        const noseHighlight = new THREE.MeshStandardMaterial({
            color: 0xffa7b3,
            roughness: 0.18,
        });
        mesh(
            sphere,
            noseHighlight,
            [-0.035, 1.58, 1.60],
            [0.032, 0.032, 0.018],
        );

        /* ============================================================
           MOUTH — curved 3D tube
           ============================================================ */

        const mouthCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.28, 1.31, 1.27),
            new THREE.Vector3(-0.14, 1.22, 1.31),
            new THREE.Vector3(0, 1.19, 1.32),
            new THREE.Vector3(0.14, 1.22, 1.31),
            new THREE.Vector3(0.28, 1.31, 1.27),
        ]);

        const mouth = new THREE.Mesh(
            new THREE.TubeGeometry(mouthCurve, 32, 0.026, 10, false),
            dark,
        );
        mouth.castShadow = true;
        root.add(mouth);

        /* ============================================================
           WHISKERS — symmetrical 3D tubes
           ============================================================ */

        function whisker(side, y, angle) {
            const startX = side * 0.28;
            const endX = side * 0.82;
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(startX, y, 1.28),
                new THREE.Vector3(side * 0.52, y + angle * 0.06, 1.27),
                new THREE.Vector3(endX, y + angle * 0.13, 1.22),
            ]);

            const line = new THREE.Mesh(
                new THREE.TubeGeometry(curve, 12, 0.012, 6, false),
                dark,
            );

            root.add(line);
        }

        [-0.05, -0.18, -0.31].forEach((y, index) => {
            whisker(-1, 1.47 + y, index - 1);
            whisker(1, 1.47 + y, -(index - 1));
        });

        /* ============================================================
           COLLAR + BELL
           ============================================================ */

        const collar = new THREE.Mesh(
            new THREE.TorusGeometry(0.82, 0.075, 16, 64),
            red,
        );
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, 0.98, 0.15);
        collar.scale.set(1, 0.58, 1);
        collar.castShadow = true;
        root.add(collar);

        mesh(
            new THREE.SphereGeometry(0.16, 32, 24),
            yellow,
            [0, 0.87, 0.77],
            [1, 1, 0.8],
        );

        mesh(
            new THREE.CylinderGeometry(0.065, 0.065, 0.05, 24),
            dark,
            [0, 0.77, 0.87],
            [1, 1, 1],
        );

        /* ============================================================
           POCKET — curved-looking layered 3D pocket
           ============================================================ */

        const pocketOuter = roundedBox(
            0.88,
            0.57,
            0.12,
            0.18,
            white,
            [0, 0.22, 0.93],
        );

        pocketOuter.scale.y = 0.82;

        const pocketInner = roundedBox(
            0.72,
            0.42,
            0.045,
            0.13,
            new THREE.MeshStandardMaterial({
                color: 0xddeaf3,
                roughness: 0.3,
            }),
            [0, 0.24, 1.01],
        );

        pocketInner.scale.y = 0.8;

        /* ============================================================
           ARMS + HANDS
           ============================================================ */

        for (const side of [-1, 1]) {
            const arm = mesh(
                sphere,
                blue,
                [side * 1.02, 0.05, 0.02],
                [0.34, 0.72, 0.38],
            );

            arm.rotation.z = side * -0.28;

            mesh(
                sphere,
                white,
                [side * 1.23, -0.50, 0.05],
                [0.38, 0.38, 0.38],
            );
        }

        /* ============================================================
           FEET
           ============================================================ */

        for (const side of [-1, 1]) {
            mesh(
                sphere,
                white,
                [side * 0.50, -1.13, 0.12],
                [0.58, 0.28, 0.42],
            );
        }

        /* ============================================================
           PROPeller — centered, horizontal and fully 3D
           ============================================================ */

        const shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.055, 0.055, 0.72, 20),
            white,
        );
        shaft.position.y = 0.38;
        shaft.castShadow = true;
        propeller.add(shaft);

        const hub = new THREE.Mesh(
            new THREE.SphereGeometry(0.10, 24, 18),
            yellow,
        );
        hub.position.y = 0.76;
        hub.castShadow = true;
        propeller.add(hub);

        function blade(rotation) {
            const geometry = new THREE.CapsuleGeometry(0.13, 0.78, 6, 20);
            const material = new THREE.MeshStandardMaterial({
                color: 0xffd337,
                roughness: 0.22,
                metalness: 0.08,
            });
            const object = new THREE.Mesh(geometry, material);
            object.rotation.z = rotation;
            object.rotation.y = 0.12;
            object.scale.set(0.58, 1, 0.18);
            object.position.y = 0.77;
            object.castShadow = true;
            propeller.add(object);
        }

        blade(0.18);
        blade(Math.PI + 0.18);

        /* ============================================================
           GROUND SHADOW
           ============================================================ */

        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(1.55, 64),
            new THREE.ShadowMaterial({ opacity: 0.22 }),
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(0, -1.38, 0.05);
        ground.scale.set(1.1, 0.48, 1);
        ground.receiveShadow = true;
        scene.add(ground);

        /* ============================================================
           INTERACTION
           ============================================================ */

        let targetX = 0;
        let targetY = 0;
        let pointerActive = false;
        let bounce = 0;

        wrapper.addEventListener('pointermove', (event) => {
            const rect = wrapper.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            targetY = x * 0.38;
            targetX = y * -0.18;
            pointerActive = true;
        });

        wrapper.addEventListener('pointerleave', () => {
            targetX = 0;
            targetY = 0;
            pointerActive = false;
        });

        wrapper.addEventListener('click', () => {
            bounce = 1;

            if ('speechSynthesis' in window) {
                const phrases = [
                    'Hehehe!',
                    'Ayo!',
                    'Asyik!',
                    'Hore!',
                ];

                const utterance = new SpeechSynthesisUtterance(
                    phrases[Math.floor(Math.random() * phrases.length)],
                );

                utterance.lang = 'id-ID';
                utterance.rate = 0.82;
                utterance.pitch = 1.55;
                speechSynthesis.cancel();
                speechSynthesis.speak(utterance);
            }
        });

        /* ============================================================
           RESIZE + ANIMATION
           ============================================================ */

        function resize() {
            const width = wrapper.clientWidth || 270;
            const height = wrapper.clientHeight || 390;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(wrapper);
        resize();

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsed = clock.getElapsedTime();
            const idleY = Math.sin(elapsed * 1.7) * 0.025;
            const idleFloat = Math.sin(elapsed * 1.45) * 0.055;

            root.position.y = -0.2 + idleFloat + bounce * 0.16;
            root.rotation.x += (targetX - root.rotation.x) * 0.055;
            root.rotation.y += (targetY - root.rotation.y) * 0.055;
            root.rotation.z = Math.sin(elapsed * 0.9) * 0.008;

            if (!pointerActive) {
                root.rotation.y += Math.sin(elapsed * 0.55) * 0.0008;
            }

            propeller.rotation.y += 0.19;
            propeller.rotation.z = Math.sin(elapsed * 2.2) * 0.035;

            // Small eye tracking makes the character feel alive.
            eyes.forEach((eye, index) => {
                const pupil = eye.parent.children.find(
                    (child) => child !== eye && child.material === dark,
                );
                if (!pupil) return;

                pupil.position.x = eye.position.x +
                    Math.sin(elapsed * 0.8 + index) * 0.018;
            });

            bounce *= 0.88;
            renderer.render(scene, camera);
        }

        animate();
    } catch (error) {
        console.warn('Premium Three.js Doraemon failed:', error);
    }
})();
