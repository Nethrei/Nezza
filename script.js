const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================
   ENTRY GATE
========================= */

const unlockAt = new Date("2026-09-08T10:00:00+07:00").getTime();
const loginCode = "1010";

const lock = $("#timeLock");
const countdown = $("#lockCountdown");
const lockTitle = $("#lockTitle");
const lockMessage = $("#lockMessage");
const unlockBtn = $("#unlockBtn");
const loginOpenBtn = $("#loginOpenBtn");
const loginModal = $("#loginModal");
const loginForm = $("#loginForm");
const loginCloseBtn = $("#loginCloseBtn");
const loginName = $("#loginName");
const loginCodeInput = $("#loginCode");
const loginError = $("#loginError");
const audio = $("#birthdayAudio");
const musicBtn = $("#musicBtn");

let musicStarted = false;
let gateOpened = false;

function isUnlocked() {
  return Date.now() >= unlockAt;
}

function openSite() {
  if (!isUnlocked()) return;
  gateOpened = true;
  lock?.classList.add("gate-hidden");
  document.body.style.overflow = "";
  playOpening();
  startBirthdayMusic();
}

function setUnlockState(unlocked) {
  if (!unlockBtn || !loginOpenBtn) return;
  unlockBtn.disabled = !unlocked;
  loginOpenBtn.disabled = !unlocked;
  if (unlocked) {
    lockTitle.textContent = "Waktunya tiba! 🎉";
    lockMessage.textContent = "Gerbang sudah terbuka. Pilih Unlock untuk masuk atau Login jika ingin memakai akses khusus.";
    unlockBtn.textContent = "🔓 Unlock & masuk";
    loginOpenBtn.textContent = "🔐 Login";
  } else {
    lockTitle.textContent = "Belum waktunya ✨";
    lockMessage.textContent = "Web ini masih terkunci. Tunggu sampai waktu yang sudah ditentukan.";
    unlockBtn.textContent = "🔒 Menunggu waktu...";
    loginOpenBtn.textContent = "🔐 Login tersedia setelah unlock";
  }
}

function updateLock() {
  if (!lock || !countdown) return;
  const difference = unlockAt - Date.now();
  if (difference > 0) {
    if (!gateOpened) {
      lock.classList.remove("gate-hidden");
      document.body.style.overflow = "hidden";
    }
    setUnlockState(false);
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const dayText = days ? `${String(days).padStart(2, "0")}:` : "";
    countdown.textContent = `${dayText}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      musicStarted = false;
      setMusicButton(false);
    }
    return;
  }
  setUnlockState(true);
  if (!gateOpened) {
    lock.classList.remove("gate-hidden");
    document.body.style.overflow = "hidden";
  }
  countdown.textContent = "00:00:00";
}

unlockBtn?.addEventListener("click", openSite);

/* =========================
   LOGIN
========================= */

function openLogin() {
  if (!isUnlocked()) return;
  loginModal?.classList.add("show");
  loginModal?.setAttribute("aria-hidden", "false");
  loginError.textContent = "";
  setTimeout(() => loginName?.focus(), 50);
}

function closeLogin() {
  loginModal?.classList.remove("show");
  loginModal?.setAttribute("aria-hidden", "true");
}

loginOpenBtn?.addEventListener("click", openLogin);
loginCloseBtn?.addEventListener("click", closeLogin);
loginModal?.addEventListener("click", (event) => {
  if (event.target === loginModal) closeLogin();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLogin();
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = loginName.value.trim();
  const code = loginCodeInput.value.trim();
  if (!isUnlocked()) {
    loginError.textContent = "Web masih terkunci.";
    return;
  }
  if (!name || code !== loginCode) {
    loginError.textContent = "Nama atau kode akses salah.";
    return;
  }
  localStorage.setItem("birthdayLoginName", name);
  closeLogin();
  openSite();
});

/* =========================
   OPENING ANIMATION
========================= */

function playOpening() {
  const opening = $("#opening");
  const savedName = localStorage.getItem("birthdayLoginName");
  const welcomeName = $("#welcomeName");
  if (!opening) return;
  if (welcomeName && savedName) welcomeName.textContent = `Welcome, ${savedName} 💗`;
  opening.classList.remove("show");
  void opening.offsetWidth;
  opening.classList.add("show");
}

/* =========================
   MUSIC
========================= */

function setMusicButton(playing) {
  if (!musicBtn) return;
  musicBtn.textContent = playing ? "❚❚" : "▶";
  musicBtn.title = playing ? "Jeda musik" : "Putar musik";
}

async function startBirthdayMusic() {
  if (!audio || musicStarted || !isUnlocked() || !gateOpened) return musicStarted;
  try {
    await audio.play();
    musicStarted = true;
    setMusicButton(true);
    return true;
  } catch (error) {
    return false;
  }
}

musicBtn?.addEventListener("click", async () => {
  if (!audio || !isUnlocked() || !gateOpened) return;
  if (audio.paused) {
    await startBirthdayMusic();
    return;
  }
  audio.pause();
  musicStarted = false;
  setMusicButton(false);
});

audio?.addEventListener("ended", () => {
  musicStarted = false;
  setMusicButton(false);
});

/* =========================
   SCROLL
========================= */

$$('[data-scroll]').forEach((button) => {
  button.addEventListener("click", () => {
    if (!gateOpened) return;
    const target = $(`#${button.dataset.scroll}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    const nav = $(".liquid-nav");
    nav?.classList.remove("open");
    $("#navToggle")?.setAttribute("aria-expanded", "false");
  });
});

