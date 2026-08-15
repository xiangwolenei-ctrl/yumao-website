/* ============ Yumao Pet — Product Site App ============ */
(function () {
  'use strict';

  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterBar = document.getElementById('filterBar');
  const catGrid = document.getElementById('catGrid');
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

  function cardHtml(p) {
    const img = p.image ? p.image.split(',')[0] : '';
    const priceLabel = p.priceDetail && p.priceDetail.length
      ? '$' + Math.min(...p.priceDetail.map(d => d.value)).toFixed(2) + '+'
      : fmtPrice(p.price);
    return (
      '<div class="card" data-row="' + p.row + '">' +
        '<div class="card-media">' + (img ? '<img loading="lazy" src="' + IMG_BASE + img + '" alt="' + esc(p.model) + '">' : '') + '</div>' +
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
    grid.innerHTML = list.map(cardHtml).join('');
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

  // ---- search ----
  let t;
  searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 150); });

  // ---- modal ----
  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const p = PRODUCTS.find(x => x.row === Number(card.dataset.row));
    if (p) openModal(p);
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { modal.hidden = true; document.body.style.overflow = ''; }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { modal.hidden = true; document.body.style.overflow = ''; }
  });

  // ---- init ----
  fetch('data/products.json')
    .then(r => r.json())
    .then(data => {
      PRODUCTS = data;
      buildFilters();
      buildCategories();
      render();
      // hero image fallback
      const hero = document.getElementById('heroImg');
      hero.onerror = () => { hero.style.display = 'none'; };
    })
    .catch(err => {
      grid.innerHTML = '<div class="loading">Failed to load product data: ' + esc(err.message) + '</div>';
    });
})();
