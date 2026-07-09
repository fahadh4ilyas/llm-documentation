/**
 * App runtime — routing, sidebar, bottom nav, content loading, CodeMirror cleanup.
 */

let currentPage = '';

/* ---- Routing ---- */

function getRoute() {
  // Hash routing (internal navigation via sidebar links or 404 redirect)
  var hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    // Only treat as route if it starts with / — plain fragments are page anchors
    if (!hash.startsWith('/')) {
      // Fall through to pathname routing
      if (window.location.pathname.startsWith('/llm-documentation/')) {
        return window.location.pathname.slice('/llm-documentation/'.length).replace(/^\/?/, '') || '';
      }
      return '';
    }
    var fragIdx = hash.indexOf('#');
    if (fragIdx !== -1) hash = hash.substring(0, fragIdx);
    return hash.replace(/^\/?/, '') || '';
  }
  // Path routing (direct visit or 404 redirect via clean URL)
  if (window.location.pathname.startsWith('/llm-documentation/')) {
    return window.location.pathname.slice('/llm-documentation/'.length).replace(/^\/?/, '') || '';
  }
  return '';
}

function getTargetFragment() {
  const hash = window.location.hash;
  // Fragment is the last segment after the last '#'
  // URL format: #/path/to/page#fragmentname
  const parts = hash.split('#');
  if (parts.length > 2) return parts[parts.length - 1];
  return null;
}

function getBreadcrumbKey(path) {
  if (!path) return 'home';
  const parts = path.split('/');
  // Multi-level paths: use the last segment as the breadcrumb key
  if (parts.length > 1) return parts[parts.length - 1];
  return parts[0];
}

function getPagePath(path) {
  return '/llm-documentation/' + (PAGE_MAP[path] || 'pages/404.html');
}

/* ---- Sidebar ---- */

function renderSidebar(currentPath) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let html = '';
  for (const item of SIDENAVS) {
    const urlPath = item.url.join('/');
    const isActive = currentPath === urlPath;
    const isSection = item.class === 'ml-3' && !/^\d/.test(item.text);

    let href = '/llm-documentation/' + urlPath;
    if (item.fragment) href += '#' + item.fragment;

    let cls = '';
    if (isActive) cls += 'active ';
    if (isSection) cls += 'section ';

    const padMap = { 3: 12, 4: 24, 5: 48 };
    const padLeft = item.class ? (padMap[parseInt(item.class.replace('ml-',''))] || 12) : 12;
    html += `<a href="${href}" class="sidebar-link ${cls.trim()}" style="padding-left:${padLeft}px">${item.text}</a>`;
  }
  sidebar.innerHTML = html;
}

/* ---- Bottom Nav ---- */

function renderBottomNav(path) {
  const container = document.getElementById('bottom-nav');
  if (!container) return;

  const key = getBreadcrumbKey(path);
  const links = BOTTOMLINKS[key] || { left: NAVS.empty, center: NAVS.empty, right: NAVS.empty };

  const mkLink = (item, side) => {
    if (!item || !item.url.length) return `<span class="bottom-link disabled invisible">—</span>`;
    const urlPath = item.url.join('/');
    return `<a href="/llm-documentation/${urlPath}" class="bottom-link ${side}">${side === 'left' ? '← ' : ''}${item.text}${side === 'right' ? ' →' : ''}</a>`;
  };

  container.innerHTML = `
    ${mkLink(links.left, 'left')}
    <a href="/llm-documentation/" class="bottom-link center">${links.center.text}</a>
    ${mkLink(links.right, 'right')}
  `;
}

/* ---- CodeMirror Cleanup ---- */

