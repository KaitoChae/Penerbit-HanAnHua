(function(){
  var docEl = document.documentElement;
  if (docEl) { docEl.className += (docEl.className ? ' ' : '') + 'js'; }

  var header = document.getElementById('siteHeader');
  var bar = document.getElementById('progressBar');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('siteNav');
  var reduceMotion = false;
  try {
    reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {}

  function eachNode(list, fn){
    for (var i = 0; i < list.length; i++) { fn(list[i], i); }
  }

  if (menuBtn && nav) {
    menuBtn.onclick = function(){
      var isOpen = (' ' + nav.className + ' ').indexOf(' open ') === -1;
      if (isOpen) { nav.className += ' open'; }
      else { nav.className = nav.className.replace(/\\s*open\\b/g, ''); }
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
    eachNode(nav.getElementsByTagName('a'), function(a){
      a.onclick = function(){
        nav.className = nav.className.replace(/\\s*open\\b/g, '');
        menuBtn.setAttribute('aria-expanded','false');
      };
    });
  }

  var reveals = document.querySelectorAll ? document.querySelectorAll('.reveal') : [];
  function showAll(){ eachNode(reveals, function(el){ if ((' ' + el.className + ' ').indexOf(' is-visible ') === -1) el.className += ' is-visible'; }); }

  if (reduceMotion || !window.IntersectionObserver) {
    showAll();
  } else {
    var io = new IntersectionObserver(function(entries){
      eachNode(entries, function(entry){
        if (entry.isIntersecting) {
          entry.target.className += ' is-visible';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });
    eachNode(reveals, function(el){ io.observe(el); });
  }

  var processTrack = document.getElementById('processTrack');
  if (processTrack) {
    if (reduceMotion || !window.IntersectionObserver) {
      processTrack.className += ' is-active';
    } else {
      var pio = new IntersectionObserver(function(entries){
        for (var i=0;i<entries.length;i++) {
          if (entries[i].isIntersecting) {
            processTrack.className += ' is-active';
            pio.disconnect();
            break;
          }
        }
      }, { threshold: 0.18 });
      pio.observe(processTrack);
    }
  }

  var ticking = false;
  var raf = window.requestAnimationFrame || function(cb){ return window.setTimeout(cb,16); };
  function updateScrollUI(){
    var d = document.documentElement;
    var body = document.body;
    var scrollTop = window.pageYOffset || d.scrollTop || (body && body.scrollTop) || 0;
    var scrollHeight = Math.max(d.scrollHeight, body ? body.scrollHeight : 0);
    var clientHeight = window.innerHeight || d.clientHeight || 1;
    var max = scrollHeight - clientHeight;
    if (bar) {
      bar.style.webkitTransform = 'scaleX(' + (max > 0 ? scrollTop / max : 0) + ')';
      bar.style.transform = 'scaleX(' + (max > 0 ? scrollTop / max : 0) + ')';
    }
    if (header) {
      var has = (' ' + header.className + ' ').indexOf(' scrolled ') !== -1;
      if (scrollTop > 24 && !has) header.className += ' scrolled';
      if (scrollTop <= 24 && has) header.className = header.className.replace(/\\s*scrolled\\b/g,'');
    }
    ticking = false;
  }
  function onScroll(){
    if (!ticking) { raf(updateScrollUI); ticking = true; }
  }
  if (window.addEventListener) {
    try { window.addEventListener('scroll', onScroll, {passive:true}); }
    catch(e) { window.addEventListener('scroll', onScroll, false); }
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', onScroll);
  }
  updateScrollUI();


  /* Lightweight catalog search — no framework, mobile-safe. */
  var bookSearch = document.getElementById('bookSearch');
  var clearBookSearch = document.getElementById('clearBookSearch');
  var searchEmpty = document.getElementById('searchEmpty');
  var booksGrid = document.getElementById('booksGrid');
  var bookCards = booksGrid && booksGrid.querySelectorAll ? booksGrid.querySelectorAll('.book-card') : [];
  function normalizeSearch(value){
    value = String(value || '').toLowerCase();
    try { if (value.normalize) value = value.normalize('NFD').replace(/[\u0300-\u036f]/g,''); } catch(e) {}
    return value.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
  }
  function filterBooks(){
    var q = normalizeSearch(bookSearch ? bookSearch.value : '');
    var visible = 0;
    eachNode(bookCards, function(card){
      var hay = normalizeSearch((card.getAttribute('data-search') || '') + ' ' + (card.textContent || card.innerText || ''));
      var match = !q || hay.indexOf(q) !== -1;
      if (match) { card.removeAttribute('hidden'); visible++; }
      else { card.setAttribute('hidden','hidden'); }
    });
    if (searchEmpty) {
      if (visible === 0) searchEmpty.removeAttribute('hidden');
      else searchEmpty.setAttribute('hidden','hidden');
    }
    if (clearBookSearch) clearBookSearch.style.visibility = q ? 'visible' : 'hidden';
  }
  if (bookSearch) {
    if (bookSearch.addEventListener) bookSearch.addEventListener('input', filterBooks, false);
    else bookSearch.onkeyup = filterBooks;
  }
  if (clearBookSearch) {
    clearBookSearch.onclick = function(){
      if (bookSearch) { bookSearch.value = ''; filterBooks(); try { bookSearch.focus(); } catch(e) {} }
    };
  }
  filterBooks();

  var year = document.getElementById('year');
  if (year) year.innerHTML = String((new Date()).getFullYear());
})();
