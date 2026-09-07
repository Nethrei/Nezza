/*
 * NEZZA — Responsive layout lock
 * Keeps the desktop composition recognizable on phones while scaling it down.
 */
(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'nezza-layout-fix';
  style.textContent = `
    /* Desktop: keep the clean two-column hero composition. */
    .hero-grid {
      width: 100%;
      max-width: 1120px;
      margin-inline: auto;
    }

    /* Phone/tablet: same composition, simply scaled — do NOT stack the hero. */
    @media (max-width: 760px) {
      .app-shell {
        padding: 70px 14px calc(var(--nav-height) + 28px);
      }

      .view-page {
        width: 100%;
      }

      .hero-grid {
        min-height: calc(100dvh - 145px);
        height: auto;
        grid-template-columns: minmax(0, 1.08fr) minmax(0, .78fr);
        gap: 8px;
        align-items: center;
      }

      .hero-copy h2,
      .page-heading h2 {
        font-size: clamp(30px, 8.8vw, 48px);
        line-height: .98;
        margin-bottom: 14px;
      }

      .hero-copy > p {
        max-width: 100%;
        margin-bottom: 17px;
        font-size: 10px;
        line-height: 1.65;
      }

      .hero-actions {
        gap: 8px;
      }

      .hero-actions .primary-btn {
        min-height: 38px;
        padding: 9px 13px;
        font-size: 10px;
      }

      .scroll-note {
        font-size: 7px;
      }

      .hero-visual {
        min-height: 330px;
        height: 52vw;
        max-height: 420px;
      }

      .main-photo-card {
        width: min(260px, 92%);
      }

      /* Keep the 3D stage visible instead of forcing it below the text. */
      #dora-stage {
        width: 100% !important;
        height: 100% !important;
        min-height: 300px;
      }

      .topbar {
        padding-inline: 12px;
      }

      .brand strong {
        font-size: 10px;
      }

      .brand small {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .app-shell {
        padding-inline: 11px;
      }

      .hero-grid {
        grid-template-columns: minmax(0, 1.12fr) minmax(0, .72fr);
        gap: 4px;
        min-height: calc(100dvh - 132px);
      }

      .hero-copy h2,
      .page-heading h2 {
        font-size: clamp(27px, 8.5vw, 39px);
        letter-spacing: -.06em;
      }

      .hero-copy > p {
        font-size: 9px;
        line-height: 1.55;
      }

      .hero-visual {
        min-height: 280px;
      }

      .main-photo-card {
        width: 94%;
        border-radius: 20px;
      }

      /* Bottom liquid navigation keeps the same long-pill appearance. */
      .liquid-nav {
        width: calc(100% - 22px) !important;
        max-width: 430px;
      }
    }
  `;
  document.head.appendChild(style);
})();
