const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================
   TIME LOCK & MUSIC
========================= */

const unlockAt = new Date("2026-09-08T10:00:00+07:00").getTime();
const audio = $("#birthdayAudio");
const musicBtn = $("#musicBtn");
const lock = $("#timeLock");
const countdown = $("#lockCountdown");

let musicStarted = false;

function isUnlocked() {
  return Date.now() >= unlockAt;
}

function setMusicButton(playing) {
  if (!musicBtn) return;

  musicBtn.textContent = playing ? "❚❚" : "▶";
  musicBtn.title = playing ? "Jeda musik" : "Putar musik";
  musicBtn.setAttribute(
    "aria-label",
    playing ? "Jeda musik" : "Putar musik"
  );
}

async function startBirthdayMusic() {
  if (!audio || musicStarted || !isUnlocked()) return musicStarted;

  try {
    await audio.play();
    musicStarted = true;
    setMusicButton(true);
    return true;
  } catch (error) {
    return false;
  }
}

function updateLock() {
  if (!lock || !countdown) return;

  const difference = unlockAt - Date.now();

  if (difference > 0) {
    lock.style.display = "grid";
    document.body.style.overflow = "hidden";

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const dayText = days
      ? `${String(days).padStart(2, "0")}:`
      : "";

    countdown.textContent =
      `${dayText}${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`;

    /* Never allow music to continue while the site is locked. */
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      musicStarted = false;
      setMusicButton(false);
    }

    return;
  }

  lock.style.display = "none";
  document.body.style.overflow = "";
  startBirthdayMusic();
}

updateLock();
setInterval(updateLock, 1000);

/* =========================
   AUTOPLAY FALLBACK
========================= */

window.addEventListener("load", () => {
  if (isUnlocked()) {
    startBirthdayMusic();
  }
});

document.addEventListener(
  "pointerdown",
  () => {
    if (isUnlocked()) {
      startBirthdayMusic();
    }
  },
  { passive: true }
);

/* =========================
   SMOOTH SCROLL
========================= */

$$('[data-scroll]').forEach((button) => {
  button.addEventListener("click", () => {
    const target = $(`#${button.dataset.scroll}`);

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    if (isUnlocked()) {
      startBirthdayMusic();
    }
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
   MEMORY ALBUM
========================= */

const cards = [...$$(".deck-card")];
let current = 0;

function renderDeck() {
  cards.forEach((card, index) => {
    const distance = (index - current + cards.length) % cards.length;

    card.style.zIndex = cards.length - distance;
    card.style.opacity = distance > 4 ? "0" : "1";
    card.style.transform =
      `rotate(${distance % 2 ? -2 : 2}deg) ` +
      `translate(${distance * 3}px, ${distance * 8}px)`;
  });

  const albumIndex = $("#albumIndex");

  if (albumIndex) {
    albumIndex.textContent = String(current + 1).padStart(2, "0");
  }
}

function moveAlbum(direction) {
  current = (current + direction + cards.length) % cards.length;
  renderDeck();
}

$(".prev")?.addEventListener("click", () => moveAlbum(-1));
$(".next")?.addEventListener("click", () => moveAlbum(1));

renderDeck();

let startX = 0;
const deck = $(".deck");

deck?.addEventListener(
  "touchstart",
  (event) => {
    startX = event.touches[0].clientX;
  },
  { passive: true }
);

deck?.addEventListener(
  "touchend",
  (event) => {
    const distanceX = event.changedTouches[0].clientX - startX;

    if (Math.abs(distanceX) > 45) {
      moveAlbum(distanceX < 0 ? 1 : -1);
    }
  },
  { passive: true }
);

/* =========================
   MUSIC BUTTON
========================= */

musicBtn?.addEventListener("click", async () => {
  if (!audio || !isUnlocked()) return;

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
