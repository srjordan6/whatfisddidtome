(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 1. The record surfaces
  var sheet=document.getElementById('sheet');
  if(sheet){ if(reduce){sheet.classList.remove('under');} else {requestAnimationFrame(function(){setTimeout(function(){sheet.classList.remove('under');},180);});} }

  // 2. Underline District words as they enter
  var qs=[].slice.call(document.querySelectorAll('blockquote.d'));
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -18% 0px'});
    qs.forEach(function(q){io.observe(q);});
  } else qs.forEach(function(q){q.classList.add('in');});

  // 3. The clock beat
  function fmt(m){var h=Math.floor(m/60),mm=m%60,ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+(mm<10?'0':'')+mm+' '+ap;}
  var clocks=[].slice.call(document.querySelectorAll('[data-clock],[data-day]'));
  if('IntersectionObserver' in window && !reduce){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return; co.unobserve(e.target); var el=e.target;
      if(el.dataset.clock){var p=el.dataset.clock.split(':'),end=(+p[0])*60+(+p[1]),start=end-90,t0=null;
        (function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/380);el.textContent=fmt(Math.round(start+(end-start)*k));if(k<1)requestAnimationFrame(step);})(performance.now());}
      else {var d=+el.dataset.day;el.textContent='July '+(d-1);setTimeout(function(){el.textContent='July '+d;},260);}
    });},{threshold:.6});
    clocks.forEach(function(c){co.observe(c);});
  }

  // 4. Contents highlight
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id);});}});},{rootMargin:'-25% 0px -65% 0px'});
    links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)so.observe(s);});
  }

  // 5. Document panel (desktop); phones open the file directly
  var panel=document.getElementById('panel'),scrim=document.getElementById('scrim'),frame=document.getElementById('pframe');
  function close(){panel.classList.remove('open');scrim.classList.remove('open');panel.setAttribute('aria-hidden','true');setTimeout(function(){frame.src='about:blank';},350);}
  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('a.doc'); if(!a)return;
    var href=a.getAttribute('href'); if(!/\.pdf(#|$)/i.test(href)||window.innerWidth<860)return;
    ev.preventDefault(); frame.src=href; document.getElementById('pnew').href=href; document.getElementById('pdl').href=href.split('#')[0];
    var li=a.closest('li'),w=li&&li.querySelector('.when');document.getElementById('ptitle').textContent=a.dataset.title||((w?w.textContent+' · ':'')+a.textContent.trim());
    panel.classList.add('open');scrim.classList.add('open');panel.setAttribute('aria-hidden','false');document.getElementById('pclose').focus();
  });
  document.getElementById('pclose').addEventListener('click',close); scrim.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('open'))close();});
})();
