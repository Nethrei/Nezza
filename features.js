/* Lightweight birthday interactions */

(() => {
  const $ = (s) => document.querySelector(s);
  const opening=$("#opening"),welcome=$("#welcomeName"),heroName=$("#heroName"),savedName=localStorage.getItem("birthdayLoginName");
  if(savedName){if(welcome)welcome.textContent=`Welcome, ${savedName}. Your birthday universe is ready. 💗`;if(heroName)heroName.textContent=`${savedName}.`;}
  function showOpening(){if(!opening)return;opening.classList.remove("show");void opening.offsetWidth;opening.classList.add("show");}
  $("#unlockBtn")?.addEventListener("click",()=>setTimeout(showOpening,20));$("#loginForm")?.addEventListener("submit",()=>setTimeout(showOpening,20));
  const deck=$("#deck");if(deck){[...deck.querySelectorAll(".deck-card")].slice(3).forEach(c=>c.remove());const count=document.querySelector(".album-count");if(count)count.innerHTML='<span id="albumIndex">01</span> / 03';}

  const area=$("#gameArea"),start=$("#gameStart"),scoreText=$("#gameScore"),rankText=$("#gameRank"),bestText=$("#gameBest"),result=$("#gameResult"),player=$("#runnerPlayer"),obstacle=$("#runnerObstacle"),bird=$("#runnerBird"),startHint=$("#runnerStartHint"),gameOver=$("#runnerGameOver"),finalScore=$("#runnerFinalScore");
  const ranks=[
    {min:0,name:"Rookie",badge:"🌱",title:"Awal yang bagus!",message:"Pemanasan selesai. Terus latihan dan kejar Master!"},
    {min:1000,name:"Master",badge:"🏆",title:"MASTER UNLOCKED!",message:"1000 poin! Refleksmu mulai nggak main-main!"},
    {min:2000,name:"Grand Master",badge:"👑",title:"GRAND MASTER!",message:"2000 poin! Kamu sudah masuk kelas pemain serius."},
    {min:3000,name:"Legend",badge:"⚡",title:"LEGENDARY RUN!",message:"3000 poin! Lari sejauh ini bukan kebetulan."},
    {min:4000,name:"Mythic",badge:"💎",title:"MYTHIC!",message:"4000 poin! Ini sudah level yang susah dipercaya."},
    {min:5000,name:"Immortal",badge:"🔥",title:"IMMORTAL!",message:"5000 poin! Kamu benar-benar bertahan sejauh ini."},
    {min:6000,name:"Supreme",badge:"🌟",title:"SUPREME RUNNER!",message:"6000 poin! Rank tertinggi tercapai. Respect!"}
  ];
  const getRank=v=>ranks.reduce((a,r)=>v>=r.min?r:a,ranks[0]),getNextRank=v=>ranks.find(r=>r.min>v)||null;
  const achievementModal=$("#achievementModal"),achievementClose=$("#achievementClose"),achievementRestart=$("#achievementRestart"),achievementBadge=$("#achievementBadge"),achievementTitle=$("#achievementTitle"),achievementRank=$("#achievementRank"),achievementScore=$("#achievementScore"),achievementMessage=$("#achievementMessage"),achievementNext=$("#achievementNext");
  let running=false,animation=0,last=0,score=0,best=Number(localStorage.getItem("birthdayRunnerBest")||0),playerY=0,velocity=0,obstacleX=0,obstacleSpeed=220,birdX=0,birdY=55;
  if(bestText)bestText.textContent=best;if(rankText)rankText.textContent=getRank(best).name;
  function setVisuals(){if(!area)return;if(player)player.style.transform=`translate3d(0,${-playerY}px,0)`;if(obstacle)obstacle.style.transform=`translate3d(${obstacleX}px,0,0)`;if(bird)bird.style.transform=`translate3d(${birdX}px,${-birdY}px,0)`;}
  function resetRunner(){score=0;playerY=0;velocity=0;obstacleSpeed=220;obstacleX=area.clientWidth+100;birdX=area.clientWidth+360;birdY=55;setVisuals();if(scoreText)scoreText.textContent="0";if(rankText)rankText.textContent="Rookie";}
  function jump(){if(running&&playerY<=2)velocity=620;}
  function hitTest(){const ground=area.clientHeight-32,pL=42,pR=pL+34,pB=ground-playerY,pT=pB-38,oL=obstacleX+7,oR=oL+30,oB=ground,oT=oB-35;return oL<pR&&oR>pL&&pB>oT+5&&pT<oB-2;}
  function showAchievement(value){const c=getRank(value),n=getNextRank(value);if(achievementBadge)achievementBadge.textContent=c.badge;if(achievementTitle)achievementTitle.textContent=c.title;if(achievementRank)achievementRank.textContent=c.name;if(achievementScore)achievementScore.textContent=value;if(achievementMessage)achievementMessage.textContent=c.message;if(achievementNext)achievementNext.textContent=n?`${n.name} · ${n.min}`:"MAX RANK · Supreme";achievementModal?.classList.add("show");achievementModal?.setAttribute("aria-hidden","false");}
  function hideAchievement(){achievementModal?.classList.remove("show");achievementModal?.setAttribute("aria-hidden","true");}
  function endGame(){running=false;cancelAnimationFrame(animation);const value=Math.floor(score),c=getRank(value);if(finalScore)finalScore.textContent=value;if(rankText)rankText.textContent=c.name;if(value>best){best=value;localStorage.setItem("birthdayRunnerBest",String(best));if(bestText)bestText.textContent=best;}if(gameOver)gameOver.hidden=false;if(startHint)startHint.hidden=true;if(start){start.disabled=false;start.textContent="Main lagi ↻";}if(result)result.textContent=`Kalah! Score ${value} · Rank ${c.name}. Lihat pencapaianmu di bawah. 🏆`;showAchievement(value);}
  function frame(now){if(!running)return;const dt=Math.min((now-last)/1000,.032);last=now;
    velocity-=1650*dt;playerY+=velocity*dt;if(playerY<0){playerY=0;velocity=0;}
    score+=dt*10;
    /* Deliberately gentle progression: 6000 is a near-endgame challenge, not a quick target. */
    obstacleSpeed=Math.min(430,220+score*.35);
    obstacleX-=obstacleSpeed*dt;if(obstacleX<-75)obstacleX=area.clientWidth+100;
    /* Flying bird appears later and moves more slowly than the gift. */
    if(score>=500){birdX-=Math.min(300,155+score*.12)*dt;birdY=55+Math.sin(now/230)*8;if(birdX<-70)birdX=area.clientWidth+330+Math.random()*180;}else{birdX=area.clientWidth+360;birdY=55;}
    const c=getRank(score);setVisuals();if(scoreText)scoreText.textContent=String(Math.floor(score));if(rankText)rankText.textContent=c.name;if(hitTest()){endGame();return;}animation=requestAnimationFrame(frame);}
  function startRunner(){if(!area)return;hideAchievement();cancelAnimationFrame(animation);resetRunner();running=true;last=performance.now();if(gameOver)gameOver.hidden=true;if(startHint)startHint.hidden=true;if(start){start.disabled=true;start.textContent="Runner berjalan...";}if(result)result.textContent="Lompatin 🎁 dan perhatikan 🐦! Kecepatan naik perlahan.";area.focus({preventScroll:true});animation=requestAnimationFrame(frame);}
  start?.addEventListener("click",startRunner);achievementRestart?.addEventListener("click",startRunner);achievementClose?.addEventListener("click",hideAchievement);achievementModal?.addEventListener("click",e=>{if(e.target===achievementModal)hideAchievement();});
  area?.addEventListener("pointerdown",e=>{e.preventDefault();if(running)jump();else if(start&&!start.disabled)startRunner();});
  document.addEventListener("keydown",e=>{if(e.code!=="Space")return;if(!running&&document.activeElement!==area)return;e.preventDefault();if(running)jump();});
  area?.addEventListener("keydown",e=>{if(e.code==="Space"){e.preventDefault();jump();}});resetRunner();

  const letterBtn=$("#letterBtn"),letterContent=$("#letterContent");letterBtn?.addEventListener("click",()=>{const open=letterContent.classList.toggle("open");letterBtn.setAttribute("aria-expanded",String(open));letterContent.setAttribute("aria-hidden",String(!open));const hint=letterBtn.querySelector("small");if(hint)hint.textContent=open?"Tap to close":"Tap to open";});
  const finalBtn=$("#finalBtn"),finalMessage=$("#finalMessage");finalBtn?.addEventListener("click",()=>{const open=finalMessage.classList.toggle("show");finalMessage.setAttribute("aria-hidden",String(!open));finalBtn.textContent=open?"Close surprise ✨":"Open the last surprise 🎁";if(open){const burst=document.createElement("div");burst.className="final-burst";burst.textContent="🎉 ✨ 🎈 💗 🎂";finalMessage.appendChild(burst);setTimeout(()=>burst.remove(),1800);}});
})();
