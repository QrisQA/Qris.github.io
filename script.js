const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  }));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Reveal cards as they enter view, while preserving content if the API is unavailable.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('visible'));
}

// If a Roblox thumbnail cannot load, keep the card usable with its gradient background.
document.querySelectorAll('.game-image img').forEach(img => {
  img.addEventListener('error', () => img.style.display = 'none');
});

const copyButton = document.querySelector('#copy-discord');
const discordName = document.querySelector('#discord-name');
const copyStatus = document.querySelector('#copy-status');
if (copyButton && discordName && copyStatus) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(discordName.textContent.trim());
      copyStatus.textContent = 'Copied! Paste qris000 into Discord search.';
      copyButton.innerHTML = 'Copied ✓';
    } catch (error) {
      copyStatus.textContent = 'Your Discord username is qris000 — select and copy it manually.';
    }
  });
}
