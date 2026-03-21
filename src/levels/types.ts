export interface LevelDef {
  id: number;
  name: string;
  icon: string;
  ages: string;
  create: (container: HTMLElement, onComplete: (score: number) => void) => void;
}
