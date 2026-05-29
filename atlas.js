// Atlas — Reveal on scroll, parallax, timeline progress
(function() {
  'use strict';

  // Reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Timeline items
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.atlas-timeline-item').forEach(el => tlObserver.observe(el));

  // Timeline progress fill
  const track = document.querySelector('.atlas-timeline-track');
  const tlSection = document.querySelector('.atlas-timeline-section');
  function updateTimeline() {
    if (!track || !tlSection) return;
    const rect = tlSection.getBoundingClientRect();
    const wh = window.innerHeight;
    const start = wh * 0.7;
    const end = -rect.height + wh * 0.3;
    const t = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    track.style.setProperty('--progress', (t * 100) + '%');
  }
  window.addEventListener('scroll', updateTimeline, { passive: true });
  updateTimeline();

  // Parallax decoration words
  const decor = document.querySelectorAll('.parallax-decor');
  function updateParallax() {
    const sy = window.scrollY;
    decor.forEach((el, i) => {
      const speed = parseFloat(el.dataset.speed || '0.15');
      el.style.transform = `translate3d(${sy * speed * (i % 2 ? 1 : -1)}px, ${sy * speed * 0.5}px, 0)`;
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // Hero plate subtle mouse parallax
  const heroPlate = document.querySelector('.atlas-hero-plate');
  if (heroPlate) {
    document.querySelector('.atlas-hero').addEventListener('mousemove', (e) => {
      const rect = heroPlate.getBoundingClientRect();
      const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      heroPlate.style.transform = `translate3d(${cx * 8}px, ${cy * 8}px, 0)`;
    });
  }
})();
