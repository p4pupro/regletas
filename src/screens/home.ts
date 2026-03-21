import { LevelDef } from '../levels/types';
import { navigate, getProgress } from '../ui';
import { createGameScreen } from './game';

export function createHomeScreen(levels: LevelDef[]): HTMLElement {
  const root = document.createElement('div');
  root.className = 'home';

  const h1 = document.createElement('h1');
  h1.textContent = '\uD83D\uDCCF Regletas';
  root.appendChild(h1);

  const sub = document.createElement('p');
  sub.className = 'subtitle';
  sub.textContent = 'Elige un nivel para jugar';
  root.appendChild(sub);

  const grid = document.createElement('div');
  grid.className = 'level-grid';
  root.appendChild(grid);

  const progress = getProgress();

  levels.forEach((level) => {
    const card = document.createElement('button');
    card.className = 'level-card';

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = level.icon;

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = level.name;

    const age = document.createElement('span');
    age.className = 'age';
    age.textContent = level.ages;

    card.append(icon, name, age);

    const best = progress[level.id];
    if (best !== undefined) {
      const badge = document.createElement('span');
      badge.className = 'age';
      badge.textContent = `\u2B50 ${best}`;
      card.appendChild(badge);
    }

    card.onclick = () => {
      navigate(() => createGameScreen(level, levels));
    };

    grid.appendChild(card);
  });

  return root;
}
