/* NEZZA — interactions */
(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const landing=$('#landing-page'),content=$('#content-area'),enter=$('#enter-btn'),music=$('#bg-music'),musicBtn=$('#music-toggle-btn');
const pages=$$('.view-page'),navs=$$('.nav-item'),indicator=$('#liquid-indicator'),sidebar=$('#liquid-sidebar'),toggle=$('#sidebar-toggle');
const fix=document.createElement('style');fix.textContent=`
.main-photo-card{display:none!important}
.dora-stage{overflow:visible!important;display:block!important;perspective:900px!important;perspective-origin:50% 48%!important;transform-style:preserve-3d!important}
.doraemon{left:50%!important;bottom:25px!important;width:170px!important;height:310px!important;transform:translateX(-50%) rotateX(0deg) rotateY(0deg)!important;transform-origin:50% 75%!important;transform-style:preserve-3d!important;will-change:transform;filter:drop-shadow(0 24px 20px rgba(0,50,120,.3))!important}
.doraemon>*{transform-style:preserve-3d}.dora-head,.dora-body{overflow:visible!important}
.dora-head:before{content:'';position:absolute;inset:5px -7px -7px 5px;border-radius:50%;background:linear-gradient(145deg,#0878c7,#034c82);z-index:-1;filter:blur(.3px)}
.dora-body:before{content:'';position:absolute;inset:6px -8px -8px 6px;border-radius:46% 46% 38% 38%;background:#034d85;z-index:-1}
.dora-face{box-shadow:inset -10px -12px 15px rgba(0,45,100,.12),inset 7px 5px 12px rgba(255,255,255,.55),0 5px 10px rgba(0,50,100,.13)!important}
.dora-belly{box-shadow:inset -9px -11px 15px rgba(0,45,90,.14),inset 8px 5px 12px rgba(255,255,255,.55)!important}
.dora-eye.left{left:26px!important}.dora-eye.right{left:51px!important}.dora-nose{left:47px!important;top:49px!important;box-shadow:inset -3px -3px 4px rgba(100,0,0,.22),0 2px 4px rgba(0,0,0,.12)}.dora-mouth{left:45px!important;top:64px!important}
.dora-pocket{left:40px!important;top:45px!important;width:50px!important;height:42px!important;border-radius:0 0 25px 25px!important;background:linear-gradient(180deg,#fff,#edf5fb 72%,#d7e5ef)!important;border:2px solid #b8ccda!important;box-shadow:inset 0 3px 4px rgba(255,255,255,.7),inset -5px -5px 8px rgba(0,45,90,.1),0 2px 4px rgba(0,45,90,.08)!important}
.dora-collar{left:5px!important;top:6px!important;width:120px!important;height:14px!important}.dora-bell{left:51px!important;top:12px!important;width:28px!important;height:28px!important;box-shadow:inset -4px -5px 7px rgba(130,70,0,.25),0 3px 5px rgba(0,0,0,.15)}
.dora-arm.left{left:-3px!important}.dora-arm.right{right:-3px!important}.dora-foot.left{left:17px!important}.dora-foot.right{right:17px!important}.dora-propeller{left:50%!important;top:-48px!important}.dora-ring{pointer-events:none!important}
.doraemon:hover{transform:translateX(-50%) translateY(-7px) rotateX(0deg) rotateY(-7deg) scale(1.025)!important}
.dora-stage.running .doraemon{animation:doraFloat3D .7s ease-in-out infinite alternate!important}
@keyframes doraFloat3D{from{transform:translateX(-50%) translateY(0) rotateX(0deg) rotateY(-1deg) scale(1)}to{transform:translateX(-50%) translateY(-10px) rotateX(2deg) rotateY(3deg) scale(1.018)}}
.dora-stage.talk .dora-mouth{animation:mouthTalk .18s ease-in-out infinite alternate!important;transform-origin:center top}@keyframes mouthTalk{from{transform:scaleY(.7)}to{transform:scaleY(1.15)}}
.dora-stage.talk .dora-head{animation:headTalk .22s ease-in-out infinite alternate}@keyframes headTalk{from{transform:translateZ(0)}to{transform:translateZ(3px)}}
@media(max-width:600px){.dora-stage{perspective:760px!important}.doraemon{transform:translateX(-50%) rotateX(0) rotateY(0)!important}}
`;
document.head.appendChild(fix);
function indicatorMove(item){if(!indicator||!item)return;const n=item.closest('.liquid-nav'),a=n.getBoundingClientRect(),b=item.getBoundingClientRect(),size=innerWidth<=480?52:56;indicator.style.width=indicator.style.height=size+'px';indicator.style.transform=`translateX(${b.left-a.left+b.width/2-size/2}px)`}
function showView(id,hash=true){const page=document.getElementById(id);if(!page)return;pages.forEach(p=>p.classList.toggle('active',p===page));navs.forEach(n=>n.classList.toggle('active',n.dataset.target===id));$$('.sidebar-link').forEach(n=>n.classList.toggle('active',n.dataset.target===id));indicatorMove(navs.find(n=>n.dataset.target===id));if(hash)history.replaceState(null,'','#'+id.replace('-view',''));$$('.reveal',page).forEach((e,i)=>{e.style.setProperty('--reveal-delay',Math.min(i*70,350)+'ms');e.classList.add('revealed')});scrollTo({top:0,behavior:'smooth'});sidebar?.classList.remove('open');toggle?.classList.remove('active')}
navs.forEach(n=>n.addEventListener('click',()=>showView(n.dataset.target)));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
$$('.sidebar-link[data-target]').forEach(n=>n.addEventListener('click',()=>showView(n.dataset.target)));toggle?.addEventListener('click',()=>{sidebar.classList.toggle('open');toggle.classList.toggle('active')});
$('#sidebar-music')?.addEventListener('click',()=>music?.paused?music?.play():music?.pause());
enter?.addEventListener('click',async()=>{try{await music?.play()}catch{}landing?.classList.add('hide');setTimeout(()=>{landing&&(landing.style.display='none');content?.classList.add('active');indicatorMove($('.nav-item.active'))},800)});
musicBtn?.addEventListener('click',()=>{if(!music)return;music.muted=!music.muted;musicBtn.textContent=music.muted?'🔇':'♪'});
const slider=$('#card-slider'),cards=$$('.memory-card',slider||document),prev=$('#prev-card'),next=$('#next-card'),count=$('#slider-count'),bar=$('#slider-bar');const step=()=>{const c=cards[0];return c?c.getBoundingClientRect().width+(parseFloat(getComputedStyle(slider).gap)||0):0};const state=()=>{if(!slider||!cards.length)return;const s=step(),i=Math.max(0,Math.min(cards.length-1,Math.round(slider.scrollLeft/s)));if(count)count.textContent=String(i+1).padStart(2,'0');if(bar)bar.style.width=((i+1)/cards.length*100)+'%';if(prev)prev.disabled=i===0;if(next)next.disabled=i===cards.length-1};prev?.addEventListener('click',()=>slider?.scrollBy({left:-step(),behavior:'smooth'}));next?.addEventListener('click',()=>slider?.scrollBy({left:step(),behavior:'smooth'}));slider?.addEventListener('scroll',state,{passive:true});
const canvas=$('#space-canvas'),ctx=canvas?.getContext('2d');let particles=[],raf;function resize(){if(!canvas||!ctx)return;const r=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*r;canvas.height=innerHeight*r;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(r,0,0,r,0,0);particles=Array.from({length:Math.min(110,Math.max(45,Math.floor(innerWidth/14)))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.35,sx:(Math.random()-.5)*.18,sy:Math.random()*.18+.03,a:Math.random()*.45+.1,p:Math.random()*6.28}))}function stars(){if(!ctx)return;ctx.clearRect(0,0,innerWidth,innerHeight);particles.forEach(p=>{p.x+=p.sx;p.y-=p.sy;p.p+=.012;if(p.x<-10)p.x=innerWidth+10;if(p.x>innerWidth+10)p.x=-10;if(p.y<-10)p.y=innerHeight+10;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fillStyle=`rgba(120,215,255,${p.a+(Math.sin(p.p)+1)*.12})`;ctx.fill()});raf=requestAnimationFrame(stars)}addEventListener('resize',()=>{resize();indicatorMove($('.nav-item.active'));state()});resize();stars();
const h=location.hash.replace('#','');showView(h==='album'?'album-view':h==='story'?'story-view':'home-view',false);state();
const stage=$('#dora-stage'),dora=$('#doraemon'),bubble=$('#dora-bubble');if(!stage||!dora)return;const sounds=['Wah!','Hehehe!','Waaah!','Ayo!','Asyik!','Hore!'];
function pickIndoVoice(){if(!('speechSynthesis'in window))return null;const voices=speechSynthesis.getVoices();return voices.find(v=>/^id(-|_)/i.test(v.lang))||voices.find(v=>/indonesian|bahasa/i.test(v.name))||null}
function speak(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),voice=pickIndoVoice();if(voice)u.voice=voice;u.lang=voice?.lang||'id-ID';u.rate=.78;u.pitch=1.7;u.volume=1;speechSynthesis.speak(u)}
function react(){const text=sounds[Math.floor(Math.random()*sounds.length)];bubble&&(bubble.textContent='✦');stage.classList.remove('talk','running','bounce','spin-gadget');void stage.offsetWidth;stage.classList.add('talk','running','bounce','spin-gadget');speak(text);setTimeout(()=>stage.classList.remove('running','bounce','spin-gadget'),2200);setTimeout(()=>stage.classList.remove('talk'),2200)}
dora.addEventListener('click',react);dora.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();react()}});
let tx=0,ty=0,cx=0,cy=0;function move3D(e){if(innerWidth<=600)return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tx=Math.max(-1,Math.min(1,x))*8;ty=Math.max(-1,Math.min(1,y))*-5}function reset3D(){tx=0;ty=0}stage.addEventListener('pointermove',move3D,{passive:true});stage.addEventListener('pointerleave',reset3D);function render3D(){cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;if(!stage.classList.contains('running'))dora.style.transform=`translateX(-50%) rotateX(${cy}deg) rotateY(${cx}deg) translateZ(0)`;requestAnimationFrame(render3D)}render3D();
})();

