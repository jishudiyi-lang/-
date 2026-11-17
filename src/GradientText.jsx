import React, { useEffect, useRef, useState } from 'react';
import { useAnimationFrame, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';

const gradients = {
  horizontal: { angle: 'to right', size: '300% 100%' },
  vertical: { angle: 'to bottom', size: '100% 300%' },
  diagonal: { angle: 'to bottom right', size: '300% 300%' },
};

function GradientClock({ elapsed, progress, duration, yoyo }) {
  useAnimationFrame((_, delta) => {
    const cycle = yoyo ? duration * 2 : duration * 1.5;
    elapsed.current = (elapsed.current + delta) % cycle;
    const phase = elapsed.current / duration;
    progress.set((yoyo && phase > 1 ? 2 - phase : phase) * 100);
  });
  return null;
}

export function GradientText({
  children,
  colors,
  animationSpeed = 9,
  direction = 'horizontal',
  pauseOnHover = true,
  yoyo = true,
}) {
  const element = useRef(null);
  const elapsed = useRef(0);
  const [paused, setPaused] = useState(false);
  const visible = useInView(element, { amount: .2 });
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const backgroundPosition = useTransform(progress, (value) => (
    direction === 'vertical' ? `50% ${value}%` : `${value}% 50%`
  ));
  const { angle, size } = gradients[direction];

  useMotionValueEvent(backgroundPosition, 'change', (position) => {
    if (element.current) element.current.style.backgroundPosition = position;
  });

  useEffect(() => {
    elapsed.current = 0;
    progress.set(0);
  }, [animationSpeed, progress, yoyo]);

  return (
    <span
      ref={element}
      className="gradient-text"
      style={{
        '--gradient-image': `linear-gradient(${angle}, ${[...colors, colors[0]].join(', ')})`,
        backgroundSize: size,
        backgroundPosition: direction === 'vertical' ? '50% 0%' : '0% 50%',
      }}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      {children}
      {visible && !reducedMotion && !paused && (
        <GradientClock elapsed={elapsed} progress={progress} duration={animationSpeed * 1000} yoyo={yoyo} />
      )}
    </span>
  );
}
