/* ============ Company Site — App ============ */
(function () {
  'use strict';

  let lang = localStorage.getItem('yumao_lang') || 'zh';

  function applyLang() {
    const dict = I18N[lang] || I18N.zh;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.getElementById('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
  }

  document.getElementById('langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('yumao_lang', lang);
    applyLang();
  });

  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  /* ---------- Gallery ---------- */
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  fetch('data/gallery.json').then(r => r.json()).then(items => {
    galleryGrid.innerHTML = items.map((it, i) =>
      '<img loading="lazy" src="' + it.src + '" alt="' + (it.label || 'Factory photo') + '" data-idx="' + i + '">'
    ).join('');
    galleryGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
  }).catch(() => { galleryGrid.innerHTML = '<p style="color:var(--muted)">Gallery loading…</p>'; });

  lightbox.addEventListener('click', e => {
    if (e.target.closest('[data-close]') || e.target === lightbox) {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { lightbox.hidden = true; document.body.style.overflow = ''; }
  });

  /* ---------- Videos ---------- */
  const videoGrid = document.getElementById('videoGrid');
  fetch('data/videos.json').then(r => r.json()).then(items => {
    if (!items.length) { videoGrid.innerHTML = ''; return; }
    videoGrid.innerHTML = items.map(it =>
      '<div class="video-card"><video controls preload="metadata" playsinline poster="' + (it.poster || '') + '">' +
      '<source src="' + it.src + '" type="video/mp4">Your browser does not support video.</video>' +
      '<div class="v-label">' + it.label + '</div></div>'
    ).join('');
  }).catch(() => {});

  /* ---------- Certifications ---------- */
  const certGrid = document.getElementById('certGrid');
  fetch('data/certs.json').then(r => r.json()).then(items => {
    certGrid.innerHTML = items.map(it =>
      '<div class="cert-card"><img loading="lazy" src="' + it.src + '" alt="' + (it.label || 'Certificate') + '"><p>' + it.label + '</p></div>'
    ).join('');
  }).catch(() => {});

  applyLang();
})();
