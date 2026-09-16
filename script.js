const defaults={name:'Vine Jonas',bio:'Artist • Music • Culture',image:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=85',links:{spotify:'https://open.spotify.com/',apple:'https://music.apple.com/',youtube:'https://youtube.com/',audiomack:'https://audiomack.com/',tiktok:'https://tiktok.com/',instagram:'https://instagram.com/'}};
const labels={spotify:'Spotify',apple:'Apple Music',youtube:'YouTube',audiomack:'Audiomack',tiktok:'TikTok',instagram:'Instagram'};
const icons={spotify:'S',apple:'',youtube:'▶',audiomack:'A',tiktok:'♪',instagram:'◎'};
const fields=document.querySelector('#linkFields');
const data=JSON.parse(localStorage.getItem('artistLinkHub'))||defaults;
const $=s=>document.querySelector(s);
function render(){
 $('#artistName').textContent=data.name; $('#artistBio').textContent=data.bio; $('#profileImage').src=data.image||defaults.image;
 $('#linksContainer').innerHTML=Object.entries(data.links).filter(([,url])=>url).map(([key,url])=>`<a class="link-card" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer"><span class="link-icon">${icons[key]}</span><span class="link-label">${labels[key]}</span><span class="arrow">↗</span></a>`).join('');
 $('#socialRow').innerHTML=Object.entries(data.links).filter(([key,url])=>['tiktok','instagram','youtube'].includes(key)&&url).map(([key,url])=>`<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer" aria-label="${labels[key]}">${icons[key]}</a>`).join('');
 fields.innerHTML=Object.entries(labels).map(([key,label])=>`<div class="link-field"><small>${label}</small><input data-link="${key}" type="url" value="${escapeHtml(data.links[key]||'')}" placeholder="https://..."></div>`).join('');
 $('#nameInput').value=data.name; $('#bioInput').value=data.bio; $('#imageInput').value=data.image;
}
function safeUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
$('#settingsTrigger').onclick=()=>$('#editor').classList.add('open'); $('#closeEditor').onclick=()=>$('#editor').classList.remove('open');
$('#saveButton').onclick=()=>{data.name=$('#nameInput').value.trim()||defaults.name;data.bio=$('#bioInput').value.trim()||defaults.bio;data.image=$('#imageInput').value.trim()||defaults.image;document.querySelectorAll('[data-link]').forEach(i=>data.links[i.dataset.link]=i.value.trim());localStorage.setItem('artistLinkHub',JSON.stringify(data));render();$('#editor').classList.remove('open');toast('Profile saved ✨')};
$('#resetButton').onclick=()=>{localStorage.removeItem('artistLinkHub');Object.assign(data,JSON.parse(JSON.stringify(defaults)));render();toast('Demo restored')};
$('#shareButton').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);toast('Profile link copied!')}catch{toast('Copy the page URL from your browser')}};
render();
