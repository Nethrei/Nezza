/* =========================================================
   NEZZA — 3D SONIC HERO
   Procedural 3D character made with Three.js.
   No model download required.
   ========================================================= */

(() => {
  'use strict';

  const visual = document.querySelector('.hero-visual');
  if (!visual || !window.THREE) return;

  const style = document.createElement('style');
  style.textContent = `
    .hero-grid{grid-template-columns:minmax(320px,.98fr) minmax(0,1.02fr)!important;gap:clamp(24px,5vw,70px)!important}
    .hero-visual{order:1!important;min-height:540px!important;position:relative!important;display:grid!important;place-items:center!important;overflow:visible!important}
    .hero-copy{order:2!important;position:relative;z-index:10}
    .sonic3d-wrap{position:relative;width:min(590px,100%);height:min(590px,72vh);min-height:430px;display:grid;place-items:center;isolation:isolate}
    .sonic3d-wrap::before{content:'';position:absolute;inset:16% 8%;z-index:-2;border-radius:50%;background:radial-gradient(circle,rgba(26,148,255,.23),rgba(40,205,255,.06) 48%,transparent 72%);filter:blur(28px);animation:sonic3dGlow 4s ease-in-out infinite}
    .sonic3d-wrap::after{content:'';position:absolute;z-index:-2;bottom:10%;width:58%;height:12%;border-radius:50%;background:radial-gradient(ellipse,rgba(0,70,180,.34),transparent 70%);filter:blur(9px);transform:perspective(280px) rotateX(65deg)}
    #sonic3d-canvas{width:100%;height:100%;display:block;touch-action:none;cursor:grab;outline:0}
    #sonic3d-canvas:active{cursor:grabbing}
    .sonic3d-label{position:absolute;left:3%;bottom:10%;display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(3,15,35,.38);backdrop-filter:blur(16px);color:#c8edff;font-size:8px;font-weight:800;letter-spacing:.15em;box-shadow:0 12px 30px rgba(0,45,120,.16);pointer-events:none}
    .sonic3d-dot{width:6px;height:6px;border-radius:50%;background:#53dcff;box-shadow:0 0 15px #53dcff;animation:sonic3dPulse 1.5s infinite}
    .sonic3d-speech{position:absolute;right:1%;top:13%;max-width:205px;padding:13px 15px;border:1px solid rgba(92,220,255,.3);border-radius:18px 18px 5px 18px;background:rgba(4,22,52,.48);backdrop-filter:blur(18px);color:#edfaff;font-size:10px;line-height:1.55;box-shadow:0 16px 40px rgba(0,45,130,.18);opacity:0;transform:translateY(8px) scale(.96);transition:.35s cubic-bezier(.2,.8,.2,1);pointer-events:none}
    .sonic3d-speech.show{opacity:1;transform:none}
    .sonic3d-ring{position:absolute;border:2px solid rgba(255,211,62,.72);border-radius:50%;box-shadow:0 0 18px rgba(255,205,55,.25);opacity:0;pointer-events:none}
    .sonic3d-ring.r1{width:22px;height:22px;left:8%;top:45%}.sonic3d-ring.r2{width:16px;height:16px;right:7%;top:55%}.sonic3d-ring.r3{width:18px;height:18px;left:18%;top:22%}
    .sonic3d-wrap.running .sonic3d-ring{animation:ringBurst .8s ease-out infinite}.sonic3d-wrap.running .r2{animation-delay:.18s}.sonic3d-wrap.running .r3{animation-delay:.36s}
    .sonic3d-hint{position:absolute;bottom:4%;left:50%;transform:translateX(-50%);font-size:7px;font-weight:800;letter-spacing:.14em;color:rgba(255,255,255,.6);white-space:nowrap;pointer-events:none}
    @keyframes sonic3dGlow{0%,100%{transform:scale(.96);opacity:.65}50%{transform:scale(1.07);opacity:1}}
    @keyframes sonic3dPulse{0%,100%{transform:scale(.75);opacity:.45}50%{transform:scale(1.15);opacity:1}}
    @keyframes ringBurst{0%{opacity:0;transform:scale(.45) translateY(0)}30%{opacity:1}100%{opacity:0;transform:scale(1.8) translateY(-30px)}}
    @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.hero-visual{order:1!important;min-height:390px!important}.hero-copy{order:2!important;text-align:center}.sonic3d-wrap{height:430px;min-height:350px}.sonic3d-speech{right:4%;top:8%}}
    @media(max-width:600px){.hero-visual{min-height:315px!important}.sonic3d-wrap{height:330px;min-height:280px}.sonic3d-speech{right:0;top:4%;max-width:150px;font-size:8px;padding:10px 12px}.sonic3d-label{left:0;bottom:8%;font-size:7px}.sonic3d-hint{bottom:2%}}
  `;
  document.head.appendChild(style);

  visual.innerHTML = `
    <div class="sonic3d-wrap" id="sonic3d-wrap">
      <canvas id="sonic3d-canvas" aria-label="Sonic 3D interaktif"></canvas>
      <div class="sonic3d-speech" id="sonic3d-speech">Hey! 👋 Ayo lanjut jelajahi cerita ini.</div>
      <i class="sonic3d-ring r1"></i><i class="sonic3d-ring r2"></i><i class="sonic3d-ring r3"></i>
      <div class="sonic3d-label"><span class="sonic3d-dot"></span> SONIC ONLINE · MOVE YOUR CURSOR</div>
      <div class="sonic3d-hint">CLICK SONIC ✦</div>
    </div>
  `;

  const THREE = window.THREE;
  const wrap = document.getElementById('sonic3d-wrap');
  const canvas = document.getElementById('sonic3d-canvas');
  const speech = document.getElementById('sonic3d-speech');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.45, 6.8);
  camera.lookAt(0, 1.25, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  scene.add(new THREE.HemisphereLight(0xcfefff, 0x07152f, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 4.1);
  key.position.set(-4, 7, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); scene.add(key);
  const rim = new THREE.DirectionalLight(0x3aa9ff, 3.5); rim.position.set(5, 3, -4); scene.add(rim);
  const fill = new THREE.PointLight(0x59dfff, 2.2, 9); fill.position.set(-3, 1.5, 3); scene.add(fill);

  const blue = new THREE.MeshStandardMaterial({ color: 0x087df2, roughness: .34, metalness: .05 });
  const darkBlue = new THREE.MeshStandardMaterial({ color: 0x0453b9, roughness: .38, metalness: .02 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xf1b27d, roughness: .62 });
  const white = new THREE.MeshStandardMaterial({ color: 0xfafcff, roughness: .25 });
  const red = new THREE.MeshStandardMaterial({ color: 0xe72d3f, roughness: .28 });
  const black = new THREE.MeshStandardMaterial({ color: 0x07111f, roughness: .2 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xffd23f, emissive: 0x6d4300, emissiveIntensity: .55, metalness: .35, roughness: .2 });

  const sonic = new THREE.Group();
  sonic.position.y = -1.15;
  scene.add(sonic);

  const shadowDisc = new THREE.Mesh(new THREE.CircleGeometry(1.35, 64), new THREE.MeshBasicMaterial({ color: 0x006eea, transparent: true, opacity: .11, depthWrite: false }));
  shadowDisc.rotation.x = -Math.PI / 2; shadowDisc.position.y = -.98; scene.add(shadowDisc);

  function smoothSphere(scale, material) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), material);
    mesh.scale.set(...scale); mesh.castShadow = true; mesh.receiveShadow = true; return mesh;
  }
  function capsule(radius, length, material) {
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 12, 24), material);
    mesh.castShadow = true; mesh.receiveShadow = true; return mesh;
  }

  const body = smoothSphere([.64, .78, .48], blue); body.position.y = 1.25; sonic.add(body);
  const belly = smoothSphere([.42, .52, .17], skin); belly.position.set(0,1.22,.43); sonic.add(belly);

  const head = smoothSphere([.84,.86,.72], blue); head.position.set(0,2.36,.02); sonic.add(head);
  const muzzle = smoothSphere([.48,.31,.38], skin); muzzle.position.set(.22,2.12,.62); muzzle.scale.x = .92; sonic.add(muzzle);
  const nose = smoothSphere([.13,.12,.16], black); nose.position.set(.55,2.23,.88); sonic.add(nose);

  function spike(x,y,z,sx,sy,sz,rz){
    const m = new THREE.Mesh(new THREE.ConeGeometry(.33,1.45,24), darkBlue);
    m.scale.set(sx,sy,sz); m.position.set(x,y,z); m.rotation.z = rz; m.rotation.x = Math.PI/2; m.castShadow=true; sonic.add(m); return m;
  }
  spike(-.48,2.55,-.13,.8,1.15,.72,-.55);
  spike(-.62,2.28,-.13,.9,1.28,.7,-.28);
  spike(-.56,2.03,-.08,.82,1.12,.68,-.05);
  spike(-.27,2.93,-.05,.62,1.0,.6,-.88);

  function ear(x, flip){
    const e = new THREE.Mesh(new THREE.ConeGeometry(.26,.58,4), blue);
    e.position.set(x,3.02,.02); e.rotation.z = flip ? -.18 : .18; e.castShadow=true; sonic.add(e);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(.14,.36,4), skin); inner.position.set(x,3.0,.08); inner.rotation.z=e.rotation.z; sonic.add(inner);
  }
  ear(-.45,false); ear(.45,true);

  function eye(x){
    const eye = smoothSphere([.23,.39,.12], white); eye.position.set(x,2.56,.66); sonic.add(eye);
    const pupil = smoothSphere([.08,.16,.07], black); pupil.position.set(x+.035,2.55,.77); sonic.add(pupil);
  }
  eye(-.18); eye(.17);

  function arm(x, side){
    const a = capsule(.16,.62,blue); a.position.set(x,1.42,.02); a.rotation.z=side*.45; sonic.add(a);
    const g = smoothSphere([.28,.25,.24],white); g.position.set(x+side*.15,1.02,.04); sonic.add(g);
  }
  arm(-.66,-1); arm(.66,1);

  function shoe(x, side){
    const s = smoothSphere([.43,.22,.68],red); s.position.set(x,.38,.28); s.rotation.y=side*.18; sonic.add(s);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(.64,.12,.7),white); sole.position.set(x,.27,.34); sole.rotation.z=side*.05; sole.castShadow=true; sonic.add(sole);
  }
  shoe(-.38,-1); shoe(.38,1);

  const backRing = new THREE.Mesh(new THREE.TorusGeometry(1.28,.018,8,96), new THREE.MeshBasicMaterial({color:0x4fd9ff,transparent:true,opacity:.42}));
  backRing.rotation.x=Math.PI/2; backRing.position.y=1.0; scene.add(backRing);
  const frontRing = new THREE.Mesh(new THREE.TorusGeometry(.9,.012,8,72), new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.28}));
  frontRing.rotation.x=Math.PI/2; frontRing.position.set(0,.12,.15); scene.add(frontRing);

  const dust = new THREE.Group(); scene.add(dust);
  for(let i=0;i<24;i++){
    const p=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.035,8,8),new THREE.MeshBasicMaterial({color:0x69dfff,transparent:true,opacity:.25+Math.random()*.35}));
    const a=Math.random()*Math.PI*2, r=1.4+Math.random()*1.5;
    p.position.set(Math.cos(a)*r,.1+Math.random()*2.6,Math.sin(a)*r*.45-.2); p.userData={a,r,s:Math.random()*.004+.002}; dust.add(p);
  }

  const target = { x:0, y:0 };
  let running = false;
  let runUntil = 0;
  let last = performance.now();
  let speechTimer;
  const lines = ['Gotta go fast! ⚡','Hey! 👋','Catch me! 💙','Sonic mode ON! ✦','Wushhh! ⚡','Ayo, lanjut! 🚀'];

  function resize(){
    const rect=wrap.getBoundingClientRect();
    const w=Math.max(1,rect.width), h=Math.max(1,rect.height);
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(wrap);
  resize();

  function react(){
    running=true; runUntil=performance.now()+1900;
    wrap.classList.add('running');
    speech.textContent=lines[Math.floor(Math.random()*lines.length)];
    speech.classList.add('show');
    clearTimeout(speechTimer); speechTimer=setTimeout(()=>speech.classList.remove('show'),1700);
  }
  canvas.addEventListener('click',react);
  canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();react();}});
  canvas.tabIndex=0;

  function pointerMove(clientX,clientY){
    const r=wrap.getBoundingClientRect();
    target.x=((clientX-r.left)/r.width-.5)*1.2;
    target.y=((clientY-r.top)/r.height-.5)*.65;
  }
  wrap.addEventListener('pointermove',e=>pointerMove(e.clientX,e.clientY));
  wrap.addEventListener('pointerleave',()=>{target.x=0;target.y=0;});

  function animate(now){
    const dt=Math.min(.035,(now-last)/1000); last=now;
    if(now>runUntil && running){running=false;wrap.classList.remove('running')}

    const idle=Math.sin(now*.0017)*.045;
    sonic.position.y=-1.15+idle+(running?Math.sin(now*.025)*.09:0);
    sonic.rotation.y += (target.x*.32-sonic.rotation.y)*.055;
    sonic.rotation.x += (-target.y*.14-sonic.rotation.x)*.055;
    if(running) sonic.rotation.z += (Math.sin(now*.03)*.012);

    backRing.rotation.z += dt*.55;
    frontRing.rotation.z -= dt*.85;
    dust.children.forEach(p=>{p.userData.a+=p.userData.s*12; p.position.x=Math.cos(p.userData.a)*p.userData.r; p.position.z=Math.sin(p.userData.a)*p.userData.r*.45-.2; p.position.y+=Math.sin(now*.001+p.userData.r)*.0008;});
    shadowDisc.scale.setScalar(1+Math.sin(now*.002)*.035);

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
