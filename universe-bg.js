/*
 * NEZZA — Living universe background
 * Blue-to-white atmosphere with slow nebula motion, star drift and shooting stars.
 */

(() => {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        html { background: #061a55; }

        body {
            background:
                radial-gradient(ellipse at 18% 18%, rgba(65, 168, 255, .42) 0%, transparent 34%),
                radial-gradient(ellipse at 82% 34%, rgba(0, 225, 255, .22) 0%, transparent 38%),
                linear-gradient(180deg, #061a55 0%, #0a3d9d 28%, #167bd2 52%, #72cfff 76%, #f7fbff 100%) !important;
            background-attachment: fixed;
        }

        #universe-bg {
            position: fixed;
            inset: 0;
            z-index: -5;
            overflow: hidden;
            pointer-events: none;
            isolation: isolate;
        }

        .universe-nebula {
            position: absolute;
            width: 42vw;
            height: 42vw;
            min-width: 260px;
            min-height: 260px;
            border-radius: 50%;
            filter: blur(55px);
            opacity: .28;
            mix-blend-mode: screen;
            will-change: transform;
        }

        .universe-nebula.a {
            left: -13vw;
            top: 8vh;
            background: radial-gradient(circle, rgba(42, 147, 255, .9), transparent 68%);
            animation: universeDriftA 18s ease-in-out infinite alternate;
        }

        .universe-nebula.b {
            right: -14vw;
            top: 30vh;
            background: radial-gradient(circle, rgba(0, 235, 255, .62), transparent 68%);
            animation: universeDriftB 23s ease-in-out infinite alternate;
        }

        .universe-nebula.c {
            left: 32vw;
            top: 48vh;
            width: 35vw;
            height: 35vw;
            background: radial-gradient(circle, rgba(112, 203, 255, .46), transparent 70%);
            animation: universeDriftC 26s ease-in-out infinite alternate;
        }

        .universe-stars {
            position: absolute;
            inset: 0;
            overflow: hidden;
        }

        .universe-star {
            position: absolute;
            width: var(--size);
            height: var(--size);
            left: var(--x);
            top: var(--y);
            border-radius: 50%;
            background: rgba(255, 255, 255, .95);
            box-shadow: 0 0 9px rgba(170, 235, 255, .85);
            opacity: var(--alpha);
            animation: starFloat var(--duration) ease-in-out var(--delay) infinite alternate;
        }

        .universe-star::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            width: 240%;
            height: 1px;
            transform: translate(-50%, -50%) rotate(45deg);
            background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
            opacity: .35;
        }

        .shooting-star {
            position: absolute;
            width: 120px;
            height: 2px;
            left: -150px;
            top: var(--top);
            border-radius: 999px;
            transform: rotate(-27deg);
            background: linear-gradient(90deg, transparent, rgba(255,255,255,.95));
            filter: drop-shadow(0 0 7px rgba(118, 218, 255, .95));
            opacity: 0;
            animation: shootingStar var(--duration) linear var(--delay) infinite;
        }

        .shooting-star.s2 { --top: 31%; --duration: 5.5s; --delay: 2.4s; width: 90px; }
        .shooting-star.s3 { --top: 52%; --duration: 6.8s; --delay: 4.7s; width: 145px; }

        .universe-haze {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(4, 16, 60, .08) 0%, rgba(40, 153, 225, .02) 52%, rgba(255,255,255,.24) 100%);
        }

        @keyframes universeDriftA {
            from { transform: translate3d(-2vw, -1vh, 0) scale(.95) rotate(0deg); }
            to { transform: translate3d(13vw, 9vh, 0) scale(1.12) rotate(18deg); }
        }

        @keyframes universeDriftB {
            from { transform: translate3d(4vw, -4vh, 0) scale(1) rotate(0deg); }
            to { transform: translate3d(-15vw, 12vh, 0) scale(1.18) rotate(-20deg); }
        }

        @keyframes universeDriftC {
            from { transform: translate3d(-8vw, 3vh, 0) scale(.9); }
            to { transform: translate3d(10vw, -10vh, 0) scale(1.18); }
        }

        @keyframes starFloat {
            from { transform: translate3d(0, 0, 0) scale(.72); }
            to { transform: translate3d(var(--move-x), var(--move-y), 0) scale(1.35); }
        }

        @keyframes shootingStar {
            0%, 76% { opacity: 0; transform: translate3d(0, 0, 0) rotate(-27deg); }
            79% { opacity: .95; }
            92%, 100% { opacity: 0; transform: translate3d(125vw, 35vh, 0) rotate(-27deg); }
        }

        @media (max-width: 700px) {
            .universe-nebula { filter: blur(42px); opacity: .22; }
            .universe-star:nth-child(n+58) { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
            .universe-nebula,
            .universe-star,
            .shooting-star { animation: none !important; }
        }
    `;
    document.head.appendChild(style);

    const layer = document.createElement('div');
    layer.id = 'universe-bg';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
        <div class="universe-nebula a"></div>
        <div class="universe-nebula b"></div>
        <div class="universe-nebula c"></div>
        <div class="universe-stars"></div>
        <div class="shooting-star s1"></div>
        <div class="shooting-star s2"></div>
        <div class="shooting-star s3"></div>
        <div class="universe-haze"></div>
    `;

    document.body.prepend(layer);

    const stars = layer.querySelector('.universe-stars');
    const amount = Math.min(85, Math.max(48, Math.floor(window.innerWidth / 17)));

    for (let i = 0; i < amount; i += 1) {
        const star = document.createElement('i');
        star.className = 'universe-star';
        star.style.setProperty('--x', `${Math.random() * 100}%`);
        star.style.setProperty('--y', `${Math.random() * 82}%`);
        star.style.setProperty('--size', `${(Math.random() * 2.1 + .55).toFixed(2)}px`);
        star.style.setProperty('--alpha', `${(Math.random() * .55 + .25).toFixed(2)}`);
        star.style.setProperty('--duration', `${(Math.random() * 4 + 3).toFixed(2)}s`);
        star.style.setProperty('--delay', `${(-Math.random() * 6).toFixed(2)}s`);
        star.style.setProperty('--move-x', `${((Math.random() - .5) * 16).toFixed(1)}px`);
        star.style.setProperty('--move-y', `${((Math.random() - .5) * 22).toFixed(1)}px`);
        stars.appendChild(star);
    }
})();
