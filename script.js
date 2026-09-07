/* NEZZA — interactions */
(() => {
  'use strict';
  const $ = (s,p=document) => p.querySelector(s);
  const $$ = (s,p=document) => [...p.querySelectorAll(s)];
  const landing=$('#landing-page'), content=$('#content-area'), enter=$('#enter-btn');
  const music=$('#bg-music'), musicBtn=$('#music-toggle-btn');
  const pages=$$('.view-page'), navs=$$('.nav-item'), indicator=$('#liquid-indicator');

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

  /* Doraemon: no Sonic code, no Sonic loader. */
  const stage=$('#dora-stage'), dora=$('#doraemon'), bubble=$('#dora-bubble');
  if(!stage||!dora)return;
  const lines=['Halo Nezuro! 👋','Ayo jelajahi cerita ini! 💙','Dorayaki time! ✨','Pintu ke mana saja siap! 🚪','Wah, kenangan bagus!','Klik aku lagi! 😄'];
  function speak(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='id-ID';u.rate=1.02;u.pitch=1.22;speechSynthesis.speak(u)}
  function react(){const text=lines[Math.floor(Math.random()*lines.length)];bubble&&(bubble.textContent=text);stage.classList.remove('talk','running','bounce','spin-gadget');void stage.offsetWidth;stage.classList.add('talk','running','bounce','spin-gadget');speak(text);setTimeout(()=>stage.classList.remove('running','bounce','spin-gadget'),2200);setTimeout(()=>stage.classList.remove('talk'),5000)}
  dora.addEventListener('click',react);dora.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();react()}});
  addEventListener('mousemove',e=>{if(stage.classList.contains('running'))return;const r=dora.getBoundingClientRect(),x=Math.max(-8,Math.min(8,(e.clientX-(r.left+r.width/2))*.035)),y=Math.max(-5,Math.min(5,(e.clientY-(r.top+r.height/2))*.02));dora.style.transform=`translateX(-50%) translateY(${y}px) rotateY(${x}deg)`});

  /* Put the photo UNDER Doraemon, never behind/inside him. */
  const photo=$('.main-photo-card', $('.hero-visual'));
  const visual=$('.hero-visual');
  function placePhoto(){
    if(!photo||!visual)return;
    visual.style.minHeight=innerWidth<=900?'520px':'620px';
    photo.style.position='absolute';
    photo.style.left='50%';
    photo.style.top=innerWidth<=600?'78%':'84%';
    photo.style.zIndex='2';
    photo.style.width=innerWidth<=600?'150px':'180px';
    photo.style.transform='translateX(-50%) rotate(-4deg)';
    photo.style.opacity='.72';
  }
  placePhoto();addEventListener('resize',placePhoto);
})();
