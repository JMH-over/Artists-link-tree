const defaults={name:'Vine Jonas',bio:'Artist • Music • Culture',image:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=85',links:{spotify:'https://open.spotify.com/',apple:'https://music.apple.com/',youtube:'https://youtube.com/',audiomack:'https://audiomack.com/',tiktok:'https://tiktok.com/',instagram:'https://instagram.com/'}};
const labels={spotify:'Spotify',apple:'Apple Music',youtube:'YouTube',audiomack:'Audiomack',tiktok:'TikTok',instagram:'Instagram'};
const icons={spotify:'S',apple:'',youtube:'▶',audiomack:'A',tiktok:'♪',instagram:'◎'};
const fields=document.querySelector('#linkFields');
const saved=localStorage.getItem('artistLinkHub');
const data=saved?JSON.parse(saved):JSON.parse(JSON.stringify(defaults));
const $=s=>document.querySelector(s);

function render(){
  $('#artistName').textContent=data.name;
  $('#artistBio').textContent=data.bio;
  $('#profileImage').src=safeUrl(data.image)||defaults.image;
  $('#linksContainer').innerHTML=Object.entries(data.links).filter(([,url])=>url).map(([key,url],i)=>`<a class="link-card" style="animation-delay:${i*.07}s" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer"><span class="link-icon">${icons[key]}</span><span class="link-label">${labels[key]}</span><span class="arrow">↗</span></a>`).join('');
  $('#socialRow').innerHTML=Object.entries(data.links).filter(([key,url])=>['tiktok','instagram','youtube'].includes(key)&&url).map(([key,url])=>`<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer" aria-label="${labels[key]}">${icons[key]}</a>`).join('');
  fields.innerHTML=Object.entries(labels).map(([key,label])=>`<div class="link-field"><small>${label}</small><input data-link="${key}" type="url" value="${escapeHtml(data.links[key]||'')}" placeholder="https://..."></div>`).join('');
  $('#nameInput').value=data.name;
  $('#bioInput').value=data.bio;
  $('#imageInput').value=data.image;
  addCardEffects();
}
function safeUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),1800)}

$('#settingsTrigger').onclick=()=>$('#editor').classList.add('open');
$('#closeEditor').onclick=()=>$('#editor').classList.remove('open');
$('#saveButton').onclick=()=>{
  data.name=$('#nameInput').value.trim()||defaults.name;
  data.bio=$('#bioInput').value.trim()||defaults.bio;
  data.image=$('#imageInput').value.trim()||defaults.image;
  document.querySelectorAll('[data-link]').forEach(i=>data.links[i.dataset.link]=i.value.trim());
  localStorage.setItem('artistLinkHub',JSON.stringify(data));
  render();
  $('#editor').classList.remove('open');
  toast('Profile saved ✨');
};
$('#resetButton').onclick=()=>{
  localStorage.removeItem('artistLinkHub');
  Object.assign(data,JSON.parse(JSON.stringify(defaults)));
  render();
  toast('Demo restored');
};
$('#shareButton').onclick=async()=>{
  try{await navigator.clipboard.writeText(location.href);toast('Profile link copied!')}catch{toast('Copy the page URL from your browser')}};

function addCardEffects(){
  document.querySelectorAll('.link-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(700px) rotateX(${y*-3}deg) rotateY(${x*4}deg) translateY(-4px) scale(1.012)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

function createParticles(){
  const wrap=$('#particles');
  for(let i=0;i<28;i++){
    const p=document.createElement('span');
    p.className='particle';
    p.style.left=`${Math.random()*100}%`;
    p.style.animationDuration=`${7+Math.random()*12}s`;
    p.style.animationDelay=`-${Math.random()*12}s`;
    p.style.opacity=(.15+Math.random()*.4).toFixed(2);
    wrap.appendChild(p);
  }
}

function addRipples(){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('click',e=>{
      const r=el.getBoundingClientRect(),size=Math.max(r.width,r.height);
      const ripple=document.createElement('span');
      ripple.className='ripple';
      ripple.style.width=ripple.style.height=`${size}px`;
      ripple.style.left=`${e.clientX-r.left-size/2}px`;
      ripple.style.top=`${e.clientY-r.top-size/2}px`;
      el.appendChild(ripple);
      setTimeout(()=>ripple.remove(),700);
    });
  });
}

function setupCursor(){
  const glow=$('.cursor-glow');
  if(!glow)return;
  window.addEventListener('pointermove',e=>{glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`},{passive:true});
}

function setupProgress(){
  const bar=$('#progressBar');
  window.addEventListener('scroll',()=>{
    const doc=document.documentElement;
    const max=doc.scrollHeight-doc.clientHeight;
    bar.style.width=`${max>0?(scrollY/max)*100:0}%`;
  },{passive:true});
}

createParticles();
addRipples();
setupCursor();
setupProgress();
render();
