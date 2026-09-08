/* Lightweight birthday interactions */

(() => {
  const $ = (s) => document.querySelector(s);

  const opening = $("#opening");
  const welcome = $("#welcomeName");
  const heroName = $("#heroName");
  const savedName = localStorage.getItem("birthdayLoginName");

  if (savedName) {
    if (welcome) welcome.textContent = `Welcome, ${savedName}. Your birthday universe is ready. 💗`;
    if (heroName) heroName.textContent = `${savedName}.`;
  }

  function showOpening() {
    if (!opening) return;
    opening.classList.remove("show");
    void opening.offsetWidth;
    opening.classList.add("show");
  }

  const unlockBtn = $("#unlockBtn");
  const loginForm = $("#loginForm");
  unlockBtn?.addEventListener("click", () => setTimeout(showOpening, 20));
  loginForm?.addEventListener("submit", () => setTimeout(showOpening, 20));

  /* Stacked photo deck: exactly 3 photos */
  const deck = $("#deck");
  const albumIndex = $("#albumIndex");
  if (deck) {
    [...deck.querySelectorAll(".deck-card")].slice(3).forEach((card) => card.remove());
    if (albumIndex) albumIndex.textContent = "01";
    const albumCount = document.querySelector(".album-count");
    if (albumCount) albumCount.innerHTML = '<span id="albumIndex">01</span> / 03';
  }

  /* Endless Chrome-style Birthday Runner */
  const area = $("#gameArea");
  const start = $("#gameStart");
  const scoreText = $("#gameScore");
  const bestText = $("#gameBest");
  const result = $("#gameResult");
  const player = $("#runnerPlayer");
  const obstacle = $("#runnerObstacle");
  const startHint = $("#runnerStartHint");
  const gameOver = $("#runnerGameOver");
  const finalScore = $("#runnerFinalScore");

  let running = false;
  let animation = 0;
  let last = 0;
  let score = 0;
  let best = Number(localStorage.getItem("birthdayRunnerBest") || 0);
  let playerY = 0;
  let velocity = 0;
  let obstacleX = 0;
  let obstacleSpeed = 230;
  let spawnTimer = 0;
  let nextSpawn = 1100;

  if (bestText) bestText.textContent = best;

  function resetPositions() {
    playerY = 0;
    velocity = 0;
    obstacleX = area ? area.clientWidth + 45 : 400;
    obstacleSpeed = 230;
    spawnTimer = 0;
    nextSpawn = 900 + Math.random() * 700;
    if (player) player.style.transform = "translateY(0px)";
    if (obstacle) obstacle.style.transform = `translateX(${obstacleX}px)`;
  }

  function jump() {
    if (!running) return;
    if (playerY <= 1) velocity = 620;
  }

  function hitTest() {
    const px = 42;
    const pw = 38;
    const py = area.clientHeight - 48 - playerY;
    const ox = obstacleX;
    const ow = 38;
    const oy = area.clientHeight - 48;
    return ox < px + pw && ox + ow > px + 5 && py < oy + 34 && py + 40 > oy + 4;
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(animation);
    if (finalScore) finalScore.textContent = Math.floor(score);
    if (score > best) {
      best = Math.floor(score);
      localStorage.setItem("birthdayRunnerBest", String(best));
      if (bestText) bestText.textContent = best;
    }
    if (gameOver) gameOver.hidden = false;
    if (startHint) startHint.hidden = true;
    if (start) start.disabled = false;
    if (start) start.textContent = "Main lagi ↻";
    if (result) result.textContent = `Kalah! Score kamu ${Math.floor(score)}. Coba pecahkan best score. 🔥`;
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.032);
    last = now;

    velocity -= 1650 * dt;
    playerY += velocity * dt;
    if (playerY < 0) {
      playerY = 0;
      velocity = 0;
    }

    score += dt * 10;
    obstacleSpeed = Math.min(430, 230 + score * 2.2);
    spawnTimer += dt * 1000;

    if (spawnTimer >= nextSpawn) {
      obstacleX = area.clientWidth + 35;
      spawnTimer = 0;
      nextSpawn = Math.max(650, 1200 - score * 2) + Math.random() * 650;
    } else {
      obstacleX -= obstacleSpeed * dt;
    }

    if (obstacleX < -55) obstacleX = area.clientWidth + 35;

    if (player) player.style.transform = `translateY(${-playerY}px)`;
    if (obstacle) obstacle.style.transform = `translateX(${obstacleX}px)`;
    if (scoreText) scoreText.textContent = String(Math.floor(score));

    if (hitTest()) {
      endGame();
      return;
    }

    animation = requestAnimationFrame(frame);
  }

  function startRunner() {
    if (!area) return;
    cancelAnimationFrame(animation);
    running = true;
    score = 0;
    last = performance.now();
    resetPositions();
    obstacleX = area.clientWidth + 35;
    if (gameOver) gameOver.hidden = true;
    if (startHint) startHint.hidden = true;
    if (start) {
      start.disabled = true;
      start.textContent = "Runner berjalan...";
    }
    if (result) result.textContent = "Lompatin 🎁 dan jangan sampai kena!";
    area.focus({ preventScroll: true });
    animation = requestAnimationFrame(frame);
  }

  start?.addEventListener("click", startRunner);
  area?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (running) jump();
    else if (!start.disabled) startRunner();
  });
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    if (!area || !area.matches(":focus") && !running) return;
    event.preventDefault();
    if (running) jump();
  });
  area?.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      jump();
    }
  });

  resetPositions();

  /* Secret letter */
  const letterBtn = $("#letterBtn");
  const letterContent = $("#letterContent");
  letterBtn?.addEventListener("click", () => {
    const open = letterContent.classList.toggle("open");
    letterBtn.setAttribute("aria-expanded", String(open));
    letterContent.setAttribute("aria-hidden", String(!open));
    const hint = letterBtn.querySelector("small");
    if (hint) hint.textContent = open ? "Tap to close" : "Tap to open";
  });

  /* Final surprise */
  const finalBtn = $("#finalBtn");
  const finalMessage = $("#finalMessage");
  finalBtn?.addEventListener("click", () => {
    const open = finalMessage.classList.toggle("show");
    finalMessage.setAttribute("aria-hidden", String(!open));
    finalBtn.textContent = open ? "Close surprise ✨" : "Open the last surprise 🎁";
    if (open) {
      const burst = document.createElement("div");
      burst.className = "final-burst";
      burst.textContent = "🎉 ✨ 🎈 💗 🎂";
      finalMessage.appendChild(burst);
      setTimeout(() => burst.remove(), 1800);
    }
  });
})();
