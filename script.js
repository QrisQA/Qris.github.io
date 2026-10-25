(function(){
  // Games: only entries with a verified placeId are shown. See README / games.js.
  var grid=document.getElementById('game-grid');
  var games=(window.GAMES||[]).filter(function(g){return g.placeId}).sort(function(a,b){return (a.order||999)-(b.order||999)});
  games.forEach(function(g){
    var li=document.createElement('li');
    var a=document.createElement('a');
    a.className='card';
    a.href='https://www.roblox.com/games/'+encodeURIComponent(g.placeId);
    a.target='_blank'; a.rel='noopener noreferrer';
    a.setAttribute('aria-label',g.title+', '+g.role+' (opens on Roblox)');
    var art=document.createElement('div'); art.className='card__art';
    var fb=document.createElement('div'); fb.className='card__fallback'; fb.setAttribute('aria-hidden','true');
    fb.textContent=g.title.replace(/[^A-Za-z0-9]/g,'').charAt(0).toUpperCase();
    art.appendChild(fb);
    var img=new Image(); img.alt=''; img.width=256; img.height=256; img.decoding='async'; img.loading='lazy';
    img.onload=function(){art.appendChild(img)};   // only shown once it truly loads; otherwise fallback stays
    img.src='assets/icons/'+g.slug+'.png';
    var t=document.createElement('h3'); t.className='card__title'; t.textContent=g.title;
    var r=document.createElement('p'); r.className='card__role'; r.textContent=g.role;
    a.appendChild(art); a.appendChild(t); a.appendChild(r); li.appendChild(a); grid.appendChild(li);
  });

  // Mobile nav
  var btn=document.querySelector('.nav__toggle'), menu=document.getElementById('menu');
  function setMenu(open){btn.setAttribute('aria-expanded',open);menu.classList.toggle('open',open)}
  btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
  menu.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // Copy Discord username
  var status=document.getElementById('copy-status'), name=document.getElementById('discord').textContent.trim();
  document.getElementById('copy').addEventListener('click',function(){
    function ok(){status.textContent='Copied “'+name+'” to clipboard.'}
    function fail(){status.textContent='Couldn’t copy automatically. My username is '+name+'.'}
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(name).then(ok,fail)}
    else{try{var t=document.createElement('textarea');t.value=name;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();var s=document.execCommand('copy');document.body.removeChild(t);s?ok():fail()}catch(e){fail()}}
  });
  document.getElementById('year').textContent=new Date().getFullYear();
})();
