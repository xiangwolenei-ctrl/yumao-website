/* ============ Yumao Pet — Product Site App ============ */
(function () {
  'use strict';

  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterBar = document.getElementById('filterBar');
  const catGrid = document.getElementById('catGrid');
  const hotSection = document.getElementById('hotSection');
  const hotGrid = document.getElementById('hotGrid');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');

  let PRODUCTS = [];
  let activeCategory = 'All';

  const IMG_BASE = 'images/product/';

  function fmtPrice(p) {
    if (p == null) return 'Price on request';
    return '$' + p.toFixed(2);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function listHtml(items) {
    if (!items || !items.length) return '<li>—</li>';
    return items.map(i => '<li>' + esc(i) + '</li>').join('');
  }

  function priceBlock(p) {
    if (p.priceDetail && p.priceDetail.length) {
      return p.priceDetail.map(d =>
        '<div class="m-price">' + esc(d.label) + ': <strong>' + fmtPrice(d.value) + '</strong></div>'
      ).join('') + '<p style="color:var(--muted);font-size:13px">FOB price · per piece</p>';
    }
    return '<div class="m-price">' + fmtPrice(p.price) + ' <small>/ piece · FOB</small></div>';
  }

  function openModal(p) {
    const img = p.image ? p.image.split(',')[0] : '';
    const html =
      '<div class="m-head">' +
        '<div class="m-media">' + (img ? '<img src="' + IMG_BASE + img + '" alt="' + esc(p.model) + '">' : '<span style="color:var(--muted)">No image</span>') + '</div>' +
        '<div>' +
          '<p class="m-model">' + esc(p.section) + ' · No.' + esc(p.serial) + '</p>' +
          '<h2 class="m-title">' + esc(p.name || p.model) + '</h2>' +
          '<p class="m-model">Model: ' + esc(p.model) + '</p>' +
          priceBlock(p) +
          '<div class="m-facts">' +
            (p.material ? '<div class="m-fact"><span>Material</span><strong>' + esc(p.material) + '</strong></div>' : '') +
            (p.color ? '<div class="m-fact"><span>Color</span><strong>' + esc(p.color) + '</strong></div>' : '') +
            (p.packSize ? '<div class="m-fact"><span>Pack Size (cm)</span><strong>' + esc(p.packSize) + '</strong></div>' : '') +
            (p.weight ? '<div class="m-fact"><span>Net Weight (kg)</span><strong>' + esc(p.weight) + '</strong></div>' : '') +
            (p.packQty ? '<div class="m-fact"><span>Packing Qty/Box</span><strong>' + esc(p.packQty) + '</strong></div>' : '') +
            (p.carton ? '<div class="m-fact"><span>Carton (cm)</span><strong>' + esc(p.carton) + '</strong></div>' : '') +
            (p.grossWeight ? '<div class="m-fact"><span>Gross Wt (kg)</span><strong>' + esc(p.grossWeight) + '</strong></div>' : '') +
            (p.moq ? '<div class="m-fact"><span>MOQ</span><strong>' + esc(p.moq) + ' pcs</strong></div>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      (p.advantages && p.advantages.length ? '<div class="m-block"><h4>Product Advantages</h4><ul>' + listHtml(p.advantages) + '</ul></div>' : '') +
      (p.parameters && p.parameters.length ? '<div class="m-block"><h4>Product Parameters</h4><ul>' + listHtml(p.parameters) + '</ul></div>' : '') +
      (p.package && p.package.length ? '<div class="m-block"><h4>Standard Package</h4><ul>' + listHtml(p.package) + '</ul></div>' : '') +
      (p.remark ? '<div class="m-note">💡 ' + esc(p.remark) + '</div>' : '') +
      '<div class="m-note">Need samples, custom colors/logo or OEM development? Contact us for a quotation.</div>';
    modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function cardHtml(p, opts) {
    opts = opts || {};
    const img = p.image ? p.image.split(',')[0] : '';
    const priceLabel = p.priceDetail && p.priceDetail.length
      ? '$' + Math.min(...p.priceDetail.map(d => d.value)).toFixed(2) + '+'
      : fmtPrice(p.price);
    return (
      '<div class="card' + (p.hot ? ' card-hot' : '') + '" data-row="' + p.row + '">' +
        '<div class="card-media">' + (img ? '<img loading="lazy" src="' + IMG_BASE + img + '" alt="' + esc(p.model) + '">' : '') +
          (p.hot ? '<span class="hot-badge' + (opts.big ? ' hot-badge-lg' : '') + '">🔥 HOT</span>' : '') +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-model">' + esc(p.model) + '</div>' +
          '<div class="card-name">' + esc(p.name || p.model) + '</div>' +
          '<div class="card-specs">' +
            (p.material ? esc(p.material) : '') +
            (p.color ? ' · ' + esc(p.color) : '') +
            (p.remark ? ' · ' + esc(p.remark) : '') +
          '</div>' +
          '<div class="card-foot">' +
            '<span class="price">' + priceLabel + '</span>' +
            '<span class="card-cta">Details →</span>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderHot() {
    const hots = PRODUCTS.filter(p => p.hot);
    hotSection.hidden = !hots.length;
    hotGrid.innerHTML = hots.map(p => cardHtml(p, { big: true })).join('');
  }

  function openCard(row) {
    window.location.href = 'product/p' + String(row).padStart(3, '0') + '.html';
  }

  function render() {
    const q = searchInput.value.trim().toLowerCase();
    let list = PRODUCTS;
    if (activeCategory !== 'All') list = list.filter(p => p.section === activeCategory);
    if (q) {
      list = list.filter(p =>
        (p.model + ' ' + p.name + ' ' + p.type + ' ' + p.section + ' ' + (p.remark || '')).toLowerCase().includes(q)
      );
    }
    if (!list.length) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    grid.innerHTML = list.map(p => cardHtml(p)).join('');
  }

  function buildFilters() {
    const sections = ['All', ...new Set(PRODUCTS.map(p => p.section))];
    filterBar.innerHTML = sections.map(s =>
      '<button class="chip' + (s === activeCategory ? ' active' : '') + '" data-cat="' + esc(s) + '">' + esc(s) + '</button>'
    ).join('');
    filterBar.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        activeCategory = chip.dataset.cat;
        buildFilters();
        render();
      });
    });
  }

  function buildCategories() {
    const sections = [...new Set(PRODUCTS.map(p => p.section))];
    const counts = {};
    PRODUCTS.forEach(p => { counts[p.section] = (counts[p.section] || 0) + 1; });
    catGrid.innerHTML = sections.map(s =>
      '<div class="cat-card" data-cat="' + esc(s) + '"><strong>' + esc(s) + '</strong><span>' + counts[s] + ' products</span></div>'
    ).join('');
    catGrid.querySelectorAll('.cat-card').forEach(el => {
      el.addEventListener('click', () => {
        activeCategory = el.dataset.cat;
        buildFilters();
        render();
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ---- nav toggle ----
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // ---- 站内锚点统一平滑滚动（修复轮播内按钮跳顶部问题）----
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.length < 2) return;
    const targetId = decodeURIComponent(href.slice(1));
    const target = document.getElementById(targetId);
    if (!target) return; // 非同页锚点(如 index.html#contact)让浏览器处理
    e.preventDefault();
    // 若导航菜单展开则收起
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('open')) navLinks.classList.remove('open');
    const y = target.getBoundingClientRect().top + window.scrollY - 78; // 减去 sticky 导航高度
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    try { history.replaceState(null, '', '#' + targetId); } catch (err) {}
    // 轮播 slide 内的按钮点击后，确保不被轮播自动切换打扰（暂停计时器并聚焦目标）
    if (window.__carouselPause) window.__carouselPause(4000);
  });

  // ---- search ----
  let t;
  searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 150); });

  // ---- modal ----
  function bindGridClick(container) {
    container.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (!card) return;
      openCard(card.dataset.row);
    });
  }
  bindGridClick(grid);
  bindGridClick(hotGrid);
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { modal.hidden = true; document.body.style.overflow = ''; }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { modal.hidden = true; document.body.style.overflow = ''; }
  });

  // ---- hero carousel ----
  (function carousel() {
    const track = document.getElementById('carouselTrack');
    const dotsBox = document.getElementById('carouselDots');
    if (!track) return;
    const slides = track.querySelectorAll('.carousel-slide');
    if (slides.length < 2) return;
    let idx = 0;
    let timer = null;
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => go(i, true));
      dotsBox.appendChild(d);
    });
    const dots = dotsBox.querySelectorAll('button');
    function go(n, reset) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      if (reset) restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 6000);
    }
    document.querySelectorAll('[data-carousel]').forEach(btn => {
      btn.addEventListener('click', () => go(btn.dataset.carousel === 'next' ? idx + 1 : idx - 1, true));
    });
    const hero = document.getElementById('hero');
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', restart);
    // 暴露暂停：外部(锚点滚动)调用后暂停自动切换 N ms
    window.__carouselPause = function (ms) {
      clearInterval(timer);
      setTimeout(restart, ms || 4000);
    };
    restart();
    // 页面带 #hash 加载时（如从 FAQ 跳回 #contact）也滚动到位
    if (location.hash && location.hash.length > 1) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) setTimeout(() => {
        const y = el.getBoundingClientRect().top + window.scrollY - 78;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }, 600);
    }
  })();

  // ---- init ----
  fetch('data/products.json')
    .then(r => r.json())
    .then(data => {
      PRODUCTS = data;
      buildFilters();
      buildCategories();
      renderHot();
      render();
    })
    .catch(err => {
      grid.innerHTML = '<div class="loading">Failed to load product data: ' + esc(err.message) + '</div>';
    });

  // ============ 浏览量统计（仅管理员可见） ============
  // 点击顶部品牌 logo 区域 5 次即可切换显示统计浮标
  (function viewStats() {
    const KEY = 'yumao_views';
    const OWNER = 'yumao_owner_v1';
    let clicks = 0;
    let lastTap = 0;

    function countView() {
      try {
        const d = new Date();
        const day = d.toISOString().slice(0, 10);
        const data = JSON.parse(localStorage.getItem(KEY) || '{"total":0,"days":{}}');
        data.total = (data.total || 0) + 1;
        data.days[day] = (data.days[day] || 0) + 1;
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch (e) { /* ignore */ }
    }
    function showStats() {
      let el = document.getElementById('yumaoStats');
      if (!el) {
        el = document.createElement('div');
        el.id = 'yumaoStats';
        el.className = 'stats-mini';
        document.body.appendChild(el);
      }
      let data = { total: 0, days: {} };
      try { data = JSON.parse(localStorage.getItem(KEY) || '{"total":0,"days":{}}'); } catch (e) {}
      const days = Object.entries(data.days || {}).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);
      const dayStr = days.map(([k, v]) => k.slice(5) + ':' + v).join('  ');
      el.textContent = '👁 ' + (data.total || 0) + ' visits  |  ' + dayStr;
      el.classList.add('show');
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove('show'), 8000);
    }
    // brand click ×5 unlocks
    const brand = document.querySelector('.brand');
    if (brand) {
      brand.addEventListener('click', (e) => {
        e.preventDefault();
        const now = Date.now();
        if (now - lastTap > 1200) clicks = 0;
        lastTap = now;
        clicks++;
        if (clicks >= 5) { clicks = 0; showStats(); }
      });
    }
    countView();
  })();

  // ============ 首页联系表单 ============
  window.homeInquiry = function () {
    const g = (id) => document.getElementById(id);
    const name = (g('cName').value || '').trim();
    const email = (g('cEmail').value || '').trim();
    const wa = (g('cWa').value || '').trim();
    const qty = (g('cQty').value || '').trim();
    const msg = (g('cMsg').value || '').trim();
    const note = g('cNote');
    if (!name || !email || !msg) {
      note.textContent = '⚠️ Please fill your name, email and question.';
      note.style.color = '#fecaca';
      return;
    }
    const body = 'New Website Inquiry\nName: ' + name + '\nEmail: ' + email +
      (wa ? '\nWhatsApp: ' + wa : '') + (qty ? '\nProduct/Qty: ' + qty : '') + '\nMessage: ' + msg;
    let inbox = [];
    try { inbox = JSON.parse(localStorage.getItem('yumao_inquiries') || '[]'); } catch (e) {}
    inbox.push({ t: new Date().toISOString(), name: name, email: email, wa: wa, msg: msg });
    try { localStorage.setItem('yumao_inquiries', JSON.stringify(inbox)); } catch (e) {}
    const url = 'https://wa.me/8613543780054?text=' + encodeURIComponent(body);
    note.textContent = '✅ Inquiry saved! Opening WhatsApp to send to our sales team…';
    note.style.color = '#bbf7d0';
    window.open(url, '_blank');
  };
})();
