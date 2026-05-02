/* ═══════════════════════════════════════════
   SOFTSHELF — MAIN JS
   Loads all app JSON files from apps/index.json
   then renders the catalogue dynamically
═══════════════════════════════════════════ */

const BASE = './apps/';
let allApps = [];
let filtered = [];
let activeFilter = 'all';

// ── FORMAT DATE ──
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── LICENSE CSS CLASS ──
function licenseClass(lic) {
  if (!lic) return '';
  return 'license-' + lic.replace(/\s/g, '');
}

// ── BUILD CARD HTML ──
function buildCard(app, delay = 0) {
  const card = document.createElement('article');
  card.className = 'app-card' + (app.featured ? ' featured' : '');
  card.style.animationDelay = `${delay}ms`;
  card.setAttribute('data-id', app.id);
  card.setAttribute('data-cat', app.category || '');

  const tags = (app.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('');
  const platforms = (app.platform || []).map(p => `<span class="platform-badge">${p}</span>`).join('');

  card.innerHTML = `
    <div class="card-top">
      <div class="card-icon">${app.icon || '📦'}</div>
      <div class="card-meta">
        <div class="card-name">${app.name}</div>
        <div class="card-tagline">${app.tagline || ''}</div>
      </div>
    </div>
    <p class="card-desc">${app.description || ''}</p>
    <div class="card-tags">${tags}</div>
    <div class="card-footer">
      <div class="card-info">
        <div class="card-date">📅 ${formatDate(app.published_at)}</div>
        <div class="card-platforms">${platforms}</div>
      </div>
      <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;">
        ${app.license ? `<span class="license-badge ${licenseClass(app.license)}">${app.license}</span>` : ''}
        ${app.download_url ? `<a class="btn-download" href="${app.download_url}" target="_blank" onclick="event.stopPropagation()">↓ Télécharger</a>` : ''}
      </div>
    </div>
  `;

  card.addEventListener('click', () => openModal(app));
  return card;
}

// ── RENDER GRID ──
function renderGrid(apps) {
  const grid = document.getElementById('appGrid');
  // Remove cards (keep loading state if still there)
  grid.querySelectorAll('.app-card, .empty-state').forEach(el => el.remove());

  if (apps.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `<h3>Aucun résultat</h3><p>Essayez un autre terme de recherche ou une autre catégorie.</p>`;
    grid.appendChild(empty);
    return;
  }

  apps.forEach((app, i) => {
    grid.appendChild(buildCard(app, i * 60));
  });
}

// ── BUILD FILTER CHIPS ──
function buildFilters(apps) {
  const cats = [...new Set(apps.map(a => a.category).filter(Boolean))].sort();
  const wrap = document.getElementById('filterChips');
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.filter = cat;
    btn.textContent = cat;
    btn.addEventListener('click', () => setFilter(cat));
    wrap.appendChild(btn);
  });
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === filter);
  });
  applyFilters();
}

// ── SORT ──
function sortApps(apps) {
  const val = document.getElementById('sortSelect').value;
  const sorted = [...apps];
  if (val === 'featured') {
    sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } else if (val === 'date') {
    sorted.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
  } else if (val === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }
  return sorted;
}

// ── APPLY FILTERS + SEARCH + SORT ──
function applyFilters() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  let result = allApps;

  if (activeFilter !== 'all') {
    result = result.filter(a => a.category === activeFilter);
  }

  if (query) {
    result = result.filter(a => {
      const haystack = [a.name, a.tagline, a.description, a.category, ...(a.tags || [])]
        .join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  filtered = sortApps(result);
  renderGrid(filtered);
}

// ── UPDATE STATS ──
function updateStats(apps) {
  const cats = new Set(apps.map(a => a.category).filter(Boolean));
  const featured = apps.filter(a => a.featured).length;
  document.getElementById('statTotal').textContent = apps.length;
  document.getElementById('statCats').textContent = cats.size;
  document.getElementById('statFeatured').textContent = featured;
}

// ── MODAL ──
function openModal(app) {
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');

  const platforms = (app.platform || []).map(p => `<span class="platform-badge">${p}</span>`).join('');
  const tags = (app.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

  body.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon">${app.icon || '📦'}</div>
      <div class="modal-title-wrap">
        <h2 class="modal-title">${app.name}</h2>
        <div class="modal-tagline">${app.tagline || ''}</div>
        ${app.license ? `<span class="license-badge ${licenseClass(app.license)}" style="margin-top:.5rem;display:inline-block">${app.license}</span>` : ''}
      </div>
    </div>

    <p class="modal-desc">${app.description || ''}</p>

    <div class="modal-grid">
      <div class="modal-field">
        <label>Version</label>
        <span>${app.version || '—'}</span>
      </div>
      <div class="modal-field">
        <label>Catégorie</label>
        <span>${app.category || '—'}</span>
      </div>
      <div class="modal-field">
        <label>Date de publication</label>
        <span>${formatDate(app.published_at)}</span>
      </div>
      <div class="modal-field">
        <label>Dernière mise à jour</label>
        <span>${formatDate(app.updated_at) || '—'}</span>
      </div>
      <div class="modal-field">
        <label>Plateformes</label>
        <span style="display:flex;gap:.3rem;flex-wrap:wrap;margin-top:.2rem">${platforms || '—'}</span>
      </div>
      <div class="modal-field">
        <label>Taille</label>
        <span>${app.size || '—'}</span>
      </div>
    </div>

    <div class="modal-tags">${tags}</div>

    <div class="modal-actions">
      ${app.download_url
        ? `<a class="btn-primary" href="${app.download_url}" target="_blank">↓ Télécharger</a>`
        : ''}
      ${app.homepage_url
        ? `<a class="btn-secondary" href="${app.homepage_url}" target="_blank">🌐 Site officiel</a>`
        : ''}
      ${app.changelog_url
        ? `<a class="btn-secondary" href="${app.changelog_url}" target="_blank">📋 Changelog</a>`
        : ''}
    </div>
  `;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ── LOAD ALL APPS ──
async function loadApps() {
  try {
    // 1. Load index
    const indexRes = await fetch(`${BASE}index.json`);
    if (!indexRes.ok) throw new Error('Impossible de charger apps/index.json');
    const index = await indexRes.json();

    // 2. Load each app file in parallel
    const results = await Promise.allSettled(
      index.apps.map(filename =>
        fetch(`${BASE}${filename}`).then(r => {
          if (!r.ok) throw new Error(`Fichier introuvable: ${filename}`);
          return r.json();
        })
      )
    );

    allApps = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    // 3. Hide loader
    document.getElementById('loadingState').style.display = 'none';

    // 4. Build UI
    buildFilters(allApps);
    updateStats(allApps);
    filtered = sortApps(allApps);
    renderGrid(filtered);

  } catch (err) {
    document.getElementById('loadingState').innerHTML = `
      <p style="color:var(--red)">⚠ Erreur de chargement</p>
      <p style="color:var(--text3);font-size:.8rem">${err.message}</p>
    `;
  }
}

// ── EVENT LISTENERS ──
document.addEventListener('DOMContentLoaded', () => {
  loadApps();

  // Search
  document.getElementById('searchInput').addEventListener('input', applyFilters);

  // Sort
  document.getElementById('sortSelect').addEventListener('change', applyFilters);

  // All chip
  document.querySelector('.chip[data-filter="all"]').addEventListener('click', () => setFilter('all'));

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });
});
