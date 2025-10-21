(function() {
  "use strict";

  // Scroll top button
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  // Animation on scroll function and init
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  // Init typed.js
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // Init isotope layout and filters
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  // Correct scrolling position upon page load for URLs containing hash links.
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

 
  //nav hover 시 글씨 나타나기
  const nav = document.querySelector('nav')
  const nav_a = nav.querySelectorAll('nav > a')
  for(let i of nav_a){
      i.addEventListener('mouseover',(e)=>{
          e.preventDefault();
          i.children[0].style.marginLeft = '0';
          i.children[0].style.opacity = '1'
      })
      i.addEventListener('mouseout',(e)=>{
          e.preventDefault();
          i.children[0].style.marginLeft = '-24px';
          i.children[0].style.opacity = '0'
      })
  }


  // nav 링크와 타깃 섹션 매핑
  const navLinks = [...document.querySelectorAll('nav a')];
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href'))) 
    .filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`nav a[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0.0
  });

  sections.forEach(sec => io.observe(sec));

  window.addEventListener('load', () => {
    const current = sections.find(sec => {
      const rect = sec.getBoundingClientRect();
      const vpCenter = window.innerHeight / 2;
      return rect.top <= vpCenter && rect.bottom >= vpCenter;
    });
    if (current) {
      const link = document.querySelector(`nav a[href="#${current.id}"]`);
      navLinks.forEach(a => a.classList.remove('active'));
      link?.classList.add('active');
    }
  });

  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // nav 숨기기
  const navEl = document.querySelector('nav');
  const web1 = document.getElementById('web1');
  
  if (navEl && web1) {
    const hideOnWeb1 = new IntersectionObserver(([entry]) => {
      const hide = entry.isIntersecting;
      navEl.classList.toggle('is-hidden-on-web1', hide);
      navEl.setAttribute('aria-hidden', hide ? 'true' : 'false');
      if (hide) navEl.setAttribute('inert', '');
      else navEl.removeAttribute('inert');
    }, {
      threshold: 0.40,         
      root: null,
      rootMargin: '0px'
    });
    hideOnWeb1.observe(web1);}
})();