function cleanCodeMirror(container, pagePath) {
  // Extract plain text from Typora CodeMirror blocks
  container.querySelectorAll('pre.md-fences').forEach(pre => {
    const lang = pre.getAttribute('lang') || '';
    const lines = [];
    pre.querySelectorAll('.CodeMirror-line').forEach(line => {
      const inner = line.querySelector('span[role="presentation"]');
      let text = inner ? inner.textContent : line.textContent;
      // Normalize non-breaking spaces, decode double-encoded entities
      text = (text || '').replace(/\u00A0/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      lines.push(text);
    });
    const cleaned = document.createElement('pre');
    cleaned.className = `code-block${lang ? ' lang-' + lang : ''}`;
    const code = document.createElement('code');
    code.textContent = lines.join('\n');
    cleaned.appendChild(code);
    pre.replaceWith(cleaned);
  });

  // Fix routerLink → hash links, resolving relative paths
  // For section index pages, TOC links are relative to the section
  const basePath = pagePath || '';

  container.querySelectorAll('a[routerLink]').forEach(a => {
    let link = a.getAttribute('routerLink') || '';
    const fragment = a.getAttribute('fragment');
    const isAbsolute = link.startsWith('/');

    // Strip /llm-documentation/ prefix if already present
    link = link.replace(/^\/llm-documentation\//, '/');

    // Strip leading/trailing slashes
    link = link.replace(/^\/+|\/+$/g, '');

    // If link is relative (doesn't include the section name), resolve it
    // Only resolve if NOT an absolute path
    if (!isAbsolute && basePath && !link.startsWith(basePath.split('/')[0])) {
      link = basePath + '/' + link;
    }

    let href = '/llm-documentation/' + link;
    if (fragment) href += '#' + fragment;
    a.setAttribute('href', href);
    a.removeAttribute('routerLink');
  });

  // Fix md-toc-inner links — convert #fragment links to proper paths
  container.querySelectorAll('.md-toc-inner').forEach(a => {
    var href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    var fragment = href.slice(1).replace(/--/g, '-');

    // h4 TOC items resolve to parent h3 page with fragment
    var item = a.closest('.md-toc-item');
    if (item && item.classList.contains('md-toc-h4')) {
      var prev = item.previousElementSibling;
      while (prev) {
        if (prev.classList.contains('md-toc-h3')) {
          var parentLink = prev.querySelector('.md-toc-inner');
          if (parentLink) {
            var parentFrag = parentLink.getAttribute('href').slice(1).replace(/--/g, '-');
            var pagePath = basePath ? basePath + '/' + parentFrag : parentFrag;
            if (!PAGE_MAP[pagePath]) {
              for (var k in PAGE_MAP) {
                if (k.endsWith('/' + parentFrag)) { pagePath = k; break; }
              }
            }
            a.setAttribute('href', '/llm-documentation/' + pagePath + '#' + fragment);
          }
          break;
        }
        prev = prev.previousElementSibling;
      }
      return;
    }

    // h2/h3 TOC items
    if (basePath) {
      fragment = basePath + '/' + fragment;
    } else if (!PAGE_MAP[fragment]) {
      for (var key in PAGE_MAP) {
        if (key.endsWith('/' + fragment)) { fragment = key; break; }
      }
    }
    a.setAttribute('href', '/llm-documentation/' + fragment);
  });
}

/* ---- Load Page ---- */

async function loadPage(path) {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  currentPage = path;
  const pageFile = getPagePath(path);

  try {
    const resp = await fetch(pageFile);
    if (!resp.ok) throw new Error('Not found');
    let html = await resp.text();

    // Double-encode angle brackets ONLY inside code blocks so they
    // survive innerHTML. &lt;volume_name&gt; would decode to <volume_name>
    // which looks like an HTML tag and gets eaten.
    html = html.replace(/(<pre\b[^>]*class="[^"]*md-fences[^"]*"[^>]*>)([\s\S]*?)(<\/pre>)/gi,
      (_, open, body, close) => open + body.replace(/&lt;/g, '&amp;lt;').replace(/&gt;/g, '&amp;gt;') + close
    );

    contentEl.innerHTML = html;

    // Fix relative asset URLs — with clean-path routing the base URL is
    // deeper than root, so assets/images/ would resolve incorrectly.
    contentEl.querySelectorAll('img[src]').forEach(function(img) {
      var src = img.getAttribute('src');
      if (src && src.indexOf('/') !== 0 && src.indexOf('http') !== 0) {
        img.setAttribute('src', '/llm-documentation/' + src);
      }
    });

    cleanCodeMirror(contentEl, path);

    renderSidebar(path);
    renderBottomNav(path);
    updatePageTitle(path);

    // Convert hash URL to clean URL after first load (from 404 redirect)
    var frag = getTargetFragment();
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      var clean = '/llm-documentation/' + path;
      if (frag) clean += '#' + frag;
      window.history.replaceState(null, '', clean);
    }

    // Scroll to fragment (for direct visit with hash or sub-item clicks)
    if (frag) {
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          var el = document.getElementById(frag) || contentEl.querySelector('a[name="' + frag + '"]');
          if (el) {
            var target = el.closest('h1,h2,h3,h4,h5,h6') || el;
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }

  } catch (e) {
    contentEl.innerHTML = `<div id='write'><h2>404 — Halaman tidak ditemukan</h2></div>`;
    renderSidebar('');
    renderBottomNav('');
  }
}

function updatePageTitle(path) {
  var meta = PAGE_META[path] || PAGE_META[''];
  document.title = (meta && meta.title) ? meta.title : 'Kubernetes Documentation — K8s Docs';

  var descEl = document.querySelector('meta[name="description"]');
  if (descEl && meta && meta.description) descEl.setAttribute('content', meta.description);

  var kwEl = document.querySelector('meta[name="keywords"]');
  if (kwEl && meta && meta.keywords) kwEl.setAttribute('content', meta.keywords);
}

/* ---- Mobile Sidebar Toggle ---- */

function initMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const iconOpen = document.getElementById('sidebar-icon-open');
  const iconClose = document.getElementById('sidebar-icon-close');
  if (!sidebar || !iconOpen || !iconClose) return;

  function isMobile() { return window.innerWidth <= 768; }

  // Start collapsed on all screen sizes
  if (!isMobile()) {
    sidebar.classList.add('collapsed');
  }

  function openSidebar() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }

  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    if (isMobile()) {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    } else {
      sidebar.classList.toggle('collapsed');
      const c = sidebar.classList.contains('collapsed');
      iconOpen.classList.toggle('hidden', !c);
      iconClose.classList.toggle('hidden', c);
    }
  });

  // Tap overlay to close
  overlay?.addEventListener('click', closeSidebar);

  // Tap a sidebar link to close (mobile only)
  sidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.classList.contains('sidebar-link')) {
      if (isMobile()) closeSidebar();
    }
  });

  // Swipe gestures on mobile
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!isMobile()) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (Math.abs(dx) < 50) return; // minimum swipe distance
    if (dx > 0 && !sidebar.classList.contains('open')) {
      // Swipe right → open
      openSidebar();
    } else if (dx < 0 && sidebar.classList.contains('open')) {
      // Swipe left when open → close
      closeSidebar();
    }
  });

  // Reset sidebar state when crossing desktop/mobile breakpoint
  let wasMobile = isMobile();
  window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
      wasMobile = nowMobile;
      sidebar.classList.remove('collapsed', 'open');
      if (overlay) overlay.classList.remove('visible');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      if (!nowMobile) sidebar.classList.add('collapsed');
    }
  });
}

