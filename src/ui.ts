export function showConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#E74C3C', '#2ECC71', '#F1C40F', '#3498DB', '#E67E22', '#AF7AC5'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${-10 - Math.random() * 20}%`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = `${Math.random() * 0.4}s`;
    p.style.animationDuration = `${0.8 + Math.random() * 0.6}s`;
    container.appendChild(p);
  }

  setTimeout(() => container.remove(), 2000);
}

export function showStarAt(x: number, y: number) {
  const star = document.createElement('div');
  star.className = 'star-burst';
  star.textContent = '\u2B50';
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 800);
}

export function shakeEl(el: HTMLElement) {
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

export function popEl(el: HTMLElement) {
  el.classList.add('pop');
  el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
}

export function navigate(screen: () => HTMLElement) {
  const app = document.getElementById('app')!;
  app.innerHTML = '';
  app.appendChild(screen());
}

export function createToolbar(title: string, onBack: () => void): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'toolbar';

  const backBtn = document.createElement('button');
  backBtn.textContent = '\u2190';
  backBtn.setAttribute('aria-label', 'Volver');
  backBtn.onclick = onBack;

  const titleEl = document.createElement('span');
  titleEl.className = 'title';
  titleEl.textContent = title;

  bar.append(backBtn, titleEl);
  return bar;
}

export function createScoreBar(total: number): {
  el: HTMLElement;
  markCorrect: (i: number) => void;
  markWrong: (i: number) => void;
} {
  const bar = document.createElement('div');
  bar.className = 'score-bar';
  const dots: HTMLElement[] = [];
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'score-dot';
    dots.push(dot);
    bar.appendChild(dot);
  }
  return {
    el: bar,
    markCorrect(i: number) { dots[i]?.classList.add('filled'); },
    markWrong(i: number) { dots[i]?.classList.add('wrong'); },
  };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function saveProgress(level: number, score: number) {
  const key = `regletas_progress`;
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  const prev = data[level] ?? 0;
  data[level] = Math.max(prev, score);
  localStorage.setItem(key, JSON.stringify(data));
}

export function getProgress(): Record<number, number> {
  return JSON.parse(localStorage.getItem('regletas_progress') || '{}');
}
