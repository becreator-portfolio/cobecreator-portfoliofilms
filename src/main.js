import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import media from './media.json';
import { contact, reel, films, clips, campaigns, series, social } from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const SAVE = navigator.connection?.saveData === true;
const MAX_AUTOPLAY = 4;

const src = (id, f) => `/media/${id}/${f}`;
const fmtTime = (s) => {
  if (!isFinite(s)) return '00:00';
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const dur = (id) => fmtTime(media[id]?.dur ?? 0);
const ratioOf = (id) => (media[id] ? `${media[id].w} / ${media[id].h}` : '16 / 9');
const ratioNum = (id) => (media[id] ? (media[id].w / media[id].h).toFixed(3) : '1.778');
const pad = (n) => String(n).padStart(2, '0');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ─────────────────────────────── playlists (for player prev/next) */
const playlists = {};
const reg = (key, items) => { playlists[key] = items; };

/* ─────────────────────────────── templates */
function frame(item, { list, idx, label = 'Play', ratio, cls = '' } = {}) {
  const r = ratio ?? ratioOf(item.id);
  return `
  <div class="frame ${cls}" role="button" tabindex="0" style="aspect-ratio:${r}"
       data-id="${item.id}" data-list="${list}" data-idx="${idx}" data-cursor="${label} · ${dur(item.id)}"
       aria-label="Assistir ${esc(item.title)} — ${dur(item.id)}">
    <div class="frame__inner">
      <img src="${src(item.id, 'poster.webp')}" alt="" loading="lazy" decoding="async" />
      <video muted loop playsinline preload="none" data-src="${src(item.id, 'preview.mp4')}"></video>
    </div>
    <span class="frame__tc mono" aria-hidden="true"><i class="rec"></i>${dur(item.id)}</span>
    <span class="playhead" aria-hidden="true"></span>
  </div>`;
}
const cap = ({ n, t, m }) =>
  `<figcaption class="cap">${n ? `<span class="cap__n">${n}</span>` : ''}<span class="cap__t">${t}</span><span class="cap__m">${m}</span></figcaption>`;
const card = (item, opts, c, extra = '') => `<figure class="card" data-reveal ${extra}>${frame(item, opts)}${cap(c)}</figure>`;

/* ─────────────────────────────── render */
const counts = {
  films: films.length,
  clips: clips.length,
  campaigns: 2 + campaigns.block.items.length + campaigns.lv.items.length,
  series: series.episodes,
  social: social.reduce((a, g) => a + g.items.length, 0),
};
const chapters = [
  ['filmes', 'Filmes', counts.films, src('f-vibe', 'poster.webp')],
  ['clipes', 'Clipes', counts.clips, src('c-sol', 'poster.webp')],
  ['campanhas', 'Campanhas', counts.campaigns, src('k-tz', 'poster.webp')],
  ['serie', 'Série', counts.series, src('serie', 'poster.webp')],
  ['social', 'Social', counts.social, src('s-ryu', 'poster.webp')],
];

function render() {
  // reel duration
  $$('[data-reel-dur]').forEach((el) => (el.textContent = dur('reel')));

  // índice (statement) + mobile menu
  $('[data-toc]').innerHTML = chapters
    .map(([id, name, n, peek], i) => `<li><a href="#${id}" data-peek="${peek}"><span class="toc__n">${pad(i + 1)}</span><span class="toc__t">${name}</span><span class="toc__c">${pad(n)}</span></a></li>`)
    .join('');
  $('.statement__peek img').src = chapters[0][3];
  $('[data-menu-nav]').innerHTML = [...chapters, ['contato', 'Contato', null]]
    .map(([id, name, n], i) => `<a href="#${id}"><span class="mono">${pad(i + 1)}</span>${name}<span class="mono">${n ? pad(n) : ''}</span></a>`)
    .join('');
  const mm = $('[data-menu-mail]');
  mm.href = `mailto:${contact.email}`;
  mm.textContent = contact.email;

  // contact
  const mail = $('[data-mail]');
  mail.href = `mailto:${contact.email}`;
  const at = contact.email.indexOf('@');
  const chars = (t) => [...t].map((c) => `<span class="char">${c}</span>`).join('');
  mail.innerHTML = `<span class="mail-a" aria-hidden="true">${chars(contact.email.slice(0, at))}</span><span class="mail-b" aria-hidden="true">${chars(contact.email.slice(at))}</span>`;
  mail.setAttribute('aria-label', `Enviar e-mail para ${contact.email}`);
  mail.dataset.cursor = 'Escrever';
  const ig = $('[data-insta]');
  ig.href = contact.instagram;
  ig.textContent = `Instagram ${contact.instagramHandle} ↗`;
  ig.setAttribute('aria-label', `Instagram ${contact.instagramHandle} (abre em nova aba)`);
  $('[data-year]').textContent = new Date().getFullYear();

  // films
  reg('films', films.map((f) => ({ ...f, kind: 'Filme autoral' })));
  $('[data-films]').innerHTML = films
    .map((f, i) => card(f, { list: 'films', idx: i }, { n: pad(i + 1), t: f.title, m: dur(f.id) }, `style="--arn:${ratioNum(f.id)}"`))
    .join('');


  // clips index
  reg('clips', clips.map((c) => ({ ...c, kind: 'Clipe' })));
  $('[data-clips]').innerHTML = clips
    .map(
      (c, i) => `
    <li class="index__row" data-reveal>
      <button class="index__btn" data-open-list="clips" data-idx="${i}" data-preview="${c.id}" data-cursor="Play"
        aria-label="Assistir ${esc(c.title)} — ${esc(c.artist)}, ${dur(c.id)}">
        <span class="index__n">${pad(i + 1)}</span>
        <span class="index__t">${c.title}</span>
        <span class="index__a">${c.artist}${c.credit ? ` — ${c.credit}` : ''}</span>
        <span class="index__d">${dur(c.id)}</span>
        <img class="index__thumb" src="${src(c.id, 'poster.webp')}" alt="" loading="lazy" decoding="async" />
      </button>
    </li>`
    )
    .join('');
  // section counts: just the number, superscript to the title
  Object.entries(counts).forEach(([k, n]) => { const el = $(`[data-count="${k}"]`); if (el) { el.textContent = pad(n); el.dataset.n = n; } });

  // Socializei — case: the ad + its storyboard (each frame opens the film at that moment)
  const sc = campaigns.socializei;
  reg('socializei', [{ ...sc }]);
  $('[data-case]').innerHTML = `
    <div class="case" data-case-wrap>
      <div class="case__media">${frame(sc, { list: 'socializei', idx: 0, ratio: '9 / 16', cls: 'frame--tc' })}</div>
      <div class="case__body">
        <div class="case__head">
          <h3 class="ptitle">${sc.title}</h3>
          <span class="mono dim">${sc.kind} · ${dur(sc.id)}</span>
        </div>
        <p class="case__line">${sc.line}</p>
        <ol class="case__board" aria-label="Storyboard — ${sc.title}">
          ${sc.board
            .map(
              (b) => `<li><button class="case__still" data-seek="${b.t}" data-cursor="Assistir de ${fmtTime(b.t)}" aria-label="Assistir ${sc.title} a partir de ${fmtTime(b.t)}">
                <img src="${src(sc.id, b.img + '.webp')}" alt="" loading="lazy" decoding="async" /></button><span class="mono dim">${fmtTime(b.t)}</span></li>`
            )
            .join('')}
        </ol>
      </div>
    </div>`;

  // TZ
  const tz = campaigns.tz;
  reg('tz', [{ ...tz }]);
  $('[data-tz]').innerHTML = `
    <div class="tz" data-tz-wrap>
      ${frame(tz, { list: 'tz', idx: 0, ratio: 'auto' })}
      <div class="tz__info">
        <h3 class="tz__t ptitle">${tz.title}</h3>
        <span class="mono">${dur(tz.id)}</span>
      </div>
    </div>`;

  // Block Office
  const b = campaigns.block;
  reg('block', b.items.map((it) => ({ ...it, title: `Block Office — ${it.title}`, kind: b.kind })));
  $('[data-block]').innerHTML = `
    <div class="block" data-block-wrap>
      <div class="block__pin" tabindex="-1">
        <div class="block__track">
          <div class="block__intro">
            <h3 class="ptitle">${b.title}</h3>
            <span class="block__hint mono">${pad(b.items.length)} peças <span class="block__arrow" aria-hidden="true">→</span></span>
          </div>
          ${b.items
            .map(
              (it, i) => `
            <figure class="block__item block__item--${it.fmt}">
              ${frame(it, { list: 'block', idx: i, ratio: it.fmt === 'v' ? '9 / 16' : '16 / 9' })}
              ${cap({ n: pad(i + 1), t: it.title, m: dur(it.id) })}
            </figure>`
            )
            .join('')}
        </div>
        <div class="block__progress mono" aria-hidden="true"><span class="block__count">01 / ${pad(b.items.length)}</span><span class="block__bar"></span></div>
      </div>
    </div>`;

  // LV
  const lv = campaigns.lv;
  reg('lv', lv.items.map((it) => ({ ...it, title: `LV Agência — ${it.title}`, kind: lv.kind })));
  $('[data-lv]').innerHTML = `
    <div class="lv">
      <div class="lv__head" data-reveal>
        <h3 class="ptitle">${lv.title}</h3>
        <span class="mono dim">Motion</span>
      </div>
      ${lv.items.map((it, i) => card(it, { list: 'lv', idx: i, ratio: '16 / 9' }, { n: pad(i + 1), t: it.title, m: dur(it.id) })).join('')}
    </div>`;

  // Série
  const ytList = `https://www.youtube.com/playlist?list=${series.playlist}`;
  $('[data-series]').innerHTML = `
    <div class="series">
      <div class="series__info">
        <h3 class="ptitle">${series.title}</h3>
        <span class="mono dim">${series.channel}</span>
        <div class="series__actions">
          <button class="btn-line mono" data-yt aria-label="Assistir ${series.title}"><span class="btn-reel__icon" aria-hidden="true"></span>Assistir</button>
          <a class="link-ext mono" href="${ytList}" target="_blank" rel="noopener">YouTube ↗</a>
        </div>
      </div>
      <div class="series__stage">
        <div class="frame" role="button" tabindex="0" data-yt data-cursor="Assistir · ${pad(series.episodes)} episódios" aria-label="Assistir ${series.title} — playlist" style="aspect-ratio:16/9">
          <div class="frame__inner">
            <img src="${src('serie', 'poster.webp')}" alt="" loading="lazy" decoding="async" />
            <video muted loop playsinline preload="none" data-src="${src('serie', 'preview.mp4')}"></video>
          </div>
          <span class="playhead" aria-hidden="true"></span>
        </div>
        <div class="series__stills" aria-hidden="true">
          ${series.stills.map((s) => `<div class="frame" data-yt data-cursor="Assistir"><div class="frame__inner"><img src="${src('serie', s + '.webp')}" alt="" loading="lazy" decoding="async" /></div></div>`).join('')}
        </div>
      </div>
    </div>`;

  // Social — contact sheet
  const flat = [];
  const groups = social.map((g) => {
    const cards = g.items
      .map((it) => {
        const idx = flat.push({ ...it, title: `${g.client} — ${it.title}`, kind: g.note }) - 1;
        return `<figure class="card" data-reveal>${frame({ ...it, title: `${g.client} — ${it.title}` }, { list: 'social', idx, ratio: '9 / 16', cls: 'frame--tc' })}</figure>`;
      })
      .join('');
    return `
      <div class="sgroup" style="--n:${g.items.length}">
        <div class="sgroup__head" data-reveal>
          <h3 class="sgroup__t">${g.client}</h3>
          <span class="sgroup__note mono">${g.note}</span>
        </div>
        <div class="sgroup__row">${cards}</div>
      </div>`;
  });
  $('[data-social]').innerHTML = `<div class="social">${groups.join('')}</div>`;
  reg('social', flat);
  reg('reel', [reel]);
}

/* ─────────────────────────────── previews */
const playing = new Set();
const autoQueue = [];
function startPreview(fr, auto = false) {
  if (!fr || SAVE) return;
  const v = $('video', fr);
  if (!v) return;
  if (!v.src) v.src = v.dataset.src;
  const p = v.play();
  if (p) p.then(() => { if (autoQueue.includes(fr)) fr.classList.add('is-playing'); else v.pause(); }).catch(() => {});
  playing.add(fr);
  const i = autoQueue.indexOf(fr);
  if (i > -1) autoQueue.splice(i, 1);
  autoQueue.push(fr);
  while (autoQueue.length > MAX_AUTOPLAY) stopPreview(autoQueue[0]);
}
function stopPreview(fr) {
  if (!fr) return;
  const v = $('video', fr);
  if (!v) return;
  v.pause();
  fr.classList.remove('is-playing');
  playing.delete(fr);
  const i = autoQueue.indexOf(fr);
  if (i > -1) autoQueue.splice(i, 1);
}

function initPreviews() {
  const frames = $$('.frame').filter((f) => $('video', f));
  frames.forEach((fr) => {
    if (FINE) {
      fr.addEventListener('mouseenter', () => startPreview(fr));
      fr.addEventListener('mouseleave', () => { if (!fr.dataset.inview) stopPreview(fr); });
    }
    // keyboard users get the same preview as hover
    fr.addEventListener('focus', () => startPreview(fr));
    fr.addEventListener('blur', () => { if (!fr.dataset.inview) stopPreview(fr); });
  });
  if (RM) return;
  // autoplay while well inside the viewport: TZ, Block Office, social, série; on touch screens: everything
  const auto = frames.filter((f) => !FINE || f.closest('.tz, .block, .sgroup__row, .series__stage'));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const fr = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          fr.dataset.inview = '1';
          startPreview(fr, true);
        } else {
          delete fr.dataset.inview;
          stopPreview(fr);
        }
      });
    },
    { threshold: [0, 0.6] }
  );
  auto.forEach((f) => io.observe(f));
}

