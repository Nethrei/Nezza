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

  $("#unlockBtn")?.addEventListener("click", () => setTimeout(showOpening, 20));
  $("#loginForm")?.addEventListener("submit", () => setTimeout(showOpening, 20));

  /* Keep the album at exactly 3 photos. */
  const deck = $("#deck");
  if (deck) {
    [...deck.querySelectorAll(".deck-card")].slice(3).forEach((card) => card.remove());
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
  let nextSpawn = 1000;

  if (bestText) bestText.textContent = best;

  function setVisuals() {
    if (!area) return;
    if (player) player.style.transform = `translate3d(0, ${-playerY}px, 0)`;
    if (obstacle) obstacle.style.transform = `translate3d(${obstacleX}px, 0, 0)`;
  }

  function resetRunner() {
    score = 0;
    playerY = 0;
    velocity = 0;
    obstacleSpeed = 230;
    spawnTimer = 0;
    nextSpawn = 1000 + Math.random() * 700;
    obstacleX = area.clientWidth + 70;
    setVisuals();
    if (scoreText) scoreText.textContent = "0";
  }

  function jump() {
    if (running && playerY <= 2) velocity = 620;
  }

  function hitTest() {
    const ground = area.clientHeight - 32;
    const playerLeft = 42;
    const playerRight = playerLeft + 34;
    const playerBottom = ground - playerY;
    const playerTop = playerBottom - 38;
    const obstacleLeft = obstacleX + 7;
    const obstacleRight = obstacleLeft + 30;
    const obstacleBottom = ground;
    const obstacleTop = obstacleBottom - 35;
    const horizontal = obstacleLeft < playerRight && obstacleRight > playerLeft;
    const vertical = playerBottom > obstacleTop + 5 && playerTop < obstacleBottom - 2;
    return horizontal && vertical;
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(animation);
    const value = Math.floor(score);
    if (finalScore) finalScore.textContent = value;
    if (value > best) {
      best = value;
      localStorage.setItem("birthdayRunnerBest", String(best));
      if (bestText) bestText.textContent = best;
    }
    if (gameOver) gameOver.hidden = false;
    if (startHint) startHint.hidden = true;
    if (start) {
      start.disabled = false;
      start.textContent = "Main lagi ↻";
    }
    if (result) result.textContent = `Kalah! Score ${value}. Tekan Main lagi untuk mencoba lagi. 🔥`;
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
    obstacleSpeed = Math.min(440, 230 + score * 2.15);
    spawnTimer += dt * 1000;

    obstacleX -= obstacleSpeed * dt;
    if (obstacleX < -70) {
      obstacleX = area.clientWidth + 50;
      spawnTimer = 0;
      nextSpawn = Math.max(650, 1250 - score * 2) + Math.random() * 650;
    }

    if (spawnTimer >= nextSpawn && obstacleX > area.clientWidth - 20) {
      obstacleX = area.clientWidth + 50;
      spawnTimer = 0;
      nextSpawn = Math.max(650, 1100 - score * 2) + Math.random() * 600;
    }

    setVisuals();
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
    resetRunner();
    running = true;
    last = performance.now();
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
    if (!running && document.activeElement !== area) return;
    event.preventDefault();
    if (running) jump();
  });
  area?.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      jump();
    }
  });

  resetRunner();

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
