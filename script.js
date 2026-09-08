const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

const unlockAt=new Date('2026-09-08T10:00:00+07:00').getTime();
const audio=$('#birthdayAudio'),musicBtn=$('#musicBtn');
let musicStarted=false;
function isUnlocked(){return Date.now()>=unlockAt}
function setMusicButton(playing){if(!musicBtn)return;musicBtn.textContent=playing?'❚❚':'▶';musicBtn.title=playing?'Jeda musik':'Putar musik';musicBtn.setAttribute('aria-label',playing?'Jeda musik':'Putar musik')}
async function startBirthdayMusic(){if(!audio||musicStarted||!isUnlocked())return musicStarted;try{await audio.play();musicStarted=true;setMusicButton(true);return true}catch(err){return false}}

$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{$('#'+b.dataset.scroll)?.scrollIntoView({behavior:'smooth',block:'start'});startBirthdayMusic()}));
window.addEventListener('load',startBirthdayMusic);
document.addEventListener('pointerdown',()=>{if(isUnlocked())startBirthdayMusic()},{passive:true});

const nav=$('.liquid-nav');
$('#navToggle')?.addEventListener('click',()=>{const open=nav.classList.toggle('open');$('#navToggle').setAttribute('aria-expanded',open)});

const cards=[...$$('.deck-card')];let current=0;
function renderDeck(){cards.forEach((c,i)=>{const d=(i-current+cards.length)%cards.length;c.style.zIndex=cards.length-d;c.style.opacity=d>4?'0':'1';c.style.transform=`rotate(${d%2?-2:2}deg) translate(${d*3}px,${d*8}px)`});$('#albumIndex').textContent=String(current+1).padStart(2,'0')}
function move(n){current=(current+n+cards.length)%cards.length;renderDeck()}
$('.prev')?.addEventListener('click',()=>move(-1));$('.next')?.addEventListener('click',()=>move(1));renderDeck();
let startX=0;$('.deck')?.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});$('.deck')?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)move(dx<0?1:-1)},{passive:true});

musicBtn?.addEventListener('click',async()=>{if(!audio||!isUnlocked())return;if(audio.paused){await startBirthdayMusic()}else{audio.pause();musicStarted=false;setMusicButton(false)}});
audio?.addEventListener('ended',()=>{musicStarted=false;setMusicButton(false)});

const lock=$('#timeLock'),countdown=$('#lockCountdown');
function updateLock(){if(!lock||!countdown)return;const diff=unlockAt-Date.now();if(diff>0){lock.style.display='grid';document.body.style.overflow='hidden';const total=Math.floor(diff/1000),d=Math.floor(total/86400),h=Math.floor(total%86400/3600),m=Math.floor(total%3600/60),s=total%60;countdown.textContent=`${d?String(d).padStart(2,'0')+':':''}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}else{lock.style.display='none';document.body.style.overflow='';startBirthdayMusic()}}
updateLock();setInterval(updateLock,1000);