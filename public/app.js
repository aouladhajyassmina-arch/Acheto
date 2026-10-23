const $=(s,e=document)=>e.querySelector(s)||Object.assign(document.createElement('div'),{value:''}),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const API='api/annonces.php',AUTH='api/auth.php',E={auto:'🚗',immo:'🏠',tech:'📱',mode:'👗',maison:'🛋️'},CN={auto:'Auto',immo:'Immo',tech:'Tech',mode:'Mode',maison:'Maison'};
const G={auto:'#DDE3E8,#3A0F34',immo:'#EAAA00,#3A0F34',tech:'#E9EDF0,#3A0F34',mode:'#F2BE31,#EAAA00',maison:'#DDE3E8,#EAAA00'};
const DEMO=[['🧥','Veste en cuir bordeaux','mode',650,'Tanger','Yasmina','photo-1551028719-00167b16eac5'],['👟','Baskets bordeaux','mode',480,'Rabat','Sara','photo-1542291026-7eec264c27ff'],['👜','Sac à main beige','mode',900,'Casablanca','Nadia','photo-1584917865442-de89df76afd3'],['🧣','Écharpe en laine','mode',120,'Fès','Yasmina','photo-1601924994987-69e26d50dc26'],['📱','iPhone 13 Pro','tech',4200,'Casablanca','Karim','photo-1592750475338-74b7b21085ab'],['🕶️','Lunettes de soleil','mode',150,'Tétouan','Sara','photo-1511499767150-a48a237f0083'],['👢','Bottes en cuir noir','mode',540,'Tanger','Nadia','photo-1543163521-1bf539c55dd2'],['🏠','Appartement 2 chambres','immo',650000,'Tanger','Omar','photo-1600607687939-ce8a6c25118c'],['🚲','Vélo VTT 26"','auto',1200,'Marrakech','Karim','photo-1485965120184-e220f721d03e'],['🛋️','Canapé 3 places','maison',1800,'Rabat','Omar','photo-1555041469-a586c61ea9bc']].map((d,i)=>({id:'d'+i,emoji:d[0],titre:d[1],categorie:d[2],prix:d[3],ville:d[4],membre:d[5],tel:'0612345678',description:'Très bon état, disponible. Contactez-moi pour plus de photos ou pour fixer un rendez-vous.',photo:`https://images.unsplash.com/${d[6]}?auto=format&fit=crop&w=900&q=80`}));
let data=[],cur='home',ncat='',me=null,seller=null,favs=[],chats={},submitted=[],trackFilter='all';
try{favs=JSON.parse(localStorage.favs||'[]');chats=JSON.parse(localStorage.chats||'{}');submitted=JSON.parse(localStorage.submittedAds||'[]')}catch{}
const sv=()=>{try{localStorage.favs=JSON.stringify(favs);localStorage.chats=JSON.stringify(chats);localStorage.submittedAds=JSON.stringify(submitted)}catch{}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dh=n=>Number(n).toLocaleString('fr-FR').replace(/\u202f/g,' ')+' DH';
const bg=a=>a.photo?`background-image:url('${esc(a.photo)}')`:`background:linear-gradient(135deg,${G[a.categorie]})`;
const em=a=>a.photo?'':(a.emoji||E[a.categorie]);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
const card=(a,i)=>`<article class="card rv" style="transition-delay:${i*50}ms" data-id="${a.id}"><div class="th" style="${bg(a)}">${em(a)}<button class="hb" data-fav="${a.id}">${favs.includes(a.id)?'❤️':'🤍'}</button></div><div class="cb"><h3>${esc(a.titre)}</h3><div class="pr">${dh(a.prix)}</div><div class="lc">📍 ${esc(a.ville)}</div></div></article>`;
const row=(a,i)=>`<article class="row rv" style="transition-delay:${i*50}ms" data-id="${a.id}"><div class="th" style="${bg(a)}">${em(a)}</div><div><h3 style="color:var(--navy)">${esc(a.titre)}</h3><div class="pr">${dh(a.prix)}</div><div class="lc">📍 ${esc(a.ville)} · ${CN[a.categorie]}</div></div><span class="go" style="font-weight:700;color:var(--brown)">Voir détail ›</span></article>`;
async function load(){
  $('#hg').innerHTML='<div class="sk"></div>'.repeat(4);
  try{const r=await fetch(API);if(!r.ok)throw 0;const j=await r.json();data=j.length?[...j,...DEMO]:DEMO}catch{data=DEMO}
  const vs=[...new Set(data.map(a=>a.ville))].sort();$('#sv').innerHTML='<option value="">Ville</option>'+vs.map(v=>`<option>${esc(v)}</option>`).join('');
  $('#sc').innerHTML='<option value="">Catégorie</option>'+Object.entries(CN).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
  drawHome();drawNew();drawSearch();drawProf();drawList();drawLikes();drawTrack();
}
function reveal(el){$$('.rv',el).forEach(e=>io.observe(e));$$('.card',el).forEach(c=>{c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(700px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-6px)`};c.onmouseleave=()=>c.style.transform=''})}
function drawHome(){$('#hc').innerHTML=Object.entries(CN).map(([k,v])=>`<div class="cat" data-cat="${k}"><span>${E[k]}</span>${v}</div>`).join('');$('#hg').innerHTML=data.slice(0,8).map(card).join('');reveal($('#hg'))}
function drawNew(){$('#nc').innerHTML=`<button class="chip ${!ncat?'on':''}" data-nc="">Tout</button>`+Object.entries(CN).map(([k,v])=>`<button class="chip ${ncat===k?'on':''}" data-nc="${k}">${v}</button>`).join('');const l=data.filter(a=>!ncat||a.categorie===ncat);$('#ng').innerHTML=l.map(card).join('')||'<p class="empty">Rien ici.</p>';reveal($('#ng'))}
function drawLikes(){const l=data.filter(a=>favs.includes(a.id));$('#lg').innerHTML=l.map(card).join('')||'<p class="empty">Aucun favori pour le moment. Touchez le cœur d’une annonce pour la garder ici.</p>';reveal($('#lg'))}
function drawTrack(){const states={pending:['⏳','En vérification'],approved:['✓','Validée'],rejected:['✕','Refusée']};const list=submitted.filter(a=>trackFilter==='all'||a.status===trackFilter);$('#tr').innerHTML=list.map((a,i)=>`<article class="row rv" style="transition-delay:${i*50}ms"><div class="th" style="${a.photo?`background-image:url('${esc(a.photo)}')`: `background:linear-gradient(135deg,${G[a.categorie]})`}">${a.photo?'':E[a.categorie]}</div><div><h3 style="color:var(--navy)">${esc(a.titre)}</h3><div class="pr">${dh(a.prix)}</div><div class="lc">📍 ${esc(a.ville)} · Envoyée le ${new Date(a.date).toLocaleDateString('fr-FR')}</div></div><span class="status ${a.status}">${states[a.status][0]} ${states[a.status][1]}</span></article>`).join('')||'<p class="empty">Aucune annonce dans cette catégorie.</p>';reveal($('#tr'))}
function drawSearch(){const q=$('#sq').value.toLowerCase(),c=$('#sc').value,v=$('#sv').value,l=data.filter(a=>(!c||a.categorie===c)&&(!v||a.ville===v)&&(!q||(a.titre+a.description).toLowerCase().includes(q)));$('#cnt').textContent=`Résultats (${l.length})`;$('#sr').innerHTML=l.map(row).join('')||'<p class="empty">Aucune annonce trouvée.</p>';reveal($('#sr'))}
function detail(id){const a=data.find(x=>x.id===id);if(!a)return;seller=a.membre;
  $('#v-det').innerHTML=`<button class="back" data-go="${cur==='det'?'home':cur}">‹</button><div class="det"><div class="big" style="${bg(a)}">${em(a)}</div><div><span class="chip on" style="cursor:default">${CN[a.categorie]}</span><h1>${esc(a.titre)}</h1><div class="pr">${dh(a.prix)}</div><div class="lc">📍 ${esc(a.ville)}</div><p class="d">${esc(a.description||'Pas de description.')}</p><div class="sel"><div class="av">${esc((a.membre||'V')[0])}</div><div><b>${esc(a.membre||'Vendeur')}</b><br><small style="color:var(--mut)">Profil du vendeur</small></div></div><div class="acts"><a class="btn pri" href="tel:${esc(a.tel)}">📞 Appeler le vendeur</a><button class="btn dk" data-chat="${esc(a.membre||'Vendeur')}">💬 Envoyer un message</button><button class="btn gh" data-fav="${a.id}">${favs.includes(a.id)?'❤️ Favori':'🤍 Favori'}</button></div></div></div>`;go('det')}
const sellers=()=>[...new Set(data.map(a=>a.membre).filter(Boolean))];
function drawProf(){const cols=['#3A0F34','#EAAA00','#6C3B63','#DDE3E8','#8B6C87'];$('#pg').innerHTML=sellers().map((s,i)=>`<div class="pc rv"><div class="av" style="background:${cols[i%5]};color:${cols[i%5]==='#DDE3E8'?'#3A0F34':'#fff'}">${esc(s[0])}</div><b>${esc(s)}</b><small>${data.filter(a=>a.membre===s).length} annonces</small><button class="btn dk" data-chat="${esc(s)}">Écrire</button></div>`).join('');reveal($('#pg'))}
const REP=['Oui, toujours disponible ✅','Je peux baisser un peu le prix 😉','Vous pouvez passer demain ?','Je vous envoie plus de photos.','Parfait, on se met d\'accord !'];
function drawList(){$('#cl').innerHTML=sellers().map(s=>{const m=chats[s]||[];return`<div class="ci ${s===seller?'on':''}" data-chat="${esc(s)}"><div class="av">${esc(s[0])}</div><div><b>${esc(s)}</b><small>${esc((m[m.length-1]||{t:'Nouvelle conversation'}).t.slice(0,32))}</small></div></div>`}).join('')}
function openChat(s){seller=s;if(!chats[s])chats[s]=[{w:'o',t:'Salut ! Comment puis-je vous aider ?'}];
  if(!document.getElementById('v-msg')){sv();sessionStorage.chatWith=s;location.href='contact.html#msg';return}$('#cn').textContent=s;$('#mg').classList.add('cv-on');drawList();$('#bd').innerHTML=chats[s].map(m=>`<div class="bb ${m.w==='me'?'me':'th2'}">${esc(m.t)}</div>`).join('');$('#bd').scrollTop=1e5;if(cur!=='msg')go('msg')}
$('#cf').onsubmit=e=>{e.preventDefault();const t=$('#ci').value.trim();if(!t||!seller)return;const s=seller;$('#ci').value='';chats[s].push({w:'me',t});sv();openChat(s);
  const ty=document.createElement('div');ty.className='bb th2 ty';ty.innerHTML='<span></span><span></span><span></span>';$('#bd').appendChild(ty);$('#bd').scrollTop=1e5;
  setTimeout(()=>{if(seller===s){chats[s].push({w:'o',t:REP[Math.random()*REP.length|0]});sv();openChat(s)}else chats[s].push({w:'o',t:REP[0]})},1300)};
$('#mb').onclick=()=>$('#mg').classList.remove('cv-on');
const PAGE={home:'accueil',new:'accueil',search:'accueil',det:'accueil',dep:'deposer',ver:'deposer',likes:'accueil',track:'accueil',help:'accueil',msg:'contact',prof:'contact'};
const DEF={accueil:'home',deposer:'dep',contact:'msg'};
function go(v){
  if(!document.getElementById('v-'+v)){location.href=PAGE[v]+'.html#'+v;return}
  if(v!=='det'&&v!=='ver')history.replaceState(null,'','#'+v);
  cur=v;$$('.view').forEach(s=>s.classList.toggle('on',s.id==='v-'+v));$$('#nav button,#tab button').forEach(b=>b.classList.toggle('on',b.dataset.go===v));if(v==='likes')drawLikes();if(v==='track')drawTrack();scrollTo({top:0,behavior:'smooth'});if(v==='msg')$('#mg').classList.remove('cv-on')}
document.addEventListener('click',e=>{
  const b=e.target.closest('.btn');if(b){const r=b.getBoundingClientRect(),s=document.createElement('span'),d=Math.max(r.width,r.height);s.className='rip';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),600)}
  const f=e.target.closest('[data-fav]');if(f){e.stopPropagation();const id=f.dataset.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];sv();f.textContent=favs.includes(id)?(f.classList.contains('hb')?'❤️':'❤️ Favori'):(f.classList.contains('hb')?'🤍':'🤍 Favori');if(cur==='likes')drawLikes();return}
  const c=e.target.closest('[data-chat]');if(c)return openChat(c.dataset.chat);
  const g=e.target.closest('[data-go]');if(g)return go(g.dataset.go);
  const ct=e.target.closest('[data-cat]');if(ct){ncat=ct.dataset.cat;drawNew();return go('new')}
  const n=e.target.closest('[data-nc]');if(n){ncat=n.dataset.nc;return drawNew()}
  const st=e.target.closest('[data-status]');if(st){trackFilter=st.dataset.status;$$('[data-status]').forEach(x=>x.classList.toggle('on',x===st));drawTrack();return}
  const k=e.target.closest('[data-id]');if(k)detail(k.dataset.id)});
$('#hs').onsubmit=e=>{e.preventDefault();$('#sq').value=$('#hq').value;drawSearch();go('search')};
$('#ss').oninput=drawSearch;
let draft=null;
$('#df').onsubmit=e=>{e.preventDefault();showVer()};
function showVer(){
  const f=new FormData($('#df')),g=k=>String(f.get(k)||'').trim(),ph=f.get('photo');
  const d=draft={titre:g('titre'),categorie:g('categorie'),prix:g('prix'),ville:g('ville'),tel:g('tel'),description:g('description'),hasPhoto:!!(ph&&ph.size)};
  const url=d.hasPhoto?URL.createObjectURL(ph):null;
  const chk=[
    [d.titre.length>=3,'ko','Titre (min. 3 caractères)'],
    [Number(d.prix)>0,'ko','Prix valide'],
    [d.ville.length>=2,'ko','Ville renseignée'],
    [/^(0|\+212)[5-7]\d{8}$/.test(d.tel.replace(/[\s.\-]/g,'')),'ko','Numéro de téléphone marocain valide'],
    [d.description.length>=20,'wn','Description détaillée (conseillé : 20 caractères min.)'],
    [d.hasPhoto,'wn','Photo ajoutée (conseillé)']];
  const bad=chk.filter(c=>!c[0]&&c[1]==='ko').length;
  $('#v-ver').innerHTML=`<button class="back" id="vb">‹</button><h2>Vérifier votre annonce</h2><div class="steps"><span>1 · Formulaire</span><span class="on">2 · Vérification</span></div>
  <div class="ver"><div class="vp"><div class="th" style="${url?`background-image:url('${url}')`:`background:linear-gradient(135deg,${G[d.categorie]})`}">${url?'':E[d.categorie]}</div>
  <h3 style="color:var(--navy);margin:14px 0 4px;font-size:1.3rem">${esc(d.titre)}</h3><div class="pr">${Number(d.prix)>0?dh(d.prix):'—'}</div>
  <div class="lc">📍 ${esc(d.ville)} · ${CN[d.categorie]} · 📞 ${esc(d.tel)}</div><p style="margin-top:12px;line-height:1.6;color:#5b4520">${esc(d.description||'Pas de description.')}</p></div>
  <div><ul class="ck">${chk.map(c=>`<li class="${c[0]?'ok':c[1]}"><span>${c[0]?'✅':c[1]==='ko'?'❌':'⚠️'}</span><span>${c[2]}</span></li>`).join('')}</ul>
  <div class="acts"><button class="btn gh" id="ve">✏️ Modifier</button><button class="btn pri" id="vc" ${bad?'disabled':''}>✓ Confirmer et envoyer</button></div>
  <p style="color:var(--mut);font-size:.82rem;margin-top:12px">${bad?'Corrigez les points en rouge avant de continuer.':'Votre annonce sera publiée après validation par notre équipe.'}</p></div></div>`;
  $('#vb').onclick=$('#ve').onclick=()=>go('dep');
  $('#vc').onclick=async ev=>{const b=ev.currentTarget;b.disabled=true;
    try{const r=await fetch(API,{method:'POST',body:new FormData($('#df'))});
      if(r.status===401){toast('Connectez-vous pour envoyer votre annonce');b.disabled=false;return setTimeout(()=>openAuth('login'),600)}
      const j=await r.json();if(!j.ok){b.disabled=false;return toast(j.error||'Erreur')}
      submitted.unshift({...draft,id:j.id||`local-${Date.now()}`,date:new Date().toISOString(),status:'pending',photo:j.photo||null});sv();drawTrack();$('#df').reset();toast('Annonce envoyée ✓ Elle sera publiée après validation.');go('track')}
    catch{b.disabled=false;toast('Serveur PHP introuvable : php -S localhost:8000')}};
  go('ver')}
function applyMe(u){me=u;const a=$('#auth');if(!me)return;a.onclick=null;a.textContent=me.role==='admin'?'Espace admin':'Bonjour '+me.nom.split(' ')[0];a.href=me.role==='admin'?'admin.html':'#';if(me.role!=='admin')a.onclick=async e=>{e.preventDefault();if(confirm('Se déconnecter ?')){await fetch(AUTH+'?a=logout');location.reload()}}}
fetch(AUTH+'?a=me').then(r=>r.json()).then(j=>applyMe(j.user)).catch(()=>{});
let amode='login';
function setMode(m){amode=m;$('#ac').classList.toggle('reg',m==='reg');$$('.at button').forEach(b=>b.classList.toggle('on',b.dataset.t===m));$('#ag').textContent=m==='reg'?'Créer mon compte':'Se connecter';$('#ae').textContent='';$('#af').elements.nom.required=m==='reg';$('#af').elements.password.autocomplete=m==='reg'?'new-password':'current-password'}
function openAuth(m,e){if(e)e.preventDefault();setMode(m||'login');$('#au').classList.add('on');setTimeout(()=>$('#af').elements[m==='reg'?'nom':'email'].focus(),50);return false}
const closeAuth=()=>$('#au').classList.remove('on');
$$('.at button').forEach(b=>b.onclick=()=>setMode(b.dataset.t));$('#abk').onclick=closeAuth;addEventListener('keydown',e=>e.key==='Escape'&&closeAuth());
$('#af').onsubmit=async e=>{e.preventDefault();const b=$('#ag');b.disabled=true;$('#ae').textContent='';
  try{const r=await fetch(AUTH+'?a='+(amode==='reg'?'register':'login'),{method:'POST',body:new FormData(e.target)}),j=await r.json();
    if(!j.ok&&!j.user){$('#ae').textContent=j.error||'Identifiants incorrects';return}
    closeAuth();e.target.reset();toast(amode==='reg'?'Compte créé ✓':'Connexion réussie ✓');
    if(j.user)applyMe(j.user);else fetch(AUTH+'?a=me').then(r=>r.json()).then(j=>applyMe(j.user))}
  catch{$('#ae').textContent='Serveur PHP introuvable : php -S localhost:8000'}
  finally{b.disabled=false}};
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('in'),io.unobserve(e.target))),{threshold:.12});
addEventListener('scroll',()=>$('#bar').style.width=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100+'%',{passive:true});
const enter=()=>{const splash=$('#splash');splash.classList.add('out');setTimeout(()=>splash.remove(),800)};$('#fp').onclick=enter;if(document.getElementById('splash'))setTimeout(enter,5200);
const PG=document.body.dataset.page;
if(PG!=='index'){
  const h=location.hash.slice(1);
  go(PAGE[h]&&h!=='det'&&h!=='ver'?h:(DEF[PG]||'home'));
  load().then(()=>{const w=sessionStorage.chatWith;if(w){sessionStorage.removeItem('chatWith');openChat(w)}});
}
