const menuButton = document.querySelector('.menu');
const nav = document.querySelector('nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}
const copyButton = document.getElementById('copy-discord');
const discordName = document.getElementById('discord-name');
const copyStatus = document.getElementById('copy-status');
if (copyButton && discordName && copyStatus) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(discordName.textContent.trim());
      copyStatus.textContent = 'Username copied. Find me on Discord.';
      copyButton.innerHTML = 'Copied ✓';
    } catch {
      copyStatus.textContent = 'Your username is qris000 — you can copy it manually.';
    }
  });
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
