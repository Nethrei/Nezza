/* NEZZA — interactions */
(() => {
  'use strict';
  const $ = (s,p=document) => p.querySelector(s);
  const $$ = (s,p=document) => [...p.querySelectorAll(s)];
  const landing=$('#landing-page'), content=$('#content-area'), enter=$('#enter-btn');
  const music=$('#bg-music'), musicBtn=$('#music-toggle-btn');
  const pages=$$('.view-page'), navs=$$('.nav-item'), indicator=$('#liquid-indicator');

  const tickerStyle=document.createElement('style');
  tickerStyle.textContent=`
    .welcome-ticker{z-index:4000!important;left:76px!important;width:calc(100% - 76px)!important;height:64px!important;overflow:hidden!important;display:flex!important;align-items:center!important;background:rgba(3,12,28,.72)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;}
    .welcome-ticker-track{position:relative!important;display:block!important;min-width:0!important;width:max-content!important;white-space:nowrap!important;padding-left:0!important;animation:welcomeRevealLTR 9s linear infinite!important;will-change:transform!important;}
    .welcome-ticker-track span{display:inline-block!important;padding-right:55px!important;}
    @keyframes welcomeRevealLTR{0%{transform:translateX(-100%)}12%{transform:translateX(0)}75%{transform:translateX(0)}100%{transform:translateX(100%)} }
    .liquid-sidebar{z-index:5000!important;background:rgba(3,12,28,.72);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);}
    .main-photo-card{display:none!important;}
    @media(max-width:900px){.welcome-ticker{left:68px!important;width:calc(100% - 68px)!important;height:56px!important}.welcome-ticker-track{animation-duration:8s!important}}
    @media(max-width:600px){.welcome-ticker{left:60px!important;width:calc(100% - 60px)!important;height:50px!important}.welcome-ticker-track{animation-duration:7s!important}}
  `;
  document.head.appendChild(tickerStyle);

  function indicatorMove(item){
    if(!indicator||!item)return;
    const n=item.closest('.liquid-nav'), a=n.getBoundingClientRect(), b=item.getBoundingClientRect();
    const size=innerWidth<=480?52:56;
    indicator.style.width=indicator.style.height=size+'px';
    indicator.style.transform=`translateX(${b.left-a.left+b.width/2-size/2}px)`;
  }
  function showView(id,hash=true){
    const page=document.getElementById(id); if(!page)return;
    pages.forEach(p=>p.classList.toggle('active',p===page));
    navs.forEach(n=>n.classList.toggle('active',n.dataset.target===id));
    indicatorMove(navs.find(n=>n.dataset.target===id));
    if(hash)history.replaceState(null,'','#'+id.replace('-view',''));
    $$('.reveal',page).forEach((e,i)=>{e.style.setProperty('--reveal-delay',Math.min(i*70,350)+'ms');e.classList.add('revealed')});
    scrollTo({top:0,behavior:'smooth'});
  }
  navs.forEach(n=>n.addEventListener('click',()=>showView(n.dataset.target)));
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
  enter?.addEventListener('click',async()=>{
    try{await music?.play()}catch{}
    landing?.classList.add('hide');
    setTimeout(()=>{if(landing)landing.style.display='none';content?.classList.add('active');indicatorMove($('.nav-item.active'))},800);
  });
  musicBtn?.addEventListener('click',()=>{if(!music)return;music.muted=!music.muted;musicBtn.textContent=music.muted?'🔇':'♪'});

  const slider=$('#card-slider'), cards=$$('.memory-card',slider||document), prev=$('#prev-card'), next=$('#next-card'), count=$('#slider-count'), bar=$('#slider-bar');
  const step=()=>{const c=cards[0];return c?c.getBoundingClientRect().width+(parseFloat(getComputedStyle(slider).gap)||0):0};
  const state=()=>{if(!slider||!cards.length)return;const s=step();const i=Math.max(0,Math.min(cards.length-1,Math.round(slider.scrollLeft/s)));if(count)count.textContent=String(i+1).padStart(2,'0');if(bar)bar.style.width=((i+1)/cards.length*100)+'%';if(prev)prev.disabled=i===0;if(next)next.disabled=i===cards.length-1};
  prev?.addEventListener('click',()=>slider?.scrollBy({left:-step(),behavior:'smooth'}));
  next?.addEventListener('click',()=>slider?.scrollBy({left:step(),behavior:'smooth'}));
  slider?.addEventListener('scroll',state,{passive:true});

  const canvas=$('#space-canvas'),ctx=canvas?.getContext('2d');let particles=[],raf;
  function resize(){if(!canvas||!ctx)return;const r=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*r;canvas.height=innerHeight*r;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(r,0,0,r,0,0);particles=Array.from({length:Math.min(110,Math.max(45,Math.floor(innerWidth/14)))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.35,sx:(Math.random()-.5)*.18,sy:Math.random()*.18+.03,a:Math.random()*.45+.1,p:Math.random()*6.28}))}
  function stars(){if(!ctx)return;ctx.clearRect(0,0,innerWidth,innerHeight);particles.forEach(p=>{p.x+=p.sx;p.y-=p.sy;p.p+=.012;if(p.x<-10)p.x=innerWidth+10;if(p.x>innerWidth+10)p.x=-10;if(p.y<-10)p.y=innerHeight+10;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fillStyle=`rgba(120,215,255,${p.a+(Math.sin(p.p)+1)*.12})`;ctx.fill()});raf=requestAnimationFrame(stars)}
  addEventListener('resize',()=>{resize();indicatorMove($('.nav-item.active'));state()});resize();stars();
  const h=location.hash.replace('#','');showView(h==='album'?'album-view':h==='story'?'story-view':'home-view',false);state();

  const stage=$('#dora-stage'), dora=$('#doraemon'), bubble=$('#dora-bubble');
  if(!stage||!dora)return;
  const lines=['Halo Nezuro! 👋','Ayo jelajahi cerita ini! 💙','Dorayaki time! ✨','Pintu ke mana saja siap! 🚪','Wah, kenangan bagus!','Klik aku lagi! 😄'];
  function pickDoraVoice(){
    if(!('speechSynthesis' in window))return null;
    const voices=speechSynthesis.getVoices();
    return voices.find(v=>/^ja(-|_)/i.test(v.lang) && /female|woman|girl|kyoko|otoya|haruka|sayaka/i.test(v.name)) || voices.find(v=>/^ja(-|_)/i.test(v.lang)) || voices.find(v=>/japanese/i.test(v.name)) || null;
  }
  function speak(text){
    if(!('speechSynthesis' in window))return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    const voice=pickDoraVoice();
    if(voice)u.voice=voice;
    u.lang=voice?.lang||'ja-JP';
    u.rate=.9;u.pitch=1.55;u.volume=1;
    speechSynthesis.speak(u);
  }
  if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=()=>{};
  function react(){
    const text=lines[Math.floor(Math.random()*lines.length)];
    bubble&&(bubble.textContent=text);
    stage.classList.remove('talk','running','bounce','spin-gadget');
    void stage.offsetWidth;
    stage.classList.add('talk','running','bounce','spin-gadget');
    speak(text);
    setTimeout(()=>stage.classList.remove('running','bounce','spin-gadget'),2200);
    setTimeout(()=>stage.classList.remove('talk'),5000);
  }
  dora.addEventListener('click',react);
  dora.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();react()}});
  addEventListener('mousemove',e=>{if(stage.classList.contains('running'))return;const r=dora.getBoundingClientRect(),x=Math.max(-8,Math.min(8,(e.clientX-(r.left+r.width/2))*.035)),y=Math.max(-5,Math.min(5,(e.clientY-(r.top+r.height/2))*.02));dora.style.transform=`translateX(-50%) translateY(${y}px) rotateY(${x}deg)`});
})();