/* =========================
   LIQUID NAVIGATION
========================= */

const nav = $(".liquid-nav");
const navToggle = $("#navToggle");
navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

/* =========================
   MEMORY ALBUM — 3 PHOTO STACK
========================= */

const cards = [...$$(".deck-card")].slice(0, 3);
let current = 0;

function renderDeck() {
  cards.forEach((card, index) => {
    const distance = (index - current + cards.length) % cards.length;
    card.style.zIndex = cards.length - distance;
    card.style.opacity = "1";
    card.style.transform = `rotate(${distance % 2 ? -2 : 2}deg) translate(${distance * 3}px, ${distance * 8}px)`;
    card.style.pointerEvents = distance === 0 ? "auto" : "none";
  });
  const albumIndex = $("#albumIndex");
  if (albumIndex) albumIndex.textContent = String(current + 1).padStart(2, "0");
}

function moveAlbum(direction) {
  current = (current + direction + cards.length) % cards.length;
  renderDeck();
}

/* Tap/click the front photo to bring the photo behind it to the front. */
deck?.addEventListener("click", () => moveAlbum(1));

$(".prev")?.addEventListener("click", (event) => {
  event.stopPropagation();
  moveAlbum(-1);
});
$(".next")?.addEventListener("click", (event) => {
  event.stopPropagation();
  moveAlbum(1);
});

let startX = 0;
deck?.addEventListener("touchstart", (event) => {
  startX = event.touches[0].clientX;
}, { passive: true });

deck?.addEventListener("touchend", (event) => {
  const distanceX = event.changedTouches[0].clientX - startX;
  if (Math.abs(distanceX) > 45) moveAlbum(distanceX < 0 ? 1 : -1);
}, { passive: true });

renderDeck();

/* =========================
   MINI GAME
========================= */

const gameArea = $("#gameArea");
const gameStart = $("#gameStart");
const gameScore = $("#gameScore");
const gameResult = $("#gameResult");
let score = 0;
let gameTimer = null;

function spawnHeart() {
  if (!gameArea) return;
  const heart = document.createElement("button");
  heart.type = "button";
  heart.className = "game-heart";
  heart.textContent = "💗";
  heart.setAttribute("aria-label", "Ambil hati");
  const maxX = Math.max(0, gameArea.clientWidth - 48);
  const maxY = Math.max(0, gameArea.clientHeight - 48);
  heart.style.left = `${Math.random() * maxX}px`;
  heart.style.top = `${Math.random() * maxY}px`;
  heart.addEventListener("click", () => {
    score += 1;
    gameScore.textContent = String(score);
    heart.remove();
    if (score >= 10) {
      clearInterval(gameTimer);
      gameResult.textContent = "🎉 Berhasil! Kamu nemuin semua 10 hati. 💗";
      gameStart.disabled = false;
      gameStart.textContent = "Main lagi →";
      return;
    }
    spawnHeart();
  }, { once: true });
  gameArea.appendChild(heart);
}

gameStart?.addEventListener("click", () => {
  clearInterval(gameTimer);
  score = 0;
  gameScore.textContent = "0";
  gameResult.textContent = "";
  gameStart.disabled = true;
  gameStart.textContent = "Cari semua hati...";
  gameArea.innerHTML = "";
  spawnHeart();
  gameTimer = setInterval(() => {
    if (gameArea && gameArea.children.length === 0 && score < 10) spawnHeart();
  }, 900);
});

/* =========================
   SECRET LETTER
========================= */

const letterBtn = $("#letterBtn");
const letterContent = $("#letterContent");
letterBtn?.addEventListener("click", () => {
  const open = letterContent.classList.toggle("open");
  letterBtn.setAttribute("aria-expanded", String(open));
  letterContent.setAttribute("aria-hidden", String(!open));
  letterBtn.querySelector("small").textContent = open ? "Tap to close" : "Tap to open";
});

/* =========================
   FINAL SURPRISE
========================= */

const finalBtn = $("#finalBtn");
const finalMessage = $("#finalMessage");
finalBtn?.addEventListener("click", () => {
  finalMessage.classList.toggle("show");
  finalMessage.setAttribute("aria-hidden", String(!finalMessage.classList.contains("show")));
  finalBtn.textContent = finalMessage.classList.contains("show") ? "✨ Surprise opened" : "Open the last surprise 🎁";
});

/* =========================
   STARTUP
========================= */

updateLock();
setInterval(updateLock, 1000);
window.addEventListener("load", updateLock);
