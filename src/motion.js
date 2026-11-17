import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const motionAllowed = '(prefers-reduced-motion: no-preference)';
const out = 'power3.out';
const cut = 'power4.inOut';

function unveilGlyphs(timeline, glyphs, at, { duration, stagger }) {
  const liftedLine = glyphs[0]?.closest('[data-cursor-lift]');
  if (liftedLine) gsap.set(liftedLine, { '--headline-mask-overflow': 'clip' });

  timeline.fromTo(glyphs, {
    yPercent: (index) => index % 2 === 0 ? 125 : -125,
    scaleY: .6,
    skewY: (index) => index % 2 === 0 ? 6 : -6,
  }, {
    yPercent: 0, scaleY: 1, skewY: 0, duration, stagger, ease: 'power4.out', clearProps: 'transform',
    onComplete: () => liftedLine?.style.removeProperty('--headline-mask-overflow'),
  }, at);
}

function opening(root) {
  const hero = root.querySelector('.hero');
  const panel = hero.querySelector('.opening-panel');
  const word = panel.querySelector('.opening-word');
  const headline = hero.querySelectorAll('.hero-primary .headline-glyph');
  const tagline = hero.querySelectorAll('.hero-secondary .headline-glyph');
  const header = hero.querySelector('.site-header');
  const bottom = hero.querySelector('.hero-bottom');
  const details = hero.querySelectorAll('.hero-detail');
  const footage = hero.querySelector('.hero-media');
  const frame = hero.querySelector('.hero-frame');

  gsap.set(panel, { autoAlpha: 1 });
  const timeline = gsap.timeline({ defaults: { ease: out } });
  timeline.set(header, { clipPath: 'inset(0 0 100% 0)', y: -14 })
    .set(bottom, { clipPath: 'inset(100% 0 0 0)', y: 12 })
    .fromTo(word, { yPercent: 111, scaleY: .65 }, { yPercent: 0, scaleY: 1, duration: .76, ease: 'power4.out' }, .06)
    .fromTo(frame, { clipPath: 'inset(22% 9% 22% 9%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.38, ease: cut, clearProps: 'clipPath' }, .75)
    .fromTo(footage, { scale: 1.16 }, { scale: 1, duration: 2.05, ease: 'power2.out', clearProps: 'transform' }, .82)
    .to(word, { yPercent: -112, duration: .68, ease: cut }, .84)
    .to(panel, { clipPath: 'inset(0 0 100% 0)', duration: 1.04, ease: cut }, .94)
    .set(panel, { autoAlpha: 0 }, 1.99)
    .to(header, { y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: .91, clearProps: 'transform,clipPath' }, 1.29)
    .fromTo(details, { y: 32, clipPath: 'inset(100% 0 0 0)' }, {
      y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: .78, stagger: .095, clearProps: 'transform,clipPath',
    }, 2.04)
    .to(bottom, { y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: .75, clearProps: 'transform,clipPath' }, 1.85);
  unveilGlyphs(timeline, headline, 1.16, { duration: 1.19, stagger: .105 });
  unveilGlyphs(timeline, tagline, 1.62, { duration: .97, stagger: .052 });

  const finish = () => timeline.progress(1);
  hero.addEventListener('focusin', finish, { once: true });
  window.addEventListener('hashchange', finish, { once: true });
  return () => {
    hero.removeEventListener('focusin', finish);
    window.removeEventListener('hashchange', finish);
  };
}

function sectionTitles(root) {
  root.querySelectorAll('[data-motion-heading]').forEach((heading) => {
    const subtitle = heading.querySelectorAll('.heading-secondary');
    const glyphs = heading.querySelectorAll('.headline-glyph');
    const timeline = gsap.timeline({
      defaults: { ease: 'power4.out' },
      scrollTrigger: { trigger: heading, start: 'top 89%', once: true },
    })
      .fromTo(heading.querySelector('.heading-type'), { yPercent: 117, scaleY: .68 }, {
        yPercent: 0, scaleY: 1, duration: 1.13, clearProps: 'transform',
      })
      .fromTo(subtitle, { y: 31, clipPath: 'inset(100% 0 0 0)' }, {
        y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: .81, stagger: .09, clearProps: 'transform,clipPath',
      }, glyphs.length ? .85 : .34);
    if (glyphs.length) unveilGlyphs(timeline, glyphs, .32, { duration: 1.17, stagger: .12 });
  });
}

function revealCards(cards, context, remember = false) {
  if (!cards.length) return;
  const framesOf = (items) => items.flatMap((item) => Array.from(item.querySelectorAll('.reveal-frame')));
  const copyOf = (items) => items.flatMap((item) => Array.from(item.querySelectorAll('[data-reveal-copy]')));
  const frames = framesOf(cards);
  const copy = copyOf(cards);
  const initialMask = 'inset(12% 4% 88% 4%)';
  const openMask = 'inset(0% 0% 0% 0%)';

  gsap.set(cards, { y: 42 });
  if (frames.length) gsap.set(frames, { clipPath: initialMask });
  if (copy.length) gsap.set(copy, { y: 26, clipPath: 'inset(100% 0 0 0)' });

  context.add('reveal', (batch) => {
    const ordered = [...batch].sort((a, b) => cards.indexOf(a) - cards.indexOf(b));
    const revealedFrames = framesOf(ordered);
    const revealedCopy = copyOf(ordered);
    const timeline = gsap.timeline({
      onComplete: () => {
        if (remember) ordered.forEach((card) => { card.dataset.motionShown = 'true'; });
      },
    });
    timeline.to(ordered, { y: 0, duration: .84, stagger: .11, ease: out, clearProps: 'transform' }, 0);
    if (revealedFrames.length) timeline.to(revealedFrames, {
      clipPath: openMask, duration: 1.12, stagger: .11, ease: 'power4.out', clearProps: 'clipPath',
    }, .08);
    if (revealedCopy.length) timeline.to(revealedCopy, {
      y: 0, clipPath: openMask, duration: .92, stagger: .11, ease: out, clearProps: 'clipPath,transform',
    }, .34);
  });

  ScrollTrigger.batch(cards, {
    start: 'top 94%',
    once: true,
    interval: .13,
    batchMax: 4,
    onEnter: context.reveal,
  });
}

export function usePortfolioMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia(root);

    media.add(motionAllowed, (context) => {
      const cleanup = (window.scrollY < 12 && !window.location.hash) ? opening(root) : undefined;
      sectionTitles(root);
      revealCards(Array.from(root.querySelectorAll('[data-section-card]')), context);
      return cleanup;
    });

    media.add(`${motionAllowed} and (min-width: 901px) and (pointer: fine)`, () => {
      root.querySelectorAll('[data-parallax] img').forEach((image) => {
        gsap.fromTo(image, { scale: 1.09, yPercent: -3.5 }, {
          scale: 1.09, yPercent: 3.5, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: .95 },
        });
      });
    });
    return () => media.revert();
  }, [rootRef]);
}

export function useArchiveMotion(gridRef, category, count) {
  useLayoutEffect(() => {
    const grid = gridRef.current;
    const media = gsap.matchMedia(grid);
    media.add(motionAllowed, (context) => {
      revealCards(Array.from(grid.querySelectorAll('[data-archive-card]:not([data-motion-shown])')), context, true);
    });
    ScrollTrigger.refresh(true);
    return () => media.revert();
  }, [gridRef, category, count]);
}
