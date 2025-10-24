// Maison Fresh Coming Soon — UX microinteractions
const form = document.getElementById('notifyForm');
const msg = document.getElementById('formMsg');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) return;
  msg.textContent = 'Merci! You are on the list — see you at opening.';
  form.reset();
  setTimeout(()=> msg.textContent='', 6000);
});

// ===== Robust Countdown (supports ISO with/without timezone) =====
const hero = document.querySelector('.hero');
const targetStr = hero?.getAttribute('data-countdown') || '';
let target = null;

// Try multiple parsing strategies for cross-browser support
function parseTarget(str){
  if(!str) return null;
  // Prefer native ISO parsing if contains timezone or Z
  if(/[zZ]|[+-]\d{2}:?\d{2}$/.test(str)){
    const d = new Date(str);
    if(!isNaN(d)) return d;
  }
  // If 'YYYY-MM-DDTHH:MM:SS' without TZ -> treat as local time
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if(m){
    const [_,Y,M,D,h,mi,s] = m;
    return new Date(Number(Y), Number(M)-1, Number(D), Number(h), Number(mi), Number(s||'0'), 0);
  }
  // If 'YYYY-MM-DD' only
  const dOnly = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(dOnly){
    const [_,Y,M,D] = dOnly;
    return new Date(Number(Y), Number(M)-1, Number(D), 9, 0, 0, 0);
  }
  // Fallback native
  const d = new Date(str);
  if(!isNaN(d)) return d;
  return null;
}

target = parseTarget(targetStr);

const dd = document.getElementById('dd');
const hh = document.getElementById('hh');
const mm = document.getElementById('mm');
const ss = document.getElementById('ss');

function renderCountdown(remainSec){
  const d = Math.floor(remainSec/86400); remainSec -= d*86400;
  const h = Math.floor(remainSec/3600); remainSec -= h*3600;
  const m = Math.floor(remainSec/60);
  const s = remainSec - m*60;
  dd.textContent = String(d).padStart(2,'0');
  hh.textContent = String(h).padStart(2,'0');
  mm.textContent = String(m).padStart(2,'0');
  if(ss) ss.textContent = String(s).padStart(2,'0');
}

function startCountdown(){
  if(!target || isNaN(target.valueOf())){
    // fallback to +60 days at 09:00
    target = new Date(); target.setDate(target.getDate()+60); target.setHours(9,0,0,0);
  }
  const tick = ()=>{
    const now = new Date();
    let sec = Math.floor((target - now)/1000);
    if (sec <= 0){
      renderCountdown(0);
      const el = document.querySelector('.kicker');
      if(el) el.textContent = 'Now Open — visit us at St. Lawrence Market';
      return;
    }
    renderCountdown(sec);
    requestAnimationFrame(tickRAF);
  };
  function tickRAF(){ // smooth update but still 1s changes
    setTimeout(tick, 1000);
  }
  tick();
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

startCountdown();
