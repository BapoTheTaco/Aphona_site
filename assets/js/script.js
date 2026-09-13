const body = document.body;
const current = body.dataset.page;

document.querySelectorAll('[data-nav]').forEach(a => {
  if (a.dataset.nav === current) a.setAttribute('aria-current', 'page');
});

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menu && nav) {
  let lockedScrollY = 0;
  const navHome = nav.parentNode;
  const navNextSibling = nav.nextSibling;

  const portalNav = () => {
    if (nav.parentNode !== document.body) {
      document.body.appendChild(nav);
    }
    nav.classList.add('nav-portal');
  };

  const restoreNav = () => {
    nav.classList.remove('nav-portal');
    if (nav.parentNode !== navHome) {
      if (navNextSibling && navNextSibling.parentNode === navHome) {
        navHome.insertBefore(nav, navNextSibling);
      } else {
        navHome.appendChild(nav);
      }
    }
  };

  const lockPage = () => {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;

    document.documentElement.classList.add('menu-open');
    body.classList.add('menu-open');

    /*
     * Fix the document at the exact current scroll position.
     * Because the nav itself is portalled to body and position:fixed,
     * it stays pinned to the viewport rather than to a scrolled header.
     */
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  };

  const unlockPage = () => {
    document.documentElement.classList.remove('menu-open');
    body.classList.remove('menu-open');

    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';

    window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    if (!nav.classList.contains('open')) return;

    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Menu openen');

    unlockPage();
    restoreNav();

    if (returnFocus) {
      requestAnimationFrame(() => menu.focus({ preventScroll: true }));
    }
  };

  const openMenu = () => {
    portalNav();
    lockPage();

    /* Separate frames ensure the off-canvas start state paints first. */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nav.classList.add('open');
        menu.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-label', 'Menu sluiten');

        const firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      });
    });
  };

  menu.addEventListener('click', () => {
    nav.classList.contains('open')
      ? closeMenu({ returnFocus: true })
      : openMenu();
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      /*
       * Do not restore scroll before navigating to another page.
       * Closing first still removes the document lock cleanly.
       */
      closeMenu();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu({ returnFocus: true });
    }
  });

  const desktopQuery = window.matchMedia('(min-width: 981px)');
  const resetForDesktop = e => {
    if (!e.matches) return;

    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      restoreNav();
      document.documentElement.classList.remove('menu-open');
      body.classList.remove('menu-open');
    }
  };

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', resetForDesktop);
  } else {
    desktopQuery.addListener(resetForDesktop);
  }
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const initActivityFilters = () => {
  const filters = document.querySelectorAll('.filter');
  if (!filters.length) return;

  const applyFilter = filter => {
    document.querySelectorAll('.activity-list article').forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  };

  filters.forEach(btn => {
    if (btn.dataset.filterBound === 'true') return;
    btn.dataset.filterBound = 'true';
    btn.addEventListener('click', () => {
      filters.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  const active = document.querySelector('.filter.active');
  applyFilter(active?.dataset.filter || 'all');
};

initActivityFilters();
document.addEventListener('aphonia:activities-rendered', initActivityFilters);

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.home-events article,.person-card,.contact-card,.price-stack>div,.benefit-grid article'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.translate = '0 16px';
    el.style.transition = 'opacity .45s ease, translate .45s ease';
    obs.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = '.revealed{opacity:1!important;translate:0 0!important}';
  document.head.appendChild(style);
}


/* Decorative Aphonia paint splatters in lighter/emptier sections. */
(() => {
  const targets = [
    ...document.querySelectorAll(
      '.section:not(.red-section):not(.yellow-section):not(.dark-section), .home-hero'
    )
  ];

  targets.forEach((section, index) => {
    if (section.querySelector('.paint-splatter')) return;

    const first = document.createElement('span');
    first.className = `paint-splatter ${index % 2 === 0 ? 'red' : 'yellow'} splatter-a`;
    first.setAttribute('aria-hidden', 'true');
    section.appendChild(first);

    /* Add a second, smaller counter-colour only on roomier sections. */
    if (index % 2 === 0) {
      const second = document.createElement('span');
      second.className = `paint-splatter ${index % 4 === 0 ? 'yellow' : 'mix'} splatter-b`;
      second.setAttribute('aria-hidden', 'true');
      section.appendChild(second);
    }

    /* Sparse third fleck on desktop-sized content only. */
    if (index % 3 === 0) {
      const third = document.createElement('span');
      third.className = 'paint-splatter mix splatter-c';
      third.setAttribute('aria-hidden', 'true');
      section.appendChild(third);
    }
  });
})();


/* Pro-praesidia archive toggle */
(() => {
  const toggle = document.querySelector('.archive-toggle');
  const archive = document.getElementById('pro-archive');
  if (!toggle || !archive) return;

  toggle.addEventListener('click', () => {
    const opening = archive.hidden;
    archive.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.textContent = opening ? 'Verberg voorgaande jaren' : 'Bekijk voorgaande jaren';

    if (opening) {
      requestAnimationFrame(() => {
        archive.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
})();
