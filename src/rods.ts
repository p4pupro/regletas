export interface RodData {
  value: number;
  color: string;
  name: string;
  label: string;
}

export const RODS: RodData[] = [
  { value: 1,  color: '#FFFFFF', name: 'blanca',      label: '1' },
  { value: 2,  color: '#E74C3C', name: 'roja',        label: '2' },
  { value: 3,  color: '#2ECC71', name: 'verde claro', label: '3' },
  { value: 4,  color: '#AF7AC5', name: 'rosa',        label: '4' },
  { value: 5,  color: '#F1C40F', name: 'amarilla',    label: '5' },
  { value: 6,  color: '#27AE60', name: 'verde oscuro',label: '6' },
  { value: 7,  color: '#2C3E50', name: 'negra',       label: '7' },
  { value: 8,  color: '#A0522D', name: 'marrón',      label: '8' },
  { value: 9,  color: '#3498DB', name: 'azul',        label: '9' },
  { value: 10, color: '#E67E22', name: 'naranja',     label: '10' },
];

export const ROD_UNIT = 40;

export function getRod(value: number): RodData {
  return RODS[value - 1];
}

function needsBorder(value: number): boolean {
  return value === 1;
}

function textColor(value: number): string {
  return [1, 5].includes(value) ? '#333' : '#fff';
}

export function createRodEl(
  rod: RodData,
  opts: { showLabel?: boolean; draggable?: boolean; size?: 'sm' | 'md' | 'lg' } = {},
): HTMLDivElement {
  const { showLabel = true, draggable = true, size = 'md' } = opts;

  const heights = { sm: 36, md: 48, lg: 60 };
  const units = { sm: 30, md: 40, lg: 50 };
  const h = heights[size];
  const u = units[size];

  const el = document.createElement('div');
  el.className = 'rod';
  el.dataset.value = String(rod.value);
  el.style.width = `${rod.value * u}px`;
  el.style.height = `${h}px`;
  el.style.lineHeight = `${h}px`;
  el.style.background = rod.color;
  el.style.color = textColor(rod.value);
  el.style.touchAction = 'none';

  if (needsBorder(rod.value)) {
    el.style.border = '2px solid #ccc';
  }

  if (showLabel) {
    el.textContent = rod.label;
  }

  if (draggable) {
    el.style.cursor = 'grab';
  }

  return el;
}
