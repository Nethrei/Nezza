/*
 * NEZZA — Global scroll reveal
 * One reusable observer for every page. Elements appear when entering
 * the viewport and reverse their animation when scrolling away.
 */

(() => {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* Global scroll-driven animation */
        .global-scroll-reveal {
            opacity: 0 !important;
            transform: translate3d(0, 42px, 0) scale(.985) !important;
            filter: blur(4px);
            transition:
                opacity .72s cubic-bezier(.2,.75,.2,1),
                transform .82s cubic-bezier(.16,.82,.25,1),
                filter .72s ease;
            will-change: opacity, transform, filter;
        }

        .global-scroll-reveal.global-scroll-visible {
            opacity: 1 !important;
            transform: none !important;
            filter: blur(0);
        }

        /* Different directions keep the page from feeling repetitive. */
        .global-scroll-reveal[data-scroll-side="left"] {
            transform: translate3d(-58px, 0, 0) scale(.985) !important;
        }
        .global-scroll-reveal[data-scroll-side="right"] {
            transform: translate3d(58px, 0, 0) scale(.985) !important;
        }
        .global-scroll-reveal[data-scroll-side="scale"] {
            transform: translate3d(0, 24px, 0) scale(.88) !important;
        }
        .global-scroll-reveal.global-scroll-visible[data-scroll-side="left"],
        .global-scroll-reveal.global-scroll-visible[data-scroll-side="right"],
        .global-scroll-reveal.global-scroll-visible[data-scroll-side="scale"] {
            transform: none !important;
        }

        /* Small stagger when several items enter together. */
        .global-scroll-reveal:nth-child(2) { transition-delay: 70ms; }
        .global-scroll-reveal:nth-child(3) { transition-delay: 120ms; }
        .global-scroll-reveal:nth-child(4) { transition-delay: 170ms; }
        .global-scroll-reveal:nth-child(5) { transition-delay: 220ms; }

        @media (max-width: 700px) {
            .global-scroll-reveal[data-scroll-side="left"],
            .global-scroll-reveal[data-scroll-side="right"] {
                transform: translate3d(0, 34px, 0) scale(.985) !important;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .global-scroll-reveal,
            .global-scroll-reveal.global-scroll-visible {
                opacity: 1 !important;
                transform: none !important;
                filter: none !important;
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);

    const pages = [...document.querySelectorAll('.view-page')];
    if (!pages.length) return;

    const ignored = new Set([
        '.liquid-nav',
        '.nav-item',
        '.music-toggle',
        '#music-toggle-btn',
        '.welcome-ticker'
    ]);

    const shouldAnimate = (element) => {
        if (!(element instanceof HTMLElement)) return false;
        if (element.classList.contains('global-scroll-reveal')) return false;
        if (ignored.has(element)) return false;
        if (element.closest('.liquid-nav')) return false;
        if (element.closest('.story-photo, .story-sticker, .story-heading, .story-copy, .story-end')) return false;

        const rect = element.getBoundingClientRect();
        return rect.width > 30 && rect.height > 20;
    };

    const candidates = (page) => {
        // Prefer meaningful blocks, then fall back to direct sections.
        const selectors = [
            '.hero-copy', '.hero-visual',
            '.section-heading', '.section-title', '.section-intro',
            '.album-header', '.memory-card', '.note-card',
            '.about-card', '.contact-card', '.contact-item',
            '.feature-card', '.info-card', '.glass-card',
            '.content-card', '.timeline-item', '.gallery-item',
            '.view-page > section', '.view-page > .container > *'
        ];

        const found = [];
        selectors.forEach((selector) => {
            page.querySelectorAll(selector).forEach((el) => {
                if (!found.includes(el) && shouldAnimate(el)) found.push(el);
            });
        });

        // If a page uses different class names, animate its visible top-level blocks.
        if (found.length < 2) {
            page.querySelectorAll(':scope > section, :scope > .section, :scope > .container').forEach((el) => {
                if (!found.includes(el) && shouldAnimate(el)) found.push(el);
            });
        }

        return found;
    };

    const allAnimated = new Set();

    pages.forEach((page) => {
        candidates(page).forEach((element, index) => {
            element.classList.add('global-scroll-reveal');
            element.dataset.scrollSide = ['left', 'right', 'scale'][index % 3];
            element.style.setProperty('--global-index', index);
            allAnimated.add(element);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const element = entry.target;
            if (entry.isIntersecting) {
                element.classList.add('global-scroll-visible');
            } else {
                // IMPORTANT: do not unobserve. Scrolling back up reverses the animation.
                element.classList.remove('global-scroll-visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px'
    });

    allAnimated.forEach((element) => observer.observe(element));

    // Re-scan whenever navigation changes a page's .active class.
    const scanPage = (page) => {
        candidates(page).forEach((element, index) => {
            element.classList.add('global-scroll-reveal');
            element.dataset.scrollSide ||= ['left', 'right', 'scale'][index % 3];
            if (!allAnimated.has(element)) {
                allAnimated.add(element);
                observer.observe(element);
            }
        });
    };

    const pageWatcher = new MutationObserver(() => {
        pages.forEach(scanPage);
    });

    pages.forEach((page) => pageWatcher.observe(page, {
        attributes: true,
        attributeFilter: ['class']
    }));

    // Also catch content injected later (album/story/etc.).
    const domWatcher = new MutationObserver((mutations) => {
        let changed = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) changed = true;
        });
        if (changed) pages.forEach(scanPage);
    });

    domWatcher.observe(document.body, { childList: true, subtree: true });
})();
