(function(){
  // mobile menu
  var mb=document.querySelector('.menu-btn'), ul=document.querySelector('.nav ul');
  if(mb&&ul){mb.addEventListener('click',function(){var o=ul.classList.toggle('open');mb.setAttribute('aria-expanded',o);});}
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hero video
  var v=document.getElementById('heroVideo'), b=document.getElementById('vidToggle');
  if(v&&b){
    var set=function(p){b.textContent=p?'Pause video':'Play video';};
    if(!reduce){var pr=v.play(); if(pr&&pr.then){pr.then(function(){set(true)}).catch(function(){set(false)});}} else set(false);
    b.addEventListener('click',function(){if(v.paused){v.play();set(true);}else{v.pause();set(false);}});
  }
  // sliders
  document.querySelectorAll('.slider').forEach(function(s){
    var t=s.querySelector('.track'), prev=s.querySelector('[data-dir="-1"]'), next=s.querySelector('[data-dir="1"]');
    var step=function(){var c=t.querySelector('.slide');return c?c.getBoundingClientRect().width+20:300;};
    var go=function(d){
      var max=t.scrollWidth-t.clientWidth-4;
      if(d>0&&t.scrollLeft>=max){t.scrollTo({left:0});}
      else if(d<0&&t.scrollLeft<=0){t.scrollTo({left:t.scrollWidth});}
      else t.scrollBy({left:d*step()});
    };
    if(prev)prev.addEventListener('click',function(){go(-1)});
    if(next)next.addEventListener('click',function(){go(1)});
    if(s.dataset.auto!==undefined&&!reduce){
      var timer=null, start=function(){stop();timer=setInterval(function(){go(1)},5000)}, stop=function(){if(timer)clearInterval(timer)};
      s.addEventListener('mouseenter',stop);s.addEventListener('mouseleave',start);
      s.addEventListener('focusin',stop);s.addEventListener('focusout',start);
      t.addEventListener('touchstart',stop,{passive:true});
      start();
    }
  });
})();
(function(){
  var tabs=document.querySelectorAll('.years button'); if(!tabs.length||!document.getElementById('yearNews')) return;
  var slides=document.querySelectorAll('#yearNews .slide'), title=document.getElementById('yearTitle'), count=document.getElementById('yearCount'), track=document.querySelector('#yearNews .track');
  function show(y){
    var n=0;
    slides.forEach(function(s){var on=(y==='all'||s.dataset.year===y); s.hidden=!on; if(on)n++;});
    tabs.forEach(function(t){t.setAttribute('aria-selected',t.dataset.year===y?'true':'false');});
    title.textContent = y==='all' ? 'All years' : y;
    count.textContent = n+(n===1?' story':' stories');
    track.scrollTo({left:0});
  }
  tabs.forEach(function(t){t.addEventListener('click',function(){show(t.dataset.year);});});
  show(tabs[0].dataset.year);
})();
(function(){
  var cats=document.querySelectorAll('.cats button'); if(!cats.length) return;
  function show(c,push){
    cats.forEach(function(b){b.setAttribute('aria-selected',b.dataset.cat===c?'true':'false');});
    document.querySelectorAll('.cat-panel').forEach(function(p){p.hidden=p.id!==c;});
    if(push) history.replaceState(null,'','#'+c);
  }
  cats.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.cat,true);});});
  var h=location.hash.replace('#','');
  if(h==='events'||h==='announcements') show(h,false);
})();
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.querySelector('.nav'), bar=document.querySelector('.progress');
  function onScroll(){
    var y=window.scrollY||0;
    if(nav) nav.classList.toggle('scrolled',y>40);
    if(bar){var h=document.documentElement.scrollHeight-window.innerHeight; bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';}
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(reduce||!('IntersectionObserver' in window)) return;

  // scroll reveal with gentle stagger inside groups
  var groups=['.gallery','.mods','.sa-grid','.moments','.facts','.rapid-grid','.chain','.grid','.stats','.pubs','.tl','.award-list','.jump','.years','.cats'];
  var singles=document.querySelectorAll('main h2, main .lead, .feature, .dir-top > *, .join > *, .hero-text .wrap > *');
  var items=[];
  singles.forEach(function(el){items.push(el);});
  groups.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(g){
      Array.prototype.forEach.call(g.children,function(c,i){c.style.setProperty('--d',Math.min(i,8)*0.09+'s');items.push(c);});
    });
  });
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  items.forEach(function(el){
    if(el.getBoundingClientRect().top<window.innerHeight*0.9){return;} // already in view: leave static
    el.classList.add('reveal'); io.observe(el);
  });

  // count-up numbers
  var nums=document.querySelectorAll('[data-count]');
  var io2=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting) return; io2.unobserve(e.target);
    var el=e.target,end=+el.dataset.count,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'',t0=null;
    function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1400),dec=(el.dataset.count.split('.')[1]||'').length,v=end*(1-Math.pow(1-p,3));el.textContent=pre+(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US'))+suf;if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  });},{threshold:.5});
  nums.forEach(function(n){io2.observe(n);});
})();
(function(){
  var chips=document.querySelectorAll('.chips button'); if(!chips.length) return;
  var cards=document.querySelectorAll('.sa');
  chips.forEach(function(c){c.addEventListener('click',function(){
    var w=c.dataset.who;
    chips.forEach(function(x){x.setAttribute('aria-selected',x===c?'true':'false');});
    cards.forEach(function(k,i){
      var on=(w==='all'||k.dataset.who===w);
      k.classList.toggle('hide',!on); k.classList.remove('pop');
      if(on){void k.offsetWidth; k.style.animationDelay=(i%8)*0.04+'s'; k.classList.add('pop');}
    });
  });});
})();
