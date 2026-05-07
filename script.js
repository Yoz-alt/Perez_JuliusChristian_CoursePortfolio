// Hamburger menu
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

const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.08});
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

function triggerUpload(box) {
  // If image already loaded, show lightbox instead
  const img = box.querySelector('img');
  if (img && img.src && img.style.display === 'block') {
    openLightbox(img.src);
    return;
  }
  box.querySelector('input[type="file"]').click();
}

function loadImg(e, inp) {
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = ev => {
    const box = inp.closest('.img-box');
    const img = box.querySelector('img');
    img.src = ev.target.result;
    img.style.display = 'block';
    box.querySelector('.ph-ico').style.display = 'none';
    box.querySelector('.ph-txt').style.display = 'none';
    // Add visual hint that it's clickable
    box.title = 'Click to view fullscreen';
    box.style.cursor = 'zoom-in';
  };
  r.readAsDataURL(f);
}

// Lightbox
function openLightbox(src) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <div class="lb-overlay"></div>
      <div class="lb-content">
        <img id="lb-img" src="">
        <button class="lb-close" onclick="closeLightbox()">✕</button>
      </div>`;
    document.body.appendChild(lb);
    lb.querySelector('.lb-overlay').onclick = closeLightbox;
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

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); closeMenu(); }
});

function loadThumb(e, inp) {
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = ev => {
    const t = inp.closest('.proc-thumb');
    t.querySelector('img').src = ev.target.result;
    t.querySelector('img').style.display = 'block';
    t.querySelector('.ph-ico').style.display = 'none';
  };
  r.readAsDataURL(f);
}

function syncName(inp) {
  document.getElementById('footerName').textContent = inp.value.toUpperCase() || 'YOUR FULL NAME';
}

// ── Render Slider ──────────────────────────────────────────────
function initRenderSlider(id) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  const before = wrap.querySelector('.rs-before');
  const handle = wrap.querySelector('.rs-handle');
  let dragging = false;

  function setPos(x) {
    const rect = wrap.getBoundingClientRect();
    let pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    before.style.clipPath = `inset(0 ${(1 - pct) * 100}% 0 0)`;
    handle.style.left = (pct * 100) + '%';
  }

  handle.style.pointerEvents = 'auto';
  handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  wrap.addEventListener('mousedown', e => {
    if (e.target.classList.contains('rs-upload-before') || e.target.classList.contains('rs-upload-after')) return;
    dragging = true; setPos(e.clientX); e.preventDefault();
  });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });

  wrap.addEventListener('touchstart', e => {
    if (e.target.classList.contains('rs-upload-before') || e.target.classList.contains('rs-upload-after')) return;
    dragging = true; setPos(e.touches[0].clientX);
  }, {passive:true});
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, {passive:true});
  window.addEventListener('touchend', () => { dragging = false; });
}

function loadRSBefore(e, id) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    document.querySelector(`#${id} .rs-img-before`).src = ev.target.result;
  };
  r.readAsDataURL(f);
}
function loadRSAfter(e, id) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    document.querySelector(`#${id} .rs-img-after`).src = ev.target.result;
  };
  r.readAsDataURL(f);
}

document.querySelectorAll('.render-slider').forEach(el => initRenderSlider(el.id));

// ── p5.js Embed Toggle ─────────────────────────────────────────
function toggleP5() {
  const row = document.querySelector('.out4-row');
  const btn = document.getElementById('p5ExpandBtn');
  const isExpanded = row.classList.toggle('expanded');
  btn.textContent = isExpanded ? '⤡ COLLAPSE' : '⤢ SHOW FULL';
  btn.style.color = isExpanded ? 'var(--pink)' : 'var(--cyan)';
  btn.style.borderColor = isExpanded ? 'rgba(255,45,120,0.5)' : 'rgba(0,240,255,0.35)';
}

document.getElementById('yr').textContent = new Date().getFullYear();
