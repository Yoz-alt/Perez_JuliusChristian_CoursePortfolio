// ── Hamburger menu ────────────────────────────────────────────
function toggleMenu() {
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navLinks');
  burger.classList.toggle('open');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('navBurger').classList.remove('open');
  document.getElementById('navLinks').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Fade-in: Chrome + all-device fix ─────────────────────────
// window 'load' waits for full paint; void offsetHeight forces
// a reflow so the CSS transition actually fires in Chrome.
function makeVisible(el) {
  void el.offsetHeight;
  el.classList.add('visible');
}

window.addEventListener('load', function () {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        makeVisible(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      makeVisible(el); // already visible on load
    } else {
      obs.observe(el);
    }
  });
});

// ── Image upload + lightbox ───────────────────────────────────
function triggerUpload(box) {
  const img = box.querySelector('img');
  if (img && img.src && img.style.display === 'block') {
    openLightbox(img.src);
    return;
  }
  const input = box.querySelector('input[type="file"]');
  if (input) input.click();
}

function loadImg(e, inp) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = function (ev) {
    const box = inp.closest('.img-box');
    const img = box.querySelector('img');
    img.src = ev.target.result;
    img.style.display = 'block';
    const ico = box.querySelector('.ph-ico');
    const txt = box.querySelector('.ph-txt');
    if (ico) ico.style.display = 'none';
    if (txt) txt.style.display = 'none';
    box.title = 'Click to view fullscreen';
    box.style.cursor = 'zoom-in';
  };
  r.readAsDataURL(f);
}

function openLightbox(src) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<div class="lb-overlay"></div><div class="lb-content"><img id="lb-img" src="" alt="Fullscreen view"><button class="lb-close" onclick="closeLightbox()">&#x2715;</button></div>';
    document.body.appendChild(lb);
    lb.querySelector('.lb-overlay').addEventListener('click', closeLightbox);
  }
  document.getElementById('lb-img').src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeLightbox(); closeMenu(); }
});

// ── Process thumbnails ────────────────────────────────────────
function loadThumb(e, inp) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = function (ev) {
    const t = inp.closest('.proc-thumb');
    const img = t.querySelector('img');
    const ico = t.querySelector('.ph-ico');
    img.src = ev.target.result;
    img.style.display = 'block';
    if (ico) ico.style.display = 'none';
  };
  r.readAsDataURL(f);
}

// ── Footer name sync ──────────────────────────────────────────
function syncName(inp) {
  const el = document.getElementById('footerName');
  if (el) el.textContent = inp.value.toUpperCase() || 'YOUR FULL NAME';
}

// ── Render Slider ─────────────────────────────────────────────
function initRenderSlider(id) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  const before = wrap.querySelector('.rs-before');
  const handle = wrap.querySelector('.rs-handle');
  if (!before || !handle) return;
  let dragging = false;

  function setPos(x) {
    const rect = wrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    before.style.clipPath = 'inset(0 ' + ((1 - pct) * 100) + '% 0 0)';
    handle.style.left = (pct * 100) + '%';
  }

  handle.style.pointerEvents = 'auto';
  handle.addEventListener('mousedown', function (e) { dragging = true; e.preventDefault(); });
  wrap.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('rs-upload-before') || e.target.classList.contains('rs-upload-after')) return;
    dragging = true; setPos(e.clientX); e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', function () { dragging = false; });
  wrap.addEventListener('touchstart', function (e) {
    if (e.target.classList.contains('rs-upload-before') || e.target.classList.contains('rs-upload-after')) return;
    dragging = true; setPos(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchmove', function (e) { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', function () { dragging = false; });
}

function loadRSBefore(e, id) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = function (ev) {
    const img = document.querySelector('#' + id + ' .rs-img-before');
    if (img) img.src = ev.target.result;
  };
  r.readAsDataURL(f);
}

function loadRSAfter(e, id) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = function (ev) {
    const img = document.querySelector('#' + id + ' .rs-img-after');
    if (img) img.src = ev.target.result;
  };
  r.readAsDataURL(f);
}

document.querySelectorAll('.render-slider').forEach(function (el) { initRenderSlider(el.id); });

// ── p5.js Embed Toggle ────────────────────────────────────────
function toggleP5() {
  const row = document.querySelector('.out4-row');
  const btn = document.getElementById('p5ExpandBtn');
  if (!row || !btn) return;
  const isExpanded = row.classList.toggle('expanded');
  btn.textContent = isExpanded ? '\u29C1 COLLAPSE' : '\u29C2 SHOW FULL';
  btn.style.color = isExpanded ? 'var(--pink)' : 'var(--cyan)';
  btn.style.borderColor = isExpanded ? 'rgba(255,45,120,0.5)' : 'rgba(0,240,255,0.35)';
}

// ── Year ──────────────────────────────────────────────────────
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();
