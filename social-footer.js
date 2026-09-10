(() => {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.className = "site-footer";
  footer.innerHTML = `
    <p>© 2026 <strong>Nezuro</strong> · All Rights Reserved</p>
    <div class="social-links">
      <a href="https://www.instagram.com/nezuro_sa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Nezuro">
        <span aria-hidden="true">◎</span><strong>@nezuro_sa</strong>
      </a>
      <a href="https://www.tiktok.com/@nezuro_sa" target="_blank" rel="noopener noreferrer" aria-label="TikTok Nezuro">
        <span aria-hidden="true">♪</span><strong>@nezuro_sa</strong>
      </a>
    </div>
    <small>Made with little moments & big wishes · 🎂✨</small>
  `;
})();
