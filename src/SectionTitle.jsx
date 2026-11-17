import React from 'react';
import { GradientText } from './GradientText.jsx';

const mainColors = ['#f5f7f3', '#a6eddb', '#b7c9ed', '#f5f7f3'];
const secondaryColors = ['#f1f4f1', '#c3dcd3', '#dbe8e2'];

export function SectionTitle({ label, title, id, description }) {
  return (
    <div className="section-heading" data-motion-heading>
      <div className="heading-mask" aria-hidden="true">
        <span className="heading-type"><GradientText colors={mainColors}>{label}</GradientText></span>
      </div>
      <div className="heading-caption">
        <h2 id={id} className="heading-secondary">
          <GradientText colors={secondaryColors} animationSpeed={13}>{title}</GradientText>
        </h2>
        {description && <p className="section-note heading-secondary">{description}</p>}
      </div>
    </div>
  );
}
