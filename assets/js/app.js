/**
 * Beyond Firewalls Blog - Minimal Editorial Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initThemeToggle();
  initReadingMetrics();
  initCopyLink();
  initScrollSpy();
});

// Reading progress bar
function initReadingProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    if (total <= 0) return;
    const pct = (window.scrollY / total) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }, { passive: true });
}

// Light / Dark mode toggle
function initThemeToggle() {
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('blog-theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = activeTheme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('blog-theme', nextTheme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
    }
  }
}

// Word count and reading time calculation
function initReadingMetrics() {
  const article = document.querySelector('.post-body');
  const readTimeEl = document.getElementById('readTime');
  const sidebarReadTimeEl = document.getElementById('sidebarReadTime');
  if (!article) return;

  const text = article.innerText || article.textContent || '';
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 225));
  const timeStr = `${minutes} min read`;

  if (readTimeEl) readTimeEl.textContent = timeStr;
  if (sidebarReadTimeEl) sidebarReadTimeEl.textContent = timeStr;
}

// Table of Contents Scrollspy
function initScrollSpy() {
  const sections = document.querySelectorAll('.post-body section');
  const navLinks = document.querySelectorAll('#tocNav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-15% 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

// Copy link
function initCopyLink() {
  const copyBtn = document.getElementById('copyBtn');
  const sidebarShareBtn = document.getElementById('sidebarShareBtn');
  const toast = document.getElementById('toast');

  const triggerCopy = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      showToast();
    } catch (e) {
      showToast();
    }
  };

  if (copyBtn) copyBtn.addEventListener('click', triggerCopy);
  if (sidebarShareBtn) sidebarShareBtn.addEventListener('click', triggerCopy);

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}
