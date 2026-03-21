import { LevelDef } from './types';
import { RODS, createRodEl } from '../rods';
import { makeDraggable } from '../touch';
import { playTap } from '../audio';

export const exploreLevel: LevelDef = {
  id: 1,
  name: 'Explorar',
  icon: '\uD83D\uDD0D',
  ages: '3-4 a\u00f1os',
  create(container) {
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.classList.add('playground');

    const hint = document.createElement('div');
    hint.className = 'game-prompt';
    hint.textContent = '\uD83D\uDC46 Toca y arrastra las regletas';
    container.appendChild(hint);

    setTimeout(() => {
      hint.style.transition = 'opacity 0.5s';
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 500);
    }, 3000);

    const area = document.createElement('div');
    area.style.position = 'relative';
    area.style.flex = '1';
    area.style.overflow = 'hidden';
    container.appendChild(area);

    RODS.forEach((rod, i) => {
      const el = createRodEl(rod, { showLabel: true, size: 'lg' });

      const areaW = Math.max(window.innerWidth - 100, 200);

      el.style.position = 'absolute';
      el.style.left = `${20 + (i % 3) * (areaW / 3)}px`;
      el.style.top = `${20 + Math.floor(i / 3) * 75}px`;

      area.appendChild(el);

      makeDraggable(el, area, {
        onStart() {
          playTap();
          showBubble(el, rod.value);
        },
      });
    });

    function showBubble(el: HTMLElement, value: number) {
      const existing = el.querySelector('.bubble');
      if (existing) existing.remove();

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = String(value);
      bubble.style.cssText = `
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: #fff;
        padding: 2px 10px;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 700;
        pointer-events: none;
        white-space: nowrap;
      `;
      el.appendChild(bubble);

      setTimeout(() => {
        bubble.style.transition = 'opacity 0.4s';
        bubble.style.opacity = '0';
        setTimeout(() => bubble.remove(), 400);
      }, 1500);
    }
  },
};
