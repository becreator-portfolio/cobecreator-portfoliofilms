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
const DESKTOP = () => window.matchMedia('(min-width: 861px)').matches;

const src = (id, f) => `/media/${id}/${f}`;
const fmtTime = (s) => {
  if (!isFinite(s)) return '00:00';
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const dur = (id) => fmtTime(media[id]?.dur ?? 0);
const ratioOf = (id) => {
  const m = media[id];
  return m ? `${m.w} / ${m.h}` : '16 / 9';
};
const pad = (n) => String(n).padStart(2, '0');

/* ─────────────────────────────── playlists (for player prev/next) */
const playlists = {};
const reg = (key, items) => { playlists[key] = items; };

/* ─────────────────────────────── templates */
function frame(item, { list, idx, label = 'Play', ratio, lazyPoster = true } = {}) {
  const r = ratio ?? ratioOf(item.id);
  return `
  <div class="frame" role="button" tabindex="0" style="aspect-ratio:${r}"
       data-id="${item.id}" data-list="${list}" data-idx="${idx}" data-cursor="${label}"
       aria-label="Assistir ${item.title.replace(/"/g, '&quot;')}">
    <div class="frame__inner">
      <img src="${src(item.id, 'poster.webp')}" alt="" ${lazyPoster ? 'loading="lazy" decoding="async"' : ''} />
      <video muted loop playsinline preload="none" data-src="${src(item.id, 'preview.mp4')}"></video>
    </div>
    <span class="frame__tc mono"><i class="rec"></i>${dur(item.id)}</span>
  </div>`;
}

function card(item, opts, capHtml) {
  return `<figure class="card" data-reveal>${frame(item, opts)}<figcaption class="cap mono">${capHtml}</figcaption></figure>`;
}

/* ─────────────────────────────── render */
function render() {
  // logo path for preloader is inlined by vite; contact
  const mail = $('[data-mail]');
  mail.href = `mailto:${contact.email}`;
  const at = contact.email.indexOf('@');
  const chars = (t) => [...t].map((c) => `<span class="char">${c}</span>`).join('');
  mail.innerHTML = `<span class="mail-a" aria-hidden="true">${chars(contact.email.slice(0, at))}</span><span class="mail-b" aria-hidden="true">${chars(contact.email.slice(at))}</span>`;
  mail.setAttribute('aria-label', `Enviar e-mail para ${contact.email}`);
  mail.dataset.cursor = 'Escrever';
  const ig = $('[data-insta]');
  ig.href = contact.instagram;
  ig.textContent = `Instagram ${contact.instagramHandle}`;
  $('[data-year]').textContent = new Date().getFullYear();

  // films
  reg('films', films.map((f) => ({ ...f, kind: 'Filme autoral' })));
  $('[data-films]').innerHTML = films
    .map((f, i) =>
      card(f, { list: 'films', idx: i }, `<span><span class="cap__n">${pad(i + 1)}</span><span class="cap__t">${f.title}</span></span><span class="dim">${f.ratio} · ${dur(f.id)}</span>`)
    )
    .join('');
  $('[data-count="films"]').textContent = `${pad(films.length)} filmes autorais`;

  // clips index
  reg('clips', clips);
  $('[data-clips]').innerHTML = clips
    .map(
      (c, i) => `
    <li class="index__row" data-reveal>
      <button class="index__btn" data-open-list="clips" data-idx="${i}" data-preview="${c.id}" data-cursor="Play"
        aria-label="Assistir ${c.title} — ${c.artist}">
        <span class="index__n">${pad(i + 1)}</span>
        <span class="index__t">${c.title}</span>
        <span class="index__a">${c.artist}${c.credit ? ` — ${c.credit}` : ''}</span>
        <span class="index__d">${dur(c.id)}</span>
        <img class="index__thumb" src="${src(c.id, 'poster.webp')}" alt="" loading="lazy" />
      </button>
    </li>`
    )
    .join('');
  $('[data-count="clips"]').textContent = `${pad(clips.length)} clipes · Unânime e outros`;

  // TZ
  const tz = campaigns.tz;
  reg('tz', [{ ...tz, kind: tz.kind }]);
  $('[data-tz]').innerHTML = `
    <div class="tz" data-tz-wrap>
      ${frame(tz, { list: 'tz', idx: 0, ratio: 'auto' })}
      <div class="tz__info">
        <h3 class="tz__t">${tz.title}</h3>
        <span class="mono">${tz.kind} · ${dur(tz.id)}</span>
      </div>
    </div>`;

  // Block Office
  const b = campaigns.block;
  reg('block', b.items.map((it) => ({ ...it, title: `Block Office — ${it.title}`, kind: b.kind })));
  $('[data-block]').innerHTML = `
    <div class="block" data-block-wrap>
      <div class="block__pin">
        <div class="block__track">
          <div class="block__intro">
            <span class="mono dim">${b.kind}</span>
            <h3 class="block__t">${b.title}</h3>
            <span class="mono dim">${pad(b.items.length)} peças · Vertical e horizontal</span>
          </div>
          ${b.items
            .map(
              (it, i) => `
            <figure class="block__item block__item--${it.fmt}">
              ${frame(it, { list: 'block', idx: i, ratio: it.fmt === 'v' ? '9 / 16' : '16 / 9' })}
              <figcaption class="cap mono"><span><span class="cap__n">${pad(i + 1)}</span>${it.title}</span><span class="dim">${dur(it.id)}</span></figcaption>
            </figure>`
            )
            .join('')}
        </div>
      </div>
    </div>`;

  // LV
  const lv = campaigns.lv;
  reg('lv', lv.items.map((it) => ({ ...it, title: `LV Agência — ${it.title}`, kind: lv.kind })));
  $('[data-lv]').innerHTML = `
    <div class="lv">
      <div class="lv__head" data-reveal>
        <span class="mono dim">${lv.kind}</span>
        <h3 class="lv__t">${lv.title}</h3>
      </div>
      ${lv.items
        .map((it, i) => card(it, { list: 'lv', idx: i, ratio: '16 / 9' }, `<span><span class="cap__n">${pad(i + 1)}</span>${it.title}</span><span class="dim">${dur(it.id)}</span>`))
        .join('')}
    </div>`;

  // Série
  $('[data-series]').innerHTML = `
    <div class="series">
      <div class="series__info">
        <span class="mono dim">${series.channel}</span>
        <h3 class="series__t">${series.title}</h3>
        <div class="series__eps mono" aria-label="${series.episodes} episódios">${Array.from({ length: series.episodes }, (_, i) => `<span>${i + 1}</span>`).join('')}</div>
        <button class="btn-line mono" data-yt><span class="btn-play__icon" aria-hidden="true"></span>Assistir a série</button>
      </div>
      <div class="series__stage">
        <div class="frame" role="button" tabindex="0" data-yt data-cursor="Assistir no YouTube" aria-label="Assistir ${series.title} no YouTube" style="aspect-ratio:16/9">
          <div class="frame__inner">
            <img src="${src('serie', 'poster.webp')}" alt="" loading="lazy" decoding="async" />
            <video muted loop playsinline preload="none" data-src="${src('serie', 'preview.mp4')}"></video>
          </div>
        </div>
        <div class="series__stills">
          ${series.stills
            .map(
              (s) => `<div class="frame" role="button" tabindex="0" data-yt data-cursor="YouTube" aria-label="Abrir playlist no YouTube"><div class="frame__inner"><img src="${src('serie', s + '.webp')}" alt="" loading="lazy" /></div></div>`
            )
            .join('')}
        </div>
      </div>
    </div>`;

  // Social
  const flat = [];
  $('[data-social]').innerHTML = `<div class="social">${social
    .map((g) => {
      const cards = g.items
        .map((it) => {
          const idx = flat.push({ ...it, title: `${g.client} — ${it.title}`, kind: g.note }) - 1;
          return card(it, { list: 'social', idx, ratio: '9 / 16' }, `<span>${it.title}</span><span class="dim">${dur(it.id)}</span>`);
        })
        .join('');
      return `
      <div class="sgroup">
        <div class="sgroup__head" data-reveal>
          <h3 class="sgroup__t">${g.client}</h3>
          <span class="mono dim">${g.note}</span>
        </div>
        <div class="sgroup__row" data-autoplay-row>${cards}</div>
      </div>`;
    })
    .join('')}</div>`;
  reg('social', flat);
  reg('reel', [reel]);
}

/* ─────────────────────────────── previews */
const playing = new Set();
function startPreview(fr) {
  if (!fr || SAVE) return;
  const v = $('video', fr);
  if (!v) return;
  if (!v.src) v.src = v.dataset.src;
  const p = v.play();
  if (p) p.then(() => fr.classList.add('is-playing')).catch(() => {});
  playing.add(fr);
}
function stopPreview(fr) {
  const v = $('video', fr);
  if (!v) return;
  v.pause();
  fr.classList.remove('is-playing');
  playing.delete(fr);
}

function initPreviews() {
  const frames = $$('.frame').filter((f) => $('video', f));
  if (FINE) {
    frames.forEach((fr) => {
      fr.addEventListener('mouseenter', () => startPreview(fr));
      fr.addEventListener('mouseleave', () => {
        if (!fr.dataset.inview) stopPreview(fr);
      });
    });
  }
  if (RM) return;
  // autoplay when the frame is well inside the viewport: TZ, Block Office, social, série; on touch: all
  const auto = frames.filter((f) => !FINE || f.closest('.tz, .block, .sgroup__row, .series__stage'));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const fr = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          fr.dataset.inview = '1';
          startPreview(fr);
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

/* floating preview for the clips index */
function initFloatPreview() {
  if (!FINE) return;
  const box = $('.float-preview');
  const v = $('video', box);
  const list = $('[data-clips]');
  let x = 0, y = 0, cx = 0, cy = 0, current = null, raf = null;
  const loop = () => {
    cx += (x - cx) * 0.14;
    cy += (y - cy) * 0.14;
    box.style.left = `${cx}px`;
    box.style.top = `${cy}px`;
    raf = requestAnimationFrame(loop);
  };
  list.addEventListener('mousemove', (e) => {
    // anchored to the right edge (titles expand on hover and must stay readable); follows the pointer vertically
    const margin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--m')) || 32;
    x = window.innerWidth - margin - box.offsetWidth / 2;
    y = Math.min(Math.max(e.clientY, box.offsetHeight / 2 + 12), window.innerHeight - box.offsetHeight / 2 - 12);
  });
  $$('.index__btn', list).forEach((btn) => {
    btn.addEventListener('mouseenter', (e) => {
      const id = btn.dataset.preview;
      if (!raf) { cx = e.clientX; cy = e.clientY; loop(); }
      box.classList.add('is-on');
      if (current !== id) {
        current = id;
        v.poster = src(id, 'poster.webp');
        if (!SAVE) { v.src = src(id, 'preview.mp4'); v.play().catch(() => {}); }
        box.style.aspectRatio = ratioOf(id);
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
  if (RM) return Promise.resolve();
  return gsap
    .timeline()
    .set('.flash', { opacity: strength })
    .to('.flash', { opacity: 0, duration: 0.42, ease: 'power2.out' });
}

/* ─────────────────────────────── player */
const player = {
  el: null, v: null, list: null, idx: 0, lastFocus: null, lenis: null,
  init(lenis) {
    this.lenis = lenis;
    this.el = $('.player');
    this.v = $('.player__video');
    const v = this.v;
    const seek = $('.pc-seek');
    const play = $('.pc-play');
    const mute = $('.pc-mute');
    const setP = () => {
      const p = v.duration ? (v.currentTime / v.duration) * 1000 : 0;
      seek.value = p;
      seek.style.setProperty('--p', `${p / 10}%`);
      $('.pc-time').textContent = fmtTime(v.currentTime);
    };
    v.addEventListener('timeupdate', setP);
    v.addEventListener('loadedmetadata', () => { $('.pc-dur').textContent = fmtTime(v.duration); setP(); });
    v.addEventListener('play', () => { play.textContent = 'Pausar'; play.setAttribute('aria-label', 'Pausar'); });
    v.addEventListener('pause', () => { play.textContent = 'Play'; play.setAttribute('aria-label', 'Reproduzir'); });
    v.addEventListener('ended', () => this.step(1, true));
    v.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    seek.addEventListener('input', () => { if (v.duration) v.currentTime = (seek.value / 1000) * v.duration; });
    play.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    mute.addEventListener('click', () => {
      v.muted = !v.muted;
      mute.textContent = v.muted ? 'Som off' : 'Som on';
      mute.setAttribute('aria-label', v.muted ? 'Ativar som' : 'Silenciar');
    });
    $('.pc-fs').addEventListener('click', () => {
      const t = $('.player__stage');
      if (document.fullscreenElement) document.exitFullscreen();
      else (t.requestFullscreen?.() ?? v.webkitEnterFullscreen?.());
    });
    $('.player__close').addEventListener('click', () => this.close());
    $('.player__prev').addEventListener('click', () => this.step(-1));
    $('.player__next').addEventListener('click', () => this.step(1));
    document.addEventListener('keydown', (e) => {
      if (this.el.hidden) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowRight' && e.target.tagName !== 'INPUT') this.step(1);
      else if (e.key === 'ArrowLeft' && e.target.tagName !== 'INPUT') this.step(-1);
      else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); v.paused ? v.play() : v.pause(); }
      else if (e.key === 'Tab') this.trap(e);
    });
  },
  trap(e) {
    const f = $$('button, input, iframe, [tabindex="0"]', this.el).filter((n) => n.offsetParent !== null && !n.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  },
  load() {
    const item = this.list[this.idx];
    const many = this.list.length > 1;
    $('.player__title').textContent = item.title;
    $('.player__meta').textContent = item.meta ?? [item.kind, item.artist, item.credit, item.ratio].filter(Boolean).join(' · ');
    $('.player__pos').textContent = many ? `${pad(this.idx + 1)} / ${pad(this.list.length)}` : '';
    $('.player__prev').hidden = $('.player__next').hidden = !many;
    $('.player__prev').disabled = this.idx === 0;
    $('.player__next').disabled = this.idx === this.list.length - 1;
    this.v.poster = src(item.id, 'poster.webp');
    this.v.src = src(item.id, 'full.mp4');
    this.v.muted = false;
    $('.pc-mute').textContent = 'Som on';
    this.v.play().catch(() => { this.v.muted = true; $('.pc-mute').textContent = 'Som off'; this.v.play().catch(() => {}); });
  },
  async open(listKey, idx = 0) {
    this.list = playlists[listKey];
    this.idx = idx;
    this.lastFocus = document.activeElement;
    this.el.classList.remove('is-embed');
    $('.player__embed').innerHTML = '';
    playing.forEach(stopPreview);
    $('.hero__video')?.pause();
    this.show();
    this.load();
  },
  openEmbed() {
    this.lastFocus = document.activeElement;
    this.list = [{ title: series.title }];
    this.el.classList.add('is-embed');
    $('.player__title').textContent = `${series.title} — ${series.channel}`;
    $('.player__meta').textContent = `Playlist · ${series.episodes} episódios · YouTube`;
    $('.player__pos').textContent = '';
    $('.player__prev').hidden = $('.player__next').hidden = true;
    $('.player__embed').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${series.firstVideo}?list=${series.playlist}&autoplay=1&rel=0" title="${series.title} — playlist no YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    playing.forEach(stopPreview);
    $('.hero__video')?.pause();
    this.show();
  },
  show() {
    this.el.hidden = false;
    this.lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    flash(0.6);
    if (!RM) gsap.fromTo('.player__stage', { clipPath: 'inset(18% 12% 18% 12%)', opacity: 0.4 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.9, ease: 'expo.out' });
    if (!RM) gsap.fromTo(['.player__bar', '.player__controls'], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    $('.player__close').focus({ preventScroll: true });
  },
  step(d, auto = false) {
    if (!this.list || this.list.length < 2) return;
    const n = this.idx + d;
    if (n < 0 || n >= this.list.length) return;
    this.idx = n;
    if (!auto || !RM) flash(0.5);
    this.load();
  },
  close() {
    this.v.pause();
    this.v.removeAttribute('src');
    this.v.load();
    $('.player__embed').innerHTML = '';
    const done = () => {
      this.el.hidden = true;
      document.documentElement.style.overflow = '';
      this.lenis?.start();
      $('.hero__video')?.play().catch(() => {});
      this.lastFocus?.focus?.({ preventScroll: true });
    };
    if (RM) return done();
    gsap.to('.player', { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => { gsap.set('.player', { opacity: 1 }); done(); } });
  },
};

function initOpeners() {
  document.addEventListener('click', (e) => {
    const yt = e.target.closest('[data-yt]');
    if (yt) return player.openEmbed();
    const o = e.target.closest('[data-open]');
    if (o) return player.open(o.dataset.open, 0);
    const l = e.target.closest('[data-open-list]');
    if (l) return player.open(l.dataset.openList, +l.dataset.idx);
    const f = e.target.closest('.frame[data-list]');
    if (f) return player.open(f.dataset.list, +f.dataset.idx);
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
    if (t) { label.textContent = t.dataset.cursor; c.classList.add('is-on'); }
    else c.classList.remove('is-on');
  });
  document.addEventListener('mouseleave', () => c.classList.remove('is-on'));
}

/* ─────────────────────────────── hero */
function initHero() {
  const v = $('.hero__video');
  const tc = $('[data-tc]');
  const tick = () => {
    const t = v.currentTime || 0;
    const f = Math.floor((t % 1) * 30);
    const s = Math.floor(t);
    tc.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(f)}`;
    requestAnimationFrame(tick);
  };
  tick();
  if (RM || SAVE) return;
  v.src = window.innerWidth > 900 ? '/media/reel/loop.mp4' : '/media/reel/loop-sm.mp4';
  v.preload = 'auto';
  v.play().catch(() => {});
  gsap.to('.hero__media', { yPercent: 18, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: -40, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  ScrollTrigger.create({ trigger: '.hero', start: 'bottom top', onEnter: () => v.pause(), onLeaveBack: () => v.play().catch(() => {}) });
}

/* ─────────────────────────────── text + reveals */
function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = `<span class="sr-only">${text}</span><span aria-hidden="true">${[...text].map((ch) => `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</span>`;
  return $$('.char', el);
}

function initReveals() {
  if (RM) return;
  $$('[data-split]').forEach((el) => {
    const chars = splitChars(el);
    gsap.from(chars, {
      yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.035,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
  $$('[data-lines] > span').forEach((line) => {
    const wrap = document.createElement('span');
    wrap.className = 'line-mask';
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);
  });
  gsap.from('[data-lines] .line-mask > span', {
    yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.12,
    scrollTrigger: { trigger: '[data-lines]', start: 'top 80%' },
  });
  gsap.from('.statement__aside', { opacity: 0, y: 16, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.statement__aside', start: 'top 90%' } });

  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  // depth: inner media drifts against the scroll
  $$('.films .frame__inner, .lv .frame__inner, .series__stage .frame__inner').forEach((inner) => {
    gsap.fromTo(inner, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: inner.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // TZ: the frame opens like a shutter
  const tz = $('[data-tz-wrap] .frame');
  if (tz) {
    gsap.fromTo(tz, { clipPath: 'inset(14% 18% 14% 18%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '[data-tz-wrap]', start: 'top bottom', end: 'top 15%', scrub: true } });
    gsap.from('.tz__info', { opacity: 0, y: 30, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '[data-tz-wrap]', start: 'top 40%' } });
  }

  // contact: letters stretch under the pointer
  if (FINE) {
    const chars = $$('.contact__mail .char');
    $('.contact__mail').addEventListener('mousemove', (e) => {
      chars.forEach((ch) => {
        const r = ch.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const k = Math.max(0, 1 - d / 220);
        ch.style.transform = `translateY(${-k * 10}%)`;
        ch.style.color = k > 0.5 ? '#fff' : '';
      });
    });
    $('.contact__mail').addEventListener('mouseleave', () => chars.forEach((ch) => { ch.style.transform = ''; ch.style.color = ''; }));
  }
}

/* Block Office: vertical scroll → horizontal travel (desktop only) */
function initBlock() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
    const pin = $('.block__pin');
    const track = $('.block__track');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
    });
  });
}

/* ─────────────────────────────── header, menu, misc */
function initHeader(lenis) {
  const h = $('[data-header]');
  let last = 0;
  const onScroll = (y) => {
    if (y > 200 && y > last + 4) h.classList.add('is-hidden');
    else if (y < last - 4 || y < 200) h.classList.remove('is-hidden');
    last = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

  $$('.header__nav a[href^="#"]').forEach((a) => {
    const sec = $(a.getAttribute('href'));
    if (!sec || a.classList.contains('header__cta')) return;
    ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('is-active', s.isActive) });
  });

  // anchor links through Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const t = id === '#top' ? 0 : $(id);
    if (t === null) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(t, { duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 4) });
    else (t === 0 ? window.scrollTo({ top: 0 }) : t.scrollIntoView());
  });

  const btn = $('.header__menu');
  const menu = $('#menu');
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Menu';
    lenis?.start();
  }
  btn.addEventListener('click', () => {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Fechar';
    lenis?.stop();
    if (!RM) gsap.from('#menu a', { yPercent: 60, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  const copy = $('[data-copy]');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      copy.textContent = 'Copiado ✓';
    } catch {
      copy.textContent = contact.email;
    }
    setTimeout(() => (copy.textContent = 'Copiar e-mail'), 2200);
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
      .to(c, { v: 100, duration: 1.25, ease: 'power2.inOut', onUpdate: () => (count.textContent = pad(Math.round(c.v)).padStart(3, '0')) }, 0)
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
initOpeners();
initCursor();
initHeader(lenis);
initPreviews();
initFloatPreview();
initBlock();
preload().then(() => {
  initHero();
  initReveals();
  if (!RM) {
    gsap.from('.hero__logo', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out' });
    gsap.from(['.hero__top', '.hero__bottom'], { opacity: 0, duration: 1, delay: 0.3 });
  }
  ScrollTrigger.refresh();
});
window.addEventListener('load', () => ScrollTrigger.refresh());
