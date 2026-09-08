const TARGET = new Date('2026-10-10T00:00:00+07:00').getTime();
const LOCK_AGAIN = new Date('2026-10-17T00:00:00+07:00').getTime();
const START = new Date('2026-09-08T00:00:00+07:00').getTime();

const lockedScreen = document.getElementById('lockedScreen');
const birthdayScreen = document.getElementById('birthdayScreen');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const progressEl = document.getElementById('progress');
const statusEl = document.getElementById('status');

function pad(value) {
  return String(value).padStart(2, '0');
}

function lockAgain() {
  birthdayScreen.classList.add('hidden');
  lockedScreen.classList.remove('hidden');
  document.title = 'Birthday Surprise 🔒';
  statusEl.textContent = '🔒 This surprise has ended';
  daysEl.textContent = '00';
  hoursEl.textContent = '00';
  minutesEl.textContent = '00';
  secondsEl.textContent = '00';
  progressEl.style.width = '100%';
}

function unlock() {
  lockedScreen.classList.add('hidden');
  birthdayScreen.classList.remove('hidden');
  birthdayScreen.classList.add('reveal');
  document.title = 'Happy Birthday ✦';
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function updateCountdown() {
  const now = Date.now();

  if (now >= LOCK_AGAIN) {
    lockAgain();
    return;
  }

  if (now >= TARGET) {
    unlock();
    return;
  }

  const distance = TARGET - now;
  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);

  const elapsed = Math.min(Math.max(now - START, 0), TARGET - START);
  const progress = (elapsed / (TARGET - START)) * 100;
  progressEl.style.width = `${progress}%`;

  statusEl.textContent = days === 0
    ? '♡ Almost there...'
    : '🔒 Locked until October 10';
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.getElementById('memoryBtn').addEventListener('click', () => {
  document.getElementById('memories').scrollIntoView({ behavior: 'smooth' });
});

const photo = document.getElementById('heroPhoto');
if (photo && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    photo.style.transform = `translate(${x}px, ${y}px)`;
  });
}
