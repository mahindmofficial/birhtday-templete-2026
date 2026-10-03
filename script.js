/* ========================= EDIT HERE ========================= */
const CONFIG = {
  name: 'Jana',
  // Add photos to assets/photos/ and list their filenames here.
  photos: ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg']
};
/* ============================================================= */

const screens=[...document.querySelectorAll('.screen')];
const dots=document.getElementById('dots');
const progress=document.getElementById('progressBar');
let current=0;
const toastEl=document.getElementById('toast');

// Personalize name
for(const el of document.querySelectorAll('[data-name]')) el.textContent=CONFIG.name;
document.title=`Happy Birthday ${CONFIG.name} 💖`;

// Navigation dots
screens.forEach((_,i)=>{const b=document.createElement('button');b.className='dot';b.title=`Section ${i+1}`;b.onclick=()=>go(i);dots.appendChild(b)});
const dotEls=[...dots.children];
function go(i){
  current=Math.max(0,Math.min(screens.length-1,i));
  screens.forEach((s,j)=>s.classList.toggle('active',j===current));
  dotEls.forEach((d,j)=>d.classList.toggle('active',j===current));
  progress.style.width=((current+1)/screens.length*100)+'%';
  if(current===11) confettiBurst(130);
}
function next(){go(current+1)}
document.querySelectorAll('.next').forEach(b=>b.addEventListener('click',()=>{if(!b.disabled)next()}));

document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='PageDown')next();if(e.key==='ArrowLeft'||e.key==='PageUp')go(current-1)});
let wheelLock=false;
window.addEventListener('wheel',e=>{if(wheelLock)return;wheelLock=true;e.deltaY>0?next():go(current-1);setTimeout(()=>wheelLock=false,750)},{passive:true});

// Escaping No button: keeps the playful behavior from the recording
const noBtn=document.getElementById('noBtn');
let noClicks=0;
function dodge(){noClicks++;const x=(Math.random()*240)-120,y=(Math.random()*110)-55;noBtn.style.transform=`translate(${x}px,${y}px)`;document.getElementById('noHint').textContent=['Hmm... try Yes 😜','No is hiding today 😂','Okay okay, just press Yes 💗'][Math.min(noClicks-1,2)];if(noClicks>3)noBtn.style.opacity='.25'}
noBtn.addEventListener('mouseenter',dodge);noBtn.addEventListener('click',dodge);

// Cake blow interaction
const cake=document.getElementById('cake'),cakeNext=document.getElementById('cakeNext');
cake.addEventListener('click',()=>{cake.classList.add('blown');cakeNext.disabled=false;document.getElementById('cakeHint').textContent='Wish made! ✨ Now let’s cut the cake.';toast('Wish granted 💖')});

// Cake cutting
const cutCake=document.getElementById('cutCake'),cutNext=document.getElementById('cutNext');
cutCake.addEventListener('click',()=>{cutCake.classList.add('cut');cutNext.disabled=false;confettiBurst(45);toast('Cake cut! 🎂')});

// Gallery: local editable files + user-selected files
const grid=document.getElementById('photoGrid');
function addPhoto(src,alt='Memory'){const img=document.createElement('img');img.src=src;img.alt=alt;img.loading='lazy';img.onerror=()=>img.remove();grid.appendChild(img)}
CONFIG.photos.forEach((p,i)=>addPhoto(`assets/photos/${p}`,`Memory ${i+1}`));
document.getElementById('photoUpload').addEventListener('change',e=>{[...e.target.files].forEach(file=>{const r=new FileReader();r.onload=()=>addPhoto(r.result,file.name);r.readAsDataURL(file)})});
if(!grid.children.length){for(let i=0;i<6;i++){const d=document.createElement('div');d.style.cssText='aspect-ratio:1;border-radius:18px;border:1px dashed rgba(255,130,194,.25);display:grid;place-items:center;color:#8f7c93;background:rgba(255,255,255,.025)';d.textContent=`Photo ${i+1}`;grid.appendChild(d)}}

// Balloons
const field=document.getElementById('balloonField');let left=8;document.getElementById('balloonCount').textContent=left;
const balloonStyles=['#ff4f2e','#ff4fa3','#58d9ff','#9d66ff','#8dff88','#ffdc27','#d80055','#5be1ff'];
for(let i=0;i<8;i++){const b=document.createElement('button');b.className='balloon';b.setAttribute('aria-label','Pop balloon');b.style.left=(8+Math.random()*82)+'%';b.style.top=(10+Math.random()*68)+'%';b.style.background=balloonStyles[i];b.style.borderColor=balloonStyles[i];b.style.animationDelay=(Math.random()*1.8)+'s';b.onclick=()=>{if(b.classList.contains('popped'))return;b.classList.add('popped');setTimeout(()=>b.remove(),220);left--;document.getElementById('balloonCount').textContent=left;if(left===0){document.getElementById('balloonNext').disabled=false;confettiBurst(55);toast('All balloons popped! 🎈')}};field.appendChild(b)}

// Wishes
const wishTexts=['May your heart always have a reason to smile. 💗','May your dreams become beautiful memories. ✨','May this year be gentle, joyful, and unforgettable. 🌸'];
document.querySelectorAll('.wish').forEach((b,i)=>b.addEventListener('click',()=>{b.classList.add('revealed');b.textContent=wishTexts[i]}));

// Gift
const gift=document.getElementById('gift'),giftNext=document.getElementById('giftNext');gift.addEventListener('click',()=>{gift.classList.add('open');giftNext.disabled=false;confettiBurst(35);toast('Surprise unlocked 🎁')});

document.getElementById('replay').onclick=()=>go(0);

function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>toastEl.classList.remove('show'),1800)}

// Cursor glow
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

// Confetti canvas
const canvas=document.getElementById('confetti'),ctx=canvas.getContext('2d');let conf=[];function resize(){canvas.width=innerWidth;canvas.height=innerHeight}resize();addEventListener('resize',resize);
function confettiBurst(count=70){for(let i=0;i<count;i++)conf.push({x:innerWidth/2+(Math.random()-.5)*160,y:innerHeight*.48,vx:(Math.random()-.5)*10,vy:Math.random()*-9-3,g:0.25,r:Math.random()*6+3,a:1,rot:Math.random()*6.28,vr:(Math.random()-.5)*.3})}
function tick(){ctx.clearRect(0,0,canvas.width,canvas.height);conf=conf.filter(p=>p.a>0);for(const p of conf){p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.a-=.008;ctx.save();ctx.globalAlpha=p.a;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=['#ff4fa3','#ffd45b','#7ce7ff','#b887ff','#72f0c6','#fff'][Math.floor(Math.random()*6)];ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.7);ctx.restore()}requestAnimationFrame(tick)}tick();

go(0);
