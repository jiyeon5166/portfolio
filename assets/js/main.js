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

  // Initiate Pure Counter
  new PureCounter();

  // Animate the skills items on reveal
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  //Initiate glightbox
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

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

  // Init swiper sliders
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

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

  // Navmenu Scrollspy
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

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
    .map(a => document.querySelector(a.getAttribute('href'))) // #home 등
    .filter(Boolean);

  // 관찰 옵션: 뷰포트 중앙 근처에 들어오면 active
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`nav a[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        // 모두 제거 후 현재만 active
        navLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    root: null,
    // 섹션의 중앙이 보일 때 반응하도록 여백 조정
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0.0
  });

  sections.forEach(sec => io.observe(sec));

  // (선택) 페이지 로드 시 현재 위치 반영
  window.addEventListener('load', () => {
    // 상단 고정 헤더가 있으면 오프셋 조절
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

  // (선택) 부드러운 스크롤
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });



















})();