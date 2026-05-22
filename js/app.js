(function () {
  'use strict';

  const STORAGE_KEY = 'sed-learning-path-progress';
  const SCHEMA_VERSION = 1;

  /* ─── State ──────────────────────────────────────────────────────────── */
  let state;

  function defaultState() {
    const tiers = {};
    LEARNING_PATH.forEach(function (tier) {
      const challenges = {};
      tier.challenges.forEach(function (c) { challenges[c.id] = false; });
      const topics = {};
      tier.topics.forEach(function (t) { topics[t.id] = { collapsed: false }; });
      tiers[tier.id] = {
        collapsed: tier.tier > 1,
        topics: topics,
        challenges: challenges,
      };
    });
    return { version: SCHEMA_VERSION, lastUpdated: new Date().toISOString(), tiers: tiers };
  }

  function migrateState(raw) {
    if (!raw || typeof raw !== 'object' || !raw.tiers) return defaultState();
    // Ensure all tiers and challenges from current content exist
    LEARNING_PATH.forEach(function (tier) {
      if (!raw.tiers[tier.id]) {
        raw.tiers[tier.id] = { collapsed: tier.tier > 1, topics: {}, challenges: {} };
      }
      const ts = raw.tiers[tier.id];
      if (!ts.topics) ts.topics = {};
      if (!ts.challenges) ts.challenges = {};
      tier.challenges.forEach(function (c) {
        if (ts.challenges[c.id] === undefined) ts.challenges[c.id] = false;
      });
      tier.topics.forEach(function (t) {
        if (!ts.topics[t.id]) ts.topics[t.id] = { collapsed: false };
      });
    });
    raw.version = SCHEMA_VERSION;
    raw.lastUpdated = new Date().toISOString();
    return raw;
  }

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return migrateState(raw);
    } catch (_) {
      return defaultState();
    }
  }

  function saveState() {
    state.lastUpdated = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* storage full — silently ignore */ }
  }

  /* ─── Progress calculation ───────────────────────────────────────────── */
  function calcTierStats(tierId) {
    const tier = LEARNING_PATH.find(function (t) { return t.id === tierId; });
    if (!tier) return { done: 0, total: 0 };
    const tierState = state.tiers[tierId] || {};
    const challenges = tierState.challenges || {};
    let done = 0;
    tier.challenges.forEach(function (c) { if (challenges[c.id]) done++; });
    return { done: done, total: tier.challenges.length };
  }

  function calcOverallStats() {
    let done = 0, total = 0;
    LEARNING_PATH.forEach(function (tier) {
      const s = calcTierStats(tier.id);
      done += s.done;
      total += s.total;
    });
    return { done: done, total: total };
  }

  function pct(done, total) {
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }

  /* ─── Progress bar update (in-place, no re-render) ───────────────────── */
  function updateProgressEl(fillId, pctId, done, total) {
    const fill = document.getElementById(fillId);
    const label = document.getElementById(pctId);
    const p = pct(done, total);
    if (fill) fill.style.width = p + '%';
    if (label) label.textContent = p + '%';
    const bar = fill && fill.parentElement;
    if (bar && bar.hasAttribute('aria-valuenow')) bar.setAttribute('aria-valuenow', p);
  }

  function updateAllProgress() {
    const overall = calcOverallStats();
    updateProgressEl('overall-progress-fill', 'overall-progress-pct', overall.done, overall.total);
    LEARNING_PATH.forEach(function (tier) {
      const s = calcTierStats(tier.id);
      updateProgressEl('tier-fill-' + tier.id, 'tier-pct-' + tier.id, s.done, s.total);
      updateProgressEl('ch-fill-' + tier.id, 'ch-pct-' + tier.id, s.done, s.total);
    });
  }

  /* ─── DOM helpers ────────────────────────────────────────────────────── */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') {
          node.className = attrs[k];
        } else if (k === 'textContent') {
          node.textContent = attrs[k];
        } else {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    if (children) {
      children.forEach(function (child) {
        if (child) node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
      });
    }
    return node;
  }

  function progressBar(fillId, pctId, done, total, label) {
    const p = pct(done, total);
    const wrap = el('div', { class: 'progress-wrap' });
    if (label) wrap.appendChild(el('span', { class: 'progress-label', textContent: label }));
    const bar = el('div', { class: 'progress-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(p) });
    const fill = el('div', { class: 'progress-fill', id: fillId });
    fill.style.width = p + '%';
    bar.appendChild(fill);
    wrap.appendChild(bar);
    const pctEl = el('span', { class: 'progress-pct', id: pctId, textContent: p + '%' });
    wrap.appendChild(pctEl);
    return wrap;
  }

  /* ─── Rendering ──────────────────────────────────────────────────────── */
  function renderExamples(examples) {
    if (!examples || !examples.length) return null;
    const list = el('div', { class: 'examples-list' });
    examples.forEach(function (ex) {
      const item = el('div', { class: 'example-item' });
      item.appendChild(el('div', { class: 'example-label', textContent: ex.label }));
      const pre = el('pre', { class: 'code-block' });
      const code = el('code');
      code.textContent = ex.code;
      pre.appendChild(code);
      item.appendChild(pre);
      list.appendChild(item);
    });
    return list;
  }

  function renderResources(resources) {
    if (!resources || !resources.length) return null;
    const frag = document.createDocumentFragment();
    frag.appendChild(el('p', { class: 'resources-heading', textContent: 'Resources' }));
    const ul = el('ul', { class: 'resource-list' });
    resources.forEach(function (r) {
      const li = el('li', { class: 'resource-item' });
      const a = el('a', { class: 'resource-link', href: r.url, target: '_blank', rel: 'noopener noreferrer', textContent: r.label });
      li.appendChild(a);
      if (r.desc) li.appendChild(el('span', { class: 'resource-desc', textContent: '— ' + r.desc }));
      ul.appendChild(li);
    });
    frag.appendChild(ul);
    return frag;
  }

  function renderTopic(topic, topicState) {
    const collapsed = topicState && topicState.collapsed;
    const section = el('div', { class: 'topic-section' + (collapsed ? ' collapsed' : ''), 'data-topic-id': topic.id });

    const header = el('div', { class: 'topic-header' });
    header.appendChild(el('span', { class: 'topic-chevron', textContent: '▾' }));
    header.appendChild(el('span', { class: 'topic-title', textContent: topic.title }));
    section.appendChild(header);

    const body = el('div', { class: 'topic-body' });
    body.appendChild(el('p', { class: 'topic-prose', textContent: topic.body }));

    const examples = renderExamples(topic.examples);
    if (examples) body.appendChild(examples);
    const resources = renderResources(topic.resources);
    if (resources) body.appendChild(resources);

    section.appendChild(body);
    return section;
  }

  function renderChallenges(challenges, tierId, challengeState) {
    const stats = calcTierStats(tierId);
    const card = el('div', { class: 'challenges-card' });

    const header = el('div', { class: 'challenges-header' });
    header.appendChild(el('span', { class: 'challenges-title', textContent: 'Challenges' }));
    const pw = progressBar('ch-fill-' + tierId, 'ch-pct-' + tierId, stats.done, stats.total, null);
    pw.className = 'challenges-progress-wrap';
    header.appendChild(pw);
    card.appendChild(header);

    const list = el('div', { class: 'challenge-list' });
    challenges.forEach(function (challenge) {
      const done = challengeState && challengeState[challenge.id];
      const item = el('div', { class: 'challenge-item' + (done ? ' completed' : ''), 'data-challenge-id': challenge.id, 'data-tier-id': tierId });

      const cb = el('input', {
        type: 'checkbox',
        class: 'challenge-checkbox',
        'data-challenge-id': challenge.id,
        'data-tier-id': tierId,
        'aria-label': challenge.title,
      });
      if (done) cb.setAttribute('checked', '');
      item.appendChild(cb);

      const content = el('div', { class: 'challenge-content' });
      content.appendChild(el('p', { class: 'challenge-text', textContent: challenge.title }));

      if (challenge.hint) {
        const hintId = 'hint-' + challenge.id;
        const toggle = el('button', { class: 'challenge-hint-toggle', 'aria-expanded': 'false', 'aria-controls': hintId, textContent: 'hint' });
        const hint = el('div', { class: 'challenge-hint', id: hintId, hidden: '' });
        hint.textContent = challenge.hint;
        content.appendChild(toggle);
        content.appendChild(hint);
      }

      item.appendChild(content);
      list.appendChild(item);
    });
    card.appendChild(list);
    return card;
  }

  function renderTier(tier) {
    const ts = state.tiers[tier.id] || {};
    const collapsed = ts.collapsed;
    const stats = calcTierStats(tier.id);

    const card = el('div', { class: 'tier-card' + (collapsed ? ' collapsed' : ''), 'data-tier': String(tier.tier), 'data-tier-id': tier.id });

    // Header
    const header = el('div', { class: 'tier-header', 'data-tier-id': tier.id });
    header.appendChild(el('span', { class: 'tier-chevron', textContent: '▾' }));
    header.appendChild(el('span', { class: 'tier-badge', textContent: tier.title }));

    const titleBlock = el('div', { class: 'tier-title-block' });
    titleBlock.appendChild(el('div', { class: 'tier-title', textContent: tier.title + ' — ' + tier.subtitle }));
    titleBlock.appendChild(el('code', { class: 'tier-subtitle-badge', textContent: tier.badge }));
    header.appendChild(titleBlock);

    const pw = progressBar('tier-fill-' + tier.id, 'tier-pct-' + tier.id, stats.done, stats.total, null);
    pw.className = 'tier-progress-wrap';
    header.appendChild(pw);
    card.appendChild(header);

    // Body
    const body = el('div', { class: 'tier-body' });

    // Topics
    body.appendChild(el('p', { class: 'section-heading', textContent: 'Topics' }));
    tier.topics.forEach(function (topic) {
      const topicState = ts.topics && ts.topics[topic.id];
      body.appendChild(renderTopic(topic, topicState));
    });

    // Challenges
    body.appendChild(el('p', { class: 'section-heading', textContent: 'Challenges' }));
    body.appendChild(renderChallenges(tier.challenges, tier.id, ts.challenges));

    card.appendChild(body);
    return card;
  }

  function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    LEARNING_PATH.forEach(function (tier) {
      app.appendChild(renderTier(tier));
    });
  }

  /* ─── Event handling ─────────────────────────────────────────────────── */
  function bindAppEvents() {
    const app = document.getElementById('app');

    // Delegated click for tier header toggle, topic header toggle, hint toggle
    app.addEventListener('click', function (e) {
      // Hint toggle
      const hintBtn = e.target.closest('.challenge-hint-toggle');
      if (hintBtn) {
        const hintId = hintBtn.getAttribute('aria-controls');
        const hintEl = document.getElementById(hintId);
        if (hintEl) {
          const isHidden = hintEl.hasAttribute('hidden');
          if (isHidden) {
            hintEl.removeAttribute('hidden');
            hintBtn.setAttribute('aria-expanded', 'true');
            hintBtn.textContent = 'hide hint';
          } else {
            hintEl.setAttribute('hidden', '');
            hintBtn.setAttribute('aria-expanded', 'false');
            hintBtn.textContent = 'hint';
          }
        }
        return;
      }

      // Topic header toggle
      const topicHeader = e.target.closest('.topic-header');
      if (topicHeader) {
        const section = topicHeader.closest('.topic-section');
        if (!section) return;
        const topicId = section.getAttribute('data-topic-id');
        const tierId = section.closest('.tier-card').getAttribute('data-tier-id');
        const isCollapsed = section.classList.toggle('collapsed');
        if (state.tiers[tierId] && state.tiers[tierId].topics[topicId]) {
          state.tiers[tierId].topics[topicId].collapsed = isCollapsed;
        }
        saveState();
        return;
      }

      // Tier header toggle
      const tierHeader = e.target.closest('.tier-header');
      if (tierHeader) {
        const tierId = tierHeader.getAttribute('data-tier-id');
        const card = tierHeader.closest('.tier-card');
        if (!card) return;
        const isCollapsed = card.classList.toggle('collapsed');
        if (state.tiers[tierId]) state.tiers[tierId].collapsed = isCollapsed;
        saveState();
        return;
      }
    });

    // Delegated change for checkboxes
    app.addEventListener('change', function (e) {
      if (!e.target.classList.contains('challenge-checkbox')) return;
      const tierId = e.target.getAttribute('data-tier-id');
      const challengeId = e.target.getAttribute('data-challenge-id');
      const done = e.target.checked;
      if (state.tiers[tierId]) state.tiers[tierId].challenges[challengeId] = done;
      const item = e.target.closest('.challenge-item');
      if (item) item.classList.toggle('completed', done);
      saveState();
      updateAllProgress();
    });
  }

  function bindHeaderEvents() {
    document.getElementById('btn-export').addEventListener('click', exportProgress);
    document.getElementById('btn-import').addEventListener('click', function () {
      document.getElementById('file-input').click();
    });
    document.getElementById('file-input').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) importProgress(file);
      e.target.value = ''; // reset so same file can be re-imported
    });
    document.getElementById('btn-reset').addEventListener('click', function () {
      if (!confirm('Reset all progress? This cannot be undone.')) return;
      state = defaultState();
      saveState();
      renderApp();
      syncCheckboxes();
      updateAllProgress();
      showToast('Progress reset.', 'success');
    });
  }

  /* ─── Import / Export ────────────────────────────────────────────────── */
  function exportProgress() {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sed-progress-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Progress exported.', 'success');
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        state = migrateState(parsed);
        saveState();
        renderApp();
        syncCheckboxes();
        updateAllProgress();
        showToast('Progress imported.', 'success');
      } catch (err) {
        showToast('Import failed: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  /* ─── Toast notifications ────────────────────────────────────────────── */
  let toastTimer;
  function showToast(message, type) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = el('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'toast toast-' + (type || 'success');
    clearTimeout(toastTimer);
    // Force reflow so transition plays even if toast was already visible
    void toast.offsetWidth;
    toast.classList.add('visible');
    toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 2500);
  }

  /* ─── Checkbox initial state (DOM reflects state) ────────────────────── */
  function syncCheckboxes() {
    document.querySelectorAll('.challenge-checkbox').forEach(function (cb) {
      const tierId = cb.getAttribute('data-tier-id');
      const cId = cb.getAttribute('data-challenge-id');
      const done = state.tiers[tierId] && state.tiers[tierId].challenges[cId];
      cb.checked = !!done;
    });
  }

  /* ─── Init ───────────────────────────────────────────────────────────── */
  function init() {
    state = loadState();
    renderApp();
    bindAppEvents();   // registered once on the persistent #app element
    bindHeaderEvents();
    syncCheckboxes();
    updateAllProgress();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
