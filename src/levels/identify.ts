import { LevelDef } from './types';
import { createRodEl, getRod } from '../rods';
import { playSuccess, playError } from '../audio';
import {
  showConfetti, shakeEl, popEl, createScoreBar, shuffle,
  saveProgress, randInt,
} from '../ui';

const TOTAL_ROUNDS = 8;

export const identifyLevel: LevelDef = {
  id: 2,
  name: 'Identificar',
  icon: '\uD83C\uDFAF',
  ages: '3-4 a\u00f1os',
  create(container, onComplete) {
    let round = 0;
    let score = 0;
    const scoreBar = createScoreBar(TOTAL_ROUNDS);

    container.innerHTML = '';
    container.appendChild(scoreBar.el);

    const prompt = document.createElement('div');
    prompt.className = 'game-prompt';
    container.appendChild(prompt);

    const refArea = document.createElement('div');
    refArea.style.cssText = 'display:flex; justify-content:center; padding:20px;';
    container.appendChild(refArea);

    const optionsArea = document.createElement('div');
    optionsArea.style.cssText = `
      display:flex; gap:12px; justify-content:center;
      flex-wrap:wrap; padding:16px; flex:1; align-items:center;
    `;
    container.appendChild(optionsArea);

    nextRound();

    function nextRound() {
      if (round >= TOTAL_ROUNDS) {
        saveProgress(2, score);
        showEnd();
        return;
      }

      refArea.innerHTML = '';
      optionsArea.innerHTML = '';

      const maxVal = round < 4 ? 5 : 10;
      const isColorMode = Math.random() > 0.5;

      const targetVal = randInt(1, maxVal);
      const target = getRod(targetVal);

      if (isColorMode) {
        prompt.textContent = `\u00bfCu\u00e1l regleta es el ${target.value}?`;
      } else {
        const ref = createRodEl(target, { showLabel: false, draggable: false, size: 'lg' });
        refArea.appendChild(ref);
        popEl(ref);
        prompt.textContent = '\u00bfQu\u00e9 n\u00famero es esta regleta?';
      }

      const wrongValues: number[] = [];
      while (wrongValues.length < 2) {
        const v = randInt(1, maxVal);
        if (v !== targetVal && !wrongValues.includes(v)) wrongValues.push(v);
      }

      const options = shuffle([targetVal, ...wrongValues]);

      options.forEach((val) => {
        const rod = getRod(val);

        if (isColorMode) {
          const btn = createRodEl(rod, { showLabel: true, draggable: false, size: 'lg' });
          btn.style.cursor = 'pointer';
          btn.onclick = () => handleAnswer(val === targetVal, btn);
          optionsArea.appendChild(btn);
        } else {
          const btn = document.createElement('button');
          btn.className = 'btn btn-primary';
          btn.style.fontSize = '1.6rem';
          btn.style.minWidth = '70px';
          btn.textContent = String(val);
          btn.onclick = () => handleAnswer(val === targetVal, btn);
          optionsArea.appendChild(btn);
        }
      });
    }

    function handleAnswer(correct: boolean, el: HTMLElement) {
      if (correct) {
        score++;
        scoreBar.markCorrect(round);
        playSuccess();
        popEl(el);
        if (round === TOTAL_ROUNDS - 1) showConfetti();
      } else {
        scoreBar.markWrong(round);
        playError();
        shakeEl(el);
      }

      round++;
      setTimeout(nextRound, correct ? 600 : 800);
    }

    function showEnd() {
      container.innerHTML = '';
      const msg = document.createElement('div');
      msg.style.cssText = `
        display:flex; flex-direction:column; align-items:center;
        justify-content:center; flex:1; gap:16px; padding:24px;
      `;

      const emoji = score >= 6 ? '\uD83C\uDF1F' : '\uD83D\uDC4D';
      msg.innerHTML = `
        <span style="font-size:3rem">${emoji}</span>
        <h2>${score} de ${TOTAL_ROUNDS}</h2>
        <p style="color:var(--text-light)">
          ${score >= 6 ? '\u00a1Genial, sigue as\u00ed!' : '\u00a1Buen intento, practica m\u00e1s!'}
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
