/* NEZZA — Lightweight interactions */
(() => {
    'use strict';

    const $ = (selector, parent = document) => parent?.querySelector(selector);
    const $$ = (selector, parent = document) => [
        ...(parent || document).querySelectorAll(selector)
    ];

    // Remove visual systems from the old version that may still exist in the DOM.
    function cleanOldVisuals() {
        ['#space-canvas', '#dora-stage', '.ambient', '.orbit'].forEach(selector => {
            $$(selector).forEach(element => element.remove());
        });
    }

    const landing = $('#landing-page');
    const content = $('#content-area');
    const enterButton = $('#enter-btn');
    const music = $('#bg-music');
    const pages = $$('.view-page');
    const nav = $('#liquid-nav');
    const navItems = $$('.nav-item');
    const toggle = $('#nav-toggle');

    function setActive(item) {
        navItems.forEach(button => {
            button.classList.toggle('active', button === item);
        });
    }

    function closeNav() {
        if (!nav || !toggle) return;

        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Buka navigasi');
        toggle.textContent = '＋';
    }

    function toggleNav() {
        if (!nav || !toggle) return;

        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute(
            'aria-label',
            isOpen ? 'Tutup navigasi' : 'Buka navigasi'
        );
        toggle.textContent = isOpen ? '×' : '＋';
    }

    function showView(id, updateHash = true, activeItem = null) {
        const page = document.getElementById(id);
        if (!page) return;

        pages.forEach(item => {
            item.classList.toggle('active', item === page);
        });

        const selectedItem = activeItem || navItems.find(
            item => item.dataset.target === id
        );

        setActive(selectedItem);

        if (updateHash) {
            history.replaceState(null, '', `#${id.replace('-view', '')}`);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeNav();
    }

    // Navigation.
    toggle?.addEventListener('click', toggleNav);

    navItems.forEach(item => {
        item.addEventListener('click', async () => {
            const action = item.dataset.action;

            if (action === 'music') {
                if (!music) return;

                try {
                    if (music.paused) {
                        await music.play();
                    } else {
                        music.pause();
                    }
                } catch {
                    // Browser autoplay restrictions can block playback.
                }

                item.classList.toggle('music-playing', !music.paused);
                const label = $('small', item);
                if (label) label.textContent = music.paused ? 'Music' : 'Playing';

                closeNav();
                return;
            }

            if (action === 'top') {
                const home = navItems.find(
                    button => button.dataset.target === 'home-view'
                );
                showView('home-view', true, home);
                return;
            }

            if (item.dataset.target) {
                showView(item.dataset.target);
            }
        });
    });

    // Buttons inside page content.
    $$('[data-go]').forEach(button => {
        button.addEventListener('click', () => {
            showView(button.dataset.go);
        });
    });

    // Landing page → main content.
    enterButton?.addEventListener('click', async () => {
        try {
            await music?.play();
        } catch {
            // Playback may require a user gesture/browser permission.
        }

        landing?.classList.add('hide');

        window.setTimeout(() => {
            if (landing) landing.style.display = 'none';
            content?.classList.add('active');
            setActive(navItems.find(item => item.dataset.target === 'home-view'));
        }, 700);
    });

    // Stacked-paper album deck.
    const slider = $('#card-slider');
    const cards = $$('.memory-card', slider || document);
    const previousButton = $('#prev-card');
    const nextButton = $('#next-card');
    const sliderCount = $('#slider-count');
    const sliderBar = $('#slider-bar');
    let albumIndex = 0;

    function renderAlbumDeck() {
        if (!cards.length) return;

        cards.forEach((card, index) => {
            const offset = (index - albumIndex + cards.length) % cards.length;

            card.classList.remove('deck-front', 'deck-mid', 'deck-back');

            if (offset === 0) {
                card.classList.add('deck-front');
                card.style.zIndex = String(cards.length + 2);
                card.style.transform = 'translateX(-50%) rotate(-2.5deg)';
                card.style.opacity = '1';
                card.style.filter = 'none';
            } else if (offset === 1) {
                card.classList.add('deck-mid');
                card.style.zIndex = String(cards.length + 1);
                card.style.transform = 'translateX(-50%) translate(16px,10px) rotate(4deg) scale(.96)';
                card.style.opacity = '.96';
                card.style.filter = 'brightness(.9)';
            } else {
                card.classList.add('deck-back');
                card.style.zIndex = String(cards.length - offset);
                card.style.transform = 'translateX(-50%) translate(-15px,20px) rotate(-5deg) scale(.92)';
                card.style.opacity = '.88';
                card.style.filter = 'brightness(.76)';
            }
        });

        if (sliderCount) {
            sliderCount.textContent = String(albumIndex + 1).padStart(2, '0');
        }

        if (sliderBar) {
            sliderBar.style.width = `${((albumIndex + 1) / cards.length) * 100}%`;
        }

        if (previousButton) previousButton.disabled = cards.length < 2;
        if (nextButton) nextButton.disabled = cards.length < 2;
    }

    function moveAlbum(direction) {
        if (!cards.length) return;
        albumIndex = (albumIndex + direction + cards.length) % cards.length;
        renderAlbumDeck();
    }

    previousButton?.addEventListener('click', () => moveAlbum(-1));
    nextButton?.addEventListener('click', () => moveAlbum(1));

    cleanOldVisuals();
    renderAlbumDeck();

    // Initial page from the URL hash.
    const hashView = window.location.hash
        ? `${window.location.hash.slice(1)}-view`
        : 'home-view';

    if (document.getElementById(hashView)) {
        showView(hashView, false);
    }

    // Keep the mobile navigation closed after switching to desktop.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) closeNav();
    }, { passive: true });
})();
