/* NEZZA — interactions + procedural Three.js Doraemon */
(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const landing=$('#landing-page'),content=$('#content-area'),enter=$('#enter-btn'),music=$('#bg-music'),musicBtn=$('#music-toggle-btn');
const pages=$$('.view-page'),navs=$$('.nav-item'),indicator=$('#liquid-indicator'),sidebar=$('#liquid-sidebar'),toggle=$('#sidebar-toggle');

/* Hide the old square photo: the hero now focuses on the 3D character. */
const fix=document.createElement('style');fix.textContent=`
.main-photo-card{display:none!important}
.dora-stage{overflow:visible!important;position:relative!important;display:block!important;perspective:1000px!important;transform-style:preserve-3d!important}
.dora-3d-wrap{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:visible!important}
.dora-3d-wrap canvas{touch-action:none!important}
.dora-stage .dora-bubble{z-index:30!important}
`;document.head.appendChild(fix);

function indicatorMove(item){if(!indicator||!item)return;const n=item.closest('.liquid-nav'),a=n?.getBoundingClientRect(),b=item.getBoundingClientRect();if(!a)return;const size=innerWidth<=480?52:56;indicator.style.width=indicator.style.height=size+'px';indicator.style.transform=`translateX(${b.left-a.left+b.width/2-size/2}px)`}
function showView(id,hash=true){const page=document.getElementById(id);if(!page)return;pages.forEach(p=>p.classList.toggle('active',p===page));navs.forEach(n=>n.classList.toggle('active',n.dataset.target===id));$$('.sidebar-link').forEach(n=>n.classList.toggle('active',n.dataset.target===id));indicatorMove(navs.find(n=>n.dataset.target===id));if(hash)history.replaceState(null,'','#'+id.replace('-view',''));$$('.reveal',page).forEach((e,i)=>{e.style.setProperty('--reveal-delay',Math.min(i*70,350)+'ms');e.classList.add('revealed')});scrollTo({top:0,behavior:'smooth'});sidebar?.classList.remove('open');toggle?.classList.remove('active')}
navs.forEach(n=>n.addEventListener('click',()=>showView(n.dataset.target)));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));$$('.sidebar-link[data-target]').forEach(n=>n.addEventListener('click',()=>showView(n.dataset.target)));
toggle?.addEventListener('click',()=>{sidebar?.classList.toggle('open');toggle?.classList.toggle('active')});
$('#sidebar-music')?.addEventListener('click',()=>music?.paused?music?.play():music?.pause());
enter?.addEventListener('click',async()=>{try{await music?.play()}catch{}landing?.classList.add('hide');setTimeout(()=>{if(landing)landing.style.display='none';content?.classList.add('active');indicatorMove($('.nav-item.active'))},800)});
musicBtn?.addEventListener('click',()=>{if(!music)return;music.muted=!music.muted;musicBtn.textContent=music.muted?'🔇':'♪'});

/* Memory slider */
const slider=$('#card-slider'),cards=$$('.memory-card',slider||document),prev=$('#prev-card'),next=$('#next-card'),count=$('#slider-count'),bar=$('#slider-bar');
const step=()=>{const c=cards[0];return c?c.getBoundingClientRect().width+(parseFloat(getComputedStyle(slider).gap)||0):0};
const state=()=>{if(!slider||!cards.length)return;const s=step(),i=Math.max(0,Math.min(cards.length-1,Math.round(slider.scrollLeft/s)));if(count)count.textContent=String(i+1).padStart(2,'0');if(bar)bar.style.width=((i+1)/cards.length*100)+'%';if(prev)prev.disabled=i===0;if(next)next.disabled=i===cards.length-1};
prev?.addEventListener('click',()=>slider?.scrollBy({left:-step(),behavior:'smooth'}));next?.addEventListener('click',()=>slider?.scrollBy({left:step(),behavior:'smooth'}));slider?.addEventListener('scroll',state,{passive:true});

/* Background stars */
const canvas=$('#space-canvas'),ctx=canvas?.getContext('2d');let particles=[],raf;
function resize(){if(!canvas||!ctx)return;const r=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*r;canvas.height=innerHeight*r;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(r,0,0,r,0,0);particles=Array.from({length:Math.min(110,Math.max(45,Math.floor(innerWidth/14)))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.35,sx:(Math.random()-.5)*.18,sy:Math.random()*.18+.03,a:Math.random()*.45+.1,p:Math.random()*6.28}))}
function stars(){if(!ctx)return;ctx.clearRect(0,0,innerWidth,innerHeight);particles.forEach(p=>{p.x+=p.sx;p.y-=p.sy;p.p+=.012;if(p.x<-10)p.x=innerWidth+10;if(p.x>innerWidth+10)p.x=-10;if(p.y<-10)p.y=innerHeight+10;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fillStyle=`rgba(120,215,255,${p.a+(Math.sin(p.p)+1)*.12})`;ctx.fill()});raf=requestAnimationFrame(stars)}
resize();stars();addEventListener('resize',()=>{resize();indicatorMove($('.nav-item.active'));state()});
const h=location.hash.replace('#','');showView(h==='album'?'album-view':h==='story'?'story-view':'home-view',false);state();

