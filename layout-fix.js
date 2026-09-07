/*
 * NEZZA — Responsive layout lock
 * Keeps the desktop composition recognizable on phones while scaling it down.
 */
(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'nezza-layout-fix';
  style.textContent = `
    .hero-grid {
      width: 100%;
      max-width: 1120px;
      margin-inline: auto;
    }

    @media (max-width: 760px) {
      html, body {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        overflow-x: hidden !important;
      }

      .app-shell {
        box-sizing: border-box;
        width: 100%;
        max-width: 100vw;
        padding: 54px 10px calc(var(--nav-height, 72px) + 20px);
      }

      .view-page,
      .hero-grid,
      .hero-copy,
      .hero-visual {
        min-width: 0;
        max-width: 100%;
      }

      .view-page { width: 100%; }

      .hero-grid {
        box-sizing: border-box;
        width: 100%;
        min-height: calc(100dvh - 126px);
        height: auto;
        grid-template-columns: minmax(0, 1.08fr) minmax(0, .82fr);
        gap: 6px;
        align-items: center;
      }

      .hero-copy {
        width: 100%;
        overflow-wrap: break-word;
      }

      .hero-copy h2,
      .page-heading h2 {
        max-width: 100%;
        font-size: clamp(27px, 8.6vw, 42px);
        line-height: .98;
        letter-spacing: -.055em;
        margin-bottom: 12px;
      }

      .hero-copy > p {
        max-width: 95%;
        margin-bottom: 14px;
        font-size: 9px;
        line-height: 1.55;
      }

      .hero-actions { gap: 7px; flex-wrap: wrap; }

      .hero-actions .primary-btn {
        min-height: 36px;
        padding: 8px 12px;
        font-size: 9px;
      }

      .scroll-note { font-size: 7px; }

      .hero-visual {
        box-sizing: border-box;
        width: 100%;
        min-height: 270px;
        height: min(52vw, 360px);
        max-height: 360px;
        overflow: visible;
      }

      #dora-stage {
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        max-width: 100%;
      }

      .main-photo-card {
        width: min(230px, 92%);
        max-width: 100%;
      }

      .topbar {
        max-width: 100vw;
        padding-inline: 10px;
      }

      .brand strong { font-size: 9px; }
      .brand small { display: none; }

      /* Reduce compositor load on touch devices. */
      #space-canvas { opacity: .25 !important; }
    }

    @media (max-width: 480px) {
      .app-shell { padding-inline: 8px; padding-top: 48px; }

      .hero-grid {
        grid-template-columns: minmax(0, 1.12fr) minmax(0, .72fr);
        gap: 3px;
        min-height: calc(100dvh - 116px);
      }

      .hero-copy h2,
      .page-heading h2 { font-size: clamp(25px, 8.35vw, 36px); }
      .hero-copy > p { font-size: 8px; line-height: 1.5; }

      .hero-visual {
        min-height: 245px;
        height: 50vw;
        max-height: 315px;
      }

      .main-photo-card { width: 94%; border-radius: 18px; }

      .liquid-nav {
        width: calc(100vw - 16px) !important;
        max-width: 430px;
      }
    }

    @media (max-width: 360px) {
      .hero-grid { grid-template-columns: minmax(0, 1.16fr) minmax(0, .66fr); }
      .hero-copy h2,
      .page-heading h2 { font-size: 27px; }
      .hero-copy > p { font-size: 7.5px; }
      .hero-visual { min-height: 220px; }
    }
  `;
  document.head.appendChild(style);
})();