/* ---- Navigation Click Handler ---- */

function handleNavClick(e) {
  var a = e.target.closest('a');
  if (!a) return;
  var href = a.getAttribute('href');
  if (!href || !href.startsWith('/llm-documentation/')) return;

  e.preventDefault();
  // Extract path (without base prefix and hash fragment)
  var hashIdx = href.indexOf('#');
  var path = (hashIdx === -1 ? href : href.substring(0, hashIdx)).replace('/llm-documentation/', '') || '';
  var fragment = hashIdx !== -1 ? href.substring(hashIdx + 1) : null;

  // Same page — just scroll to fragment
  if (path === currentPage && fragment) {
    window.history.pushState(null, '', href);
    var el = document.getElementById(fragment) || document.querySelector('a[name="' + fragment + '"]');
    if (el) {
      var target = el.closest('h1,h2,h3,h4,h5,h6') || el;
      target.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  window.history.pushState(null, '', href);
  loadPage(path);

  // Scroll to fragment after page load
  if (fragment) {
    setTimeout(function() {
      var el = document.getElementById(fragment) || document.querySelector('a[name="' + fragment + '"]');
      if (el) {
        var target = el.closest('h1,h2,h3,h4,h5,h6') || el;
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }
}

/* ---- Init ---- */

window.addEventListener('hashchange', function() {
  // Only handle route hashes (#/path), not page fragments (#anchor)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    loadPage(getRoute());
  }
});

window.addEventListener('popstate', function() {
  loadPage(getRoute());
});

document.addEventListener('DOMContentLoaded', function() {
  initMobileSidebar();
  loadPage(getRoute());

  // Intercept all navigation clicks for clean-path pushState
  document.addEventListener('click', handleNavClick);
});