/* floating preview for the clips index: anchored right, follows the pointer vertically */
function initFloatPreview() {
  if (!FINE) return;
  const box = $('.float-preview');
  const v = $('video', box);
  const tc = $('.float-preview__tc', box);
  const list = $('[data-clips]');
  let x = 0, y = 0, cy = 0, current = null, raf = null;
  const margin = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--m')) || 32;
  const loop = () => {
    cy += (y - cy) * 0.14;
    box.style.left = `${x}px`;
    box.style.top = `${cy}px`;
    raf = requestAnimationFrame(loop);
  };
  list.addEventListener('mousemove', (e) => {
    x = window.innerWidth - margin() - box.offsetWidth / 2;
    y = Math.min(Math.max(e.clientY, box.offsetHeight / 2 + 12), window.innerHeight - box.offsetHeight / 2 - 12);
  });
  $$('.index__btn', list).forEach((btn) => {
    btn.addEventListener('mouseenter', (e) => {
      const id = btn.dataset.preview;
      if (!raf) { cy = e.clientY; x = window.innerWidth - margin() - box.offsetWidth / 2; loop(); }
      box.classList.add('is-on');
      if (current !== id) {
        current = id;
        v.poster = src(id, 'poster.webp');
        box.style.aspectRatio = ratioOf(id);
        tc.textContent = dur(id);
        if (!SAVE) { v.src = src(id, 'preview.mp4'); v.play().catch(() => {}); }
      }
    });
  });
  list.addEventListener('mouseleave', () => {
    box.classList.remove('is-on');
    v.pause();
    current = null;
    setTimeout(() => { if (!box.classList.contains('is-on') && raf) { cancelAnimationFrame(raf); raf = null; } }, 400);
  });
}

