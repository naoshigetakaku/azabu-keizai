/* ================================================================
   countdown.js — カウントダウンのスロットリールアニメーション
   ================================================================ */
(function() {
  // ★最終日（この日が0になる）
  const TARGET_DATE = new Date('2026-05-02T00:00:00+09:00');

  const wrap     = document.getElementById('counterWrap');
  const labelEl  = document.getElementById('counterLabel');
  if (!wrap) return;

  // 今日の残り日数（JST基準）
  function daysLeft() {
    const jst    = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const today  = new Date(jst.getFullYear(), jst.getMonth(), jst.getDate());
    const target = new Date(TARGET_DATE.getFullYear(), TARGET_DATE.getMonth(), TARGET_DATE.getDate());
    return Math.max(0, Math.ceil((target - today) / 86400000));
  }

  // 数字を桁ごとの配列に（最低3桁）
  function toDigits(n, minLen = 3) {
    const s = String(n);
    return s.padStart(Math.max(s.length, minLen), '0').split('').map(Number);
  }

  // スロットのreel要素を作成
  function makeSlot() {
    const slot = document.createElement('div');
    slot.className = 'digit-slot';
    const reel = document.createElement('div');
    reel.className = 'digit-reel';
    for (let rep = 0; rep < 3; rep++) {
      for (let d = 0; d <= 9; d++) {
        const span = document.createElement('span');
        span.textContent = d;
        reel.appendChild(span);
      }
    }
    slot.appendChild(reel);
    return { slot, reel };
  }

  // リールを指定桁に合わせてアニメーション
  function spinReel(reel, fromDigit, toDigit, duration, delay) {
    const firstSpan = reel.querySelector('span');
    const slotH = firstSpan ? firstSpan.getBoundingClientRect().height : reel.parentElement.offsetHeight || 88;

    const fromRow = 10 + fromDigit;
    let toRow = 10 + toDigit;
    if (toRow >= fromRow) toRow += 10;

    reel.style.transition = 'none';
    reel.style.transform  = `translateY(-${fromRow * slotH}px)`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          reel.style.transition = `transform ${duration}ms cubic-bezier(0.22, 0.08, 0.08, 1.0)`;
          reel.style.transform  = `translateY(-${toRow * slotH}px)`;
        }, delay);
      });
    });
  }

  const slots = [];
  const unitEl = wrap.querySelector('.hero-counter-unit');

  function buildSlots(numDigits) {
    wrap.querySelectorAll('.digit-slot').forEach(s => s.remove());
    slots.length = 0;
    for (let i = 0; i < numDigits; i++) {
      const { slot, reel } = makeSlot();
      wrap.insertBefore(slot, unitEl);
      slots.push({ slot, reel, current: 0 });
    }
  }

  function animateToDigits(fromDigits, toDigits) {
    if (slots.length !== toDigits.length) {
      buildSlots(toDigits.length);
      const padFrom = String(fromDigits.reduce((a,d,i)=> a*10+d, 0))
        .padStart(toDigits.length, '0').split('').map(Number);
      slots.forEach((s, i) => { s.current = padFrom[i] || 0; });
    }

    slots.forEach((s, i) => {
      const from = s.current;
      const to   = toDigits[i];
      const delay    = i * 80;
      const duration = 900 + i * 60;
      spinReel(s.reel, from, to, duration, delay);
      s.current = to;
    });
  }

  const days = daysLeft();
  const targetDigits = toDigits(days);
  const startDigits  = toDigits(365, targetDigits.length);

  buildSlots(startDigits.length);

  requestAnimationFrame(() => {
    slots.forEach((s, i) => {
      s.current = startDigits[i];
      const firstSpan = s.reel.querySelector('span');
      const slotH = firstSpan ? firstSpan.getBoundingClientRect().height : 88;
      const row   = 10 + startDigits[i];
      s.reel.style.transition = 'none';
      s.reel.style.transform  = `translateY(-${row * slotH}px)`;
    });

    wrap.classList.add('active');
    if (labelEl) labelEl.classList.add('show');
  });

  setTimeout(() => {
    animateToDigits(startDigits, targetDigits);
  }, 2600);
})();
