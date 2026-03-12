/* ================================================================
   hero.js — ヒーロースクロールシーケンス（パララックス・テキスト表示）
   ================================================================ */
const heroWrap    = document.querySelector('.hero-sticky-wrap');
const heroBg      = document.getElementById('heroBg');
const heroLabel   = document.getElementById('heroLabel');
const heroLines   = [
  document.getElementById('heroLine0'),
  document.getElementById('heroLine1'),
  document.getElementById('heroLine2'),
];
const heroSub     = document.getElementById('heroSub');
const heroActions = document.getElementById('heroActions');
const progressFill= document.getElementById('heroProgressFill');

function trigger(el)      { if (el) el.classList.add('in'); }
function triggerLine(idx) { if (heroLines[idx]) heroLines[idx].classList.add('in'); }

function onHeroScroll() {
  if (!heroWrap) return;
  const rect     = heroWrap.getBoundingClientRect();
  const wrapH    = heroWrap.offsetHeight;
  const viewH    = window.innerHeight;
  const scrolled = -rect.top;
  const total    = wrapH - viewH;
  const progress = Math.max(0, Math.min(1, scrolled / total));

  if (progressFill) progressFill.style.height = (progress * 100) + '%';
  if (heroBg) heroBg.style.transform = `scale(1.04) translateY(${progress * viewH * 0.18}px)`;

  // Trigger hero text reveals based on scroll progress
  if (progress >= 0.00) trigger(heroLabel);
  if (progress >= 0.15) triggerLine(0);
  if (progress >= 0.30) triggerLine(1);
  if (progress >= 0.45) triggerLine(2);
  if (progress >= 0.62) trigger(heroSub);
  if (progress >= 0.78) trigger(heroActions);
}

window.addEventListener('DOMContentLoaded', () => { trigger(heroLabel); });
window.addEventListener('scroll', onHeroScroll, { passive: true });
onHeroScroll();
