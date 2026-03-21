import { LevelDef } from '../levels/types';
import { navigate, createToolbar } from '../ui';
import { createHomeScreen } from './home';

export function createGameScreen(level: LevelDef, allLevels: LevelDef[]): HTMLElement {
  const root = document.createElement('div');
  root.className = 'game-screen';

  const toolbar = createToolbar(level.name, () => {
    navigate(() => createHomeScreen(allLevels));
  });
  root.appendChild(toolbar);

  const container = document.createElement('div');
  container.className = 'game-area';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.flex = '1';
  root.appendChild(container);

  level.create(container, (_score: number) => {
    navigate(() => createHomeScreen(allLevels));
  });

  return root;
}
