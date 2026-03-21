import { LevelDef } from './types';
import { createRodEl, getRod, ROD_UNIT } from '../rods';
import { playSuccess, playError } from '../audio';
import {
  showConfetti, shakeEl, popEl, createScoreBar, shuffle,
  saveProgress, randInt,
} from '../ui';

const TOTAL_ROUNDS = 6;

export const subtractionLevel: LevelDef = {
  id: 5,
  name: 'Restar',
  icon: '\u2796',
  ages: '5-6 a\u00f1os',
  create(container, onComplete) {
    let round = 0;
    let score = 0;

    const scoreBar = createScoreBar(TOTAL_ROUNDS);
    container.innerHTML = '';
    container.appendChild(scoreBar.el);

    const prompt = document.createElement('div');
    prompt.className = 'game-prompt';
    container.appendChild(prompt);

    const targetArea = document.createElement('div');
    targetArea.className = 'target-area';
    targetArea.style.flex = '1';
    targetArea.style.overflow = 'auto';
    container.appendChild(targetArea);

    const tray = document.createElement('div');
    tray.className = 'rod-tray';
    container.appendChild(tray);

    nextRound();

    function nextRound() {
      if (round >= TOTAL_ROUNDS) {
        saveProgress(5, score);
        showEnd();
        return;
      }

      targetArea.innerHTML = '';
      tray.innerHTML = '';

      const maxBig = round < 3 ? 6 : 10;
      const bigVal = randInt(3, maxBig);
      const smallVal = randInt(1, bigVal - 1);
      const diffVal = bigVal - smallVal;

      prompt.textContent = `\u00bfQu\u00e9 regleta completa el hueco?`;

      const bigRod = createRodEl(getRod(bigVal), {
        showLabel: true, draggable: false, size: 'lg',
      });
      targetArea.appendChild(bigRod);
      popEl(bigRod);

      const row = document.createElement('div');
      row.className = 'answer-row';
      targetArea.appendChild(row);

      const smallRod = createRodEl(getRod(smallVal), {
        showLabel: true, draggable: false, size: 'lg',
      });
      row.appendChild(smallRod);

      const gap = document.createElement('div');
      gap.className = 'gap-placeholder';
      gap.style.width = `${diffVal * ROD_UNIT}px`;
      gap.textContent = '?';
      row.appendChild(gap);

      const wrongValues: number[] = [];
      const used = new Set([diffVal]);
      let attempts = 0;
      while (wrongValues.length < 2 && attempts < 20) {
        const v = randInt(1, Math.min(maxBig, 10));
        if (!used.has(v)) {
          wrongValues.push(v);
          used.add(v);
        }
        attempts++;
      }

      const options = shuffle([diffVal, ...wrongValues]);
      options.forEach((val) => {
        const rod = getRod(val);
        const el = createRodEl(rod, { showLabel: true, draggable: false, size: 'md' });
        el.style.cursor = 'pointer';

        el.onclick = () => {
          if (val === diffVal) {
            score++;
            scoreBar.markCorrect(round);
            playSuccess();

            gap.innerHTML = '';
            const correct = createRodEl(getRod(diffVal), {
              showLabel: true, draggable: false, size: 'lg',
            });
            gap.style.border = 'none';
            gap.style.padding = '0';
            gap.appendChild(correct);
            popEl(correct);

            if (round === TOTAL_ROUNDS - 1) showConfetti();
          } else {
            scoreBar.markWrong(round);
            playError();
            shakeEl(el);
          }

          round++;
          setTimeout(nextRound, 800);
        };

        tray.appendChild(el);
      });
    }

    function showEnd() {
      container.innerHTML = '';
      const msg = document.createElement('div');
      msg.style.cssText = `
        display:flex; flex-direction:column; align-items:center;
        justify-content:center; flex:1; gap:16px; padding:24px;
      `;
      const emoji = score >= 4 ? '\uD83C\uDF1F' : '\uD83D\uDC4D';
      msg.innerHTML = `
        <span style="font-size:3rem">${emoji}</span>
        <h2>${score} de ${TOTAL_ROUNDS}</h2>
        <p style="color:var(--text-light)">
          ${score >= 4 ? '\u00a1La resta es tu fuerte!' : '\u00a1Sigue intentando!'}
        </p>
      `;
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = 'Volver';
      btn.onclick = () => onComplete(score);
      msg.appendChild(btn);
      container.appendChild(msg);
    }
  },
};
