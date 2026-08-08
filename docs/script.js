(function(){
  document.documentElement.classList.add('js');

  const header = document.getElementById('siteHeader');
  const bar = document.getElementById('progressBar');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('siteNav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function(){
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded','false');
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  }

  const processTrack = document.getElementById('processTrack');
  if (processTrack) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      processTrack.classList.add('is-active');
    } else {
      const pio = new IntersectionObserver(function(entries){
        if (entries.some(function(e){ return e.isIntersecting; })) {
          processTrack.classList.add('is-active');
          pio.disconnect();
        }
      }, { threshold: 0.18 });
      pio.observe(processTrack);
    }
  }

  let ticking = false;
  function updateScrollUI(){
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max ? doc.scrollTop / max : 0) + ')';
    if (header) header.classList.toggle('scrolled', doc.scrollTop > 24);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking) {
      requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive:true });
  updateScrollUI();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