/* ===== REAL-TIME THREE.JS DORAEMON ===== */
(async()=>{
  const stage=document.getElementById('dora-stage');if(!stage)return;
  try{
    const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js');
    stage.innerHTML='';
    const wrap=document.createElement('div');wrap.className='dora-3d-wrap';Object.assign(wrap.style,{position:'absolute',inset:'0',width:'100%',height:'100%',cursor:'grab'});stage.appendChild(wrap);
    const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(28,1,.1,100);camera.position.set(0,1.05,7.2);camera.lookAt(0,.85,0);
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x000000,0);Object.assign(renderer.domElement.style,{width:'100%',height:'100%',display:'block'});wrap.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0x9edcff,0x06142e,2.2));const key=new THREE.DirectionalLight(0xffffff,3.4);key.position.set(-3,5,5);key.castShadow=true;scene.add(key);const rim=new THREE.PointLight(0x1d8cff,2.8,12);rim.position.set(3,1,4);scene.add(rim);
    const root=new THREE.Group();root.position.y=-.05;scene.add(root);
    const blue=new THREE.MeshStandardMaterial({color:0x0798ed,roughness:.32,metalness:.03}),white=new THREE.MeshStandardMaterial({color:0xf4f8fb,roughness:.3}),dark=new THREE.MeshStandardMaterial({color:0x101826,roughness:.25}),red=new THREE.MeshStandardMaterial({color:0xd9213d,roughness:.3}),yellow=new THREE.MeshStandardMaterial({color:0xffc928,roughness:.24,metalness:.15});
    const sphere=new THREE.SphereGeometry(1,48,32);const add=(g,m,pos,scale,par=root)=>{const o=new THREE.Mesh(g,m);o.position.set(...pos);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;par.add(o);return o};
    /* perfectly centered head */
    add(sphere,blue,[0,1.65,0],[1.38,1.38,1.25]);add(sphere,white,[0,1.48,1.02],[1.02,.88,.34]);
    [-.34,.34].forEach(x=>{add(sphere,white,[x,1.78,1.38],[.27,.36,.18]);add(sphere,dark,[x,1.78,1.545],[.105,.145,.055])});add(sphere,red,[0,1.43,1.52],[.145,.145,.12]);
    const tube=(points,m,r=.02)=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,r,8,false),m,[0,0,0],[1,1,1]);
    tube([new THREE.Vector3(-.28,1.22,1.36),new THREE.Vector3(-.14,1.12,1.47),new THREE.Vector3(0,1.1,1.48),new THREE.Vector3(.14,1.12,1.47),new THREE.Vector3(.28,1.22,1.36)],dark,.025);
    [-1,1].forEach(s=>{tube([new THREE.Vector3(s*.55,1.43,1.30),new THREE.Vector3(s*.88,1.37,1.29),new THREE.Vector3(s*1.08,1.35,1.27)],dark,.018);tube([new THREE.Vector3(s*.58,1.52,1.31),new THREE.Vector3(s*.91,1.55,1.29),new THREE.Vector3(s*1.08,1.59,1.27)],dark,.018);tube([new THREE.Vector3(s*.56,1.34,1.31),new THREE.Vector3(s*.89,1.27,1.28),new THREE.Vector3(s*1.07,1.24,1.26)],dark,.018)});
    /* body, belly, pocket */
    add(sphere,blue,[0,.18,0],[1.05,1.22,.82]);add(sphere,white,[0,.35,.73],[.62,.72,.22]);add(new THREE.BoxGeometry(1,1,1),white,[0,.38,.94],[.53,.30,.08]);
    const collar=add(new THREE.TorusGeometry(.86,.10,18,64),red,[0,1.02,0]);collar.rotation.x=Math.PI/2;add(sphere,yellow,[0,.87,.87],[.22,.22,.16]);add(new THREE.CylinderGeometry(.025,.025,.13,16),dark,[0,.78,1.01]);
    [-1,1].forEach(s=>{const arm=add(sphere,blue,[s*1.0,.2,0],[.42,.72,.48]);arm.rotation.z=s*.22;add(sphere,white,[s*1.14,-.08,.08],[.43,.43,.40])});[-1,1].forEach(s=>add(sphere,white,[s*.48,-.93,.12],[.62,.29,.48]));
    /* centered propeller */
    const prop=new THREE.Group();prop.position.set(0,3.2,0);root.add(prop);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.65,20),yellow);shaft.position.y=.3;shaft.castShadow=true;prop.add(shaft);
    [-1,1].forEach(s=>{const b=new THREE.Mesh(sphere,yellow);b.position.x=s*.47;b.scale.set(.62,.08,.14);b.rotation.z=s*.12;b.castShadow=true;prop.add(b)});
    const ground=new THREE.Mesh(new THREE.CircleGeometry(1.35,64),new THREE.ShadowMaterial({opacity:.18}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.22;ground.scale.set(1.25,.72,1);ground.receiveShadow=true;scene.add(ground);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.75,.008,8,128),new THREE.MeshBasicMaterial({color:0x1b9fff,transparent:true,opacity:.18}));ring.rotation.x=Math.PI/2;ring.position.y=.75;scene.add(ring);
    let targetX=0,targetY=0,rotX=0,rotY=0,busy=false;
    const pointer=e=>{const r=wrap.getBoundingClientRect();targetY=(((e.clientX-r.left)/r.width)-.5)*.34;targetX=-(((e.clientY-r.top)/r.height)-.5)*.12};wrap.addEventListener('pointermove',pointer,{passive:true});wrap.addEventListener('pointerleave',()=>{targetX=0;targetY=0});wrap.addEventListener('pointerdown',()=>wrap.style.cursor='grabbing');addEventListener('pointerup',()=>wrap.style.cursor='grab');
    function resize(){const r=wrap.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}resize();addEventListener('resize',resize);
    function react(){if(busy)return;busy=true;const start=performance.now();const animate=now=>{const t=Math.min(1,(now-start)/700),b=Math.sin(t*Math.PI);root.position.y=-.05+b*.18;root.scale.setScalar(1+b*.035);if(t<1)requestAnimationFrame(animate);else{root.position.y=-.05;root.scale.setScalar(1);busy=false}};requestAnimationFrame(animate);if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(['Wah!','Hehehe!','Waaah!','Ayo!','Asyik!','Hore!'][Math.floor(Math.random()*6)]);u.lang='id-ID';u.rate=.78;u.pitch=1.65;u.volume=1;speechSynthesis.speak(u)}}wrap.addEventListener('click',react);
    let last=performance.now();function render(now){const dt=Math.min(.05,(now-last)/1000);last=now;rotY+=(targetY-rotY)*.07;rotX+=(targetX-rotX)*.07;root.rotation.y=rotY;root.rotation.x=rotX;prop.rotation.y+=dt*5.5;ring.rotation.z+=dt*.12;renderer.render(scene,camera);requestAnimationFrame(render)}requestAnimationFrame(render);
  }catch(err){console.warn('Three.js Doraemon failed:',err)}
})();