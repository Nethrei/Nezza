/*
 * NEZZA — Scroll story
 * Adds an interactive memory section below the homepage hero.
 */

(() => {
    'use strict';

    const home = document.querySelector('#home-view');
    const hero = home?.querySelector('.hero-grid');
    if (!home || !hero || home.querySelector('.scroll-story')) return;

    const style = document.createElement('style');
    style.textContent = `
        .scroll-story {
            position: relative;
            width: min(1120px, 100%);
            min-height: 980px;
            margin: 0 auto;
            padding: 110px 0 180px;
            overflow: hidden;
        }
        .scroll-story::before {
            content: '';
            position: absolute;
            left: 50%; top: 40px; bottom: 80px; width: 1px;
            background: linear-gradient(to bottom, transparent, rgba(112,220,255,.55), transparent);
            opacity: .7;
        }
        .story-heading {
            position: relative;
            z-index: 3;
            width: min(620px,90%);
            margin: 0 auto 110px;
            text-align: center;
            opacity: 1;
            transform: none;
        }
        .story-heading .story-kicker {
            display: inline-block;
            margin-bottom: 15px;
            color: #72d8ff;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .24em;
        }
        .story-heading h3 {
            margin: 0 0 18px;
            color: #fff;
            font: 700 clamp(40px,6vw,72px)/.94 'Space Grotesk',Inter,sans-serif;
            letter-spacing: -.055em;
        }
        .story-heading h3 span {
            color: transparent;
            background: linear-gradient(90deg,#fff,#61d7ff,#2b8cff);
            background-clip: text;
            -webkit-background-clip: text;
        }
        .story-heading p {
            margin: auto;
            max-width: 500px;
            color: rgba(225,241,255,.68);
            font-size: 14px;
            line-height: 1.8;
        }
        .story-grid {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: .78fr 1.22fr;
            align-items: center;
            gap: clamp(35px,7vw,100px);
            min-height: 650px;
        }
        .story-copy {
            opacity: 0;
            transform: translateX(-70px);
            transition: opacity .85s ease, transform 1s cubic-bezier(.2,.8,.2,1);
        }
        .story-copy.is-visible { opacity: 1; transform: none; }
        .story-number {
            display: block;
            margin-bottom: 16px;
            color: rgba(255,255,255,.35);
            font: 700 12px/1 'Space Grotesk',sans-serif;
            letter-spacing: .2em;
        }
        .story-copy h4 {
            margin-bottom: 18px;
            color: #fff;
            font: 700 clamp(32px,4vw,52px)/1 'Space Grotesk',sans-serif;
            letter-spacing: -.045em;
        }
        .story-copy h4 span { color: #69d5ff; }
        .story-copy p {
            max-width: 410px;
            color: rgba(226,241,255,.7);
            font-size: 14px;
            line-height: 1.9;
        }
        .story-line {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 28px;
            color: rgba(255,255,255,.55);
            font-size: 9px;
            font-weight: 700;
            letter-spacing: .16em;
        }
        .story-line::before {
            content: '';
            width: 34px;
            height: 1px;
            background: #62d8ff;
            box-shadow: 0 0 15px rgba(98,216,255,.8);
        }
        .story-gallery { position: relative; height: 590px; }
        .story-photo {
            position: absolute;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,.24);
            border-radius: 28px;
            background: rgba(255,255,255,.06);
            box-shadow: 0 35px 80px rgba(0,10,45,.45),0 0 50px rgba(35,151,255,.12);
            opacity: 0;
            transform: translateY(80px) rotate(0deg) scale(.9);
            transition: opacity .78s ease,transform .9s cubic-bezier(.16,.85,.25,1);
        }
        .story-photo.is-visible { opacity: 1; }
        .story-photo img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(1.08) contrast(1.03); }
        .story-photo::after {
            content:'';
            position:absolute;
            inset:0;
            background:linear-gradient(145deg,rgba(255,255,255,.14),transparent 35%,rgba(0,91,255,.15));
            pointer-events:none;
        }
        .story-photo.photo-main {
            z-index:3; left:12%; top:45px; width:52%; height:430px;
            transform:translateY(80px) rotate(-5deg) scale(.9);
            transition-delay:0ms;
        }
        .story-photo.photo-main.is-visible { transform:translateY(0) rotate(-5deg) scale(1); }
        .story-photo.photo-small {
            z-index:4; right:0; bottom:25px; width:42%; height:300px;
            transform:translateY(100px) rotate(7deg) scale(.88);
            transition-delay:150ms;
        }
        .story-photo.photo-small.is-visible { transform:translateY(0) rotate(7deg) scale(1); }
        .story-photo.photo-mini {
            z-index:5; left:0; bottom:45px; width:29%; height:205px;
            transform:translateY(120px) rotate(-8deg) scale(.85);
            transition-delay:300ms;
        }
        .story-photo.photo-mini.is-visible { transform:translateY(0) rotate(-8deg) scale(1); }
        .story-sticker {
            position:absolute;
            z-index:8;
            display:grid;
            place-items:center;
            border:1px solid rgba(255,255,255,.3);
            border-radius:22px;
            background:rgba(112,205,255,.13);
            box-shadow:0 18px 45px rgba(0,40,100,.35),inset 0 1px 0 rgba(255,255,255,.2);
            opacity:0;
            transform:translateY(55px) rotate(-14deg) scale(.7);
            transition:opacity .7s ease,transform .9s cubic-bezier(.2,.9,.25,1);
        }
        .story-sticker.is-visible { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
        .sticker-heart { right:4%; top:4px; width:72px; height:72px; font-size:31px; transition-delay:100ms; }
        .sticker-star { left:3%; top:35%; width:58px; height:58px; font-size:25px; transition-delay:220ms; }
        .sticker-note { right:3%; top:51%; width:64px; height:64px; font-size:27px; transition-delay:340ms; }
        .story-sticker.is-floating { animation:storyFloat 4.5s ease-in-out infinite; }
        .sticker-star.is-floating { animation-delay:-1.5s; }
        .sticker-note.is-floating { animation-delay:-2.6s; }
        @keyframes storyFloat { 0%,100%{margin-top:0} 50%{margin-top:-13px} }
        .story-end {
            position:relative;
            z-index:4;
            margin:90px auto 0;
            text-align:center;
            opacity:0;
            transform:translateY(40px);
            transition:opacity .8s ease,transform .9s ease;
        }
        .story-end.is-visible { opacity:1; transform:none; }
        .story-end strong { display:block; margin-bottom:9px; color:#fff; font:700 24px 'Space Grotesk',sans-serif; }
        .story-end span { color:rgba(215,237,255,.5); font-size:11px; letter-spacing:.12em; }

        @media (max-width:900px) {
            .scroll-story{min-height:1120px;padding-top:80px}
            .story-grid{grid-template-columns:1fr;gap:40px}
            .story-copy{text-align:center;transform:translateY(45px)}
            .story-copy p{margin:auto}
            .story-line{margin-top:22px}
            .story-gallery{width:min(650px,92vw);margin:auto;height:570px}
            .story-photo.photo-main{left:16%;width:56%;height:390px}
            .story-photo.photo-small{width:42%;height:270px}
            .story-photo.photo-mini{width:30%;height:190px}
        }
        @media (max-width:600px) {
            .scroll-story{
                min-height:920px;
                padding:58px 14px 100px;
            }
            .scroll-story::before{left:50%;opacity:.35}
            .story-heading{
                width:100%;
                margin-bottom:48px;
                padding:0 4px;
            }
            .story-heading .story-kicker{
                display:block;
                margin-bottom:12px;
                font-size:9px;
                letter-spacing:.2em;
            }
            .story-heading h3{
                font-size:clamp(38px,11vw,48px);
                line-height:.96;
                margin-bottom:14px;
            }
            .story-heading p{
                font-size:12px;
                line-height:1.7;
                max-width:330px;
            }
            .story-grid{gap:20px}
            .story-copy{transform:translateY(35px)}
            .story-copy h4{font-size:30px}
            .story-copy p{font-size:12px;line-height:1.75}
            .story-gallery{height:430px;width:100%}
            .story-photo.photo-main{left:13%;top:15px;width:62%;height:300px}
            .story-photo.photo-small{right:0;bottom:20px;width:45%;height:205px}
            .story-photo.photo-mini{left:0;bottom:35px;width:31%;height:145px}
            .sticker-heart{right:1%;top:0;width:58px;height:58px}
            .sticker-star{left:0;top:36%;width:48px;height:48px}
            .sticker-note{right:0;top:52%;width:52px;height:52px}
            .story-end{margin-top:48px}
        }
        @media (prefers-reduced-motion:reduce) {
            .story-copy,.story-photo,.story-sticker,.story-end{transition:none!important;animation:none!important;transform:none!important;opacity:1!important}
        }
    `;
    document.head.appendChild(style);

    const image = 'IMG_20260731_204858.jpg';
    const section = document.createElement('section');
    section.className = 'scroll-story';
    section.setAttribute('aria-label','Memory story');
    section.innerHTML = `
        <div class="story-heading">
            <span class="story-kicker">A LITTLE FURTHER</span>
            <h3>Scroll pelan,<br><span>ceritanya muncul.</span></h3>
            <p>Setiap bagian muncul saat kamu melewatinya — foto, kata-kata, dan stiker kecil yang bikin halaman terasa hidup.</p>
        </div>
        <div class="story-grid">
            <div class="story-copy reveal-scroll"><span class="story-number">01 / MEMORY</span><h4>Some moments<br>deserve to be <span>kept.</span></h4><p>Hal sederhana bisa jadi kenangan paling berharga. Geser terus ke bawah dan biarkan setiap frame muncul satu per satu.</p><span class="story-line">KEEP SCROLLING</span></div>
            <div class="story-gallery">
                <div class="story-photo photo-main reveal-scroll"><img src="${image}" alt="Memory moment utama"></div>
                <div class="story-photo photo-small reveal-scroll"><img src="${image}" alt="Memory moment kedua"></div>
                <div class="story-photo photo-mini reveal-scroll"><img src="${image}" alt="Memory moment ketiga"></div>
                <div class="story-sticker sticker-heart reveal-scroll is-floating">💙</div>
                <div class="story-sticker sticker-star reveal-scroll is-floating">✦</div>
                <div class="story-sticker sticker-note reveal-scroll is-floating">☁️</div>
            </div>
        </div>
        <div class="story-end reveal-scroll"><strong>Dan ini baru awalnya.</strong><span>KEEP GOING ↓</span></div>
    `;

    hero.insertAdjacentElement('afterend', section);

    const elements = [...section.querySelectorAll('.reveal-scroll')];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    elements.forEach((element) => observer.observe(element));

    let ticking = false;
    const stickers = [...section.querySelectorAll('.story-sticker')];
    function parallax() {
        ticking = false;
        const rect = section.getBoundingClientRect();
        const progress = (window.innerHeight * .72 - rect.top) / Math.max(rect.height, 1);
        const offset = Math.max(-18, Math.min(18, (progress - .5) * 34));
        stickers.forEach((sticker, index) => {
            if (sticker.classList.contains('is-visible')) sticker.style.translate = `0 ${offset * (index + 1) * .35}px`;
            else sticker.style.translate = '';
        });
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(parallax);
        }
    }, { passive:true });
})();
