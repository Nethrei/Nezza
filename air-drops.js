/* Sky Battle HP Regen drops */
(() => {
  const area = document.querySelector('#airGameArea');
  const enemies = document.querySelector('#airEnemies');
  const medkits = document.querySelector('#airMedkits');
  const player = document.querySelector('#airPlayer');
  const hpText = document.querySelector('#airHp');
  if (!area || !enemies || !medkits || !player || !hpText) return;

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
      content:'HP Regen';position:absolute;top:35px;left:50%;transform:translateX(-50%);
      font:700 8px/1 Arial,sans-serif;letter-spacing:.4px;white-space:nowrap;
      color:#72ffad;text-shadow:0 0 7px rgba(40,255,130,.9);
    }
    @keyframes hpRegenPulse{from{scale:.94;opacity:.82}to{scale:1.06;opacity:1}}
  `;
  document.head.appendChild(style);

  // Disable the old timer-based health drops. HP Regen now comes from defeated enemies only.
  const oldDrops = new MutationObserver(mutations => {
    for (const mutation of mutations) mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1 && node.classList.contains('air-medkit') && !node.classList.contains('hp-regen-drop')) node.remove();
    });
  });
  oldDrops.observe(medkits, { childList: true });

  const positions = new Map();
  setInterval(() => {
    enemies.querySelectorAll('.air-enemy').forEach(el => {
      const match = (el.style.transform || '').match(/translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/);
      if (match) positions.set(el, { x: Number(match[1]), y: Number(match[2]) });
    });
  }, 40);

  function playerBox() {
    const x = parseFloat(player.style.left) || 0;
    return { x, y: area.clientHeight - 65, w: 48, h: 48 };
  }
  function touching(x, y) {
    const p = playerBox();
    return x < p.x + p.w && x + 34 > p.x && y < p.y + p.h && y + 34 > p.y;
  }
  function heal() {
    const hp = Math.min(5, (Number(hpText.textContent) || 0) + 1);
    hpText.textContent = String(hp);
  }

  function spawnRegen(x, y) {
    const drop = document.createElement('div');
    drop.className = 'air-medkit hp-regen-drop';
    drop.textContent = '+';
    drop.dataset.hpRegen = '1';
    drop.style.transform = `translate3d(${x}px,${y}px,0)`;
    medkits.appendChild(drop);

    let py = y, last = performance.now();
    const tick = now => {
      if (!drop.isConnected) return;
      const dt = Math.min((now - last) / 1000, .032); last = now;
      py += 55 * dt;
      drop.style.transform = `translate3d(${x}px,${py}px,0)`;
      if (touching(x, py)) { heal(); drop.remove(); return; }
      if (py > area.clientHeight + 35) { drop.remove(); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const enemyWatcher = new MutationObserver(mutations => {
    for (const mutation of mutations) mutation.removedNodes.forEach(node => {
      if (node.nodeType !== 1 || !node.classList.contains('air-enemy')) return;
      const p = positions.get(node); positions.delete(node);
      if (!p) return;
      // Ignore enemies that reached/collided near the player. Only mid-screen defeats can drop HP Regen.
      if (p.y > area.clientHeight - 105) return;
      if (Math.random() < 0.18) spawnRegen(p.x, p.y);
    });
  });
  enemyWatcher.observe(enemies, { childList: true });
})();
