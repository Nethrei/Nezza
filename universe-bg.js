/* NEZZA — animated deep-space background, mobile optimized */
(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    html, body { background: transparent !important; }

    #universe-bg {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      background: linear-gradient(180deg,#020a2b 0%,#06266d 22%,#0b67c7 52%,#63cfff 76%,#f7fbff 100%);
      contain: strict;
      will-change: transform;
    }

    .universe-space { position:absolute; inset:0; overflow:hidden; }

    .universe-nebula {
      position:absolute;
      width:55vw; height:55vw;
      min-width:320px; min-height:320px;
      border-radius:50%;
      filter:blur(65px);
      opacity:.42;
      will-change:transform;
      mix-blend-mode:screen;
    }
    .universe-nebula.a { left:-20vw; top:-8vh; background:radial-gradient(circle,rgba(34,112,255,.95),transparent 68%); animation:nebulaA 15s ease-in-out infinite alternate; }
    .universe-nebula.b { right:-20vw; top:18vh; background:radial-gradient(circle,rgba(0,221,255,.72),transparent 68%); animation:nebulaB 19s ease-in-out infinite alternate; }
    .universe-nebula.c { left:18vw; top:48vh; background:radial-gradient(circle,rgba(40,147,255,.62),transparent 68%); animation:nebulaC 23s ease-in-out infinite alternate; }

    .universe-cloud {
      position:absolute; width:80vw; height:28vw; min-height:180px;
      left:10vw; top:25vh; border-radius:50%;
      background:radial-gradient(ellipse,rgba(72,182,255,.20),transparent 67%);
      filter:blur(35px);
      animation:cloudMove 18s ease-in-out infinite alternate;
      will-change:transform;
    }

    .universe-stars { position:absolute; inset:0; }
    .universe-star {
      position:absolute; left:var(--x); top:var(--y);
      width:var(--size); height:var(--size); border-radius:50%;
      background:#fff; box-shadow:0 0 8px rgba(160,230,255,.95);
      opacity:var(--alpha); animation:starDrift var(--duration) ease-in-out var(--delay) infinite alternate;
      will-change:transform, opacity;
    }

    .shooting-star {
      position:absolute; left:-180px; top:var(--top); width:150px; height:2px;
      border-radius:99px; opacity:0;
      background:linear-gradient(90deg,transparent,#fff);
      box-shadow:0 0 10px #79dcff;
      transform:rotate(-25deg);
      animation:shoot var(--duration) linear var(--delay) infinite;
    }

    .space-glow {
      position:absolute; inset:0;
      background:radial-gradient(circle at 50% 20%,rgba(70,155,255,.18),transparent 35%),linear-gradient(180deg,transparent 60%,rgba(255,255,255,.18) 100%);
      animation:glowPulse 9s ease-in-out infinite alternate;
      will-change:opacity, transform;
    }

    @keyframes nebulaA { from{transform:translate(-4vw,-2vh) scale(.9) rotate(0deg)} to{transform:translate(20vw,12vh) scale(1.18) rotate(20deg)} }
    @keyframes nebulaB { from{transform:translate(5vw,-3vh) scale(1)} to{transform:translate(-22vw,14vh) scale(1.2) rotate(-22deg)} }
    @keyframes nebulaC { from{transform:translate(-10vw,5vh) scale(.9)} to{transform:translate(14vw,-10vh) scale(1.2)} }
    @keyframes cloudMove { from{transform:translateX(-12vw) scale(.95)} to{transform:translateX(12vw) scale(1.1)} }
    @keyframes glowPulse { from{opacity:.65;transform:scale(1)} to{opacity:1;transform:scale(1.04)} }
    @keyframes starDrift { from{transform:translate3d(0,0,0) scale(.65)} to{transform:translate3d(var(--mx),var(--my),0) scale(1.5)} }
    @keyframes shoot { 0%,70%{opacity:0;transform:translate3d(0,0,0) rotate(-25deg)} 74%{opacity:1} 90%,100%{opacity:0;transform:translate3d(135vw,42vh,0) rotate(-25deg)} }

    @media(max-width:700px){
      .universe-nebula{width:90vw;height:90vw;min-width:260px;min-height:260px;filter:blur(32px);opacity:.30}
      .universe-nebula.c { display:none; }
      .universe-cloud{width:120vw;left:-10vw;filter:blur(24px);opacity:.8}
      .universe-star:nth-child(n+45){display:none}
      .shooting-star { width:110px; box-shadow:0 0 7px #79dcff; }
      .space-glow { animation-duration:14s; }
    }

    @media(prefers-reduced-motion:reduce){
      .universe-nebula,.universe-cloud,.universe-star,.shooting-star,.space-glow{animation:none !important}
    }
  `;
  document.head.appendChild(style);

  const layer = document.createElement('div');
  layer.id = 'universe-bg';
  layer.innerHTML = `
    <div class="universe-space">
      <div class="universe-nebula a"></div>
      <div class="universe-nebula b"></div>
      <div class="universe-nebula c"></div>
      <div class="universe-cloud"></div>
      <div class="universe-stars"></div>
      <div class="shooting-star" style="--top:18%;--duration:7s;--delay:1s"></div>
      <div class="shooting-star" style="--top:48%;--duration:8s;--delay:4s"></div>
      <div class="space-glow"></div>
    </div>`;
  document.body.prepend(layer);

  const stars = layer.querySelector('.universe-stars');
  const mobile = window.innerWidth <= 700;
  const count = mobile
    ? Math.min(44, Math.max(30, Math.floor(window.innerWidth / 9)))
    : Math.min(90, Math.max(55, Math.floor(window.innerWidth / 13)));

  for(let i=0;i<count;i++){
    const s=document.createElement('i');
    s.className='universe-star';
    s.style.setProperty('--x',`${Math.random()*100}%`);
    s.style.setProperty('--y',`${Math.random()*78}%`);
    s.style.setProperty('--size',`${(Math.random()*(mobile ? 1.4 : 2)+.45).toFixed(2)}px`);
    s.style.setProperty('--alpha',`${(.25+Math.random()*.7).toFixed(2)}`);
    s.style.setProperty('--duration',`${(4+Math.random()*5).toFixed(2)}s`);
    s.style.setProperty('--delay',`${(-Math.random()*6).toFixed(2)}s`);
    s.style.setProperty('--mx',`${((Math.random()-.5)*(mobile ? 18 : 28)).toFixed(1)}px`);
    s.style.setProperty('--my',`${((Math.random()-.5)*(mobile ? 24 : 34)).toFixed(1)}px`);
    stars.appendChild(s);
  }

  let px=0,py=0,tx=0,ty=0;
  let rafId=0;
  let running=!document.hidden;

  if (!mobile) {
    window.addEventListener('pointermove',e=>{
      tx=(e.clientX/window.innerWidth-.5)*2;
      ty=(e.clientY/window.innerHeight-.5)*2;
    },{passive:true});
  }

  function parallax(){
    if (!running) return;
    px+=(tx-px)*.035; py+=(ty-py)*.035;
    layer.style.transform=`translate3d(${px*10}px,${py*7}px,0)`;
    rafId=requestAnimationFrame(parallax);
  }

  document.addEventListener('visibilitychange',()=>{
    running=!document.hidden;
    if(running && !rafId) parallax();
    if(!running && rafId) { cancelAnimationFrame(rafId); rafId=0; }
  });

  parallax();
})();
