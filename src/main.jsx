import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { artworkById, hero, profile, strengths } from './content.js';
import { usePortfolioMotion } from './motion.js';
import { SectionTitle } from './SectionTitle.jsx';
import { GradientText } from './GradientText.jsx';
import { HeadlineLine } from './Headline.jsx';
import { Work } from './Work.jsx';
import './tailwind.css';
import './styles.css';

const navigation = [
  ['about', '个人经历'],
  ['work', '精选项目'],
  ['characters', '人物设计'],
  ['strengths', '个人优势'],
];
const contactGradient = ['#d2f9e7', '#a6eddb', '#f3f6ef'];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="返回首页">
      <span className="brand-mark" aria-hidden="true">✳</span>
      <span>{profile.name || 'AI DESIGN'}<small>AI DESIGN PORTFOLIO</small></span>
    </a>
  );
}

function Hero() {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (preference.matches) video.current?.pause();
      else video.current?.play().catch(() => {});
    };
    syncPlayback();
    preference.addEventListener('change', syncPlayback);
    return () => preference.removeEventListener('change', syncPlayback);
  }, []);

  function togglePlayback() {
    if (video.current.paused) video.current.play().catch(() => {});
    else video.current.pause();
  }

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-frame" aria-hidden="true">
        <video ref={video} className="hero-media" muted loop playsInline preload="metadata"
          poster={hero.poster} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}>
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="hero-shade" />
      </div>
      <div className="opening-panel" aria-hidden="true">
        <div className="opening-mask"><span className="opening-word">AI DESIGN</span></div>
      </div>
      <header className="site-header shell">
        <Brand />
        <nav aria-label="主导航">
          {navigation.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <a className="button button-outline header-contact" href="#contact">联系我 <span aria-hidden="true">↗</span></a>
      </header>
      <div className="hero-content shell" data-headline-region>
        <p className="eyebrow hero-detail"><span className="signal" /> AI DESIGNER <span className="eyebrow-line" /></p>
        <h1 id="hero-title" aria-label="無限進步，构建想象中的世界">
          <HeadlineLine className="hero-primary" text="無限進步" cursorLift />
          <HeadlineLine className="hero-secondary" text="构建想象中的世界" />
        </h1>
        <p className="hero-description hero-detail">AI 漫剧制作 · 东方幻想视觉 · 美术资产设计</p>
        <a className="button button-solid hero-detail" href="#work">浏览精选项目 <span aria-hidden="true">↗</span></a>
      </div>
      <div className="hero-bottom shell">
        <a href="#about" className="scroll-link"><span aria-hidden="true">↓</span> 向下探索</a>
        <div className="hero-credit">
          <span>天穹上空 / 仙侠场景</span>
          <button type="button" className="media-control" onClick={togglePlayback} aria-label={playing ? '暂停背景视频' : '播放背景视频'}>
            <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section shell" id="about" aria-labelledby="about-title">
      <SectionTitle label="ABOUT" title="个人经历" id="about-title" />
      <div className="about-grid">
        <figure className="portrait" data-section-card>
          <div className="portrait-image reveal-frame" data-parallax>
            <img src={profile.portrait} alt="青绿色光效中的仙侠角色海报" loading="lazy" decoding="async" />
          </div>
          <figcaption>{profile.portraitCaption}</figcaption>
        </figure>
        <div className="about-copy" data-section-card>
          <p className="eyebrow">AI DESIGNER</p>
          <h3>{profile.name || 'AI 设计师'}</h3>
          <p className="bio">{profile.bio}</p>
          {profile.experience.length > 0 && (
            <ol className="experience">
              {profile.experience.map(({ period, title, description }) => (
                <li key={period + title}><span>{period}</span><div><strong>{title}</strong><p>{description}</p></div></li>
              ))}
            </ol>
          )}
          <a className="text-link" href={profile.email ? `mailto:${profile.email}` : '#contact'}>
            {profile.email || '联系我'} <span aria-hidden="true">↗</span>
          </a>
          <dl className="stats">
            {profile.stats.map(({ value, label }) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="section shell" id="strengths" aria-labelledby="strengths-title">
      <SectionTitle label="CAPABILITIES" title="个人优势" id="strengths-title" />
      <div className="strengths-grid">
        {strengths.map(({ theme, label, title, description, art, href, link }) => {
          const artwork = artworkById.get(art);
          return (
            <article className={`strength-card strength-${theme}`} key={title} data-section-card>
              <figure className="strength-art reveal-frame">
                <img src={artwork.thumb} alt={artwork.title} width={artwork.width} height={artwork.height} loading="lazy" decoding="async" />
              </figure>
              <div className="strength-copy" data-reveal-copy>
                <p className="eyebrow">{label}</p>
                <h3>{title}</h3>
                <p className="strength-description">{description}</p>
                <a className="text-link strength-link" href={href}>{link} <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-center shell">
        <div className="contact-heading" data-motion-heading data-headline-region>
          <div className="heading-mask" aria-hidden="true">
            <span className="heading-type"><GradientText colors={contactGradient} direction="diagonal">CONTACT</GradientText></span>
          </div>
          <h2 id="contact-title" aria-label="无限进步">
            <HeadlineLine className="contact-headline" text="无限进步" cursorLift />
          </h2>
          <p className="contact-description heading-secondary">AI 漫剧制作、视觉设定与美术资产合作</p>
        </div>
        <div className="contact-actions" data-section-card>
          {profile.email && <>
            <a className="button button-solid" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
            <button className="button button-outline" type="button" onClick={copyEmail} aria-live="polite">{copied ? '邮箱已复制' : '复制邮箱'}</button>
          </>}
          {profile.phone && <a className="button button-outline" href={`tel:${profile.phone}`}>{profile.phone}</a>}
          {profile.wechat && <span>微信 {profile.wechat}</span>}
          {!profile.email && !profile.phone && !profile.wechat && <span>联系方式待补充</span>}
        </div>
      </div>
      <div className="contact-bottom shell">
        <Brand />
        <a className="scroll-link" href="#top"><span aria-hidden="true">↑</span> 返回顶部</a>
      </div>
    </footer>
  );
}

function App() {
  const page = useRef(null);
  usePortfolioMotion(page);
  return <div ref={page}><main><Hero /><About /><Work /><Strengths /></main><Contact /></div>;
}

createRoot(document.getElementById('root')).render(<App />);
