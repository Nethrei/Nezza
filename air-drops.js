/* Sky Battle HP Regen drops */
(() => {
  const area = document.querySelector('#airGameArea');
  const enemies = document.querySelector('#airEnemies');
  const medkits = document.querySelector('#airMedkits');
  if (!area || !enemies || !medkits) return;

  const style = document.createElement('style');
  style.textContent = `
    .air-medkit.hp-regen-drop{
      width:34px!important;height:34px!important;
      display:grid!important;place-items:center!important;
      border-radius:50%!important;
      background:rgba(20,255,125,.18)!important;
      border:2px solid rgba(70,255,150,.95)!important;
      box-shadow:0 0 14px rgba(40,255,130,.7), inset 0 0 10px rgba(70,255,150,.18)!important;
      color:#39ff88!important;
      font-size:24px!important;font-weight:900!important;
      text-shadow:0 0 8px rgba(50,255,130,.95)!important;
      z-index:7!important;
      animation:hpRegenPulse .8s ease-in-out infinite alternate;
    }
    .air-medkit.hp-regen-drop::after{
      content:'HP Regen';
      position:absolute;
      top:35px;left:50%;transform:translateX(-50%);
      font:700 8px/1 Arial,sans-serif;
      letter-spacing:.4px;white-space:nowrap;
      color:#72ffad;text-shadow:0 0 7px rgba(40,255,130,.9);
    }
    @keyframes hpRegenPulse{from{scale:.94;opacity:.82}to{scale:1.06;opacity:1}}
  `;
  document.head.appendChild(style);

  // Remove the old timer-based medkits. HP Regen now comes only from defeated enemies.
  const oldDrops = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList.contains('air-medkit') && !node.classList.contains('hp-regen-drop')) {
          node.remove();
        }
      });
    }
  });
  oldDrops.observe(medkits, { childList: true });

  // Keep a lightweight snapshot of enemy positions so we can tell a defeat from an enemy leaving the screen.
  const positions = new Map();
  setInterval(() => {
    enemies.querySelectorAll('.air-enemy').forEach(el => {
      const match = (el.style.transform || '').match(/translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/);
      if (match) positions.set(el, { x: Number(match[1]), y: Number(match[2]) });
    });
  }, 40);

  function spawnRegen(x, y) {
    const drop = document.createElement('div');
    drop.className = 'air-medkit hp-regen-drop';
    drop.textContent = '+';
    drop.dataset.hpRegen = '1';
    drop.style.transform = `translate3d(${x}px,${y}px,0)`;
    medkits.appendChild(drop);

    // Make the pickup behave like the existing falling health item.
    let py = y;
    const started = performance.now();
    const tick = now => {
      if (!drop.isConnected) return;
      py += 55 * Math.min((now - (tick.last || now)) / 1000, .032);
      tick.last = now;
      drop.style.transform = `translate3d(${x}px,${py}px,0)`;
      if (py > area.clientHeight + 35 || now - started > 8000) { drop.remove(); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const enemyWatcher = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.removedNodes.forEach(node => {
        if (node.nodeType !== 1 || !node.classList.contains('air-enemy')) return;
        const p = positions.get(node);
        positions.delete(node);
        if (!p) return;
        // Enemy collisions happen near the player's bottom area; ignore those.
        if (p.y > area.clientHeight - 105) return;
        // Random drop: not every defeated enemy drops HP Regen.
        if (Math.random() < 0.18) spawnRegen(p.x, p.y);
      });
    }
  });
  enemyWatcher.observe(enemies, { childList: true });
})();
