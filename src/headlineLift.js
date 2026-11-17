const pointerMotion = '(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)';

export function attachHeadlineLift(line) {
  const region = line.closest('[data-headline-region]');
  if (!region) return;
  const media = window.matchMedia(pointerMotion);
  const glyphs = Array.from(line.querySelectorAll('.glyph-mask'), (mask) => ({
    mask,
    face: mask.querySelector('.headline-face'),
  }));
  const active = new Set();
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  function flatten(face) {
    if (!active.delete(face)) return;
    for (const property of ['--title-rise', '--title-depth', '--title-tilt-x', '--title-tilt-y', '--title-edge-x', '--title-edge-y']) {
      face.style.removeProperty(property);
    }
  }

  function reset() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    active.forEach(flatten);
  }

  function update() {
    frame = 0;
    const letters = glyphs.map(({ mask, face }) => ({ face, bounds: mask.getBoundingClientRect() }));

    for (const { face, bounds } of letters) {
      const dx = pointerX - (bounds.left + bounds.width / 2);
      const dy = pointerY - (bounds.top + bounds.height / 2);
      const radius = Math.max(bounds.width * 1.19, bounds.height * .81);
      const distance = Math.hypot(dx, dy);

      if (distance >= radius) {
        flatten(face);
        continue;
      }

      const proximity = (1 - (distance / radius) ** 2) ** 2;
      const lift = Math.min(bounds.height * .245, 36) * proximity;
      if (lift < .25) {
        flatten(face);
        continue;
      }

      active.add(face);
      face.style.setProperty('--title-rise', `${(-lift).toFixed(2)}px`);
      face.style.setProperty('--title-depth', `${(lift * 1.17).toFixed(2)}px`);
      face.style.setProperty('--title-tilt-x', `${((dy / radius) * proximity * 19).toFixed(2)}deg`);
      face.style.setProperty('--title-tilt-y', `${((dx / radius) * proximity * -21).toFixed(2)}deg`);
      face.style.setProperty('--title-edge-x', `${((dx / radius) * lift * -.57).toFixed(2)}px`);
      face.style.setProperty('--title-edge-y', `${(lift * .86).toFixed(2)}px`);
    }
  }

  function onPointerMove(event) {
    if (!media.matches || event.pointerType !== 'mouse' || line.style.getPropertyValue('--headline-mask-overflow')) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  region.addEventListener('pointermove', onPointerMove, { passive: true });
  region.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  media.addEventListener('change', reset);

  return () => {
    region.removeEventListener('pointermove', onPointerMove);
    region.removeEventListener('pointerleave', reset);
    window.removeEventListener('blur', reset);
    media.removeEventListener('change', reset);
    reset();
  };
}
