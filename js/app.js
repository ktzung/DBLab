/* DBLab — ứng dụng tĩnh, không build, không backend */
(function () {
  "use strict";

  const DB = window.DBLAB;
  if (!DB) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const SVGNS = "http://www.w3.org/2000/svg";
  const PROGRESS_KEY = "dblab:progress:v1";
  const THEME_KEY = "dblab:theme";
  const LAST_KEY = "dblab:last-lesson";
  const MISSIONS_KEY = "dblab:missions:v1";
  const AUTO_MS = 7600;

  const ICON_PATHS = {
    table: '<rect x="2.8" y="3.1" width="14.4" height="13.8" rx="2"/><path d="M2.8 7.4h14.4M8 7.4v9.5M13 7.4v9.5"/>',
    row: '<rect x="2.8" y="3.8" width="14.4" height="4.2" rx="1.2"/><rect x="2.8" y="12" width="14.4" height="4.2" rx="1.2"/><path d="M5.6 9.9h8.8"/>',
    key: '<circle cx="7" cy="10" r="3.4"/><path d="M10.2 10H17M14.6 10v2.6M16.8 10v2"/>',
    link: '<path d="M8.2 11.8 11.8 8.2M6.2 12.2l-1.1 1.1a2.6 2.6 0 0 0 3.7 3.7l1.1-1.1M10.6 4.1l1.1-1.1a2.6 2.6 0 0 1 3.7 3.7l-1.1 1.1"/>',
    type: '<path d="M3.2 5.4h13.6M3.2 10h9M3.2 14.6h6.2"/>',
    rule: '<rect x="4.2" y="2.6" width="11.6" height="14.8" rx="2"/><path d="M7 7h6M7 10.2h6M7 13.4h3.4"/>',
    query: '<rect x="2.6" y="3" width="14.8" height="14" rx="2.4"/><path d="m5.8 7.2 2 2-2 2M10.4 11.6h4"/>',
    join: '<rect x="2.6" y="3.4" width="6.2" height="6.2" rx="1.2"/><rect x="11.2" y="10.4" width="6.2" height="6.2" rx="1.2"/><path d="M8.8 6.5h3.4a2.4 2.4 0 0 1 2.4 2.4v1.5"/>',
    group: '<rect x="2.8" y="3" width="6" height="6" rx="1.2"/><rect x="11.2" y="3" width="6" height="6" rx="1.2"/><rect x="2.8" y="11" width="6" height="6" rx="1.2"/><rect x="11.2" y="11" width="6" height="6" rx="1.2"/>',
    window: '<rect x="2.6" y="3.4" width="14.8" height="13.2" rx="2"/><path d="M2.6 7.2h14.8M6.4 12.2h7.2"/>',
    index: '<path d="M4 3.4h8.4M4 7.6h8.4M4 11.8h5.2M4 16h5.2M14.4 9.4v7.2M12.4 14.6l2 2 2-2"/>',
    tx: '<path d="M4 5.2h12M4 10h12M4 14.8h12" opacity=".45"/><path d="M6.2 10h7.6M9.4 7.2 12.6 10l-3.2 2.8"/>',
    lock: '<rect x="4.4" y="8.6" width="11.2" height="8.6" rx="2"/><path d="M7 8.6V6.4a3 3 0 0 1 6 0v2.2M10 12v2.2"/>',
    plan: '<circle cx="5" cy="10" r="2.2"/><circle cx="15" cy="5" r="2.2"/><circle cx="15" cy="15" r="2.2"/><path d="M7 9.2 13 5.8M7 10.8l6 3.4"/>',
    user: '<circle cx="10" cy="6.5" r="3.2"/><path d="M4 17c.6-3.2 3-5 6-5s5.4 1.8 6 5"/>',
    disk: '<ellipse cx="10" cy="5" rx="6.2" ry="2.4"/><path d="M3.8 5v10c0 1.3 2.8 2.4 6.2 2.4s6.2-1.1 6.2-2.4V5M3.8 10c0 1.3 2.8 2.4 6.2 2.4s6.2-1.1 6.2-2.4"/>',
    book: '<path d="M3 4.5h5.5A2.5 2.5 0 0 1 11 7v9a2.5 2.5 0 0 0-2.5-2H3zM17 4.5h-3.5A2.5 2.5 0 0 0 11 7v9a2.5 2.5 0 0 1 2.5-2H17z"/>',
    star: '<path d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.7l5.4-.8z"/>',
    file: '<path d="M5 2.5h8a2 2 0 0 1 2 2v13H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Zm3 4h4M8 10h4M8 13.5h2.5"/>',
    bulb: '<path d="M7.2 14.2h5.6M8 17h4M10 2.5a5 5 0 0 0-3 9v1.7h6V11.5a5 5 0 0 0-3-9Z"/>',
    check: '<path d="m4 10 4 4 8-8"/>',
    code: '<path d="m7 5-4 5 4 5M13 5l4 5-4 5"/>'
  };

  const UI_ICONS = {
    play: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 3.5 16 10 6.5 16.5Z"/></svg>',
    pause: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3.5h3.5v13H5zM11.5 3.5H15v13h-3.5z"/></svg>',
    replay: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5V7h3.5"/></svg>',
    prev: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>',
    next: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5"/></svg>',
    full: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5v-4h4M16.5 7.5v-4h-4M3.5 12.5v4h4M16.5 12.5v4h-4"/></svg>',
    info: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M10 9v4.5M10 6.5h.01"/></svg>',
    check: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>',
    arrow: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
    plus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>',
    minus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12"/></svg>',
    left: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5"/></svg>',
    right: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg>',
    trash: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 3.5h4M6 6l.8 11h6.4L14 6M8.5 9v5M11.5 9v5"/></svg>',
    search: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="m13.2 13.2 3.8 3.8"/></svg>'
  };

  const TONE_COLORS = {
    blue: "var(--blue)",
    coral: "var(--coral)",
    green: "var(--green)",
    violet: "var(--violet)",
    yellow: "var(--yellow)",
    mint: "var(--mint)"
  };

  const TONE_SWATCH = {
    blue: "var(--blue-soft)",
    coral: "var(--coral-soft)",
    green: "var(--green-soft)",
    violet: "var(--violet-soft)",
    yellow: "var(--yellow-soft)",
    mint: "var(--mint-soft)"
  };

  const NODE_TONES = {
    table: "blue",
    row: "green",
    key: "yellow",
    link: "violet",
    type: "mint",
    rule: "coral",
    query: "blue",
    join: "violet",
    group: "mint",
    window: "violet",
    index: "yellow",
    tx: "green",
    lock: "coral",
    plan: "blue",
    user: "mint",
    disk: "coral",
    book: "blue",
    star: "coral",
    file: "green",
    bulb: "yellow",
    check: "green",
    code: "blue"
  };

  const view = $("#view");
  const sidebarNav = $("#sidebarNav");
  const searchModal = $("#searchModal");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");
  const toastEl = $("#toast");

  const state = {
    route: { view: "home" },
    progress: loadProgress(),
    lesson: { id: null, step: 1, playing: false, speed: 1, timer: null },
    practice: null,
    lab: null,
    cheat: { section: "numbers", query: "" },
    search: { items: [], selected: 0, modalOpen: false },
    diagram: null,
    revealObserver: null
  };

  const moduleMap = {};
  const lessonList = [];
  DB.modules.forEach((m) => {
    moduleMap[m.id] = m;
    m.lessons.forEach((id) => {
      const lesson = DB.lessons[id];
      if (!lesson) return;
      lesson.module = m.id;
      lessonList.push(lesson);
    });
  });
  const lessonById = DB.lessons;
  const totalLessons = lessonList.length;
  const totalSteps = lessonList.reduce((sum, l) => sum + l.steps.length, 0);

  let searchIndex = [];
  let toastTimer = null;
  let sidebarReturnFocus = null;

  /* ----------------------------------------------------------
     Utilities
     ---------------------------------------------------------- */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  }

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  function formatInt(n) {
    return Math.round(n).toLocaleString("vi-VN");
  }

  function iconMarkup(name, cls) {
    const inner = ICON_PATHS[name] || ICON_PATHS.info;
    return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }

  function toneVars(tone) {
    const t = TONE_COLORS[tone] ? tone : "blue";
    return `--mc:${TONE_COLORS[t]};--mc-soft:${TONE_SWATCH[t]}`;
  }

  function nodeTone(type) {
    return NODE_TONES[type] || "blue";
  }

  function nodeToneVars(type) {
    const t = nodeTone(type);
    return `--tone:${TONE_COLORS[t]};--tone-soft:${TONE_SWATCH[t]}`;
  }

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      return raw && typeof raw === "object" ? raw : {};
    } catch (err) {
      return {};
    }
  }

  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress)); } catch (err) { /* private mode */ }
  }

  function isComplete(id) {
    const lesson = lessonById[id];
    if (!lesson) return false;
    return (state.progress[id] || 0) >= lesson.steps.length;
  }

  function savedStep(id) {
    const lesson = lessonById[id];
    if (!lesson) return 1;
    return clamp(state.progress[id] || 1, 1, lesson.steps.length);
  }

  function completedCount() {
    return lessonList.filter((l) => isComplete(l.id)).length;
  }

  function nextLessonOf(id) {
    const idx = lessonList.findIndex((l) => l.id === id);
    return idx >= 0 ? lessonList[idx + 1] || null : null;
  }

  function resumeLesson() {
    try {
      const last = localStorage.getItem(LAST_KEY);
      if (last && lessonById[last]) return lessonById[last];
    } catch (err) { /* ignore */ }
    return lessonList.find((l) => !isComplete(l.id)) || lessonList[0];
  }

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  function navigate(hash) {
    if (location.hash === hash) {
      onRoute();
    } else {
      location.hash = hash;
    }
  }

  /* ----------------------------------------------------------
     Theme
     ---------------------------------------------------------- */
  function initTheme() {
    let theme = "light";
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") theme = stored;
    } catch (err) { /* ignore */ }
    document.body.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#080f19" : "#0c1624");
  }

  function toggleTheme() {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#080f19" : "#0c1624");
  }

  /* ----------------------------------------------------------
     Chrome / sidebar
     ---------------------------------------------------------- */
  function updateChrome() {
    const completed = completedCount();
    const pct = totalLessons ? completed / totalLessons : 0;
    const ring = $("#ringFill");
    if (ring) ring.style.strokeDashoffset = String(91.1 * (1 - pct));
    const globalText = $("#globalProgressText");
    if (globalText) globalText.textContent = `${completed}/${totalLessons}`;
    const sideFill = $("#sidebarProgressFill");
    if (sideFill) sideFill.style.width = `${Math.round(pct * 100)}%`;
    const sideText = $("#sidebarProgressText");
    if (sideText) sideText.textContent = `${completed}/${totalLessons} bài`;

    $$(".mode-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.mode === state.route.view);
    });
    renderSidebar();
  }

  function renderSidebar() {
    if (!sidebarNav) return;
    const activeId = state.route.view === "learn" ? state.route.lessonId : null;
    sidebarNav.innerHTML = DB.modules.map((m) => {
      const moduleLessons = m.lessons
        .map((id) => lessonById[id])
        .filter(Boolean);
      if (!moduleLessons.length) return "";
      return `
        <div class="side-module">
          <div class="side-module-head">
            <span class="side-module-num">${esc(m.num)}</span>
            <span>${esc(m.title)}</span>
          </div>
          ${moduleLessons.map((lesson) => {
            const done = isComplete(lesson.id);
            const active = lesson.id === activeId;
            const step = savedStep(lesson.id);
            return `
              <a class="side-lesson${active ? " is-active" : ""}${done ? " is-done" : ""}"
                 href="#/learn/${esc(lesson.id)}/${step}" data-lesson-link>
                <span class="side-lesson-num">${done ? "✓" : lessonList.indexOf(lesson) + 1}</span>
                <span class="side-lesson-body">
                  <span class="side-lesson-title">${esc(lesson.title)}</span>
                  <span class="side-lesson-meta">${esc(lesson.duration)} · ${lesson.steps.length} bước</span>
                </span>
              </a>`;
          }).join("")}
        </div>`;
    }).join("");
  }

  function openSidebar() {
    sidebarReturnFocus = document.activeElement;
    document.body.classList.add("sidebar-open");
    $("#sidebarScrim").hidden = false;
    $("#menuBtn").setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    $("#sidebarScrim").hidden = true;
    $("#menuBtn").setAttribute("aria-expanded", "false");
    if (sidebarReturnFocus && typeof sidebarReturnFocus.focus === "function") sidebarReturnFocus.focus();
    sidebarReturnFocus = null;
  }

  function toggleSidebar() {
    if (document.body.classList.contains("sidebar-open")) closeSidebar();
    else openSidebar();
  }

  function syncTopbarOffset() {
    const bar = document.querySelector(".topbar");
    if (!bar) return;
    document.documentElement.style.setProperty("--topbar-offset", `${bar.offsetHeight}px`);
  }

  /* ----------------------------------------------------------
     Router
     ---------------------------------------------------------- */
  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return { view: "home" };
    if (parts[0] === "learn") {
      if (!parts[1]) return { view: "learn", lessonId: null, step: 1 };
      const lesson = lessonById[parts[1]];
      if (!lesson) return { view: "missing" };
      const step = clamp(parseInt(parts[2] || "1", 10) || 1, 1, lesson.steps.length);
      return { view: "learn", lessonId: lesson.id, step };
    }
    if (parts[0] === "practice") return { view: "practice" };
    if (parts[0] === "lab") return { view: "lab" };
    if (parts[0] === "cheatsheets") {
      const section = DB.cheatsheets.find((s) => s.id === parts[1]);
      return { view: "cheatsheets", section: section ? section.id : null };
    }
    return { view: "missing" };
  }

  function onRoute() {
    const route = parseRoute();
    if (route.view === "learn" && !route.lessonId) {
      const resume = resumeLesson();
      if (resume) {
        const step = savedStep(resume.id);
        location.hash = `#/learn/${resume.id}/${step}`;
        return;
      }
    }
    if (route.view === "cheatsheets") {
      const valid = route.section || (DB.cheatsheets.some((s) => s.id === state.cheat.section) ? state.cheat.section : DB.cheatsheets[0].id);
      state.cheat.section = valid;
    }
    state.route = route;
    stopPlayer();
    document.body.dataset.view = route.view;
    closeSidebar();
    closeSearch();

    if (route.view === "home") renderHome();
    else if (route.view === "learn") renderLesson(route.lessonId, route.step);
    else if (route.view === "practice") renderPractice();
    else if (route.view === "lab") renderLab();
    else if (route.view === "cheatsheets") renderCheatsheets();
    else renderMissing();

    updateChrome();
    window.scrollTo(0, 0);
  }

  /* ----------------------------------------------------------
     Search
     ---------------------------------------------------------- */
  function buildSearchIndex() {
    const index = [];
    lessonList.forEach((lesson) => {
      const mod = moduleMap[lesson.module];
      index.push({
        kind: "lesson",
        href: `#/learn/${lesson.id}/1`,
        title: lesson.title,
        sub: `${mod.num} · ${mod.title} · ${lesson.duration}`,
        haystack: `${lesson.title} ${lesson.shortTitle} ${lesson.subtitle} ${lesson.tags.join(" ")} ${mod.title}`.toLowerCase()
      });
      lesson.steps.forEach((step, i) => {
        index.push({
          kind: "step",
          href: `#/learn/${lesson.id}/${i + 1}`,
          title: step.title,
          sub: `${lesson.shortTitle} · bước ${i + 1} · ${step.type}`,
          haystack: `${lesson.title} ${lesson.shortTitle} ${step.title} ${step.short} ${step.type} ${stripHTML(step.body)}`.toLowerCase()
        });
      });
    });
    DB.cheatsheets.forEach((section) => {
      section.cards.forEach((card) => {
        index.push({
          kind: "cheat",
          href: `#/cheatsheets/${section.id}`,
          title: card.title,
          sub: `${section.title} · cheatsheet`,
          haystack: `${section.title} ${card.title} ${stripHTML(card.html)}`.toLowerCase()
        });
      });
    });
    searchIndex = index;
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.hidden = false;
    document.body.classList.add("has-modal");
    state.search.modalOpen = true;
    searchInput.value = "";
    renderSearchResults("");
    setTimeout(() => searchInput.focus(), 30);
  }

  function closeSearch() {
    if (!searchModal || searchModal.hidden) return;
    searchModal.hidden = true;
    document.body.classList.remove("has-modal");
    state.search.modalOpen = false;
  }

  function searchResultsFor(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      const lessons = lessonList.slice(0, 5).map((lesson) => {
        const mod = moduleMap[lesson.module];
        return {
          kind: "lesson",
          href: `#/learn/${lesson.id}/1`,
          title: lesson.title,
          sub: `${mod.num} · ${mod.title} · ${lesson.duration}`
        };
      });
      const cheats = DB.cheatsheets.slice(0, 3).map((s) => ({
        kind: "cheat",
        href: `#/cheatsheets/${s.id}`,
        title: s.title,
        sub: "Cheatsheet · công thức & bảng tra"
      }));
      return lessons.concat(cheats);
    }
    return searchIndex
      .filter((item) => item.haystack.includes(q))
      .sort((a, b) => {
        const at = a.title.toLowerCase().indexOf(q);
        const bt = b.title.toLowerCase().indexOf(q);
        if (at >= 0 && bt < 0) return -1;
        if (bt >= 0 && at < 0) return 1;
        const rank = { lesson: 0, step: 1, cheat: 2 };
        return (rank[a.kind] - rank[b.kind]) || a.title.localeCompare(b.title, "vi");
      })
      .slice(0, 16);
  }

  function renderSearchResults(query) {
    const items = searchResultsFor(query);
    if (!items.length) {
      state.search.items = [];
      state.search.selected = -1;
      searchResults.innerHTML = `<div class="search-empty">Không tìm thấy kết quả cho “${esc(query)}”.<br>Thử “cache”, “shard”, “queue” hoặc “p95”.</div>`;
      return;
    }
    const groups = { lesson: "Bài học", step: "Bước trong bài", cheat: "Cheatsheets" };
    const ordered = [];
    let html = "";
    ["lesson", "step", "cheat"].forEach((kind) => {
      const group = items.filter((item) => item.kind === kind);
      if (!group.length) return;
      html += `<div class="search-group-title">${groups[kind]}</div>`;
      group.forEach((item) => {
        const index = ordered.length;
        ordered.push(item);
        const badge = kind === "lesson" ? iconMarkup("book") : kind === "cheat" ? "C" : "↳";
        html += `
          <a class="search-result${index === 0 ? " is-selected" : ""}" href="${item.href}" data-search-item="${index}">
            <span class="search-result-icon${kind === "cheat" ? " cheat" : ""}">${badge}</span>
            <span class="search-result-body">
              <span class="search-result-title">${esc(item.title)}</span>
              <span class="search-result-sub">${esc(item.sub)}</span>
            </span>
            <span class="search-result-kbd">↵</span>
          </a>`;
      });
    });
    state.search.items = ordered;
    state.search.selected = 0;
    searchResults.innerHTML = html;
  }

  function moveSearchSelection(delta) {
    if (!state.search.items.length) return;
    state.search.selected = (state.search.selected + delta + state.search.items.length) % state.search.items.length;
    $$(".search-result", searchResults).forEach((el, i) => {
      el.classList.toggle("is-selected", i === state.search.selected);
      if (i === state.search.selected) el.scrollIntoView({ block: "nearest" });
    });
  }

  function activateSearchSelection() {
    if (state.search.selected < 0) return;
    const links = $$(".search-result", searchResults);
    const el = links[state.search.selected];
    if (el) {
      closeSearch();
      location.hash = el.getAttribute("href");
    }
  }

  /* ----------------------------------------------------------
     Home
     ---------------------------------------------------------- */
  function renderHome() {
    document.title = "DBLab — Cơ sở dữ liệu, nhìn thấy từng bước";
    const completed = completedCount();
    const resume = resumeLesson();
    const resumeStep = resume ? savedStep(resume.id) : 1;
    const resumeHref = resume ? `#/learn/${resume.id}/${resumeStep}` : "#/learn";
    const featured = lessonList.find((l) => !isComplete(l.id)) || lessonList[0];
    const seedRows = window.DB_SEED
      ? window.DB_SEED.tables.reduce((sum, t) => sum + t.rows.length, 0)
      : 0;

    const modes = [
      {
        title: "Học bằng sơ đồ sống",
        desc: "Từng bước được làm nổi bật: bảng, khóa, JOIN và index hiện ra theo nhịp.",
        href: "#/learn",
        icon: "table",
        tone: "blue",
        cta: "Vào lớp học"
      },
      {
        title: "Luyện tập tình huống",
        desc: `${DB.practice.length} ca thực tế: truy vấn sai, khóa ngoại, index và giao dịch.`,
        href: "#/practice",
        icon: "star",
        tone: "coral",
        cta: "Bắt đầu luyện"
      },
      {
        title: "SQL Workbench",
        desc: "Viết SELECT và chạy thật trên dữ liệu mẫu, kèm 6 nhiệm vụ có chấm điểm.",
        href: "#/lab",
        icon: "query",
        tone: "violet",
        cta: "Mở phòng SQL"
      },
      {
        title: "Cheatsheets",
        desc: "Cú pháp, kiểu dữ liệu, index và giao dịch để tra nhanh khi làm bài.",
        href: "#/cheatsheets",
        icon: "file",
        tone: "green",
        cta: "Mở bảng tra"
      }
    ];

    view.innerHTML = `
      <div class="home">
        <section class="hero">
          <div class="hero-copy">
            <span class="eyebrow">Khóa học tương tác · ${totalLessons} bài · tiếng Việt</span>
            <h1>Hiểu dữ liệu.<br><span class="hl">Chạy</span> câu truy vấn.</h1>
            <p class="hero-sub">Đi từ một bảng có khóa chính đến JOIN, GROUP BY, index và transaction. Mỗi bài là <strong>một sơ đồ sống</strong>, và mỗi câu SQL được chạy thật ngay trong trình duyệt — không cần cài database.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${resumeHref}">${completed ? "Tiếp tục học" : "Bắt đầu bài 01"} ${UI_ICONS.arrow}</a>
              <a class="btn btn-ghost" href="#/lab">${iconMarkup("query")} Mở SQL Workbench</a>
            </div>
            <div class="hero-note">${UI_ICONS.check} Không backend. Dữ liệu mẫu và tiến độ nằm trên máy bạn.</div>
            <div class="hero-stats">
              <div class="hero-stat"><b>${totalLessons}</b><span>bài học tương tác</span></div>
              <div class="hero-stat"><b>${totalSteps}</b><span>bước có sơ đồ</span></div>
              <div class="hero-stat"><b>${seedRows}</b><span>dòng dữ liệu mẫu</span></div>
              <div class="hero-stat"><b>${completed}/${totalLessons}</b><span>tiến độ của bạn</span></div>
            </div>
          </div>
          ${dbHeroVisual()}
        </section>

        <section class="reveal">
          <div class="section-head">
            <div>
              <h2>Bốn cách học, một cơ sở dữ liệu</h2>
              <p>Không chỉ đọc lý thuyết. Bạn xem dữ liệu chảy qua sơ đồ, viết truy vấn, làm sai và sửa ngay.</p>
            </div>
            <a class="section-link" href="#/learn">Xem lộ trình ${UI_ICONS.arrow}</a>
          </div>
          <div class="mode-grid">
            ${modes.map((m) => `
              <a class="mode-card" href="${m.href}" style="${toneVars(m.tone)}">
                <span class="mode-icon">${iconMarkup(m.icon)}</span>
                <h3>${m.title}</h3>
                <p>${m.desc}</p>
                <span class="mode-arrow">${m.cta} ${UI_ICONS.arrow}</span>
              </a>`).join("")}
          </div>
        </section>

        <section class="section reveal">
          <div class="section-head">
            <div>
              <h2>Lộ trình ${totalLessons} bài</h2>
              <p>Từ mô hình quan hệ đến vận hành: mỗi module trả lời một câu hỏi lớn.</p>
            </div>
            <a class="section-link" href="#/learn/${featured.id}/1">Học bài tiếp theo ${UI_ICONS.arrow}</a>
          </div>
          <div class="outline-grid">
            ${DB.modules.map((m) => outlineModule(m)).join("")}
          </div>
        </section>

        <section class="reveal">
          ${workbenchPromo()}
        </section>

        <section class="section reveal">
          <div class="section-head">
            <div>
              <h2>Câu hỏi thường gặp</h2>
              <p>Vài điều cần biết trước khi dùng trên lớp hoặc tự học.</p>
            </div>
          </div>
          <div class="faq-list">
            <details class="faq-item">
              <summary>SQL ở đây có phải MySQL hay PostgreSQL thật?</summary>
              <p>Không. Workbench dùng một engine SQL tối giản viết riêng cho khóa học, chạy hoàn toàn trong trình duyệt. Nó hỗ trợ SELECT, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT, hàm tổng hợp và một số hàm chuỗi/số. Cú pháp học được chuyển thẳng sang MySQL/PostgreSQL, nhưng các lệnh thay đổi cấu trúc hay giao dịch thật không chạy ở đây.</p>
            </details>
            <details class="faq-item">
              <summary>Dữ liệu mẫu có bị thay đổi khi tôi chạy truy vấn?</summary>
              <p>Không. Engine chỉ đọc dữ liệu trong bộ nhớ và nạp lại từ bộ seed mỗi lần mở trang. Nút <b>Nạp lại dữ liệu</b> đưa mọi thứ về trạng thái ban đầu. Không có dữ liệu nào được gửi lên server.</p>
            </details>
            <details class="faq-item">
              <summary>Có cần cài database hay backend không?</summary>
              <p>Không. Toàn bộ site là HTML, CSS và JavaScript tĩnh. Tiến độ học lưu bằng localStorage trên máy bạn.</p>
            </details>
            <details class="faq-item">
              <summary>Dùng trên điện thoại hoặc máy chiếu được không?</summary>
              <p>Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Trình soạn SQL vẫn chạy được; trên điện thoại nên xoay ngang để xem bảng kết quả rộng.</p>
            </details>
          </div>
        </section>

        <footer class="site-footer">
          <div class="footer-brand"><span>D</span> DBLab</div>
          <div class="footer-note">Một sản phẩm học tập gốc. Dữ liệu mẫu là hư cấu, phục vụ minh họa truy vấn.</div>
          <div class="footer-links">
            <a href="#/learn">Học</a>
            <a href="#/practice">Luyện tập</a>
            <a href="#/lab">SQL Workbench</a>
            <a href="#/cheatsheets">Cheatsheets</a>
          </div>
        </footer>
      </div>`;

    initReveals();
  }

  function dbHeroVisual() {
    return `
      <div class="db-hero" aria-label="Ví dụ một câu SQL và bảng kết quả">
        <div class="db-hero-bar">
          <i></i><i></i><i></i>
          <span>dblab://truong-hoc</span>
        </div>
        <div class="db-hero-code"><span class="c">-- Sĩ số từng khoa, giữ cả khoa rỗng</span>
<span class="k">SELECT</span> k.tenkhoa, <span class="f">COUNT</span>(s.masv) <span class="k">AS</span> so_sv
<span class="k">FROM</span> khoa k <span class="k">LEFT JOIN</span> sinhvien s
  <span class="k">ON</span> s.makhoa = k.makhoa
<span class="k">GROUP BY</span> k.tenkhoa
<span class="k">ORDER BY</span> so_sv <span class="k">DESC</span>;</div>
        <div class="db-hero-result">
          <table>
            <thead><tr><th>tenkhoa</th><th>so_sv</th></tr></thead>
            <tbody>
              <tr><td>Công nghệ thông tin</td><td>6</td></tr>
              <tr><td>Kế toán</td><td>2</td></tr>
              <tr><td>Ngoại ngữ</td><td>2</td></tr>
              <tr><td>Điện tử</td><td>2</td></tr>
              <tr><td>Môi trường</td><td>0</td></tr>
            </tbody>
          </table>
        </div>
        <div class="db-hero-foot">
          <span class="db-hero-chip"><b>5</b> bảng</span>
          <span class="db-hero-chip"><b>57</b> dòng dữ liệu</span>
          <span class="db-hero-chip">engine chạy <b>cục bộ</b></span>
        </div>
      </div>`;
  }

  function workbenchPromo() {
    const nodes = [
      { icon: "table", label: "khoa", sub: "5 dòng" },
      { icon: "table", label: "sinhvien", sub: "12 dòng" },
      { icon: "table", label: "diem", sub: "26 dòng" },
      { icon: "key", label: "JOIN", sub: "theo khóa", hot: true },
      { icon: "query", label: "SELECT", sub: "kết quả", hot: true }
    ];
    return `
      <div class="lab-promo">
        <div>
          <span class="eyebrow">SQL Workbench · chạy cục bộ</span>
          <h2>Viết câu truy vấn.<br>Thấy dữ liệu trả lời.</h2>
          <p>Một cơ sở dữ liệu trường học nhỏ, trình soạn SQL và sáu nhiệm vụ có chấm điểm. Không cần cài MySQL, không gửi dữ liệu đi đâu.</p>
          <a class="btn btn-lime" href="#/lab">Mở SQL Workbench ${UI_ICONS.arrow}</a>
        </div>
        <div class="mini-pipe" aria-hidden="true">
          ${nodes.map((n, i) => `${i ? '<span class="mini-line"></span>' : ""}
            <div class="mini-node${n.hot ? " is-hot" : ""}">
              ${iconMarkup(n.icon)}
              <b>${n.label}</b>
              <span>${n.sub}</span>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function outlineModule(module) {
    const lessons = module.lessons.map((id) => lessonById[id]).filter(Boolean);
    return `
      <div class="outline-module" style="${toneVars(module.tone)}">
        <div class="outline-module-head">
          <span class="outline-module-num">${esc(module.num)}</span>
          <h3>${esc(module.title)}</h3>
          <span>${lessons.length} bài</span>
        </div>
        ${lessons.map((lesson) => {
          const idx = lessonList.indexOf(lesson) + 1;
          const done = isComplete(lesson.id);
          const step = savedStep(lesson.id);
          return `
            <a class="outline-lesson${done ? " is-done" : ""}" href="#/learn/${lesson.id}/${step}">
              <span class="outline-lesson-num">${idx < 10 ? "0" + idx : idx}</span>
              <span class="outline-lesson-title">${esc(lesson.title)}</span>
              <span class="outline-lesson-meta">${esc(lesson.duration)}</span>
              ${done ? '<span class="mini-check">✓</span>' : ""}
            </a>`;
        }).join("")}
      </div>`;
  }

  function initReveals() {
    if (state.revealObserver) {
      state.revealObserver.disconnect();
      state.revealObserver = null;
    }
    const items = $$(".reveal");
    if (!items.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    state.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          state.revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => state.revealObserver.observe(el));
  }

  function renderMissing() {
    document.title = "Không tìm thấy trang — DBLab";
    view.innerHTML = `
      <div class="missing">
        <span class="eyebrow">404</span>
        <h1>Trang này chưa có trong bản đồ</h1>
        <p>Đường dẫn không tồn tại hoặc bài học đã bị di chuyển. Quay về lộ trình để chọn một bài khác.</p>
        <a class="btn btn-primary" href="#/">Về trang chủ</a>
      </div>`;
  }

  /* ----------------------------------------------------------
     Global event wiring
     ---------------------------------------------------------- */
  function bindGlobalEvents() {
    window.addEventListener("hashchange", onRoute);
    window.addEventListener("resize", syncTopbarOffset);
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#searchBtn").addEventListener("click", openSearch);
    $("#menuBtn").addEventListener("click", toggleSidebar);
    $("#sidebarScrim").addEventListener("click", closeSidebar);
    $("#resetProgressBtn").addEventListener("click", () => {
      if (!window.confirm("Đặt lại toàn bộ tiến độ học trên trình duyệt này?")) return;
      state.progress = {};
      saveProgress();
      updateChrome();
      navigate("#/");
      toast("Đã đặt lại tiến độ.");
    });

    $$(".search-backdrop, [data-close-search]").forEach((el) => {
      el.addEventListener("click", closeSearch);
    });

    searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSearchSelection(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSearchSelection(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        activateSearchSelection();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      }
    });
    searchResults.addEventListener("click", (e) => {
      if (e.target.closest(".search-result")) closeSearch();
    });

    document.addEventListener("keydown", (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (state.search.modalOpen) closeSearch();
        else openSearch();
        return;
      }
      if (e.key === "Escape") {
        if (state.search.modalOpen) {
          closeSearch();
          return;
        }
        if (document.body.classList.contains("sidebar-open")) {
          closeSidebar();
          return;
        }
      }
      if (e.target && e.target.id === "dbEditor") {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          e.preventDefault();
          runEditor();
        } else if (e.key === "Tab") {
          e.preventDefault();
          insertIntoEditor("  ");
        }
        return;
      }
      if (state.route.view !== "learn" || state.search.modalOpen) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToStep(state.lesson.step + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToStep(state.lesson.step - 1);
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlayer();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        replayLesson();
      }
    });

    view.addEventListener("click", handleViewClick);
    view.addEventListener("input", handleViewInput);
    view.addEventListener("change", handleViewChange);
  }

  /* ----------------------------------------------------------
     Lesson engine
     ---------------------------------------------------------- */
  function renderLesson(lessonId, stepIndex) {
    const lesson = lessonById[lessonId];
    if (!lesson) {
      renderMissing();
      return;
    }
    const index = clamp(stepIndex || 1, 1, lesson.steps.length);
    state.lesson.id = lesson.id;
    state.lesson.step = index;
    state.lesson.playing = false;
    state.lesson.speed = 1;
    stopPlayer();
    try { localStorage.setItem(LAST_KEY, lesson.id); } catch (err) { /* ignore */ }

    const mod = moduleMap[lesson.module];
    const next = nextLessonOf(lesson.id);
    const nextHref = next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = next ? "Bài tiếp" : "Luyện tập";
    document.title = `${lesson.title} — DBLab`;

    view.innerHTML = `
      <div class="lesson-page">
        <div class="lesson-head">
          <div>
            <div class="lesson-breadcrumb">
              <a href="#/">DBLab</a><span class="sep">/</span>
              <span>${esc(mod.title)}</span><span class="sep">/</span>
              <span>${esc(lesson.shortTitle)}</span>
            </div>
            <h1 class="lesson-title">${esc(lesson.title)}</h1>
            <p class="lesson-sub">${esc(lesson.subtitle)}</p>
            <div class="lesson-badges">
              <span class="pill pill-blue">${esc(mod.num)} · ${esc(mod.title)}</span>
              <span class="pill">${esc(lesson.level)}</span>
              <span class="pill">${esc(lesson.duration)}</span>
              <span class="pill">${lesson.steps.length} bước</span>
            </div>
          </div>
          <div class="lesson-head-right">
            <a class="btn btn-ghost btn-sm" href="#/">Về lộ trình</a>
            <a class="btn btn-primary btn-sm" href="${nextHref}">${nextLabel} ${UI_ICONS.arrow}</a>
          </div>
        </div>

        <div class="lesson-layout">
          <div class="lesson-main">
            <div class="metric-strip" id="metricStrip">${metricStripHTML(lesson, lesson.steps[index - 1])}</div>

            <div class="stage-card" id="stageCard">
              <div class="stage-top">
                <div class="stage-title">
                  <span class="live-dot"></span>
                  <span>Sơ đồ dữ liệu</span>
                  <span>${lesson.nodes.length} khối · ${lesson.edges.length} liên kết</span>
                </div>
                <div class="stage-actions">
                  <button class="stage-icon-btn" type="button" data-action="fullscreen" title="Xem toàn màn hình">
                    ${UI_ICONS.full}<span>Toàn màn hình</span>
                  </button>
                </div>
              </div>
              <div class="stage-canvas" id="stageCanvas">
                ${renderDiagram(lesson)}
              </div>
              <div class="stage-legend">
                <div class="legend">
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--blue)"></i>Luồng chính</span>
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--mint)"></i>Quan hệ dữ liệu</span>
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--coral)"></i>Kết quả trả về</span>
                </div>
                <span class="stage-hint">← → chuyển bước · Space phát · R phát lại</span>
              </div>
            </div>

            <div class="player-card">
              <div class="player-top">
                <button class="play-btn" id="playBtn" type="button" data-action="toggle-play" aria-label="Phát tự động các bước">
                  ${UI_ICONS.play}
                </button>
                <button class="player-small-btn" type="button" data-action="replay" aria-label="Phát lại từ đầu" title="Phát lại">${UI_ICONS.replay}</button>
                <button class="player-small-btn" type="button" data-action="prev-step" aria-label="Bước trước">${UI_ICONS.prev}</button>
                <div class="player-track-wrap">
                  <div class="player-track"><div class="player-track-fill" id="playerFill"></div></div>
                  <div class="player-time">
                    <span id="playerStepText">Bước ${index}/${lesson.steps.length}</span>
                    <span id="playerPct">${Math.round((index / lesson.steps.length) * 100)}%</span>
                  </div>
                </div>
                <button class="player-small-btn" type="button" data-action="next-step" aria-label="Bước sau">${UI_ICONS.next}</button>
                <button class="speed-btn" type="button" data-action="cycle-speed" aria-label="Đổi tốc độ phát" title="Tốc độ phát">1×</button>
              </div>
              <div class="timeline" id="timeline">
                ${lesson.steps.map((step, i) => `
                  <button class="tl-step${i === index - 1 ? " is-active" : ""}${i < index - 1 ? " is-done" : ""}"
                          type="button" data-step="${i + 1}" title="Bước ${i + 1}: ${esc(step.title)}">
                    <span class="tl-step-bar"><span></span></span>
                    <span class="tl-step-label">${String(i + 1).padStart(2, "0")} · ${esc(step.short)}</span>
                  </button>`).join("")}
              </div>
            </div>
          </div>

          <aside class="step-panel" id="stepPanel">${stepPanelHTML(lesson, index)}</aside>
        </div>
      </div>`;

    state.lesson.step = index;
    applyStep(lesson, index, { updateHash: false, initial: true });
  }

  function metricStripHTML(lesson, step) {
    return lesson.metrics.map((m) => {
      const value = step.metrics && step.metrics[m.key] != null ? step.metrics[m.key] : "—";
      return `
        <div class="metric" style="--metric-color:var(--${m.tone})">
          <div class="metric-label">${esc(m.label)}</div>
          <div class="metric-value">${esc(value)}</div>
        </div>`;
    }).join("");
  }

  function stepPanelHTML(lesson, index) {
    const step = lesson.steps[index - 1];
    const isFirst = index === 1;
    const isLast = index === lesson.steps.length;
    const typeClass = step.tone === "warn" ? " type-warn" : step.tone === "final" ? " type-final" : "";
    const next = nextLessonOf(lesson.id);
    const nextHref = next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = next ? `Sang bài: ${next.title}` : "Luyện tập tình huống";
    const changes = step.changes && step.changes.length
      ? `<div class="step-section">
          <div class="step-section-title">Điều gì thay đổi</div>
          <div class="change-list">
            ${step.changes.map((c) => `<div class="change-item">${UI_ICONS.check}<span>${c}</span></div>`).join("")}
          </div>
        </div>`
      : "";
    const note = step.note
      ? `<div class="callout">
          <div class="callout-head">${iconMarkup("bulb")} Điểm cần nhớ</div>
          <p>${step.note}</p>
        </div>`
      : "";
    const complete = isLast
      ? `<div class="complete-banner">
          <h4>Bạn đã đi hết bài</h4>
          <p>Tiến độ đã được lưu trên trình duyệt. Có thể xem lại bất cứ lúc nào.</p>
          <a class="btn btn-sm btn-lime" style="margin-top:9px" href="${nextHref}">${nextLabel} ${UI_ICONS.arrow}</a>
        </div>`
      : "";

    return `
      <div class="step-panel-scroll">
        <div class="step-meta">
          <span class="step-counter">BƯỚC ${String(index).padStart(2, "0")} / ${String(lesson.steps.length).padStart(2, "0")}</span>
          <span class="step-type${typeClass}">${esc(step.type)}</span>
        </div>
        <h2 class="step-title">${esc(step.title)}</h2>
        <div class="step-body">${step.body}</div>
        ${note}
        ${changes}
        <div class="learn-box">
          <div class="step-section-title">Sau bài này, bạn nắm được</div>
          <div class="learn-list">
            ${lesson.learn.map((item) => `<div class="learn-item">${esc(item)}</div>`).join("")}
          </div>
        </div>
        ${complete}
      </div>
      <div class="step-nav">
        <button class="btn btn-ghost" type="button" data-action="prev-step" ${isFirst ? "disabled" : ""}>${UI_ICONS.prev} Trước</button>
        <button class="btn btn-primary" type="button" data-action="next-step" ${isLast ? "disabled" : ""}>Tiếp ${UI_ICONS.next}</button>
      </div>
      <div class="kbd-hints">
        <span><kbd>←</kbd><kbd>→</kbd> chuyển bước</span>
        <span><kbd>Space</kbd> phát</span>
        <span><kbd>R</kbd> lại</span>
      </div>`;
  }

  function anchorPoint(node, dx, dy) {
    const cx = node.x + node.w / 2;
    const cy = node.y + node.h / 2;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return { x: dx >= 0 ? node.x + node.w : node.x, y: cy };
    }
    return { x: cx, y: dy >= 0 ? node.y + node.h : node.y };
  }

  function edgeGeometry(edge, nodeById) {
    const a = nodeById[edge.from];
    const b = nodeById[edge.to];
    if (!a || !b) return null;
    const acx = a.x + a.w / 2;
    const acy = a.y + a.h / 2;
    const bcx = b.x + b.w / 2;
    const bcy = b.y + b.h / 2;
    const p1 = anchorPoint(a, bcx - acx, bcy - acy);
    const p2 = anchorPoint(b, acx - bcx, acy - bcy);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    let path = "";
    let mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    if (edge.bow) {
      const nx = -dy / len;
      const ny = dx / len;
      const cx = mid.x + nx * edge.bow;
      const cy = mid.y + ny * edge.bow;
      path = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      mid = {
        x: 0.25 * p1.x + 0.5 * cx + 0.25 * p2.x,
        y: 0.25 * p1.y + 0.5 * cy + 0.25 * p2.y
      };
    } else {
      path = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const labelPos = {
      x: mid.x + (horizontal ? 0 : 10),
      y: mid.y + (horizontal ? -8 : 0)
    };
    return { path, labelPos, p1, p2 };
  }

  function renderDiagram(lesson) {
    const nodeById = {};
    lesson.nodes.forEach((n) => { nodeById[n.id] = n; });
    const types = Array.from(new Set(lesson.nodes.map((n) => n.type)));
    const symbols = types.map((type) => `
      <symbol id="i-${type}" viewBox="0 0 20 20">
        <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          ${ICON_PATHS[type] || ICON_PATHS.server}
        </g>
      </symbol>`).join("");
    const paths = {};

    const edgeMarkup = lesson.edges.map((edge) => {
      const geo = edgeGeometry(edge, nodeById);
      if (!geo) return "";
      paths[edge.id] = geo.path;
      const label = edge.label
        ? (() => {
            const width = Math.max(28, edge.label.length * 4.9 + 9);
            const x = geo.labelPos.x - width / 2;
            const y = geo.labelPos.y - 9;
            return `
              <g class="d-edge-label-g">
                <rect class="d-edge-label-bg" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="13" rx="3.5"/>
                <text class="d-edge-label" x="${geo.labelPos.x.toFixed(1)}" y="${(geo.labelPos.y + 1.5).toFixed(1)}" text-anchor="middle">${esc(edge.label)}</text>
              </g>`;
          })()
        : "";
      const kindClass = edge.kind === "response" ? " is-response" : edge.kind === "data" ? " is-data" : "";
      return `<g data-edge-group="${edge.id}"><path class="d-edge${kindClass}" data-edge="${edge.id}" d="${geo.path}" marker-end="url(#d-arrow)"/>${label}</g>`;
    }).join("");

    const nodeMarkup = lesson.nodes.map((node) => {
      const tone = nodeToneVars(node.type);
      const iy = (node.h - 32) / 2;
      return `
        <g class="d-node" data-node="${node.id}" transform="translate(${node.x},${node.y})" style="${tone}">
          <title>${esc(node.label)} — ${esc(node.sub)}</title>
          <rect class="node-bg" width="${node.w}" height="${node.h}" rx="12"/>
          <rect class="node-accent" x="0" y="12" width="3" height="${node.h - 24}" rx="1.5"/>
          <rect class="node-icon-wrap" x="12" y="${iy.toFixed(1)}" width="32" height="32" rx="9"/>
          <use class="node-icon" href="#i-${node.type}" x="20" y="${(iy + 8).toFixed(1)}" width="16" height="16"/>
          <text class="node-label" x="54" y="${(node.h / 2 - 3).toFixed(1)}">${esc(node.label)}</text>
          <text class="node-sub" x="54" y="${(node.h / 2 + 11).toFixed(1)}">${esc(node.sub)}</text>
        </g>`;
    }).join("");

    state.diagram = { paths, nodeById };

    return `
      <svg class="diagram" viewBox="0 0 900 500" role="img" aria-label="Sơ đồ dữ liệu cho bài ${esc(lesson.title)}">
        <title>${esc(lesson.title)} — sơ đồ tương tác</title>
        <desc>Các bảng, khóa và luồng dữ liệu được làm nổi bật theo từng bước.</desc>
        <defs>
          ${symbols}
          <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#2f6bff" flood-opacity=".32"/>
          </filter>
          <marker id="d-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 1 9 5 0 9Z" style="fill:var(--diagram-edge)"/>
          </marker>
          <marker id="d-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 1 9 5 0 9Z" style="fill:var(--blue)"/>
          </marker>
        </defs>
        <g class="d-edges">${edgeMarkup}</g>
        <g class="d-nodes">${nodeMarkup}</g>
        <g id="packetLayer"></g>
      </svg>`;
  }

  function renderPackets(edgeIds) {
    const layer = $("#packetLayer");
    if (!layer || !state.diagram) return;
    layer.textContent = "";
    const ids = edgeIds.slice(0, 12);
    ids.forEach((id, i) => {
      const path = state.diagram.paths[id];
      if (!path) return;
      const circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("r", "3.4");
      circle.setAttribute("class", "d-packet");
      const anim = document.createElementNS(SVGNS, "animateMotion");
      anim.setAttribute("dur", `${(1.5 + (i % 4) * 0.28).toFixed(2)}s`);
      anim.setAttribute("repeatCount", "indefinite");
      anim.setAttribute("path", path);
      anim.setAttribute("begin", `-${(i * 0.33).toFixed(2)}s`);
      anim.setAttribute("calcMode", "spline");
      anim.setAttribute("keySplines", "0.4 0 0.2 1");
      anim.setAttribute("keyTimes", "0;1");
      circle.appendChild(anim);
      layer.appendChild(circle);
    });
  }

  function applyStep(lesson, index, opts) {
    const step = lesson.steps[index - 1];
    if (!step) return;
    const options = opts || {};
    const focus = step.focus === "all" ? lesson.nodes.map((n) => n.id) : (step.focus || []);
    const activeEdges = step.edges === "all" ? lesson.edges.map((e) => e.id) : (step.edges || []);
    const warn = step.warn || [];

    $$(".d-node", view).forEach((el) => {
      const id = el.dataset.node;
      const active = focus.includes(id);
      const isWarn = warn.includes(id);
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-warn", isWarn);
      el.classList.toggle("is-dim", !active && !isWarn && focus.length > 0);
    });

    $$(".d-edge", view).forEach((el) => {
      const id = el.dataset.edge;
      const active = activeEdges.includes(id);
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-dim", activeEdges.length > 0 && !active);
      el.setAttribute("marker-end", active ? "url(#d-arrow-active)" : "url(#d-arrow)");
    });

    renderPackets(activeEdges);

    const panel = $("#stepPanel");
    if (panel) {
      panel.innerHTML = stepPanelHTML(lesson, index);
      const scroll = $(".step-panel-scroll", panel);
      if (scroll) scroll.scrollTop = 0;
    }

    const strip = $("#metricStrip");
    if (strip) {
      strip.innerHTML = metricStripHTML(lesson, step);
      $$(".metric", strip).forEach((el) => {
        el.classList.add("is-pulse");
        setTimeout(() => el.classList.remove("is-pulse"), 650);
      });
    }

    $$(".tl-step", view).forEach((el, i) => {
      el.classList.toggle("is-active", i === index - 1);
      el.classList.toggle("is-done", i < index - 1);
    });

    state.lesson.step = index;
    state.lesson.id = lesson.id;
    updatePlayerUI(lesson, index);

    if (state.diagram && options.updateHash !== false) {
      try { history.replaceState(null, "", `#/learn/${lesson.id}/${index}`); } catch (err) { /* ignore */ }
    }
    if (!options.initial) {
      try { localStorage.setItem(LAST_KEY, lesson.id); } catch (err) { /* ignore */ }
    }

    const previous = state.progress[lesson.id] || 0;
    if (index > previous) {
      state.progress[lesson.id] = index;
      saveProgress();
      updateChrome();
    }

    if (state.lesson.playing && index >= lesson.steps.length) {
      stopPlayer();
    }
  }

  function updatePlayerUI(lesson, index) {
    const fill = $("#playerFill");
    if (fill) fill.style.width = `${(index / lesson.steps.length) * 100}%`;
    const stepText = $("#playerStepText");
    if (stepText) stepText.textContent = `Bước ${index}/${lesson.steps.length}`;
    const pct = $("#playerPct");
    if (pct) pct.textContent = `${Math.round((index / lesson.steps.length) * 100)}%`;
    const playBtn = $("#playBtn");
    if (playBtn) {
      playBtn.innerHTML = state.lesson.playing ? UI_ICONS.pause : UI_ICONS.play;
      playBtn.setAttribute("aria-label", state.lesson.playing ? "Tạm dừng phát tự động" : "Phát tự động các bước");
    }
    const speedBtn = $(".speed-btn", view);
    if (speedBtn) speedBtn.textContent = `${state.lesson.speed}×`;
  }

  function goToStep(index) {
    if (!state.lesson.id) return false;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return false;
    const target = clamp(index, 1, lesson.steps.length);
    applyStep(lesson, target, { updateHash: true });
    if (state.lesson.playing) {
      if (target >= lesson.steps.length) {
        stopPlayer();
      } else {
        restartAutoTimer();
      }
    }
    return true;
  }

  function restartAutoTimer() {
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    if (!state.lesson.playing) return;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    state.lesson.timer = setInterval(() => {
      if (!state.lesson.playing) return;
      const current = state.lesson.step;
      if (current < lesson.steps.length) {
        goToStep(current + 1);
      } else {
        stopPlayer();
      }
    }, AUTO_MS / state.lesson.speed);
  }

  function setPlaying(playing) {
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    if (playing && state.lesson.step >= lesson.steps.length) {
      applyStep(lesson, 1, { updateHash: true });
    }
    state.lesson.playing = Boolean(playing);
    if (state.lesson.playing) restartAutoTimer();
    else {
      clearInterval(state.lesson.timer);
      state.lesson.timer = null;
    }
    updatePlayerUI(lesson, state.lesson.step);
  }

  function togglePlayer() {
    if (state.route.view !== "learn") return;
    setPlaying(!state.lesson.playing);
  }

  function stopPlayer() {
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    state.lesson.playing = false;
    const lesson = lessonById[state.lesson.id];
    if (lesson && state.route.view === "learn" && $("#playBtn")) {
      updatePlayerUI(lesson, state.lesson.step);
    }
  }

  function replayLesson() {
    if (state.route.view !== "learn") return;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    state.lesson.playing = false;
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    applyStep(lesson, 1, { updateHash: true });
    setPlaying(true);
  }

  function cycleSpeed() {
    const speeds = [1, 1.5, 2];
    const idx = speeds.indexOf(state.lesson.speed);
    state.lesson.speed = speeds[(idx + 1) % speeds.length];
    const lesson = lessonById[state.lesson.id];
    if (lesson) updatePlayerUI(lesson, state.lesson.step);
    if (state.lesson.playing) restartAutoTimer();
  }

  function toggleFullscreen() {
    const card = $("#stageCard");
    if (!card) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (card.requestFullscreen) {
      card.requestFullscreen().catch(() => toast("Trình duyệt không cho phép toàn màn hình ở chế độ này."));
    } else {
      toast("Trình duyệt không hỗ trợ toàn màn hình.");
    }
  }

  /* ----------------------------------------------------------
     Practice engine
     ---------------------------------------------------------- */
  const PRACTICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

  function initPractice() {
    const order = DB.practice.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    state.practice = { order, index: 0, selected: null, answered: false, results: [] };
  }

  function renderPractice() {
    if (!state.practice) initPractice();
    document.title = "Luyện tập — DBLab";
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Luyện tập</div>
            <h1>Tình huống thực tế</h1>
            <p>${DB.practice.length} tình huống thực tế về truy vấn sai, khóa ngoại, index và giao dịch. Chọn thay đổi có tác động lớn nhất trước khi xem lời giải thích.</p>
          </div>
          <div class="mode-head-right">
            <button class="btn btn-ghost" type="button" data-action="restart-practice">Làm lại</button>
            <a class="btn btn-primary" href="#/learn">Vào bài học</a>
          </div>
        </div>
        <div class="practice-layout">
          <div id="practiceCard"></div>
          <aside class="practice-side" id="practiceSide"></aside>
        </div>
      </div>`;
    renderPracticeCard();
    renderPracticeSide();
  }

  function renderPracticeCard() {
    const wrap = $("#practiceCard");
    const p = state.practice;
    if (!wrap || !p) return;
    const total = p.order.length;
    if (p.index >= total) {
      const correct = p.results.filter(Boolean).length;
      const pct = Math.round((correct / total) * 100);
      const message = pct >= 80
        ? "Bạn đọc tình huống rất tốt. Thử SQL Workbench hoặc mở lại bài tương ứng để đào sâu."
        : pct >= 50
          ? "Nền tảng đã vững. Xem lại các tình huống sai và chú ý chỉ số nào đang báo đỏ."
          : "Hãy mở lại các bài liên quan tới tình huống sai, rồi thử lại lượt luyện này.";
      wrap.innerHTML = `
        <div class="scenario-card practice-result">
          <div class="result-ring" style="--score:${pct}"><b>${pct}%</b></div>
          <h2>Hoàn thành lượt luyện</h2>
          <p>Bạn trả lời đúng <strong>${correct}/${total}</strong> tình huống. ${message}</p>
          <div class="result-actions">
            <button class="btn btn-primary" type="button" data-action="restart-practice">Làm lại</button>
            <a class="btn btn-ghost" href="#/lab">Mở SQL Workbench</a>
          </div>
        </div>`;
      return;
    }

    const q = DB.practice[p.order[p.index]];
    const feedback = p.answered
      ? (() => {
          const correct = p.selected === q.correct;
          const isLast = p.index === total - 1;
          return `
            <div class="feedback ${correct ? "is-good" : "is-bad"}" id="practiceFeedback" tabindex="-1">
              <div class="feedback-head">${correct ? UI_ICONS.check : iconMarkup("info")} ${correct ? "Chính xác" : "Chưa đúng"}</div>
              <p>${q.explain}</p>
              <div class="feedback-actions">
                <button class="btn btn-primary btn-sm" type="button" data-action="next-question">
                  ${isLast ? "Xem kết quả" : `Tình huống tiếp ${UI_ICONS.arrow}`}
                </button>
              </div>
            </div>`;
        })()
      : "";

    wrap.innerHTML = `
      <div class="scenario-card">
        <div class="scenario-top">
          <span class="scenario-num">TÌNH HUỐNG ${String(p.index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
          <span class="pill pill-blue">${esc(q.tag)}</span>
        </div>
        <div class="scenario-body">
          <h2>${esc(q.title)}</h2>
          <p class="scenario-text">${esc(q.scenario)}</p>
          <div class="metric-chips">
            ${q.metrics.map((m) => `<div class="metric-chip${m.danger ? " danger" : ""}"><span>${esc(m.label)}</span><b>${esc(m.value)}</b></div>`).join("")}
          </div>
          <div class="options">
            ${q.options.map((option, i) => {
              let cls = "";
              if (p.answered) {
                if (i === q.correct) cls = " is-correct";
                else if (i === p.selected) cls = " is-wrong";
              }
              return `
                <button class="option-btn${cls}" type="button" data-action="answer" data-option="${i}" ${p.answered ? "disabled" : ""}>
                  <span class="option-letter">${PRACTICE_LETTERS[i]}</span>
                  <span>${esc(option)}</span>
                </button>`;
            }).join("")}
          </div>
          ${feedback}
        </div>
      </div>`;
    if (p.answered) {
      const f = $("#practiceFeedback");
      if (f) f.focus({ preventScroll: true });
    }
  }

  function renderPracticeSide() {
    const wrap = $("#practiceSide");
    const p = state.practice;
    if (!wrap || !p) return;
    const total = p.order.length;
    const correct = p.results.filter(Boolean).length;
    const answeredCount = p.results.filter((v) => v !== undefined).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const current = Math.min(p.index, total - 1);
    wrap.innerHTML = `
      <div class="side-card">
        <h3>Điểm của bạn</h3>
        <div class="score-big">${correct}<small> / ${total}</small></div>
        <div class="score-bar"><span style="width:${pct}%"></span></div>
        <p class="score-note">${answeredCount} tình huống đã trả lời · ${pct}% chính xác</p>
      </div>
      <div class="side-card">
        <h3>Tiến độ lượt luyện</h3>
        <div class="practice-progress">
          ${p.order.map((_, i) => {
            const done = i < p.results.length;
            const isCurrent = i === current && p.index < total;
            return `<span class="pp-dot${done ? " is-done" : ""}${isCurrent ? " is-current" : ""}" title="Tình huống ${i + 1}"></span>`;
          }).join("")}
        </div>
        <p class="score-note">Mỗi câu chỉ có một lựa chọn tối ưu theo bối cảnh.</p>
      </div>
      <div class="side-card">
        <h3>Cách luyện hiệu quả</h3>
        <p class="score-note">Đọc đề bài trước, xác định đúng bảng và khóa nối, rồi mới chọn câu lệnh. Đừng đoán theo tên hàm nghe quen.</p>
        <a class="btn btn-ghost btn-sm" style="margin-top:11px" href="#/cheatsheets/syntax">Mở cú pháp SQL</a>
      </div>`;
  }

  function answerPractice(option) {
    const p = state.practice;
    if (!p || p.answered || p.index >= p.order.length) return;
    const q = DB.practice[p.order[p.index]];
    if (option < 0 || option >= q.options.length) return;
    p.selected = option;
    p.answered = true;
    p.results[p.index] = option === q.correct;
    renderPracticeCard();
    renderPracticeSide();
  }

  function nextPracticeQuestion() {
    const p = state.practice;
    if (!p || !p.answered) return;
    if (p.index < p.order.length - 1) {
      p.index += 1;
      p.selected = null;
      p.answered = false;
    } else {
      p.index = p.order.length;
    }
    renderPracticeCard();
    renderPracticeSide();
    const card = $(".scenario-card", view);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function restartPractice() {
    initPractice();
    renderPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Đã bắt đầu lượt luyện mới.");
  }

  /* ----------------------------------------------------------
     SQL Workbench
     ---------------------------------------------------------- */
  function initLab() {
    if (state.lab) return;
    state.lab = {
      db: window.DBEngine.createDatabase(window.DB_SEED),
      mission: 0,
      completed: loadMissions(),
      attempts: 0,
      showHint: false,
      lastResult: null
    };
  }

  function loadMissions() {
    try {
      const raw = localStorage.getItem(MISSIONS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function saveMissions() {
    try { localStorage.setItem(MISSIONS_KEY, JSON.stringify(state.lab.completed)); } catch (err) { /* ignore */ }
  }

  function schemaHTML() {
    if (!state.lab) return "";
    const db = state.lab.db;
    return db.order.map((name) => {
      const table = db.tables[name];
      const cols = table.columns.map((col) => {
        const flag = col.pk ? '<span class="db-flag pk">PK</span>' : col.fk ? '<span class="db-flag fk">FK</span>' : "";
        return `<button class="db-col" type="button" data-action="db-insert" data-text="${esc(col.name)}" title="Chèn ${esc(col.name)}">${flag}<span>${esc(col.name)}</span><small>${esc(col.type)}</small></button>`;
      }).join("");
      return `
        <div class="db-table-item">
          <button class="db-table-name" type="button" data-action="db-table" data-table="${esc(name)}" title="Xem toàn bộ ${esc(table.label)}">
            ${iconMarkup("table")} ${esc(name)} <span>${table.rows.length} dòng</span>
          </button>
          <ul class="db-col-list">${cols}</ul>
        </div>`;
    }).join("");
  }

  function examplesHTML() {
    return window.DB_SEED.examples.map((ex) => `
      <button class="db-example" type="button" data-action="db-example" data-example="${esc(ex.id)}">${esc(ex.label)}</button>`).join("");
  }

  function missionsListHTML() {
    const completed = state.lab.completed;
    return window.DB_SEED.missions.map((m, i) => {
      const done = Boolean(completed[m.id]);
      const active = i === state.lab.mission;
      return `
        <button class="db-mission${done ? " is-done" : ""}${active ? " is-active" : ""}" type="button" data-action="db-mission" data-mission="${i}">
          <span class="db-mission-dot">✓</span>
          <span>
            <span class="db-mission-title">${esc(m.title)}</span>
            <span class="db-mission-meta">${done ? "Đã hoàn thành" : "Chưa kiểm tra"}</span>
          </span>
        </button>`;
    }).join("");
  }

  function missionPanelHTML() {
    const missions = window.DB_SEED.missions;
    const m = missions[state.lab.mission];
    if (!m) return "";
    const done = Boolean(state.lab.completed[m.id]);
    return `
      <div class="db-panel-head">
        <span>Nhiệm vụ ${String(state.lab.mission + 1).padStart(2, "0")} / ${String(missions.length).padStart(2, "0")}</span>
        <span>${done ? "đã xong" : "chưa xong"}</span>
      </div>
      <div class="db-mission-body">
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.prompt)}</p>
        <div class="db-mission-foot">
          <button class="db-run" type="button" data-action="db-check">${UI_ICONS.play} Chạy &amp; kiểm tra</button>
          <button class="db-ghost" type="button" data-action="db-hint">${state.lab.showHint ? "Ẩn gợi ý" : "Gợi ý"}</button>
          <span class="db-status" id="dbCheckStatus"></span>
        </div>
        ${state.lab.showHint ? `<div class="db-mission-hint">${esc(m.hint)}</div>` : ""}
        <div id="dbCheckMsg"></div>
      </div>`;
  }

  function missionProgressHTML() {
    const total = window.DB_SEED.missions.length;
    const done = window.DB_SEED.missions.filter((m) => state.lab.completed[m.id]).length;
    return `
      <div class="db-progress-line">
        <span>${done}/${total} nhiệm vụ</span>
        <span class="bar"><span style="width:${(done / total) * 100}%"></span></span>
        <span>${done === total ? "Hoàn tất" : "Tiếp tục"}</span>
      </div>`;
  }

  function updateMissionUI() {
    const list = $("#dbMissionList");
    if (list) list.innerHTML = missionsListHTML();
    const panel = $("#dbMissionPanel");
    if (panel) panel.innerHTML = missionPanelHTML();
    const prog = $("#dbMissionProgress");
    if (prog) prog.innerHTML = missionProgressHTML();
  }

  function renderLab() {
    initLab();
    document.title = "SQL Workbench — DBLab";
    const db = state.lab.db;
    const totalRows = db.order.reduce((sum, name) => sum + db.tables[name].rows.length, 0);
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>SQL Workbench</div>
            <h1>Viết truy vấn, chạy thật</h1>
            <p>Dữ liệu mẫu ${db.order.length} bảng · ${totalRows} dòng. Chạy SELECT ngay trong trình duyệt, kiểm tra kết quả với 6 nhiệm vụ.</p>
          </div>
          <div class="mode-head-right">
            <button class="btn btn-ghost" type="button" data-action="db-reset">Nạp lại dữ liệu</button>
            <a class="btn btn-primary" href="#/learn">Học lý thuyết</a>
          </div>
        </div>
        <div class="db-workbench">
          <aside class="db-side">
            <div class="db-panel">
              <div class="db-panel-head"><span>Lược đồ dữ liệu</span><span>${db.order.length} bảng</span></div>
              <div class="db-schema" id="dbSchema">${schemaHTML()}</div>
            </div>
            <div class="db-panel">
              <div class="db-panel-head"><span>Ví dụ nhanh</span></div>
              <div class="db-examples">${examplesHTML()}</div>
            </div>
          </aside>
          <div class="db-main">
            <div class="db-editor-card">
              <div class="db-editor-bar">
                <span class="db-dot r"></span><span class="db-dot y"></span><span class="db-dot g"></span>
                <span class="db-editor-file">query.sql</span>
                <span class="db-kbd">⌘/Ctrl + Enter để chạy</span>
              </div>
              <textarea class="db-editor" id="dbEditor" spellcheck="false" aria-label="Trình soạn SQL">SELECT * FROM sinhvien LIMIT 5;</textarea>
              <div class="db-actions">
                <button class="db-run" type="button" data-action="db-run">${UI_ICONS.play} Chạy</button>
                <button class="db-ghost" type="button" data-action="db-clear">Xóa</button>
                <span class="db-status" id="dbStatus">Sẵn sàng</span>
              </div>
            </div>
            <div class="db-result-card">
              <div class="db-result-head"><span>Kết quả</span><b id="dbResultMeta">chưa chạy</b></div>
              <div class="db-result-body" id="dbResultBody">
                <div class="db-placeholder">Bấm <b>Chạy</b> hoặc chọn một ví dụ để xem dữ liệu.</div>
              </div>
            </div>
            <div class="db-panel">
              <div class="db-panel-head"><span>Nhiệm vụ</span><span id="dbMissionCount">${window.DB_SEED.missions.length} bài</span></div>
              <div class="db-missions" id="dbMissionList">${missionsListHTML()}</div>
              <div id="dbMissionProgress">${missionProgressHTML()}</div>
            </div>
            <div class="db-mission-panel" id="dbMissionPanel">${missionPanelHTML()}</div>
          </div>
        </div>
      </div>`;

    runEditor();
  }

  function formatCell(value) {
    if (value === null || value === undefined) return '<span class="db-null">NULL</span>';
    if (typeof value === "number") {
      const text = Number.isInteger(value) ? String(value) : value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
      return `<span class="db-num">${esc(text)}</span>`;
    }
    return esc(value);
  }

  function resultTableHTML(result) {
    if (!result.rows.length) {
      return `<div class="db-placeholder">Truy vấn chạy thành công nhưng không trả về dòng nào.</div>`;
    }
    const shown = result.rows.slice(0, 200);
    const more = result.rows.length > shown.length
      ? `<div class="db-ok-note">Chỉ hiển thị 200 / ${result.rows.length} dòng.</div>` : "";
    return `
      <table class="db-table">
        <thead><tr>${result.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${shown.map((row) => `<tr>${row.map((v) => `<td>${formatCell(v)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>${more}`;
  }

  function errorHTML(err, sql) {
    const loc = window.DBEngine.errorLocation(sql, err.pos);
    return `<div class="db-error">${esc(err.message)}${loc ? `<small>Dòng ${loc.line}, cột ${loc.col}</small>` : ""}</div>`;
  }

  function currentSql() {
    const ed = $("#dbEditor");
    return ed ? ed.value.trim() : "";
  }

  function runEditor(opts) {
    if (!state.lab) return null;
    const options = opts || {};
    const sql = currentSql();
    const body = $("#dbResultBody");
    const meta = $("#dbResultMeta");
    const status = $("#dbStatus");
    if (!sql) {
      if (body) body.innerHTML = '<div class="db-placeholder">Hãy viết một câu SELECT trước khi chạy.</div>';
      if (meta) meta.textContent = "trống";
      if (status) { status.className = "db-status err"; status.textContent = "Chưa có truy vấn"; }
      return null;
    }
    try {
      const result = window.DBEngine.run(sql, state.lab.db);
      state.lab.lastResult = result;
      if (body) body.innerHTML = resultTableHTML(result);
      if (meta) meta.textContent = `${result.rows.length} dòng · ${result.elapsed.toFixed(1)} ms`;
      if (status) {
        status.className = "db-status ok";
        status.textContent = `${result.rows.length} dòng`;
      }
      if (options.check) checkMission(result, sql);
      return result;
    } catch (err) {
      if (body) body.innerHTML = errorHTML(err, sql);
      if (meta) meta.textContent = "lỗi";
      if (status) { status.className = "db-status err"; status.textContent = "Có lỗi"; }
      if (options.check) {
        const msg = $("#dbCheckMsg");
        if (msg) msg.innerHTML = `<div class="db-check-msg bad">Truy vấn chưa chạy được. Đọc thông báo lỗi ở khung kết quả rồi sửa cú pháp.</div>`;
      }
      return null;
    }
  }

  function checkMission(userResult, sql) {
    const missions = window.DB_SEED.missions;
    const m = missions[state.lab.mission];
    if (!m) return;
    let expected;
    try {
      expected = window.DBEngine.run(m.sql, window.DBEngine.createDatabase(window.DB_SEED));
    } catch (err) {
      toast("Nhiệm vụ đang lỗi cấu hình, báo lại giúp mình.");
      return;
    }
    state.lab.attempts += 1;
    const labelsMatch = userResult.columns.length === expected.columns.length
      && userResult.columns.every((c, i) => c.toLowerCase() === expected.columns[i].toLowerCase());
    const rowsMatch = window.DBEngine.sameResult(userResult, expected, true);
    const rowsMatchAnyOrder = window.DBEngine.sameResult(userResult, expected, false);

    if (labelsMatch && rowsMatch) {
      state.lab.completed[m.id] = true;
      saveMissions();
      updateMissionUI();
      const msg = $("#dbCheckMsg");
      const status = $("#dbCheckStatus");
      if (msg) msg.innerHTML = `<div class="db-check-msg ok">Chính xác. Kết quả khớp cả tên cột, thứ tự dòng và giá trị.</div>`;
      if (status) { status.className = "db-status ok"; status.textContent = "Đạt"; }
      toast("Đã hoàn thành nhiệm vụ: " + m.title);
      return;
    }

    let reason;
    if (!labelsMatch) {
      reason = `Tên cột chưa đúng. Cần: <b>${expected.columns.map(esc).join(", ")}</b>. Đặt bí danh bằng <code>AS</code> khi đề bài yêu cầu.`;
    } else if (rowsMatchAnyOrder) {
      reason = "Các dòng đúng nhưng thứ tự chưa đúng. Kiểm tra mệnh đề ORDER BY.";
    } else if (userResult.rows.length !== expected.rows.length) {
      reason = `Số dòng chưa khớp: bài cần ${expected.rows.length} dòng, truy vấn trả ${userResult.rows.length} dòng. Xem lại WHERE/JOIN/GROUP BY.`;
    } else {
      reason = "Giá trị trong bảng chưa khớp hoàn toàn. So sánh cột với đề bài và kiểm tra điều kiện lọc.";
    }
    if (state.lab.attempts >= 2 && !state.lab.showHint) {
      state.lab.showHint = true;
      updateMissionUI();
    }
    const msg = $("#dbCheckMsg");
    const status = $("#dbCheckStatus");
    if (msg) {
      const hint = state.lab.attempts >= 2 ? `<br><small>Gợi ý: ${esc(m.hint)}</small>` : "";
      msg.innerHTML = `<div class="db-check-msg bad">Chưa đạt. ${reason}${hint}</div>`;
    }
    if (status) { status.className = "db-status err"; status.textContent = `Sai · lần ${state.lab.attempts}`; }
  }

  function insertIntoEditor(text) {
    const ed = $("#dbEditor");
    if (!ed) return;
    const start = ed.selectionStart == null ? ed.value.length : ed.selectionStart;
    const end = ed.selectionEnd == null ? ed.value.length : ed.selectionEnd;
    const before = ed.value.slice(0, start);
    const after = ed.value.slice(end);
    const pad = before && !/\s$/.test(before) ? " " : "";
    ed.value = before + pad + text + after;
    const pos = start + pad.length + text.length;
    ed.focus();
    ed.setSelectionRange(pos, pos);
  }

  function applyDbExample(id) {
    const ex = window.DB_SEED.examples.find((e) => e.id === id);
    if (!ex) return;
    const ed = $("#dbEditor");
    if (ed) ed.value = ex.sql;
    runEditor();
  }

  function resetDb() {
    if (!state.lab) return;
    state.lab.db = window.DBEngine.createDatabase(window.DB_SEED);
    state.lab.lastResult = null;
    state.lab.attempts = 0;
    const body = $("#dbResultBody");
    if (body) body.innerHTML = '<div class="db-placeholder">Dữ liệu đã về trạng thái ban đầu. Bấm Chạy để truy vấn.</div>';
    const meta = $("#dbResultMeta");
    if (meta) meta.textContent = "chưa chạy";
    const status = $("#dbStatus");
    if (status) { status.className = "db-status"; status.textContent = "Đã nạp lại dữ liệu"; }
    toast("Đã nạp lại dữ liệu mẫu.");
  }

  function showTable(name) {
    const ed = $("#dbEditor");
    if (!ed) return;
    ed.value = `SELECT * FROM ${name} LIMIT 10;`;
    runEditor();
  }

  /* ----------------------------------------------------------
     Cheatsheets
     ---------------------------------------------------------- */
  function renderCheatsheets() {
    const sections = DB.cheatsheets;
    const active = sections.find((s) => s.id === state.cheat.section) || sections[0];
    state.cheat.section = active.id;
    document.title = "Cheatsheets — DBLab";
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Cheatsheets</div>
            <h1>Tra nhanh khi thiết kế</h1>
            <p>Mẫu câu SQL, danh sách kiểm tra thiết kế và quy trình vận hành để tra nhanh khi làm bài.</p>
          </div>
          <div class="mode-head-right">
            <a class="btn btn-ghost" href="#/learn">Vào bài học</a>
            <a class="btn btn-primary" href="#/lab">Mở SQL Workbench</a>
          </div>
        </div>
        <div class="cheat-layout">
          <nav class="cheat-tabs" aria-label="Các mục cheatsheet">
            ${sections.map((s) => `<a class="cheat-tab${s.id === active.id ? " is-active" : ""}" href="#/cheatsheets/${s.id}"><span class="cheat-tab-num">${s.num}</span><span>${esc(s.title)}</span></a>`).join("")}
          </nav>
          <div class="cheat-content">
            <div class="cheat-search">
              ${UI_ICONS.search}
              <input id="cheatSearch" type="search" placeholder="Tìm trong mục này..." value="${esc(state.cheat.query)}" aria-label="Tìm trong cheatsheet">
            </div>
            <div id="cheatContent">${cheatContentHTML(active)}</div>
          </div>
        </div>
      </div>`;
  }

  function cheatContentHTML(section) {
    const query = state.cheat.query.trim().toLowerCase();
    const cards = section.cards.filter((card) => {
      if (!query) return true;
      return `${card.title} ${stripHTML(card.html)}`.toLowerCase().includes(query);
    });
    const intro = `
      <div class="cheat-intro">
        <h2>${esc(section.title)}</h2>
        <p>${esc(section.intro)}</p>
        ${query ? `<p style="margin-top:6px;font-size:.68rem;color:var(--text-faint)">${cards.length} kết quả cho “${esc(state.cheat.query.trim())}”.</p>` : ""}
      </div>`;
    if (!cards.length) {
      return `${intro}<div class="no-results">Không tìm thấy nội dung phù hợp. <button class="btn btn-ghost btn-sm" type="button" data-action="clear-cheat-search" style="margin-left:6px">Xóa tìm kiếm</button></div>`;
    }
    return `${intro}<div class="cheat-grid">${cards.map((card, i) => `
      <article class="cheat-card${card.wide ? " wide" : ""}">
        <h3><span class="num">${section.num}.${String(i + 1).padStart(2, "0")}</span>${esc(card.title)}</h3>
        ${card.html}
      </article>`).join("")}</div>`;
  }

  function renderCheatContent() {
    const content = $("#cheatContent");
    const section = DB.cheatsheets.find((s) => s.id === state.cheat.section) || DB.cheatsheets[0];
    if (!content || !section) return;
    content.innerHTML = cheatContentHTML(section);
  }

  function handleViewClick(e) {
    const stepBtn = e.target.closest("[data-step]");
    if (stepBtn && state.route.view === "learn" && !e.target.closest("[data-action]")) {
      const target = parseInt(stepBtn.dataset.step, 10);
      if (target) goToStep(target);
      return;
    }
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === "fullscreen") toggleFullscreen();
    else if (action === "toggle-play") togglePlayer();
    else if (action === "replay") replayLesson();
    else if (action === "prev-step") goToStep(state.lesson.step - 1);
    else if (action === "next-step") goToStep(state.lesson.step + 1);
    else if (action === "cycle-speed") cycleSpeed();
    else if (action === "restart-practice") restartPractice();
    else if (action === "answer") answerPractice(parseInt(btn.dataset.option, 10));
    else if (action === "next-question") nextPracticeQuestion();
    else if (action === "clear-cheat-search") {
      state.cheat.query = "";
      const input = $("#cheatSearch");
      if (input) input.value = "";
      renderCheatContent();
      if (input) input.focus();
    } else if (action === "db-run") {
      runEditor();
    } else if (action === "db-check") {
      runEditor({ check: true });
    } else if (action === "db-clear") {
      const ed = $("#dbEditor");
      if (ed) { ed.value = ""; ed.focus(); }
    } else if (action === "db-reset") {
      resetDb();
    } else if (action === "db-example") {
      applyDbExample(btn.dataset.example);
    } else if (action === "db-table") {
      showTable(btn.dataset.table);
    } else if (action === "db-insert") {
      insertIntoEditor(btn.dataset.text);
    } else if (action === "db-mission") {
      state.lab.mission = parseInt(btn.dataset.mission, 10) || 0;
      state.lab.attempts = 0;
      state.lab.showHint = false;
      updateMissionUI();
    } else if (action === "db-hint") {
      state.lab.showHint = !state.lab.showHint;
      updateMissionUI();
    }
  }

  function handleViewInput(e) {
    if (e.target.id === "cheatSearch") {
      state.cheat.query = e.target.value;
      renderCheatContent();
    }
  }

  function handleViewChange() {
    /* không còn điều khiển dạng range */
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  function init() {
    initTheme();
    buildSearchIndex();
    bindGlobalEvents();
    updateChrome();
    syncTopbarOffset();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncTopbarOffset);
    onRoute();
  }

  init();
})();
