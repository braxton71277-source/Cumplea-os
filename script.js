/* ===== Corazones flotantes (limitados + se pausan si la pestaña no está visible) ===== */
const FH = document.getElementById('floatingHearts');
const MAX_HEARTS = 12;
let heartsCount = 0;
let pageHidden = document.hidden;

function heart() {
  if (!FH || pageHidden || heartsCount >= MAX_HEARTS) return;
  const s = document.createElement('span');
  s.className = 'float-heart';
  s.textContent = Math.random() > .2 ? '♥' : '✦';
  s.style.setProperty('--x', Math.random() * 100 + '%');
  s.style.setProperty('--s', 12 + Math.random() * 24 + 'px');
  s.style.setProperty('--d', 7 + Math.random() * 7 + 's');
  FH.appendChild(s);
  heartsCount++;
  setTimeout(() => { s.remove(); heartsCount--; }, 15000);
}
setInterval(heart, 800);

/* aca el mensaje */
const modal = document.getElementById('modal');
const open = document.getElementById('openMsg');
const close = document.getElementById('close');
const modal2 = document.getElementById('modal2');
const open2 = document.getElementById('openMsg2');
const close2 = document.getElementById('close2');


if (open) open.onclick = () => modal.classList.add('show');
if (close) close.onclick = () => modal.classList.remove('show');
if (modal) modal.onclick = e => { if (e.target === modal) modal.classList.remove('show') };
if (open2) open2.onclick = () => modal2.classList.add('show');
if (close2) close2.onclick = () => modal2.classList.remove('show');
if (modal2) modal2.onclick = e => { if (e.target === modal2) modal2.classList.remove('show') };

/* recordatorio aca el audio*/
const audio = document.getElementById('audio'), play = document.getElementById('play'),
  mini = document.getElementById('musicMini'), status = document.getElementById('status'),
  vol = document.getElementById('vol');

function toggle() {
  if (!audio) return;
  if (audio.paused) {
    audio.play().then(() => {
      if (status) status.textContent = 'Reproduciendo...';
      if (play) play.textContent = 'Ⅱ';
      if (mini) mini.textContent = 'Ⅱ';
    }).catch(() => { if (status) status.textContent = 'Agrega music/cancion.mp3' });
  } else {
    audio.pause();
    if (status) status.textContent = 'Pausada';
    if (play) play.textContent = '♫';
    if (mini) mini.textContent = '♫';
  }
}
if (play) play.onclick = toggle;
if (mini) mini.onclick = toggle;
if (vol && audio) vol.oninput = () => audio.volume = +vol.value;

/* aca empieza las particulas recordatorio*/
const c = document.getElementById('sparkCanvas');
if (c) {
  const x = c.getContext('2d');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PARTICLE_COUNT = reduceMotion ? 0 : 180;
  let w = 0, h = 0, ps = [];
  let running = !document.hidden;

  
  const glowSize = 28;
  const glow = document.createElement('canvas');
  glow.width = glow.height = glowSize;
  const gctx = glow.getContext('2d');
  const grad = gctx.createRadialGradient(glowSize / 2, glowSize / 2, 0, glowSize / 2, glowSize / 2, glowSize / 2);
  grad.addColorStop(0, 'rgba(255,150,220,1)');
  grad.addColorStop(0.5, 'rgba(255,90,205,0.6)');
  grad.addColorStop(1, 'rgba(255,90,205,0)');
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, glowSize, glowSize);

  function size() {
    const r = c.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 1.5); // límite de nitidez para no dibujar de más
    w = r.width; h = r.height;
    c.width = w * d; c.height = h * d;
    x.setTransform(d, 0, 0, d, 0, 0);
    ps = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r2 = (Math.min(w, h) * .30) + (Math.random() * Math.min(w, h) * .18);
      ps.push({
        x: w / 2 + Math.cos(a) * r2,
        y: h * .48 + Math.sin(a) * r2 * .72,
        v: Math.random() * .4 + .15,
        s: Math.random() * 1.8 + .6,
        a: Math.random() * .5 + .2
      });
    }
  }

  function draw(t) {
    requestAnimationFrame(draw);
    if (!running || PARTICLE_COUNT === 0) return;
    x.clearRect(0, 0, w, h);
    x.globalCompositeOperation = 'lighter';
    for (const p of ps) {
      p.y -= p.v * .2;
      p.x += Math.sin(t / 900 + p.y) * .08;
      if (p.y < 0) p.y = h + 20;
      x.globalAlpha = p.a;
      const sz = p.s * 7;
      x.drawImage(glow, p.x - sz / 2, p.y - sz / 2, sz, sz);
    }
    x.globalAlpha = 1;
  }

  size();
  requestAnimationFrame(draw);
  addEventListener('resize', size);
}

/* Pausar las animaciones cuando no se vean recordatorio */
document.addEventListener('visibilitychange', () => {
  pageHidden = document.hidden;
});
