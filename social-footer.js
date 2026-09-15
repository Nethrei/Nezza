(() => {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.className = "site-footer";
  footer.innerHTML = `
    <p>© 2026 <strong>Nezuro</strong> · All Rights Reserved</p>
    <div class="social-links">
      <a href="https://www.instagram.com/nezuro_sa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Nezuro">
        <svg class="social-icon instagram-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
        </svg>
        <strong>@nezuro_sa</strong>
      </a>
      <a href="https://www.tiktok.com/@nezuro_sa" target="_blank" rel="noopener noreferrer" aria-label="TikTok Nezuro">
        <svg class="social-icon tiktok-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M14 4v10.2a4.2 4.2 0 1 1-3-4V7.1a7.1 7.1 0 1 0 6 7.1V8.2c1.2 1 2.7 1.6 4.3 1.7V7.1A5.8 5.8 0 0 1 17 4h-3Z" fill="currentColor"/>
        </svg>
        <strong>@nezuro_sa</strong>
      </a>
    </div>
    <small>Made with little moments & big wishes · 🎂✨</small>
  `;
})();
