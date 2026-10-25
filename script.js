(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var grid=document.getElementById('game-grid');
  var games=(window.GAMES||[]).slice();

  function compact(n){
    if(n>=1e9)return (n/1e9).toFixed(n>=1e10?1:2).replace(/\.?0+$/,'')+'B';
    if(n>=1e6)return (n/1e6).toFixed(n>=1e8?0:1).replace(/\.0$/,'')+'M';
    if(n>=1e3)return (n/1e3).toFixed(n>=1e5?0:1).replace(/\.0$/,'')+'K';
    return String(Math.round(n));
  }
  function num(v){if(typeof v==='number')return v;if(!v)return NaN;
    var m=String(v).replace(/,/g,'').trim().match(/^([\d.]+)\s*([kmb])?$/i);if(!m)return NaN;
    return parseFloat(m[1])*({k:1e3,m:1e6,b:1e9}[(m[2]||'').toLowerCase()]||1)}
  function fmtDate(d){var t=new Date(d);return isNaN(t)?'':t.toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})}

  fetch('data/stats.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).catch(function(){return null})
  .then(function(stats){ render(stats) });

  function render(stats){
    var S={};games.forEach(function(g){var r=stats&&stats.games&&stats.games[g.slug]||{};S[g.slug]={playing:num(r.playing),visits:num(r.visits)}});
    var all=games.every(function(g){return !isNaN(S[g.slug].visits)});
    if(all)games.sort(function(a,b){return S[b.slug].visits-S[a.slug].visits});
    document.getElementById('fact-count').textContent=games.length;
    games.forEach(function(g,i){
      var s=S[g.slug];
      var li=document.createElement('li'); li.className='reveal'; li.style.setProperty('--i',i%4); li.dataset.role=g.role;
      var a=document.createElement('a'); a.className='card';
      a.href='https://www.roblox.com/games/'+encodeURIComponent(g.placeId);
      a.target='_blank'; a.rel='noopener noreferrer';
      a.setAttribute('aria-label',g.title+', '+g.role+' (opens on Roblox)');
      a.addEventListener('pointermove',function(e){var b=a.getBoundingClientRect();a.style.setProperty('--mx',(e.clientX-b.left)+'px');a.style.setProperty('--my',(e.clientY-b.top)+'px')});

      var media=el('div','card__media');
      var fb=el('span','card__letter'); fb.textContent=g.title.replace(/[^A-Za-z0-9]/g,'').charAt(0).toUpperCase(); media.appendChild(fb);
      if(g.thumb){var im=new Image();im.alt='';im.className='card__thumb';im.decoding='async';im.referrerPolicy='no-referrer';
        im.onload=function(){media.insertBefore(im,fb.nextSibling);requestAnimationFrame(function(){im.classList.add('in')})};im.src=g.thumb}

      var body=el('div','card__body');
      var t=el('h3','card__title'); t.textContent=g.title;
      var r=el('p','card__role'); r.textContent=g.role;
      body.appendChild(t); body.appendChild(r);
      var foot=el('div','card__stats');
      if(!isNaN(s.playing))foot.appendChild(stat('live','playing',s.playing,'playing'));
      if(!isNaN(s.visits))foot.appendChild(stat('','visits',s.visits,'visits'));
      if(!foot.children.length){foot.classList.add('is-empty');foot.appendChild(stat('','visits',0,'visits'))}
      a.appendChild(media); a.appendChild(body); a.appendChild(foot); li.appendChild(a); grid.appendChild(li);
    });
    var note=document.getElementById('stats-note');
    if(stats&&stats.updated&&fmtDate(stats.updated)){note.textContent='Player counts and visit totals are from Roblox, last updated '+fmtDate(stats.updated)+'.'}
    initReveal(); initFilters();
  }
  function el(t,c){var e=document.createElement(t);e.className=c;return e}
  function load(src,ok){var i=new Image();i.alt='';i.decoding='async';i.onload=function(){ok(i);requestAnimationFrame(function(){i.classList.add('in')})};i.src=src}
  function stat(cls,_k,val,label){
    var d=el('span','stat '+cls); var n=el('b','stat__n'); n.dataset.val=val; n.textContent=compact(val);
    var l=el('span','stat__l'); l.textContent=label; d.appendChild(n); d.appendChild(l); return d}

  // Reveal on scroll + count-up
  function initReveal(){
    var items=document.querySelectorAll('.reveal');
    if(reduce||!('IntersectionObserver' in window)){items.forEach(function(e){e.classList.add('in')});return}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return; e.target.classList.add('in'); io.unobserve(e.target);
      e.target.querySelectorAll('.stat__n').forEach(countUp)})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(e){io.observe(e)});
  }
  function countUp(n){var end=+n.dataset.val,t0=null,dur=1100;
    function f(ts){t0=t0||ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);n.textContent=compact(end*e);if(p<1)requestAnimationFrame(f);else n.textContent=compact(end)}
    requestAnimationFrame(f)}

  // Filters
  function initFilters(){
    var chips=document.querySelectorAll('.chip');
    chips.forEach(function(c){c.addEventListener('click',function(){
      chips.forEach(function(x){var on=x===c;x.classList.toggle('is-on',on);x.setAttribute('aria-pressed',on)});
      var f=c.dataset.filter;
      grid.querySelectorAll('li').forEach(function(li){li.hidden=!(f==='all'||li.dataset.role===f);if(!li.hidden)li.classList.add('in')});
    })});
  }

  // Scroll progress, nav state, active link
  var bar=document.getElementById('progress'),nav=document.getElementById('nav'),tick=false;
  function onScroll(){tick=false;var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    bar.style.transform='scaleX('+(max>0?h.scrollTop/max:0)+')';nav.classList.toggle('is-stuck',h.scrollTop>10)}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
  if('IntersectionObserver' in window){
    var links=document.querySelectorAll('.nav__menu a');
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
    ['games','about','contact'].forEach(function(id){so.observe(document.getElementById(id))});
  }

  // Mobile nav
  var btn=document.querySelector('.nav__toggle'),menu=document.getElementById('menu');
  function setMenu(o){btn.setAttribute('aria-expanded',o);menu.classList.toggle('open',o)}
  btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
  menu.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // Copy Discord username
  var status=document.getElementById('copy-status'),name=document.getElementById('discord').textContent.trim(),cb=document.getElementById('copy');
  cb.addEventListener('click',function(){
    function ok(){status.textContent='Copied “'+name+'” to clipboard.';cb.textContent='Copied ✓';setTimeout(function(){cb.textContent='Copy username'},1800)}
    function fail(){status.textContent='Couldn’t copy automatically. My username is '+name+'.'}
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(name).then(ok,fail)}
    else{try{var t=document.createElement('textarea');t.value=name;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();var s=document.execCommand('copy');document.body.removeChild(t);s?ok():fail()}catch(e){fail()}}
  });
  document.getElementById('year').textContent=new Date().getFullYear();
})();
