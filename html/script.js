// nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
}

// scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{ threshold:0.15 });
document.querySelectorAll('.reveal').forEach((el,i)=>{
  el.style.setProperty('--i', el.dataset.i || (i % 8));
  io.observe(el);
});

// count-up
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
    const decimals = el.dataset.count.includes('.') ? 1 : 0;
    const start = performance.now(), dur = 1300;
    function tick(now){
      const p = Math.min(1,(now-start)/dur), eased = 1-Math.pow(1-p,3), val = end*eased;
      el.textContent = (decimals ? val.toFixed(1) : Math.round(val)) + suffix;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
},{ threshold:0.6 });
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

// duplicate review marquee for seamless loop
document.querySelectorAll('.rev-track').forEach(t=>{ t.innerHTML += t.innerHTML; });

// floating music player: appear after hero, expand on click
const mp = document.getElementById('miniPlayer');
if(mp){
  const showAt = 400;
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > showAt) mp.classList.add('show');
    else mp.classList.remove('show');
  }, { passive:true });
  mp.addEventListener('click', (e)=>{
    if(e.target.closest('.mp-close')){ mp.classList.remove('expanded'); return; }
    mp.classList.toggle('expanded');
  });
}

// theme toggle (light/dark) — session only, no persistent storage
const themeToggle = document.getElementById('themeToggle');
if(themeToggle){
  const root = document.documentElement;
  themeToggle.addEventListener('click', ()=>{
    const isDark = root.getAttribute('data-theme') !== 'light';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.textContent = isDark ? '🌙' : '☀';
  });
}

// ===== HDR compare drag slider =====
(function(){
  const wrap = document.getElementById('hdrCompare');
  if(!wrap) return;
  const after = wrap.querySelector('.hdr-after');
  const divider = wrap.querySelector('.hdr-divider');
  let dragging = false;
  function setPos(clientX){
    const r = wrap.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    after.style.width = pct + '%';
    divider.style.left = pct + '%';
    const afterImg = after.querySelector('img');
    if(afterImg) afterImg.style.width = (100 / (pct/100)) + '%';
  }
  // Mouse: drag anywhere is fine on desktop
  wrap.addEventListener('mousedown', e=>{ dragging=true; setPos(e.clientX); });
  window.addEventListener('mousemove', e=>{ if(dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', ()=>{ dragging=false; });

  // Touch: only start dragging from the divider handle, and only take over
  // once the finger is clearly moving horizontally — otherwise let the page scroll.
  const handle = wrap.querySelector('.hdr-divider');
  let startX = 0, startY = 0, decided = false, horiz = false;

  function touchStart(e){
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    decided = false; horiz = false;
    // start candidate only if the touch began near the divider handle
    const r = handle.getBoundingClientRect();
    const nearHandle = Math.abs(t.clientX - (r.left + r.width/2)) < 44;
    dragging = nearHandle;
  }
  function touchMove(e){
    if(!dragging) return;
    const t = e.touches[0];
    if(!decided){
      const dx = Math.abs(t.clientX - startX);
      const dy = Math.abs(t.clientY - startY);
      if(dx < 6 && dy < 6) return;          // too small to decide yet
      horiz = dx > dy;                       // horizontal intent?
      decided = true;
      if(!horiz){ dragging = false; return; } // vertical -> release, allow scroll
    }
    if(horiz){ e.preventDefault(); setPos(t.clientX); }
  }
  function touchEnd(){ dragging=false; decided=false; horiz=false; }

  wrap.addEventListener('touchstart', touchStart, {passive:true});
  wrap.addEventListener('touchmove', touchMove, {passive:false});
  wrap.addEventListener('touchend', touchEnd);
})();

// ===== AI voice command cycle =====
(function(){
  const cmds = document.querySelectorAll('.voice-cmds .vc');
  const mic = document.getElementById('voiceMic');
  if(!cmds.length) return;
  let i = 0;
  setInterval(()=>{
    cmds.forEach(c=>c.classList.remove('active'));
    cmds[i].classList.add('active');
    if(mic){ mic.classList.add('listening'); setTimeout(()=>mic.classList.remove('listening'), 900); }
    i = (i+1) % cmds.length;
  }, 1800);
})();

// ===== Floating feature demo widget (HDR+ & Voice, CSS-animated, no media) =====
(function(){
  const mv = document.getElementById('miniVideo');
  if(!mv) return;
  const label = document.getElementById('mvLabel');

  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 700) mv.classList.add('show');
    else mv.classList.remove('show');
  }, { passive:true });

  mv.addEventListener('click', (e)=>{
    if(e.target.closest('.mv-close')){ mv.classList.remove('expanded'); return; }
    mv.classList.toggle('expanded');
  });

  // rotate the small caption between the two features
  const cmds = ['"Play next"','"Volume up"','"Turn on HDR"','"Find music"'];
  const captions = ['HDR+ tone mapping','AI voice control'];
  let ci = 0, capi = 0;
  const cmdEl = mv.querySelector('.demo-cmd');
  setInterval(()=>{ if(cmdEl){ cmdEl.textContent = cmds[ci % cmds.length]; ci++; } }, 2000);
  setInterval(()=>{ if(label){ label.textContent = captions[capi % captions.length]; capi++; } }, 4000);
})();

