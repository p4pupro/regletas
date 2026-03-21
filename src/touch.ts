export interface DragCallbacks {
  onStart?: (el: HTMLElement) => void;
  onMove?: (el: HTMLElement, x: number, y: number) => void;
  onEnd?: (el: HTMLElement) => void;
}

export function makeDraggable(el: HTMLElement, bounds?: HTMLElement, cb?: DragCallbacks) {
  let startX = 0;
  let startY = 0;
  let origX = 0;
  let origY = 0;

  el.style.position = 'absolute';
  el.style.touchAction = 'none';

  el.addEventListener('pointerdown', onDown);

  function onDown(e: PointerEvent) {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
    el.style.zIndex = '100';

    startX = e.clientX;
    startY = e.clientY;
    origX = el.offsetLeft;
    origY = el.offsetTop;

    cb?.onStart?.(el);

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  }

  function onMove(e: PointerEvent) {
    let newX = origX + (e.clientX - startX);
    let newY = origY + (e.clientY - startY);

    if (bounds) {
      const maxX = bounds.clientWidth - el.offsetWidth;
      const maxY = bounds.clientHeight - el.offsetHeight;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    el.style.left = `${newX}px`;
    el.style.top = `${newY}px`;

    cb?.onMove?.(el, newX, newY);
  }

  function onUp(e: PointerEvent) {
    el.releasePointerCapture(e.pointerId);
    el.style.cursor = 'grab';
    el.style.zIndex = '';

    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);

    cb?.onEnd?.(el);
  }
}

export function makeDropZone(
  zone: HTMLElement,
  onDrop: (rod: HTMLElement, zone: HTMLElement) => void,
) {
  zone.classList.add('drop-zone');

  const observer = new MutationObserver(() => {});
  observer.observe(zone, { childList: true });

  return {
    checkDrop(rodEl: HTMLElement) {
      const rodRect = rodEl.getBoundingClientRect();
      const zoneRect = zone.getBoundingClientRect();
      const overlap =
        rodRect.left < zoneRect.right &&
        rodRect.right > zoneRect.left &&
        rodRect.top < zoneRect.bottom &&
        rodRect.bottom > zoneRect.top;

      if (overlap) {
        onDrop(rodEl, zone);
        return true;
      }
      return false;
    },
    destroy() {
      observer.disconnect();
    },
  };
}
