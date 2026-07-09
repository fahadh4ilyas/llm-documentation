/**
 * Theme toggle — switches between dark and light mode.
 * Persists to localStorage. Applies to <html data-theme="...">.
 */
(function() {
  const KEY = 'fahadh-theme';
  const stored = localStorage.getItem(KEY) || 'light';
  applyTheme(stored);

  function updateIcons(theme) {
    const iconDark = document.getElementById('theme-icon-dark');
    const iconLight = document.getElementById('theme-icon-light');
    if (iconDark && iconLight) {
      iconDark.classList.toggle('hidden', theme === 'light');
      iconLight.classList.toggle('hidden', theme === 'dark');
    }
  }

  function renderTurnstile(theme) {
    var widget = document.getElementById('turnstile-widget');
    if (!widget) return;
    // Skip if widget is hidden (inside closed modal)
    if (!widget.offsetParent) return;
    var prevId = widget.getAttribute('data-widget-id');
    if (prevId && window.turnstile) {
      window.turnstile.remove(parseInt(prevId, 10));
    }
    // Clear any leftover iframe
    widget.innerHTML = '';
    widget.removeAttribute('data-widget-id');
    if (window.turnstile) {
      window.turnstile.render(widget, {
        sitekey: widget.getAttribute('data-sitekey'),
        theme: theme
      });
    } else {
      setTimeout(function() { renderTurnstile(theme); }, 200);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    updateIcons(theme);
    renderTurnstile(theme);
  }

  // Called by components.js after navbar icons are injected into DOM
  window.syncThemeIcons = function() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateIcons(theme);
  };

  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };
})();
