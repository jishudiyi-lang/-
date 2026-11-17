import React, { useEffect, useRef } from 'react';
import { attachHeadlineLift } from './headlineLift.js';

export function HeadlineLine({ text, className, cursorLift = false }) {
  const line = useRef(null);
  useEffect(() => {
    if (cursorLift) return attachHeadlineLift(line.current);
  }, [cursorLift, text]);

  return (
    <span className={`headline-line ${className}`} ref={line} data-cursor-lift={cursorLift || undefined} aria-hidden="true">
      {Array.from(text).map((character, index) => (
        <span className="glyph-mask" key={index}>
          <span className="headline-glyph">
            {cursorLift ? <span className="headline-face">{character}</span> : character}
          </span>
        </span>
      ))}
    </span>
  );
}
