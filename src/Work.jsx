import React, { useRef, useState } from 'react';
import { archive, archiveFilters, artworkById, characterArt, credits, projects } from './content.js';
import { useArchiveMotion } from './motion.js';
import { SectionTitle } from './SectionTitle.jsx';

const pageSize = 12;
const topics = Object.fromEntries(archiveFilters.map(({ id, label }) => [id, label]));

function ArtworkImage({ artwork, large = false }) {
  return <img src={large ? artwork.full : artwork.thumb} alt={artwork.title}
    width={artwork.width} height={artwork.height} loading="lazy" decoding="async" />;
}

function FeaturedProjects({ open }) {
  return (
    <div className="projects-grid">
      {projects.map((project, index) => {
        const items = project.images.map((id) => artworkById.get(id));
        return (
          <button className={`project-card ${index === 0 ? 'project-feature' : ''}`} type="button"
            data-section-card key={project.title} onClick={() => open(items, 0, project)}
            aria-label={`查看${project.title}项目，${items.length} 张图片`}>
            <span className="project-image reveal-frame" data-parallax={index === 0 ? '' : undefined}>
              <ArtworkImage artwork={items[0]} large />
            </span>
            <span className="project-caption">
              <span><span className="project-meta">{project.category} <span aria-hidden="true">/</span> {items.length} 张</span>
                <span className="project-name">{project.title}</span></span>
              <span className="round-arrow" aria-hidden="true">↗</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CharacterDesign({ open }) {
  return (
    <section className="work-subsection character-section" id="characters" aria-labelledby="character-title">
      <SectionTitle label="CHARACTERS" title="人物设计" id="character-title" description="角色三视图、服装轮廓与造型设定" />
      <div className="character-grid">
        {characterArt.slice(0, 3).map((artwork, index) => (
          <button type="button" className="character-card" key={artwork.id} data-section-card
            onClick={() => open(characterArt, index)} aria-label={`放大${artwork.title}`}>
            <span className="character-image reveal-frame"><ArtworkImage artwork={artwork} /></span>
            <span className="character-caption">{artwork.title}<span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
      <button type="button" className="button button-outline character-all" onClick={() => open(characterArt, 0)}>
        查看全部 {characterArt.length} 张人物设计 <span aria-hidden="true">↗</span>
      </button>
    </section>
  );
}

function Archive({ open }) {
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(pageSize);
  const grid = useRef(null);
  const shouldFocusNext = useRef(false);
  const visible = category === 'all' ? archive : archive.filter((item) => item.category === category);
  const shown = visible.slice(0, limit);
  const totalByType = Object.fromEntries(archiveFilters.map(({ id }) => [
    id, id === 'all' ? archive.length : archive.filter((item) => item.category === id).length,
  ]));
  useArchiveMotion(grid, category, shown.length);

  function selectCategory(id) {
    setCategory(id);
    setLimit(pageSize);
  }

  return (
    <section className="work-subsection archive-section" id="archive" aria-labelledby="archive-title">
      <SectionTitle label="VISUAL ARCHIVE" title="作品图集" id="archive-title" description={`${archive.length} 张场景、人物与道具设定`} />
      <div className="archive-toolbar">
        <div className="archive-filters" role="group" aria-label="作品分类">
          {archiveFilters.map(({ id, label }) => (
            <button type="button" key={id} aria-pressed={category === id} onClick={() => selectCategory(id)}>
              {label} <span>{totalByType[id]}</span>
            </button>
          ))}
        </div>
        <p className="archive-count" aria-live="polite">已显示 {shown.length} / {visible.length} 张</p>
      </div>
      <div className="archive-grid" key={category} ref={grid}>
        {shown.map((artwork, index) => (
          <button className={`archive-card archive-${artwork.category}`} type="button" key={artwork.id}
            ref={(button) => {
              if (button && shouldFocusNext.current && index === limit - pageSize) {
                shouldFocusNext.current = false;
                button.focus({ preventScroll: true });
              }
            }}
            data-archive-card onClick={() => open(visible, index)} aria-label={`放大${artwork.title}`}>
            <span className="archive-image reveal-frame"><ArtworkImage artwork={artwork} /></span>
            <span className="archive-card-caption"><span>{artwork.title}<small>{topics[artwork.category]}</small></span>
              <span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
      {shown.length < visible.length && (
        <div className="archive-more">
          <button className="button button-outline" type="button" onClick={(event) => {
            shouldFocusNext.current = event.detail === 0;
            setLimit((current) => current + pageSize);
          }}>加载更多作品 <span aria-hidden="true">↓</span></button>
        </div>
      )}
    </section>
  );
}

function Lightbox({ modal, selection, setSelection }) {
  const item = selection?.items[selection.index];

  function move(offset) {
    setSelection((current) => {
      if (!current) return current;
      const index = current.index + offset;
      return current.items[index] ? { ...current, index } : current;
    });
  }

  function handleKeys(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  return (
    <dialog ref={modal} className="project-dialog artwork-dialog" aria-label="作品大图"
      onClick={(event) => { if (event.target === event.currentTarget) modal.current.close(); }}
      onKeyDown={handleKeys} onClose={() => setSelection(null)}>
      <div className="dialog-inner">
        <button type="button" className="dialog-close" autoFocus aria-label="关闭作品" onClick={() => modal.current.close()}>×</button>
        {item && (
          <>
            <p className="eyebrow">{selection.project?.category ?? topics[item.category]}</p>
            <h3>{selection.project?.title ?? item.title}</h3>
            {selection.project && <p className="artwork-description">{selection.project.description}</p>}
            <figure className="artwork-view">
              <img src={item.full} key={item.id} alt={item.title} width={item.width} height={item.height} decoding="async" />
            </figure>
            <div className="artwork-toolbar">
              <p aria-live="polite">{selection.index + 1} / {selection.items.length}
                {selection.project && <span>{item.title}</span>}</p>
              <div className="artwork-controls">
                <button type="button" aria-label="上一张" disabled={selection.index === 0} onClick={() => move(-1)}>←</button>
                <button type="button" aria-label="下一张" disabled={selection.index + 1 === selection.items.length} onClick={() => move(1)}>→</button>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

export function Work() {
  const modal = useRef(null);
  const [selection, setSelection] = useState(null);

  function open(items, index, project) {
    setSelection({ items, index, project });
    modal.current.showModal();
  }

  return (
    <section className="section work-section shell" id="work" aria-labelledby="work-title">
      <SectionTitle label="SELECTED WORK" title="精选项目" id="work-title" description="东方幻想场景与美术资产选集" />
      <FeaturedProjects open={open} />
      <CharacterDesign open={open} />
      <Archive open={open} />
      <div className="credits" id="production-credits" data-section-card>
        <h3>代表作与分工</h3>
        <ul>{credits.map(({ title, role }) => <li key={title}><strong>{title}</strong><span>{role}</span></li>)}</ul>
      </div>
      <Lightbox modal={modal} selection={selection} setSelection={setSelection} />
    </section>
  );
}
