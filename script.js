const $=(s)=>document.querySelector(s);
const $$=(s)=>document.querySelectorAll(s);
const landing=$('#landing-page'), enter=$('#enter-btn'), content=$('#content-area'), music=$('#bg-music'), musicBtn=$('#music-toggle-btn');
const pages=$$('.view-page'), navs=$$('.nav-item'), liquidItems=$$('.liquid-item'), pill=$('.liquid-pill');

/* Entrance */
enter.addEventListener('click',()=>{
  music.play().catch(()=>{});
  landing.classList.add('hide');
  setTimeout(()=>{landing.style.display='none';content.classList.add('active');toast('Welcome to the blue universe ✦');},800);
});

/* Navigation */
function movePill(target){
  const item=[...liquidItems].find(x=>x.dataset.target===target); if(!item)return;
  const index=[...liquidItems].indexOf(item); pill.style.transform=`translateX(${index*100}%)`;
  liquidItems.forEach(x=>x.classList.toggle('active',x===item));
}
function showView(target,updateHash=true){
  pages.forEach(p=>p.classList.toggle('active',p.id===target));
  navs.forEach(n=>n.classList.toggle('active',n.dataset.target===target));
  movePill(target); window.scrollTo({top:0,behavior:'smooth'});
  if(updateHash) history.replaceState(null,'','#'+target.replace('-view',''));
}
[...navs,...liquidItems].forEach(item=>item.addEventListener('click',e=>{e.preventDefault();showView(item.dataset.target);closeMenu();}));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));

/* Music */
let muted=false; musicBtn.addEventListener('click',()=>{muted=!muted;music.muted=muted;musicBtn.textContent=muted?'🔇':'♫';musicBtn.classList.toggle('muted',muted);toast(muted?'Music muted':'Music on ✦');});

/* Sidebar */
const menu=$('#menu-btn'), sidebar=$('#sidebar-menu'), overlay=$('#sidebar-overlay'), close=$('#close-sidebar');
function openMenu(){sidebar.classList.add('open');overlay.classList.add('open')};function closeMenu(){sidebar.classList.remove('open');overlay.classList.remove('open')};
menu.addEventListener('click',openMenu);close.addEventListener('click',closeMenu);overlay.addEventListener('click',closeMenu);

/* Toast */
let toastTimer;function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('toast-show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('toast-show'),1800)}

/* Interactive cursor glow + tilt */
const glow=$('#cursor-glow');let mx=innerWidth/2,my=innerHeight/2;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;glow.style.left=mx+'px';glow.style.top=my+'px';});
$$('.tilt-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`rotateY(${x*10}deg) rotateX(${y*-10}deg) rotate(5deg)`}));
$$('.tilt-card').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform='rotate(5deg)'));

/* Album slider: arrows + mouse/touch drag */
const slider=$('#card-slider'), cards=$$('.memory-card'), counter=$('#slider-counter'), progress=$('#slider-progress');let index=0,drag=false,startX=0,startScroll=0;
function sliderUpdate(){const width=cards[0].getBoundingClientRect().width+22;index=Math.max(0,Math.min(cards.length-1,Math.round(slider.scrollLeft/width)));counter.textContent=`0${index+1} / 0${cards.length}`;progress.style.width=`${((index+1)/cards.length)*100}%`}
$('.next').addEventListener('click',()=>slider.scrollBy({left:cards[0].getBoundingClientRect().width+22,behavior:'smooth'}));$('.prev').addEventListener('click',()=>slider.scrollBy({left:-(cards[0].getBoundingClientRect().width+22),behavior:'smooth'}));
slider.addEventListener('scroll',()=>requestAnimationFrame(sliderUpdate));
slider.addEventListener('pointerdown',e=>{drag=true;startX=e.clientX;startScroll=slider.scrollLeft;slider.classList.add('dragging');slider.setPointerCapture(e.pointerId)});
slider.addEventListener('pointermove',e=>{if(drag)slider.scrollLeft=startScroll-(e.clientX-startX)*1.2});slider.addEventListener('pointerup',()=>{drag=false;slider.classList.remove('dragging');});slider.addEventListener('pointercancel',()=>{drag=false;slider.classList.remove('dragging')});

