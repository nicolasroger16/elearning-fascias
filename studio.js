(function() {
  'use strict';
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Iso parallax on hero
  const stage = document.querySelector('.st-iso-stage');
  const hero = document.querySelector('.st-hero');
  if (stage && hero) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = `rotateX(${58 - cy * 8}deg) rotateZ(${-32 + cx * 8}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      stage.style.transform = 'rotateX(58deg) rotateZ(-32deg)';
    });
  }
})();
