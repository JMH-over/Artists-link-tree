const platformCatalog={
 spotify:{label:'Spotify',icon:'S',placeholder:'https://open.spotify.com/...'},
 apple:{label:'Apple Music',icon:'',placeholder:'https://music.apple.com/...'},
 youtube:{label:'YouTube',icon:'▶',placeholder:'https://youtube.com/...'},
 audiomack:{label:'Audiomack',icon:'A',placeholder:'https://audiomack.com/...'},
 deezer:{label:'Deezer',icon:'D',placeholder:'https://www.deezer.com/...'},
 pandora:{label:'Pandora',icon:'P',placeholder:'https://www.pandora.com/...'},
 amazon:{label:'Amazon Music',icon:'AM',placeholder:'https://music.amazon.com/...'},
 tidal:{label:'TIDAL',icon:'T',placeholder:'https://tidal.com/...'},
 boomplay:{label:'Boomplay',icon:'B',placeholder:'https://www.boomplay.com/...'},
 soundcloud:{label:'SoundCloud',icon:'SC',placeholder:'https://soundcloud.com/...'},
 tiktok:{label:'TikTok',icon:'♪',placeholder:'https://tiktok.com/@...'},
 instagram:{label:'Instagram',icon:'◎',placeholder:'https://instagram.com/...'},
 facebook:{label:'Facebook',icon:'f',placeholder:'https://facebook.com/...'},
 x:{label:'X',icon:'𝕏',placeholder:'https://x.com/...'},
 website:{label:'Website',icon:'↗',placeholder:'https://yourwebsite.com/...'},
 whatsapp:{label:'WhatsApp',icon:'WA',placeholder:'https://wa.me/...'}
};
const defaults={name:'Vine Jonas',bio:'Independent music artist • New music & links',image:'assets/vine-jonas-avatar.webp',links:{spotify:'https://open.spotify.com/artist/2gL6H8h3Et6TlWgJbYkosM',apple:'https://music.apple.com/us/artist/vine-jonas/1879792254',audiomack:'https://audiomack.com/vinejonas',tidal:'https://tidal.com/artist/23165351/u',deezer:'https://www.deezer.com/artist/120727252',amazon:'https://music.amazon.com/artists/B08TLH4Z55?ref=dm_ff_amazonmusic_3p',youtube:'https://youtube.com/channel/UCHYa50_gQDoEmUu8WmQ2fNQ?si=djYmE0o4huvyXeNm'}};
const fields=document.querySelector('#linkFields');
const STORAGE_KEY='artistLinkHub:vine-jonas';
const saved=localStorage.getItem(STORAGE_KEY);
const raw=saved?JSON.parse(saved):JSON.parse(JSON.stringify(defaults));
const data={...raw,links:{...raw.links}};
// Correct legacy Vine Jonas links saved before the latest Spotify profile URL update.
if(data.links.spotify?.includes('open.spotify.com/artist/2gL6H8h3Et6TWgJbYkosM')) data.links.spotify='https://open.spotify.com/artist/2gL6H8h3Et6TlWgJbYkosM';
if(data.links.audiomack==='https://audiomack.com/vinejns') data.links.audiomack='https://audiomack.com/vinejonas';
if(data.image==='https://raw.githubusercontent.com/JMH-over/Artists-link-tree/main/assets/vine-jonas-avatar.webp') data.image='assets/vine-jonas-avatar.webp';
localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
const $=s=>document.querySelector(s);
function safeUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function makeSlug(name){return (name||'artist').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'artist'}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),1800)}
function getPublicEntries(){return Object.entries(data.links).filter(([,url])=>url)}
function getEditorEntries(){return Object.entries(data.links)}
function render(){
 $('#artistName').textContent=data.name; $('#artistBio').textContent=data.bio;
 $('#profileImage').src=safeUrl(data.image)||defaults.image; $('#avatarPreview').src=safeUrl(data.image)||defaults.image;
 $('#linksContainer').innerHTML=getPublicEntries().map(([key,url],i)=>{const p=platformCatalog[key]||{label:key,icon:'↗'};return `<a class="link-card" style="animation-delay:${i*.07}s" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer"><span class="link-icon">${escapeHtml(p.icon)}</span><span class="link-label">${escapeHtml(p.label)}</span><span class="arrow">↗</span></a>`}).join('');
 $('#socialRow').innerHTML=getPublicEntries().filter(([key])=>['tiktok','instagram','youtube','facebook','x'].includes(key)).map(([key,url])=>{const p=platformCatalog[key];return `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer" aria-label="${p.label}">${escapeHtml(p.icon)}</a>`}).join('');
 renderLinkFields();
 $('#nameInput').value=data.name; $('#bioInput').value=data.bio; $('#pageSlug').textContent=makeSlug(data.name);
 addCardEffects();
}
function renderLinkFields(){
 fields.innerHTML=getEditorEntries().map(([key,url],index)=>{const p=platformCatalog[key]||{label:key,icon:'↗',placeholder:'https://...'};return `<div class="link-field"><div class="link-field-head"><small>${escapeHtml(p.label)}</small><button type="button" class="remove-link" data-index="${index}" aria-label="Remove ${escapeHtml(p.label)}">Remove</button></div><select data-platform-index="${index}">${Object.entries(platformCatalog).map(([id,item])=>`<option value="${id}" ${id===key?'selected':''}>${escapeHtml(item.label)}</option>`).join('')}</select><input data-link-index="${index}" type="url" value="${escapeHtml(url)}" placeholder="${escapeHtml(p.placeholder)}"></div>`}).join('');
 document.querySelectorAll('.remove-link').forEach(btn=>btn.onclick=()=>{const entries=getEditorEntries();const index=Number(btn.dataset.index);if(entries[index])delete data.links[entries[index][0]];renderLinkFields();toast('Link removed — save changes')});
 document.querySelectorAll('[data-platform-index]').forEach(select=>select.onchange=()=>{const entries=getEditorEntries(),index=Number(select.dataset.platformIndex),oldKey=entries[index]?.[0],url=entries[index]?.[1]||'';const newKey=select.value;if(oldKey&&oldKey!==newKey){delete data.links[oldKey];data.links[newKey]=url}renderLinkFields()});
}
$('#addLinkButton').onclick=()=>{let key=Object.keys(platformCatalog).find(id=>!Object.prototype.hasOwnProperty.call(data.links,id));if(!key)key='website';let suffix=1;while(Object.prototype.hasOwnProperty.call(data.links,key)){key=`website-${suffix++}`}data.links[key]='';renderLinkFields();const last=fields.querySelector('.link-field:last-child input');last?.focus();toast('New link added')};
$('#settingsTrigger').onclick=()=>$('#editor').classList.add('open');
$('#closeEditor').onclick=()=>$('#editor').classList.remove('open');
document.querySelectorAll('.tab').forEach(tab=>tab.onclick=()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));tab.classList.add('active');$('#'+tab.dataset.tab+'Panel').classList.add('active')});
$('#avatarUpload').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;if(file.size>4*1024*1024){toast('Avatar must be under 4MB');e.target.value='';return}const reader=new FileReader();reader.onload=()=>{data.image=reader.result;$('#avatarPreview').src=reader.result;toast('Avatar ready — save changes')};reader.readAsDataURL(file)});
$('#saveButton').onclick=()=>{data.name=$('#nameInput').value.trim()||defaults.name;data.bio=$('#bioInput').value.trim()||defaults.bio;const nextLinks={};document.querySelectorAll('[data-link-index]').forEach(input=>{const index=Number(input.dataset.linkIndex);const entries=getEditorEntries();const key=entries[index]?.[0];if(key)nextLinks[key]=input.value.trim()});data.links=nextLinks;localStorage.setItem(STORAGE_KEY,JSON.stringify(data));render();$('#editor').classList.remove('open');toast('Profile saved ✨')};
$('#resetButton').onclick=()=>{localStorage.removeItem(STORAGE_KEY);Object.assign(data,JSON.parse(JSON.stringify(defaults)));render();toast('Demo restored')};
async function copyText(text,msg){try{await navigator.clipboard.writeText(text);toast(msg)}catch{toast('Copy the page URL from your browser')}}
$('#shareButton').onclick=()=>copyText(location.href,'Profile link copied!');$('#copySlug').onclick=()=>copyText(location.href,'Profile link copied!');
function addCardEffects(){document.querySelectorAll('.link-card').forEach(card=>{card.onpointermove=e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(700px) rotateX(${y*-3}deg) rotateY(${x*4}deg) translateY(-4px) scale(1.012)`};card.onpointerleave=()=>card.style.transform=''})}
function createParticles(){const wrap=$('#particles');for(let i=0;i<28;i++){const p=document.createElement('span');p.className='particle';p.style.left=`${Math.random()*100}%`;p.style.animationDuration=`${7+Math.random()*12}s`;p.style.animationDelay=`-${Math.random()*12}s`;wrap.appendChild(p)}}
function addRipples(){document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('click',e=>{const r=el.getBoundingClientRect(),size=Math.max(r.width,r.height),ripple=document.createElement('span');ripple.className='ripple';ripple.style.width=ripple.style.height=`${size}px`;ripple.style.left=`${e.clientX-r.left-size/2}px`;ripple.style.top=`${e.clientY-r.top-size/2}px`;el.appendChild(ripple);setTimeout(()=>ripple.remove(),700)}))}
function setupCursor(){const glow=$('.cursor-glow');window.addEventListener('pointermove',e=>{glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`},{passive:true})}
function setupProgress(){const bar=$('#progressBar');window.addEventListener('scroll',()=>{const d=document.documentElement,max=d.scrollHeight-d.clientHeight;bar.style.width=`${max>0?(scrollY/max)*100:0}%`},{passive:true})}
createParticles();addRipples();setupCursor();setupProgress();render();
