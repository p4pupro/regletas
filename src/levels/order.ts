import { LevelDef } from './types';
import { createRodEl, getRod, ROD_UNIT } from '../rods';
import { playSuccess, playError, playDrop } from '../audio';
import {
  showConfetti, shakeEl, popEl, shuffle, saveProgress, randInt,
} from '../ui';

export const orderLevel: LevelDef = {
  id: 3,
  name: 'Ordenar',
  icon: '\uD83D\uDCCA',
  ages: '4-5 a\u00f1os',
  create(container, onComplete) {
    container.innerHTML = '';

    const maxVal = pick5or10();
    const values = Array.from({ length: maxVal }, (_, i) => i + 1);

    const prompt = document.createElement('div');
    prompt.className = 'game-prompt';
    prompt.textContent = '\uD83D\uDC46 Ordena de menor a mayor';
    container.appendChild(prompt);

    const slotsArea = document.createElement('div');
    slotsArea.className = 'order-slots';
    slotsArea.style.flex = '1';
    slotsArea.style.overflow = 'auto';
    container.appendChild(slotsArea);

    const slots: HTMLElement[] = [];
    const placed: (number | null)[] = [];

    values.forEach((v, i) => {
      const slot = document.createElement('div');
      slot.className = 'order-slot';
      slot.style.width = `${v * ROD_UNIT + 16}px`;
      slot.dataset.index = String(i);
      slots.push(slot);
      placed.push(null);
      slotsArea.appendChild(slot);
    });

    const tray = document.createElement('div');
    tray.className = 'rod-tray';
    container.appendChild(tray);

    const shuffled = shuffle(values);
    shuffled.forEach((val) => {
      const rod = getRod(val);
      const el = createRodEl(rod, { showLabel: true, draggable: false, size: 'md' });
      el.style.cursor = 'pointer';
      el.dataset.rodValue = String(val);
      el.onclick = () => tryPlace(val, el);
      tray.appendChild(el);
    });

    let nextSlot = 0;

    function tryPlace(value: number, el: HTMLElement) {
      const expected = nextSlot + 1;

      if (value === expected) {
        playDrop();

        const rodData = getRod(value);
        const rodEl = createRodEl(rodData, { showLabel: true, draggable: false, size: 'md' });
        popEl(rodEl);

        slots[nextSlot].innerHTML = '';
        slots[nextSlot].appendChild(rodEl);
        slots[nextSlot].classList.add('filled');
        placed[nextSlot] = value;

        el.remove();
        nextSlot++;

        if (nextSlot === values.length) {
          playSuccess();
          showConfetti();
          saveProgress(3, values.length);
          setTimeout(() => showEnd(), 1200);
        }
      } else {
        playError();
        shakeEl(el);
      }
    }

    function showEnd() {
      container.innerHTML = '';
      const msg = document.createElement('div');
      msg.style.cssText = `
        display:flex; flex-direction:column; align-items:center;
        justify-content:center; flex:1; gap:16px; padding:24px;
      `;
      msg.innerHTML = `
        <span style="font-size:3rem">\uD83C\uDF1F</span>
        <h2>\u00a1Escalera completa!</h2>
        <p style="color:var(--text-light)">Has ordenado ${maxVal} regletas</p>
      `;
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = 'Volver';
      btn.onclick = () => onComplete(maxVal);
      msg.appendChild(btn);
      container.appendChild(msg);
    }

    function pick5or10(): number {
      return randInt(0, 1) === 0 ? 5 : 10;
    }
  },
};
