
// Vidnexa Player — Shared Script
(function(){
  // Nav scroll effect
  const nav = document.querySelector('nav');
  if(nav){
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav-scroll', window.scrollY > 50);
    });
  }

  // Hamburger mobile menu (simple toggle)
  const ham = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if(ham && links){
    ham.addEventListener('click', () => {
      links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '70px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(6,8,24,.98)';
      links.style.padding = '20px';
      links.style.gap = '18px';
      links.style.borderBottom = '1px solid rgba(255,255,255,.08)';
    });
  }

  // Scroll reveal (IntersectionObserver)
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => obs.observe(el));

  // Count-up animation
  function countUp(el){
    const t = parseFloat(el.dataset.target);
    let c = 0; const s = t / 55;
    const tm = setInterval(() => {
      c = Math.min(c + s, t);
      el.textContent = t % 1 !== 0 ? c.toFixed(1) : Math.floor(c);
      if(c >= t) clearInterval(tm);
    }, 20);
  }
  const statsEl = document.getElementById('stats');
  if(statsEl){
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.querySelectorAll('.count[data-target]').forEach(countUp);
        }
      });
    }, { threshold: .5 }).observe(statsEl);
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });

  // Mini player on scroll
  const minip = document.getElementById('minip');
  if(minip){
    window.addEventListener('scroll', () => {
      if(window.scrollY > 700) minip.classList.add('show');
    });
  }

  // Active nav link (for inner pages)
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.getAttribute('href') === current) a.classList.add('active');
  });

  // Phone parallax
  const ph = document.getElementById('phonemock');
  if(ph){
    document.addEventListener('mousemove', e => {
      const dx = (e.clientX - window.innerWidth/2) / window.innerWidth * 10;
      const dy = (e.clientY - window.innerHeight/2) / window.innerHeight * 8;
      ph.style.transform = `perspective(1200px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
    });
  }

  // Particle canvas
  const c = document.getElementById('pcanvas');
  if(c){
    const x = c.getContext('2d');
    let W, H, pts = [];
    function resize(){ W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; }
    resize(); window.addEventListener('resize', resize);
    const cols = ['#7232FF','#FF3060','#00CFFF','#9B6EFF','#FFB300','#10D67A'];
    for(let i=0;i<70;i++) pts.push({x:Math.random()*1400,y:Math.random()*900,r:Math.random()*1.5+.4,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,o:Math.random()*.5+.1,c:cols[Math.floor(Math.random()*cols.length)]});
    function draw(){
      x.clearRect(0,0,W,H);
      pts.forEach(p => {
        x.beginPath(); x.arc(p.x,p.y,p.r,0,Math.PI*2);
        x.fillStyle=p.c; x.globalAlpha=p.o; x.fill();
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0) p.x=W; if(p.x>W) p.x=0;
        if(p.y<0) p.y=H; if(p.y>H) p.y=0;
      });
      x.globalAlpha=1; requestAnimationFrame(draw);
    }
    draw();
  }

})();
