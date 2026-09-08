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

  /* Secret letter */
  const letterBtn = $("#letterBtn");
  const letterContent = $("#letterContent");
  letterBtn?.addEventListener("click", () => {
    const open = letterContent.classList.toggle("open");
    letterBtn.setAttribute("aria-expanded", String(open));
    const hint = letterBtn.querySelector("small");
    if (hint) hint.textContent = open ? "Tap to close" : "Tap to open";
  });

  /* Mini game */
  const area = $("#gameArea");
  const start = $("#gameStart");
  const scoreText = $("#gameScore");
  const result = $("#gameResult");
  let score = 0;
  let timer = null;

  function spawnHeart() {
    if (!area) return;
    const heart = document.createElement("button");
    heart.className = "game-heart";
    heart.type = "button";
    heart.textContent = "💗";
    heart.setAttribute("aria-label", "Tangkap hati");
    heart.style.left = `${Math.random() * Math.max(0, area.clientWidth - 52)}px`;
    heart.style.top = `${Math.random() * Math.max(0, area.clientHeight - 58)}px`;
    heart.addEventListener("click", () => {
      score++;
      scoreText.textContent = score;
      if (score >= 10) {
        clearTimeout(timer);
        area.replaceChildren();
        start.disabled = false;
        start.textContent = "Main lagi ↻";
        result.textContent = "🎉 Berhasil! 10 hati tertangkap. Kamu menang!";
      } else {
        spawnHeart();
      }
    }, { once: true });
    area.replaceChildren(heart);
  }

  start?.addEventListener("click", () => {
    clearTimeout(timer);
    score = 0;
    scoreText.textContent = "0";
    result.textContent = "Tangkap semuanya! 💗";
    start.disabled = true;
    start.textContent = "Game berjalan...";
    spawnHeart();
    timer = setTimeout(() => {
      if (score < 10) {
        area.replaceChildren();
        start.disabled = false;
        start.textContent = "Coba lagi ↻";
        result.textContent = `Waktu habis. Score kamu ${score}/10. 😆`;
      }
    }, 30000);
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