/* ===== REAL-TIME PROCEDURAL THREE.JS DORAEMON ===== */
(async()=>{
 const stage=$('#dora-stage');if(!stage)return;
 try{
  const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js');
  stage.innerHTML='';
  const wrap=document.createElement('div');wrap.className='dora-3d-wrap';stage.appendChild(wrap);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(27,1,.1,100);camera.position.set(0,1.05,7.6);camera.lookAt(0,.82,0);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0,0);Object.assign(renderer.domElement.style,{width:'100%',height:'100%',display:'block'});wrap.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xb9e9ff,0x08162d,2.2));
  const key=new THREE.DirectionalLight(0xffffff,3.6);key.position.set(-3.5,5.5,5.5);key.castShadow=true;scene.add(key);
  const fill=new THREE.PointLight(0x55b9ff,2.3,12);fill.position.set(3,1.5,4);scene.add(fill);
  const warm=new THREE.PointLight(0xffe2a2,1.1,8);warm.position.set(-2,-.5,3);scene.add(warm);

  const root=new THREE.Group();root.position.y=-.25;scene.add(root);
  const blue=new THREE.MeshStandardMaterial({color:0x0798ed,roughness:.3,metalness:.02});
  const blueDark=new THREE.MeshStandardMaterial({color:0x045b9b,roughness:.34});
  const white=new THREE.MeshStandardMaterial({color:0xf7fafc,roughness:.28});
  const dark=new THREE.MeshStandardMaterial({color:0x0b1420,roughness:.2});
  const red=new THREE.MeshStandardMaterial({color:0xd61f3b,roughness:.3});
  const yellow=new THREE.MeshStandardMaterial({color:0xffca28,roughness:.22,metalness:.15});
  const black=new THREE.MeshStandardMaterial({color:0x15191e,roughness:.25});
  const sphere=new THREE.SphereGeometry(1,56,40);
  const add=(g,m,pos,scale,par=root)=>{const o=new THREE.Mesh(g,m);o.position.set(...pos);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;par.add(o);return o};

  /* Body: round, compact, symmetric. */
  add(sphere,blue,[0,.15,0],[1.03,1.18,.84]);
  add(sphere,blueDark,[0,.10,-.34],[.78,.92,.42]);
  add(sphere,white,[0,.34,.72],[.64,.74,.20]);

  /* Head: large and centered, with a soft blue back rim. */
  add(sphere,blue,[0,1.62,0],[1.39,1.39,1.27]);
  add(sphere,blueDark,[0,1.57,-.28],[1.27,1.29,.95]);
  add(sphere,white,[0,1.48,1.04],[1.04,.90,.34]);

  /* Eyes + pupils aligned on one horizontal axis. */
  [-.34,.34].forEach(x=>{
    add(sphere,white,[x,1.80,1.38],[.275,.365,.19]);
    add(sphere,dark,[x,1.80,1.555],[.105,.15,.055]);
  });
  add(sphere,red,[0,1.45,1.535],[.145,.145,.125]);
  add(sphere,red,[0,1.455,1.64],[.048,.048,.035]);

  /* Mouth: clean centered U curve. */
  const curve=(pts,m,r)=>new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),28,r,10,false),m);
  const mouth=curve([
    new THREE.Vector3(-.29,1.23,1.37),new THREE.Vector3(-.16,1.12,1.47),new THREE.Vector3(0,1.09,1.49),new THREE.Vector3(.16,1.12,1.47),new THREE.Vector3(.29,1.23,1.37)
  ],dark,.026);root.add(mouth);mouth.castShadow=true;

  /* Whiskers: three perfectly mirrored lines on each side. */
  [-1,1].forEach(s=>{
    [[.57,1.48,.0],[.57,1.57,.07],[.57,1.38,-.07]].forEach((v,i)=>{
      const y=[1.48,1.57,1.39][i],endX=[1.10,1.11,1.09][i],endY=[1.43,1.61,1.28][i];
      const w=curve([new THREE.Vector3(s*v[0],y,1.28),new THREE.Vector3(s*.84,(y+endY)/2,1.28),new THREE.Vector3(s*endX,endY,1.24)],dark,.016);root.add(w);
    });
  });

  /* Collar + bell. */
  const collar=add(new THREE.TorusGeometry(.86,.105,20,72),red,[0,1.00,0]);collar.rotation.x=Math.PI/2;
  add(sphere,yellow,[0,.84,.86],[.205,.205,.15]);
  const bellHole=add(new THREE.CylinderGeometry(.026,.026,.15,16),black,[0,.74,1.00]);bellHole.rotation.z=Math.PI/2;

  /* Pocket: extruded rounded-bottom shape, centered instead of a flat box. */
  const pocketShape=new THREE.Shape();pocketShape.moveTo(-.55,.28);pocketShape.lineTo(.55,.28);pocketShape.lineTo(.55,-.04);pocketShape.bezierCurveTo(.55,-.40,.28,-.58,0,-.58);pocketShape.bezierCurveTo(-.28,-.58,-.55,-.40,-.55,-.04);pocketShape.closePath();
  const pocketGeo=new THREE.ExtrudeGeometry(pocketShape,{depth:.18,bevelEnabled:true,bevelSegments:3,steps:2,bevelSize:.045,bevelThickness:.035});pocketGeo.center();
  const pocket=new THREE.Mesh(pocketGeo,white);pocket.position.set(0,.38,.91);pocket.scale.set(.78,.70,1);pocket.castShadow=true;pocket.receiveShadow=true;root.add(pocket);

  /* Arms and feet: round forms with slight depth. */
  const armL=add(sphere,blue,[-1.03,.15,.02],[.40,.54,.42]);armL.rotation.z=-.35;
  const armR=add(sphere,blue,[1.03,.15,.02],[.40,.54,.42]);armR.rotation.z=.35;
  add(sphere,white,[-1.18,-.02,.37],[.28,.30,.28]);add(sphere,white,[1.18,-.02,.37],[.28,.30,.28]);
  add(sphere,blue,[-.48,-.83,.03],[.58,.38,.65]);add(sphere,blue,[.48,-.83,.03],[.58,.38,.65]);
  add(sphere,white,[-.55,-.92,.54],[.54,.27,.32]);add(sphere,white,[.55,-.92,.54],[.54,.27,.32]);

  /* Propeller: centered shaft + two horizontal rounded blades. No leaning. */
  const prop=new THREE.Group();prop.position.set(0,3.05,.02);root.add(prop);
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.42,24),yellow);shaft.castShadow=true;prop.add(shaft);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.12,28,18),yellow);cap.position.y=.22;cap.castShadow=true;prop.add(cap);
  const bladeGeo=new THREE.CapsuleGeometry(.14,.66,10,20);
  const blade1=new THREE.Mesh(bladeGeo,yellow);blade1.rotation.z=Math.PI/2;blade1.scale.set(.72,.23,.16);blade1.position.set(-.38,.26,0);blade1.castShadow=true;prop.add(blade1);
  const blade2=new THREE.Mesh(bladeGeo,yellow);blade2.rotation.z=Math.PI/2;blade2.scale.set(.72,.23,.16);blade2.position.set(.38,.26,0);blade2.castShadow=true;prop.add(blade2);

  /* Soft ground shadow gives the character a 3D-game feel. */
  const shadowMat=new THREE.MeshBasicMaterial({color:0x0a1d35,transparent:true,opacity:.16,depthWrite:false});
  const ground=new THREE.Mesh(new THREE.CircleGeometry(1.18,48),shadowMat);ground.rotation.x=-Math.PI/2;ground.position.set(0,-1.22,.05);ground.scale.set(1.45,.62,1);scene.add(ground);

  let targetX=0,targetY=0,rotX=0,rotY=0,bounce=0,clickSpin=0;
  const bubble=$('#dora-bubble');
  const sounds=['Wah!','Hehehe!','Waaah!','Ayo!','Asyik!','Hore!'];
  function pickIndoVoice(){if(!('speechSynthesis'in window))return null;const vs=speechSynthesis.getVoices();return vs.find(v=>/^id(-|_)/i.test(v.lang))||vs.find(v=>/indonesian|bahasa/i.test(v.name))||null}
  function speak(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),v=pickIndoVoice();if(v)u.voice=v;u.lang=v?.lang||'id-ID';u.rate=.78;u.pitch=1.65;u.volume=1;speechSynthesis.speak(u)}
  function react(){const text=sounds[Math.floor(Math.random()*sounds.length)];if(bubble)bubble.textContent='✦';bounce=1;clickSpin=1;speak(text);setTimeout(()=>{if(bubble)bubble.textContent='✦'},450)}
  wrap.addEventListener('pointermove',e=>{const r=wrap.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;targetY=Math.max(-1,Math.min(1,x))*.18;targetX=Math.max(-1,Math.min(1,y))*.10},{passive:true});
  wrap.addEventListener('pointerleave',()=>{targetX=0;targetY=0});
  wrap.addEventListener('click',react);

  function fit(){const r=wrap.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  fit();addEventListener('resize',fit);
  const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();
    prop.rotation.z=Math.sin(t*1.7)*.035;prop.rotation.y=t*7.5;
    if(clickSpin){prop.rotation.y+=clickSpin*1.2;clickSpin*=.90;if(clickSpin<.01)clickSpin=0}
    bounce+=(0-bounce)*.065;
    const float=Math.sin(t*1.7)*.035;
    root.position.y=-.25+float+bounce*.20;
    root.rotation.x+=(targetX-root.rotation.x)*.06;root.rotation.y+=(targetY-root.rotation.y)*.06;
    renderer.render(scene,camera);
  }
  animate();
 }catch(err){console.warn('Three.js Doraemon failed:',err)}
})();
})();