// ===================== VOICE SEARCH / NAVIGATION =====================
(function(){
  const btn = document.getElementById('voiceSearchBtn');
  if(!btn) return;
  const panel = document.getElementById('voiceSearchPanel');
  const statusEl = document.getElementById('vsStatus');
  const heardEl = document.getElementById('vsHeard');

  // Map of spoken keywords -> section id on the page.
  // Multiple keywords (English + Hindi/Hinglish) can point to one section.
  const MAP = [
    { id:'hdr',        keys:['hdr','h d r','contrast','colour','color','brightness','दृश्य'] },
    { id:'voice',      keys:['voice','ai','आवाज','voice control','microphone','mic','बोल'] },
    { id:'features',   keys:['feature','features','what it does','tools','फीचर','सुविधा'] },
    { id:'formats',    keys:['format','formats','mkv','mp4','codec','फॉर्मेट'] },
    { id:'screenshots',keys:['screenshot','screenshots','screens','photos','pictures','स्क्रीन'] },
    { id:'reviews',    keys:['review','reviews','ratings','rating','stars','रिव्यू','रेटिंग'] },
    { id:'faq',        keys:['faq','question','questions','help','doubt','सवाल','प्रश्न'] },
    { id:'blog',       keys:['blog','article','guide','guides','post','posts','ब्लॉग'] },
  ];
  // Actions that aren't just scrolling
  function runCommand(text){
    const t = text.toLowerCase();

    // download / install / get app -> open Play Store
    if(/(download|install|get the app|get app|play store|डाउनलोड|इंस्टॉल)/.test(t)){
      say('Opening the Play Store…');
      window.open('https://play.google.com/store/apps/details?id=com.vidnexa.videoplayer','_blank');
      return true;
    }
    // top / home / up
    if(/(top|home|up|start|ऊपर|शुरू)/.test(t)){
      say('Going to the top');
      window.scrollTo({ top:0, behavior:'smooth' });
      return true;
    }
    // theme
    if(/(dark|light|theme|black|white|थीम)/.test(t)){
      const tog = document.getElementById('themeToggle');
      if(tog){ say('Switching theme'); tog.click(); return true; }
    }
    // section matches
    for(const item of MAP){
      if(item.keys.some(k => t.includes(k))){
        const el = document.getElementById(item.id);
        if(el){
          say('Going to ' + item.id.toUpperCase());
          el.scrollIntoView({ behavior:'smooth', block:'start' });
          el.classList.add('vs-flash');
          setTimeout(()=>el.classList.remove('vs-flash'), 1600);
          return true;
        }
      }
    }
    say("Sorry, I couldn't find that. Try: features, HDR, reviews, formats, FAQ or download.");
    return false;
  }

  function say(msg){ if(statusEl) statusEl.textContent = msg; }

  // Web Speech API
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){
    // Fallback: no speech support -> show a text box instead
    btn.addEventListener('click', ()=>{
      panel.classList.add('open');
      say('Voice not supported here — type what you want to find:');
      showTextFallback();
    });
    return;
  }

  const rec = new SR();
  rec.lang = 'en-IN';            // works reasonably for Hinglish too
  rec.interimResults = true;
  rec.continuous = false;
  let listening = false;

  btn.addEventListener('click', ()=>{
    if(listening){ rec.stop(); return; }
    panel.classList.add('open');
    heardEl.textContent = '';
    say('Listening… say what you want to find');
    try { rec.start(); } catch(e){}
  });

  rec.onstart = ()=>{ listening = true; btn.classList.add('listening'); };
  rec.onend   = ()=>{ listening = false; btn.classList.remove('listening'); };
  rec.onerror = (e)=>{ say('Mic error: ' + e.error + '. Please allow microphone access.'); };

  rec.onresult = (e)=>{
    let txt = '';
    for(let i=0;i<e.results.length;i++){ txt += e.results[i][0].transcript; }
    heardEl.textContent = '“' + txt + '”';
    if(e.results[e.results.length-1].isFinal){
      runCommand(txt);
      setTimeout(()=>{ panel.classList.remove('open'); }, 2600);
    }
  };

  function showTextFallback(){
    if(document.getElementById('vsText')) return;
    const inp = document.createElement('input');
    inp.id = 'vsText'; inp.type='text'; inp.placeholder='e.g. reviews, HDR, download';
    inp.className = 'vs-text';
    inp.addEventListener('keydown', ev=>{ if(ev.key==='Enter'){ runCommand(inp.value); } });
    panel.appendChild(inp);
    inp.focus();
  }

  // close panel on outside click
  document.addEventListener('click', (e)=>{
    if(!panel.contains(e.target) && !btn.contains(e.target)) panel.classList.remove('open');
  });
})();

// ===== Gesture overlay caption rotation (syncs with 12s CSS loop) =====
(function(){
  const cap = document.getElementById('govCaption');
  if(!cap) return;
  const steps = [
    'Swipe left edge up  →  Volume up',
    'Swipe right edge up  →  Brightness up',
    'Double-tap left  →  Rewind 10s',
    'Double-tap right  →  Forward 10s'
  ];
  let i = 0;
  cap.textContent = steps[0];
  setInterval(()=>{ i = (i+1) % steps.length; cap.textContent = steps[i]; }, 3000);
})();
