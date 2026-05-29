/* ════════════════════════════════════════════
   FASCIAS E-LEARNING — INTERACTIONS
   ════════════════════════════════════════════ */
(function () {
  const STORAGE_KEY = 'fascia-elearning-progress';

  /* ── State persistence ── */
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveState(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

  const state = loadState();
  if (!state.lessons) state.lessons = {};   // { lessonId: 'done' }
  if (!state.modules) state.modules = {};   // { moduleId: percent }

  /* ── Accordion lessons ── */
  document.querySelectorAll('.lesson').forEach(lesson => {
    const header = lesson.querySelector('.lesson-header');
    const toggle = lesson.querySelector('.lesson-toggle');
    const id = lesson.dataset.lesson;

    // Restore read state
    const readMark = lesson.querySelector('.read-mark');
    if (readMark && state.lessons[id] === 'done') readMark.classList.add('done');

    header.addEventListener('click', (e) => {
      // Don't toggle if clicking read-mark
      if (e.target.closest('.read-mark')) return;
      lesson.classList.toggle('open');
    });

    if (readMark) {
      readMark.addEventListener('click', (e) => {
        e.stopPropagation();
        readMark.classList.toggle('done');
        state.lessons[id] = readMark.classList.contains('done') ? 'done' : null;
        saveState(state);
        updateProgress();
      });
    }
  });

  /* ── Progress bar ── */
  function updateProgress() {
    const lessons = document.querySelectorAll('.lesson');
    if (!lessons.length) return;
    const done = document.querySelectorAll('.lesson .read-mark.done').length;
    const pct = Math.round((done / lessons.length) * 100);
    const fill = document.querySelector('.progressbar-fill');
    if (fill) fill.style.width = pct + '%';
    const counter = document.querySelector('[data-progress-counter]');
    if (counter) counter.textContent = `${done}/${lessons.length}`;

    // Save module-level progress
    const moduleId = document.body.dataset.module;
    if (moduleId) { state.modules[moduleId] = pct; saveState(state); }
  }
  updateProgress();

  /* ── Quiz ── */
  document.querySelectorAll('.quiz').forEach(quiz => {
    const correct = quiz.dataset.correct;
    quiz.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        if (quiz.classList.contains('answered')) return;
        quiz.classList.add('answered');
        const value = opt.dataset.value;
        if (value === correct) opt.classList.add('correct');
        else {
          opt.classList.add('wrong');
          const correctOpt = quiz.querySelector(`.quiz-option[data-value="${correct}"]`);
          if (correctOpt) correctOpt.classList.add('correct');
        }
      });
    });
  });

  /* ── Active TOC link on scroll ── */
  const tocLinks = document.querySelectorAll('.module-toc a[href^="#"]');
  if (tocLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    tocLinks.forEach(a => {
      const tgt = document.querySelector(a.getAttribute('href'));
      if (tgt) observer.observe(tgt);
    });
  }

  /* ── Expose progress globally for index hub ── */
  window.fasciaState = state;
})();