/* ─────────────────────────────── flash pulse */
function flash(strength = 0.75) {
  if (RM) return;
  gsap.timeline().set('.flash', { opacity: strength }).to('.flash', { opacity: 0, duration: 0.42, ease: 'power2.out' });
}

/* ─────────────────────────────── player */
const heroState = { visible: true };
const player = {
  el: null, v: null, list: null, idx: 0, lastFocus: null, lenis: null, idleT: null,
  init(lenis) {
    this.lenis = lenis;
    this.el = $('.player');
    this.v = $('.player__video');
    const v = this.v;
    const seek = $('.pc-seek');
    const play = $('.pc-play');
    const mute = $('.pc-mute');
    const status = $('.player__status');
    const setP = () => {
      const p = v.duration ? (v.currentTime / v.duration) * 1000 : 0;
      seek.value = p;
      seek.style.setProperty('--p', `${p / 10}%`);
      $('.pc-time').textContent = fmtTime(v.currentTime);
    };
    const setStatus = (t) => { status.textContent = t; status.classList.toggle('is-on', !!t); };
    v.addEventListener('timeupdate', setP);
    v.addEventListener('loadedmetadata', () => { $('.pc-dur').textContent = fmtTime(v.duration); setP(); });
    v.addEventListener('waiting', () => setStatus('Carregando…'));
    v.addEventListener('playing', () => setStatus(''));
    v.addEventListener('canplay', () => setStatus(''));
    v.addEventListener('play', () => { play.textContent = 'Pausar'; play.setAttribute('aria-label', 'Pausar'); this.armIdle(); });
    v.addEventListener('pause', () => { play.textContent = 'Play'; play.setAttribute('aria-label', 'Reproduzir'); this.wake(); });
    v.addEventListener('ended', () => this.step(1, true));
    v.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    v.addEventListener('dblclick', () => this.fullscreen());
    seek.addEventListener('input', () => { if (v.duration) v.currentTime = (seek.value / 1000) * v.duration; });
    play.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    mute.addEventListener('click', () => this.toggleMute());
    $('.pc-fs').addEventListener('click', () => this.fullscreen());
    $('.player__close').addEventListener('click', () => this.close());
    $('.player__prev').addEventListener('click', () => this.step(-1));
    $('.player__next').addEventListener('click', () => this.step(1));
    ['mousemove', 'touchstart'].forEach((ev) => this.el.addEventListener(ev, () => this.armIdle(), { passive: true }));
    document.addEventListener('keydown', (e) => {
      if (this.el.hidden) return;
      this.armIdle();
      const typing = e.target.tagName === 'INPUT';
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowRight' && !typing) this.step(1);
      else if (e.key === 'ArrowLeft' && !typing) this.step(-1);
      else if ((e.key === ' ' || e.key === 'k') && (e.target === document.body || e.target === v)) { e.preventDefault(); v.paused ? v.play() : v.pause(); }
      else if (e.key === 'm' && !typing) this.toggleMute();
      else if (e.key === 'f' && !typing) this.fullscreen();
      else if (e.key === 'Tab') this.trap(e);
    });
  },
  toggleMute() {
    const v = this.v, mute = $('.pc-mute');
    v.muted = !v.muted;
    mute.textContent = v.muted ? 'Som off' : 'Som on';
    mute.setAttribute('aria-label', v.muted ? 'Ativar som' : 'Silenciar');
  },
  fullscreen() {
    const t = $('.player__stage');
    if (document.fullscreenElement) document.exitFullscreen();
    else if (t.requestFullscreen) t.requestFullscreen();
    else this.v.webkitEnterFullscreen?.();
  },
  wake() { clearTimeout(this.idleT); this.el.classList.remove('is-idle'); },
  armIdle() {
    this.wake();
    if (this.el.classList.contains('is-embed') || this.v.paused || !FINE) return;
    this.idleT = setTimeout(() => {
      if (!this.el.contains(document.activeElement) || document.activeElement === document.body || document.activeElement === this.v || document.activeElement === $('.player__close')) this.el.classList.add('is-idle');
    }, 2600);
  },
  trap(e) {
    const f = $$('a[href]:not([hidden]), button:not([hidden]), input, iframe', this.el).filter((n) => n.offsetParent !== null && !n.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  },
  load() {
    const item = this.list[this.idx];
    const many = this.list.length > 1;
    const next = many ? this.list[this.idx + 1] : null;
    $('.player__title').textContent = item.title;
    $('.player__meta').textContent = item.meta ?? [item.kind, item.artist, item.credit].filter(Boolean).join(' · ');
    $('.player__pos').textContent = many ? `${pad(this.idx + 1)} / ${pad(this.list.length)}` : '';
    $('.player__prev').hidden = $('.player__next').hidden = !many;
    $('.player__prev').disabled = this.idx === 0;
    $('.player__next').disabled = !next;
    $('.player__next-l').textContent = next ? `Próximo: ${next.title.replace(/^.+? — /, '')}` : 'Próximo';
    $('.player__next').setAttribute('aria-label', next ? `Próximo trabalho: ${next.title}` : 'Próximo trabalho');
    $('.player__yt').hidden = true;
    this.v.poster = src(item.id, 'poster.webp');
    this.v.src = src(item.id, 'full.mp4');
    if (this.seekTo) {
      const t = this.seekTo;
      this.v.addEventListener('loadedmetadata', () => { this.v.currentTime = t; }, { once: true });
      this.seekTo = 0;
    }
    this.v.muted = false;
    $('.pc-mute').textContent = 'Som on';
    this.v.play().catch(() => { this.v.muted = true; $('.pc-mute').textContent = 'Som off'; this.v.play().catch(() => {}); });
  },
  prepare() {
    this.lastFocus = document.activeElement;
    playing.forEach(stopPreview);
    $('.hero__video')?.pause();
  },
  open(listKey, idx = 0, srcEl = null, seek = 0) {
    this.prepare();
    this.seekTo = seek;
    this.list = playlists[listKey];
    this.idx = idx;
    this.el.classList.remove('is-embed');
    $('.player__embed').innerHTML = '';
    this.show(srcEl);
    this.load();
  },
  openEmbed(srcEl = null) {
    this.prepare();
    this.list = [{ title: series.title }];
    this.el.classList.add('is-embed');
    $('.player__title').textContent = `${series.title} — ${series.channel}`;
    $('.player__meta').textContent = `Playlist · ${series.episodes} episódios · YouTube`;
    $('.player__pos').textContent = '';
    $('.player__prev').hidden = $('.player__next').hidden = true;
    const yt = $('.player__yt');
    yt.href = `https://www.youtube.com/playlist?list=${series.playlist}`;
    yt.hidden = false;
    $('.player__embed').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${series.firstVideo}?list=${series.playlist}&autoplay=1&rel=0&modestbranding=1" title="${series.title} — playlist no YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    this.show(srcEl);
  },
  // the frame grows out of the piece that was clicked: spatial continuity between page and player
  sourceRect(srcEl) {
    if (!srcEl) return null;
    const fp = $('.float-preview');
    let el = srcEl;
    if (srcEl.classList.contains('index__btn')) {
      const thumb = $('.index__thumb', srcEl);
      el = fp.classList.contains('is-on') ? fp : thumb && thumb.offsetParent ? thumb : srcEl;
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 ? r : null;
  },
  show(srcEl = null) {
    const r = this.sourceRect(srcEl);
    this.el.hidden = false;
    this.lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    if (!RM) {
      const stage = $('.player__stage');
      const sr = stage.getBoundingClientRect();
      const from = r
        ? `inset(${Math.max(0, r.top - sr.top)}px ${Math.max(0, sr.right - r.right)}px ${Math.max(0, sr.bottom - r.bottom)}px ${Math.max(0, r.left - sr.left)}px)`
        : 'inset(18% 12% 18% 12%)';
      gsap.fromTo(this.el, { backgroundColor: 'rgba(0,0,0,0)' }, { backgroundColor: 'rgba(0,0,0,1)', duration: 0.5, ease: 'power2.out', clearProps: 'backgroundColor' });
      gsap.fromTo(stage, { clipPath: r ? from : from }, { clipPath: r ? 'inset(0px 0px 0px 0px)' : 'inset(0% 0% 0% 0%)', duration: 0.95, ease: 'expo.inOut', clearProps: 'clipPath' });
      gsap.fromTo(['.player__bar', '.player__controls'], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: 'power3.out', clearProps: 'opacity,transform' });
      gsap.delayedCall(0.62, () => flash(0.32));
    }
    $('.player__close').focus({ preventScroll: true });
  },
  step(d, auto = false) {
    if (!this.list || this.list.length < 2) return;
    const n = this.idx + d;
    if (n < 0 || n >= this.list.length) return;
    this.idx = n;
    if (!auto) flash(0.5);
    this.load();
  },
  close() {
    this.wake();
    this.v.pause();
    this.v.removeAttribute('src');
    this.v.load();
    $('.player__embed').innerHTML = '';
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    const done = () => {
      this.el.hidden = true;
      document.documentElement.style.overflow = '';
      this.lenis?.start();
      if (heroState.visible && !RM && !SAVE) $('.hero__video')?.play().catch(() => {});
      this.lastFocus?.focus?.({ preventScroll: true });
    };
    if (RM) return done();
    gsap.to('.player', { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { gsap.set('.player', { clearProps: 'opacity' }); done(); } });
  },
};

function initOpeners() {
  document.addEventListener('click', (e) => {
    const yt = e.target.closest('[data-yt]');
    if (yt) return player.openEmbed(yt.classList.contains('frame') ? yt : $('.series__stage > .frame'));
    const o = e.target.closest('[data-open]');
    if (o) return player.open(o.dataset.open, 0, null);
    const sk = e.target.closest('[data-seek]');
    if (sk) return player.open('socializei', 0, sk, +sk.dataset.seek);
    const l = e.target.closest('[data-open-list]');
    if (l) return player.open(l.dataset.openList, +l.dataset.idx, l);
    const f = e.target.closest('.frame[data-list]');
    if (f) return player.open(f.dataset.list, +f.dataset.idx, f);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const f = e.target.closest?.('.frame[role="button"]');
    if (!f) return;
    e.preventDefault();
    f.click();
  });
}

/* ─────────────────────────────── cursor */
function initCursor() {
  if (!FINE) return;
  const c = $('.cursor');
  const label = $('.cursor__label');
  let x = -100, y = -100, cx = -100, cy = -100;
  window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    cx += (x - cx) * 0.3;
    cy += (y - cy) * 0.3;
    c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
  });
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-cursor]');
    if (t && player.el.hidden) { label.textContent = t.dataset.cursor; c.classList.add('is-on'); }
    else c.classList.remove('is-on');
  });
  document.addEventListener('mouseleave', () => c.classList.remove('is-on'));
}