/* Particle background */
const canvas=$('#bg-canvas'),ctx=canvas.getContext('2d');let particles=[];function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);particles=Array.from({length:Math.min(90,Math.floor(innerWidth/14))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.6+.3,v:(Math.random()-.5)*.22,a:Math.random()*.5+.12}))}resize();addEventListener('resize',resize);
function drawParticles(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of particles){p.x+=p.v;p.y-=.08;if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;if(p.y<0)p.y=innerHeight;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(100,205,255,${p.a})`;ctx.fill()}requestAnimationFrame(drawParticles)}drawParticles();

/* Sonic-style blue speedster canvas animation. Drawn locally, no external asset needed. */
function sonicAnimation(canvas){if(!canvas)return;const c=canvas.getContext('2d'),dpr=devicePixelRatio||1,w=canvas.width,h=canvas.height;let t=0;
function frame(){t+=.07;c.clearRect(0,0,w,h);const cx=w*.5+Math.sin(t)*4,cy=h*.54+Math.sin(t*2)*3,s=Math.min(w,h)/300;
// speed streaks
c.strokeStyle='rgba(78,199,255,.25)';c.lineWidth=3*s;for(let i=0;i<7;i++){const yy=h*(.3+i*.08);const len=35+((i*23+Math.floor(t*30))%70);c.beginPath();c.moveTo(w*.05,yy);c.lineTo(w*.05+len*s,yy);c.stroke()}
// shadow
c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(cx,cy+75*s,62*s,13*s,0,0,Math.PI*2);c.fill();
// legs
c.strokeStyle='#102d5e';c.lineWidth=13*s;c.lineCap='round';c.beginPath();c.moveTo(cx-20*s,cy+38*s);c.lineTo(cx-38*s,cy+69*s);c.moveTo(cx+20*s,cy+38*s);c.lineTo(cx+42*s,cy+60*s);c.stroke();
// red shoes
c.fillStyle='#e52f43';c.beginPath();c.ellipse(cx-48*s,cy+72*s,31*s,12*s,-.12,0,Math.PI*2);c.ellipse(cx+48*s,cy+63*s,31*s,12*s,.1,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.fillRect(cx-64*s,cy+68*s,30*s,5*s);c.fillRect(cx+34*s,cy+59*s,30*s,5*s);
// torso
c.fillStyle='#1179d9';c.beginPath();c.ellipse(cx,cy+20*s,49*s,57*s,0,0,Math.PI*2);c.fill();
// arms
c.strokeStyle='#1179d9';c.lineWidth=16*s;c.beginPath();c.moveTo(cx-40*s,cy+10*s);c.lineTo(cx-72*s,cy-6*s);c.moveTo(cx+40*s,cy+5*s);c.lineTo(cx+72*s,cy-18*s);c.stroke();
// white gloves
c.fillStyle='#fff';c.beginPath();c.arc(cx-78*s,cy-8*s,13*s,0,Math.PI*2);c.arc(cx+78*s,cy-22*s,13*s,0,Math.PI*2);c.fill();
// quills
c.fillStyle='#0863c5';c.beginPath();c.moveTo(cx-38*s,cy-25*s);c.lineTo(cx-92*s,cy-55*s);c.lineTo(cx-47*s,cy-55*s);c.lineTo(cx-105*s,cy-88*s);c.lineTo(cx-25*s,cy-62*s);c.lineTo(cx-5*s,cy-92*s);c.lineTo(cx+20*s,cy-47*s);c.closePath();c.fill();
// face
c.fillStyle='#1179d9';c.beginPath();c.ellipse(cx,cy-28*s,47*s,43*s,0,0,Math.PI*2);c.fill();c.fillStyle='#f1c5a2';c.beginPath();c.ellipse(cx+16*s,cy-12*s,29*s,28*s,0,0,Math.PI*2);c.fill();
// ears
c.fillStyle='#1179d9';c.beginPath();c.moveTo(cx-33*s,cy-57*s);c.lineTo(cx-27*s,cy-88*s);c.lineTo(cx-8*s,cy-62*s);c.moveTo(cx+25*s,cy-60*s);c.lineTo(cx+38*s,cy-88*s);c.lineTo(cx+44*s,cy-53*s);c.fill();
// eyes
c.fillStyle='#fff';c.beginPath();c.ellipse(cx+2*s,cy-32*s,11*s,18*s,0,0,Math.PI*2);c.ellipse(cx+23*s,cy-31*s,11*s,18*s,0,0,Math.PI*2);c.fill();c.fillStyle='#111';c.beginPath();c.arc(cx+5*s,cy-30*s,5*s,0,Math.PI*2);c.arc(cx+26*s,cy-29*s,5*s,0,Math.PI*2);c.fill();
// nose + smile
c.fillStyle='#101b2d';c.beginPath();c.arc(cx+40*s,cy-8*s,5*s,0,Math.PI*2);c.fill();c.strokeStyle='#9a3b3b';c.lineWidth=2*s;c.beginPath();c.arc(cx+29*s,cy+3*s,15*s,.15,1.35);c.stroke();
requestAnimationFrame(frame)}frame()}
sonicAnimation($('#sonic-canvas'));sonicAnimation($('#sonic-small'));sonicAnimation($('#sonic-about'));

/* Initial state / hash */
const hash=location.hash.replace('#','');if(hash==='album'||hash==='story')showView(hash==='album'?'album-view':'about-view',false);else{showView('home-view',false)}
