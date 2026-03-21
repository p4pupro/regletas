import { LevelDef } from './types';
import { createRodEl, getRod } from '../rods';
import { playSuccess, playError, playDrop } from '../audio';
import {
  showConfetti, shakeEl, popEl, createScoreBar, shuffle,
  saveProgress, randInt,
} from '../ui';

const TOTAL_ROUNDS = 6;

export const additionLevel: LevelDef = {
  id: 4,
  name: 'Sumar',
  icon: '\u2795',
  ages: '4-5 a\u00f1os',
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
        saveProgress(4, score);
        showEnd();
        return;
      }

      targetArea.innerHTML = '';
      tray.innerHTML = '';

      const maxTarget = round < 3 ? 5 : 10;
      const targetVal = randInt(3, maxTarget);
      const a = randInt(1, targetVal - 1);
      const b = targetVal - a;

      prompt.textContent = `\u00bfQu\u00e9 dos regletas juntas forman la ${getRod(targetVal).name}?`;

      const targetEl = createRodEl(getRod(targetVal), {
        showLabel: true, draggable: false, size: 'lg',
      });
      targetArea.appendChild(targetEl);
      popEl(targetEl);

      const answerRow = document.createElement('div');
      answerRow.className = 'answer-row';
      targetArea.appendChild(answerRow);

      const picked: number[] = [];

      const wrongOptions = generateWrongPairs(a, b, targetVal, maxTarget);
      const allOptions = shuffle([a, b, ...wrongOptions]);

      allOptions.forEach((val) => {
        const rod = getRod(val);
        const el = createRodEl(rod, { showLabel: true, draggable: false, size: 'md' });
        el.style.cursor = 'pointer';

        el.onclick = () => {
          if (picked.length >= 2) return;
          picked.push(val);

          const clone = createRodEl(rod, { showLabel: true, draggable: false, size: 'md' });
          answerRow.appendChild(clone);
          popEl(clone);
          el.style.opacity = '0.3';
          el.style.pointerEvents = 'none';

          playDrop();

          if (picked.length === 2) {
            const sum = picked[0] + picked[1];
            setTimeout(() => {
              if (sum === targetVal) {
                score++;
                scoreBar.markCorrect(round);
                playSuccess();
                if (round === TOTAL_ROUNDS - 1) showConfetti();
              } else {
                scoreBar.markWrong(round);
                playError();
                shakeEl(answerRow);
              }
              round++;
              setTimeout(nextRound, 700);
            }, 400);
          }
        };

        tray.appendChild(el);
      });
    }

    function generateWrongPairs(a: number, b: number, _target: number, max: number): number[] {
      const wrong: number[] = [];
      const used = new Set([a, b]);
      let attempts = 0;
      while (wrong.length < 2 && attempts < 20) {
        const v = randInt(1, max);
        if (!used.has(v)) {
          wrong.push(v);
          used.add(v);
        }
        attempts++;
      }
      return wrong;
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
          ${score >= 4 ? '\u00a1Eres un crack sumando!' : '\u00a1Sigue practicando!'}
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