/* ─────────────────────────────── hero */
function initHero() {
  const v = $('.hero__video');
  const tc = $('[data-tc]');
  let raf;
  const tick = () => {
    const t = v.currentTime || 0;
    const s = Math.floor(t);
    tc.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(Math.floor((t % 1) * 30))}`;
    raf = requestAnimationFrame(tick);
  };
  ScrollTrigger.create({
    trigger: '.hero', start: 'top bottom', end: 'bottom top',
    onToggle: (s) => {
      heroState.visible = s.isActive;
      if (s.isActive) { if (!raf) tick(); if (v.src && player.el.hidden) v.play().catch(() => {}); }
      else { cancelAnimationFrame(raf); raf = null; v.pause(); }
    },
  });
  tick();
  if (RM || SAVE) return;
  v.src = window.innerWidth > 900 ? '/media/reel/loop.mp4' : '/media/reel/loop-sm.mp4';
  v.preload = 'auto';
  v.play().catch(() => {});
  gsap.to('.hero__media', { yPercent: 16, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: -36, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ─────────────────────────────── motion system */
// 1 · WIDTH MORPH — the signature: titles travel from condensed to extended as they enter,
//     the same axis that separates "BY" (wide) from the body. Scrubbed, so it reads as camera movement.
function initMorph() {
  $$('[data-morph="expand"]').forEach((el) => {
    const isShead = el.classList.contains('shead__t');
    gsap.fromTo(el,
      { fontStretch: '62%', opacity: isShead ? 0.25 : 1 },
      { fontStretch: '125%', opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: isShead ? 'top 62%' : 'top 30%', scrub: 0.4 } });
  });
  // contact: the address expands as the page closes — mirrors the opening statement
  const ma = $('.contact__mail .mail-a');
  if (ma) gsap.fromTo(ma, { fontStretch: '62%' }, { fontStretch: '125%', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 35%', scrub: 0.4 } });
}

// 2 · COUNTS roll up when the header enters
function initCounts() {
  $$('[data-count]').forEach((el) => {
    const n = +el.dataset.n || 0;
    const o = { v: 0 };
    el.textContent = '00';
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(o, { v: n, duration: 0.9, ease: 'power2.out', onUpdate: () => (el.textContent = pad(Math.round(o.v))) }),
    });
  });
}

// 3 · SHUTTER — pieces open like a frame being exposed (same gesture as the TZ shutter)
function shutter(frames, trigger, stagger = 0) {
  if (!frames.length) return;
  const inners = frames.map((f) => $('.frame__inner', f));
  gsap.set(frames, { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set(inners, { scale: 1.16 });
  ScrollTrigger.create({
    trigger, start: 'top 88%', once: true,
    onEnter: () => {
      gsap.to(frames, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.out', stagger, clearProps: 'clipPath' });
      gsap.to(inners, { scale: 1, duration: 1.6, ease: 'expo.out', stagger });
    },
  });
}

function initReveals() {
  if (RM) return;
  initMorph();
  initCounts();

  // opening statement: the second line arrives as a cut once the first has expanded
  gsap.from('.statement__b', { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.statement__text', start: 'top 55%' } });
  gsap.from(['.statement__craft', '.statement__peek', '.toc li'], { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.statement__craft', start: 'top 92%' } });

  $$('.films .card, .lv .card').forEach((c) => {
    shutter([$('.frame', c)], c);
    gsap.from($('.cap', c), { opacity: 0, y: 10, duration: 0.9, delay: 0.35, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
  });
  shutter($$('.series__stage > .frame'), '.series__stage');
  shutter($$('.case__media .frame'), '.case');
  gsap.from('.case__board li', { opacity: 0, y: 18, duration: 0.9, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.case__board', start: 'top 92%' } });
  gsap.from(['.case__head', '.case__line'], { opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.case', start: 'top 80%' } });
  gsap.fromTo('.case__line', { fontStretch: '62%' }, { fontStretch: '82%', ease: 'none', scrollTrigger: { trigger: '.case__line', start: 'top bottom', end: 'top 45%', scrub: 0.4 } });
  gsap.from('.series__stills .frame', { opacity: 0, y: 16, duration: 0.9, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.series__stills', start: 'top 95%' } });
  $$('.sgroup').forEach((g) => shutter($$('.frame', g), g, 0.08));
  $$('.index__row, .sgroup__head, .lv__head, .series__info').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 24, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 94%' } });
  });

  // depth: media drifts slightly against the scroll inside its frame
  $$('.films .frame__inner, .lv .frame__inner, .series__stage > .frame .frame__inner').forEach((inner) => {
    gsap.fromTo(inner, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: inner.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // TZ: the frame opens like a shutter, scrubbed
  const tz = $('[data-tz-wrap] .frame');
  if (tz) {
    gsap.fromTo(tz, { clipPath: 'inset(14% 18% 14% 18%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '[data-tz-wrap]', start: 'top bottom', end: 'top 15%', scrub: true } });
    gsap.from('.tz__info', { opacity: 0, y: 30, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '[data-tz-wrap]', start: 'top 40%' } });
  }

  // contact: letters lift under the pointer
  if (FINE) {
    const chars = $$('.contact__mail .char');
    $('.contact__mail').addEventListener('mousemove', (e) => {
      chars.forEach((ch) => {
        const r = ch.getBoundingClientRect();
        const k = Math.max(0, 1 - Math.abs(e.clientX - (r.left + r.width / 2)) / 220);
        ch.style.transform = `translateY(${-k * 10}%)`;
        ch.style.color = k > 0.5 ? '#fff' : '';
      });
    });
    $('.contact__mail').addEventListener('mouseleave', () => chars.forEach((ch) => { ch.style.transform = ''; ch.style.color = ''; }));
  }
}

// 4 · PLAYHEADS — a thin bar shows a preview is running and how far it is in its loop
function initPlayheads() {
  const fp = $('.float-preview');
  const fpv = $('video', fp);
  const fph = $('.playhead', fp);
  gsap.ticker.add(() => {
    playing.forEach((fr) => {
      const v = $('video', fr), ph = $('.playhead', fr);
      if (v && ph && v.duration) ph.style.transform = `scaleX(${(v.currentTime / v.duration).toFixed(4)})`;
    });
    if (fp.classList.contains('is-on') && fpv.duration) fph.style.transform = `scaleX(${(fpv.currentTime / fpv.duration).toFixed(4)})`;
  });
}

// 5 · ÍNDICE PEEK — hovering/focusing a chapter shows a still from it (desktop)
function initPeek() {
  const box = $('.statement__peek');
  const img = $('img', box);
  if (!box || getComputedStyle(box).display === 'none') return;
  let cur = img.src;
  const show = (url) => {
    if (!url || url === cur) return;
    cur = url;
    const next = new Image();
    next.src = url;
    next.decode?.().catch(() => {}).finally(() => {
      if (cur !== url) return;
      if (RM) { img.src = url; return; }
      gsap.timeline()
        .to(img, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.28, ease: 'power2.in' })
        .add(() => { img.src = url; })
        .fromTo(img, { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.08 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.7, ease: 'expo.out' });
    });
  };
  $$('.toc a').forEach((a) => {
    a.addEventListener('mouseenter', () => show(a.dataset.peek));
    a.addEventListener('focus', () => show(a.dataset.peek));
  });
}

// 6 · MAGNETIC — only the primary action, a small pull toward the pointer
function initMagnetic() {
  if (!FINE || RM) return;
  $$('[data-magnetic]').forEach((btn) => {
    const ring = $('.btn-reel__ring', btn);
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.6, ease: 'power3.out' });
    btn.addEventListener('mousemove', (e) => {
      const r = ring.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });
}

/* Block Office: vertical scroll → horizontal travel (desktop) with progress */
function initBlock() {
  const total = campaigns.block.items.length;
  const count = $('.block__count');
  const bar = $('.block__bar');
  const items = $$('.block__item');
  // pinned (vertical scroll drives it) only on wide screens without reduced motion; otherwise it is a native swipe
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
    const pin = $('.block__pin');
    const track = $('.block__track');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      // runs on every scrubbed frame, so the counter follows what is actually on screen
      onUpdate() {
        bar.style.setProperty('--p', this.progress().toFixed(3));
        const mid = window.innerWidth / 2;
        let best = 0, bd = Infinity;
        items.forEach((it, i) => { const r = it.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
        const txt = `${pad(best + 1)} / ${pad(total)}`;
        if (count.textContent !== txt) {
          count.textContent = txt;
          items.forEach((it, i) => it.classList.toggle('is-current', i === best));
        }
      },
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onToggle: (st) => $('.block').classList.toggle('is-pinned', st.isActive),
      },
    });
    items[0]?.classList.add('is-current');
    return () => $('.block').classList.remove('is-pinned');
  });
}

/* ─────────────────────────────── header, chapter, menu, misc */
function initHeader(lenis) {
  const h = $('[data-header]');
  let last = 0;
  const onScroll = (y) => {
    if (!$('#menu').hidden) return;
    if (y > 200 && y > last + 4) h.classList.add('is-hidden');
    else if (y < last - 4 || y < 200) h.classList.remove('is-hidden');
    last = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

  // active nav + chapter indicator
  const chap = $('[data-chapter]');
  let current = '';
  const setChapter = (txt) => {
    if (txt === current) return;
    current = txt;
    if (RM || !txt) { chap.textContent = txt; return; }
    gsap.timeline()
      .to(chap, { yPercent: -100, duration: 0.25, ease: 'power2.in' })
      .add(() => { chap.textContent = txt; })
      .fromTo(chap, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'expo.out' });
  };
  $$('[data-chapter-name]').forEach((sec) => {
    const link = $(`.header__nav a[href="#${sec.id}"]`);
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (s) => {
        link?.classList.toggle('is-active', s.isActive);
        if (s.isActive) setChapter(`(${sec.dataset.chapterN}) ${sec.dataset.chapterName}`);
      },
    });
  });
  ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom 50%', onToggle: (s) => s.isActive && setChapter('') });
  ScrollTrigger.create({ trigger: '.statement', start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && setChapter('Índice') });

  // anchor links through Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const t = id === '#top' ? 0 : $(id);
    if (t === null) return;
    e.preventDefault();
    closeMenu(false);
    if (lenis) lenis.scrollTo(t, { duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 4) });
    else (t === 0 ? window.scrollTo({ top: 0 }) : t.scrollIntoView());
    if (t !== 0) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  });

  const btn = $('.header__menu');
  const menu = $('#menu');
  function closeMenu(returnFocus = true) {
    if (menu.hidden) return;
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Menu';
    lenis?.start();
    document.documentElement.style.overflow = '';
    if (returnFocus) btn.focus();
  }
  btn.addEventListener('click', () => {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false;
    h.classList.remove('is-hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Fechar';
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    if (!RM) gsap.from('#menu nav a', { yPercent: 60, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 });
    $('#menu nav a')?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') closeMenu();
    if (e.key === 'Tab') {
      const f = [btn, ...$$('a', menu)];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  const copy = $('[data-copy]');
  const status = $('[data-copy-status]');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      copy.textContent = 'Copiado ✓';
      status.textContent = 'E-mail copiado';
    } catch {
      copy.textContent = contact.email;
    }
    setTimeout(() => { copy.textContent = 'Copiar e-mail'; status.textContent = ''; }, 2200);
  });
}

/* ─────────────────────────────── preloader */
function preload() {
  const pre = $('.preloader');
  const path = $('.preloader__logo path');
  const count = $('.preloader__count');
  document.body.classList.add('is-loading');
  const end = () => { pre.remove(); document.body.classList.remove('is-loading'); };
  if (RM || sessionStorage.getItem('cb-seen')) {
    gsap.to(pre, { opacity: 0, duration: RM ? 0.01 : 0.4, onComplete: end });
    return Promise.resolve();
  }
  sessionStorage.setItem('cb-seen', '1');
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  const c = { v: 0 };
  return new Promise((res) => {
    gsap.timeline({ onComplete: () => { end(); res(); } })
      .to(path, { strokeDashoffset: 0, duration: 1.25, ease: 'power2.inOut' }, 0)
      .to(c, { v: 100, duration: 1.25, ease: 'power2.inOut', onUpdate: () => (count.textContent = String(Math.round(c.v)).padStart(3, '0')) }, 0)
      .to(path, { fillOpacity: 1, duration: 0.25, ease: 'power1.out' }, 1.15)
      .add(() => flash(0.85), 1.5)
      .set(pre, { opacity: 0 }, 1.52);
  });
}

/* ─────────────────────────────── boot */
render();
const lenis = RM ? null : new Lenis({ lerp: 0.11, smoothWheel: true });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
player.init(lenis);
initBlock(); // the pin must exist before any trigger placed below it is measured
initOpeners();
initCursor();
initHeader(lenis);
initPreviews();
initFloatPreview();
initPlayheads();
preload().then(() => {
  initHero();
  initReveals();
  initPeek();
  initMagnetic();
  if (!RM) {
    gsap.from('.hero__logo', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out' });
    gsap.from(['.hero__top', '.hero__bottom'], { opacity: 0, duration: 1, delay: 0.3 });
  }
  ScrollTrigger.refresh();
});
window.addEventListener('load', () => ScrollTrigger.refresh());
