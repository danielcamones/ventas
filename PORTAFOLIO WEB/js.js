// ═══════════════════════════════════════════
// PARTICLES ENGINE (NATURAL)
// ═══════════════════════════════════════════
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
let W, H;
const mouse = {x:-9999,y:-9999};

function resize(){
  W = cvs.width = window.innerWidth;
  H = cvs.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; });

const PAL = ['rgba(6,182,212,','rgba(59,130,246,','rgba(139,92,246,','rgba(16,185,129,','rgba(245,158,11,'];

class Particle {
  constructor(){ this.reset(); }
  reset(){
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-.5)*.3; this.vy = (Math.random()-.5)*.3;
    this.r = Math.random()*2+.4;
    this.col = PAL[Math.floor(Math.random()*PAL.length)];
    this.alpha = Math.random()*.4+.08;
    this.life = this.maxLife = Math.random()*250+100;
    this.type = Math.random()>.8 ? 'diamond' : 'circle';
  }
  update(){
    const dx=this.x-mouse.x, dy=this.y-mouse.y, dist=Math.hypot(dx,dy);
    if(dist<140){ const f=140/dist; this.vx+=dx/dist*f*.015; this.vy+=dy/dist*f*.015; }
    this.vx *= .985; this.vy *= .985;
    this.x += this.vx; this.y += this.vy;
    this.life--;
    if(this.life<=0||this.x<-20||this.x>W+20||this.y<-20||this.y>H+20) this.reset();
  }
  draw(){
    const a = this.alpha*(this.life/this.maxLife);
    ctx.fillStyle = this.col+a+')';
    if(this.type==='diamond'){
      ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(Math.PI/4);
      ctx.fillRect(-this.r,-this.r,this.r*2,this.r*2); ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
    }
  }
}

function drawConnections(particles){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const p=particles[i], q=particles[j];
      const d = Math.hypot(p.x-q.x, p.y-q.y);
      if(d<90){
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
        ctx.strokeStyle = `rgba(6,182,212,${(1-d/90)*.05})`;
        ctx.lineWidth = .5; ctx.stroke();
      }
    }
  }
}

const particles = Array.from({length:120},()=>new Particle());
(function frame(){
  ctx.clearRect(0,0,W,H);
  drawConnections(particles);
  particles.forEach(p=>{ p.update(); p.draw(); });
  requestAnimationFrame(frame);
})();

// ═══════════════════════════════════════════
// NATIVE TYPEWRITER EFFECT (INFINITO Y MÁS LENTO)
// ═══════════════════════════════════════════
const typewriterContainer = document.getElementById('typewriter-container');
const fullTextToType = "Daniel<br><span class='accent'>Eduardo</span><br>Camones C.";

let charIndex = 0;
let isDeleting = false;
let currentHTML = "";

function typeEffectLoop() {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = fullTextToType;
  
  let rawChars = [];
  function parseNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      for (let c of node.nodeValue) rawChars.push({ type: 'char', value: c });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') {
        rawChars.push({ type: 'tag', value: '<br>' });
      } else if (node.tagName === 'SPAN') {
        rawChars.push({ type: 'startSpan', value: "<span class='accent'>" });
        for (let child of node.childNodes) parseNodes(child);
        rawChars.push({ type: 'endSpan', value: "</span>" });
      }
    }
  }
  tempDiv.childNodes.forEach(parseNodes);

  function buildHTMLStr(upto) {
    let str = "";
    let openSpan = false;
    let count = 0;
    
    for (let i = 0; i < rawChars.length; i++) {
      let item = rawChars[i];
      if (item.type === 'startSpan') { openSpan = true; str += item.value; }
      else if (item.type === 'endSpan') { openSpan = false; str += item.value; }
      else if (item.type === 'tag') { str += item.value; }
      else if (item.type === 'char') {
        if (count < upto) { str += item.value; count++; }
        else { break; }
      }
    }
    return str;
  }

  const totalLetters = rawChars.filter(i => i.type === 'char').length;

  if (!isDeleting) {
    currentHTML = buildHTMLStr(charIndex);
    typewriterContainer.innerHTML = currentHTML + "<span class='typed-cursor'>|</span>";
    charIndex++;

    if (charIndex > totalLetters) {
      isDeleting = true;
      setTimeout(typeEffectLoop, 2500);
    } else {
      setTimeout(typeEffectLoop, 150);
    }
  } else {
    charIndex--;
    currentHTML = buildHTMLStr(charIndex);
    typewriterContainer.innerHTML = currentHTML + "<span class='typed-cursor'>|</span>";

    if (charIndex === 0) {
      isDeleting = false;
      setTimeout(typeEffectLoop, 800);
    } else {
      setTimeout(typeEffectLoop, 70);
    }
  }
}

setTimeout(typeEffectLoop, 500);

// ═══════════════════════════════════════════
// NAVBAR SCROLL & ACTIVE LINKS
// ═══════════════════════════════════════════
const navbar = document.getElementById('navbar');
const btt = document.getElementById('btt');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled', window.scrollY>50);
  btt.classList.toggle('show', window.scrollY>400);
  
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  let current='';
  sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-100) current=s.id; });
  navAs.forEach(a=>{ a.classList.toggle('active', a.getAttribute('href')==='#'+current); });
});

// ═══════════════════════════════════════════
// MOBILE MENU LÓGICA
// ═══════════════════════════════════════════
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click',()=>{
  mobileMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if(mobileMenu.classList.contains('open')){
    spans[0].style.transform='rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity='0';
    spans[2].style.transform='rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s=>{s.style.transform='';s.style.opacity='';});
  }
});

function closeMobile(){
  mobileMenu.classList.remove('open');
  const spans = burger.querySelectorAll('span');
  spans.forEach(s=>{s.style.transform='';s.style.opacity='';});
}

// ═══════════════════════════════════════════
// SCROLL REVEAL OBSERVER
// ═══════════════════════════════════════════
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      e.target.querySelectorAll('.prog-fill').forEach(bar=>{
        setTimeout(()=>bar.classList.add('animate'),300);
      });
      observer.unobserve(e.target);
    }
  });
},{threshold:0.12,rootMargin:'0px 0px -50px 0px'});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});