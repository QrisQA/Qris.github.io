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

// Load square official Roblox experience icons instead of wide gameplay thumbnails.
document.querySelectorAll('.game-art img[data-place-id]').forEach(async (img) => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
  const placeId = img.dataset.placeId;
  try {
    const universeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    if (!universeResponse.ok) return;
    const universe = await universeResponse.json();
    if (!universe.universeId) return;
    const iconResponse = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universe.universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);
    if (!iconResponse.ok) return;
    const icons = await iconResponse.json();
    const iconUrl = icons.data && icons.data[0] && icons.data[0].imageUrl;
    if (iconUrl) img.src = iconUrl;
  } catch {
    // Keep the existing artwork if Roblox's public thumbnail API is unavailable.
  }
});
