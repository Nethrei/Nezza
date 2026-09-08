// TEMPORARY EDIT MODE
// The birthday lock/countdown is disabled so the website can be edited freely.

const lockedScreen = document.getElementById('lockedScreen');
const birthdayScreen = document.getElementById('birthdayScreen');

function unlock() {
  if (lockedScreen) lockedScreen.classList.add('hidden');
  if (birthdayScreen) birthdayScreen.classList.remove('hidden');
  if (birthdayScreen) birthdayScreen.classList.add('reveal');
  document.title = 'Happy Birthday ✦';
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Always open the birthday page while editing.
unlock();

document.getElementById('memoryBtn')?.addEventListener('click', () => {
  document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' });
});

const photo = document.getElementById('heroPhoto');
if (photo && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    photo.style.transform = `translate(${x}px, ${y}px)`;
  });
}
