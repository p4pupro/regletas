import './style.css';
import { navigate } from './ui';
import { createHomeScreen } from './screens/home';
import { LevelDef } from './levels/types';
import { exploreLevel } from './levels/explore';
import { identifyLevel } from './levels/identify';
import { orderLevel } from './levels/order';
import { additionLevel } from './levels/addition';
import { subtractionLevel } from './levels/subtraction';

const levels: LevelDef[] = [
  exploreLevel,
  identifyLevel,
  orderLevel,
  additionLevel,
  subtractionLevel,
];

navigate(() => createHomeScreen(levels));
