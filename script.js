const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  nav.classList.toggle('open');
  const open = nav.classList.contains('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '✕' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = '☰';
}));
document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Public stats for Escape Tsunami For Brainrots. The page remains useful if the proxy is unavailable.
const universeId = '9363735110';
const fallbackStats = { playing: '~3.5K', visits: '5.7B+' };
const playingEl = document.querySelector('#game-playing');
const visitsEl = document.querySelector('#game-visits');
const statusEl = document.querySelector('#stats-status');
const updatedEl = document.querySelector('#stats-updated');
const thumbEl = document.querySelector('#game-thumbnail');

function compactNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  if (n >= 1e9) return (n / 1e9).toFixed(n >= 10e9 ? 1 : 2).replace(/\.0$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 10e6 ? 1 : 2).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 10e3 ? 1 : 2).replace(/\.0$/, '') + 'K';
  return Math.round(n).toLocaleString('en-US');
}

async function refreshGameStats() {
  try {
    const response = await fetch(`https://games.roproxy.com/v1/games?universeIds=${universeId}`, {cache: 'no-store'});
    if (!response.ok) throw new Error('Stats endpoint unavailable');
    const payload = await response.json();
    const game = payload && payload.data && payload.data[0];
    if (!game || typeof game.playing !== 'number' || typeof game.visits !== 'number') throw new Error('Stats not found');
    playingEl.textContent = compactNumber(game.playing);
    visitsEl.textContent = compactNumber(game.visits);
    statusEl.textContent = 'PUBLIC STATS · UPDATED';
    updatedEl.textContent = `Checked ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
  } catch (error) {
    playingEl.textContent = fallbackStats.playing;
    visitsEl.textContent = fallbackStats.visits;
    statusEl.textContent = 'RECENT SNAPSHOT';
    updatedEl.textContent = 'Live refresh unavailable · approximate values';
  }
}

async function loadGameThumbnail() {
  try {
    const response = await fetch(`https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`);
    if (!response.ok) return;
    const payload = await response.json();
    const imageUrl = payload && payload.data && payload.data[0] && payload.data[0].imageUrl;
    if (imageUrl) {
      thumbEl.onload = () => thumbEl.classList.add('loaded');
      thumbEl.src = imageUrl;
    }
  } catch (error) {
    // The CSS background is the visual fallback when the thumbnail service is unavailable.
  }
}

refreshGameStats();
loadGameThumbnail();
setInterval(refreshGameStats, 60000);
