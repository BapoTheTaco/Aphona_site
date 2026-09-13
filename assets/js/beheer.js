const state = { activities: [], current: [], previousYears: [] };
const $ = sel => document.querySelector(sel);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

async function load() {
  try {
    const [activities, praesidium] = await Promise.all([
      fetch('content/activiteiten.json', {cache:'no-store'}).then(r=>r.json()),
      fetch('content/praesidium.json', {cache:'no-store'}).then(r=>r.json())
    ]);
    state.activities = activities.activities || [];
    state.current = praesidium.current || [];
    state.previousYears = praesidium.previousYears || [];
    renderAll();
  } catch (err) {
    document.querySelector('.manage-note').innerHTML = '<strong>Databestanden konden niet geladen worden.</strong> Open deze beheerpagina via GitHub Pages of een lokale webserver, niet rechtstreeks als file://.';
  }
}

function field(label, value, cls, type='text', options=[]) {
  if (type === 'select') return `<label>${label}<select class="${cls}">${options.map(o=>`<option value="${esc(o.value)}"${o.value===value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></label>`;
  return `<label>${label}<input type="${type}" class="${cls}" value="${esc(value)}"></label>`;
}

function renderActivities() {
  $('#manage-activities').innerHTML = state.activities.map((a,i)=>`<article class="manage-item" data-i="${i}"><div class="manage-item-grid">
    ${field('Datum',a.date,'f-date')}${field('Naam activiteit',a.title,'f-title')}
    ${field('Categorie',a.category,'f-category','select',[{value:'avond',label:'Avond'},{value:'cantus',label:'Cantus'},{value:'sport',label:'Sport & activiteit'}])}
    ${field('Label op kaart',a.label,'f-label')}
  </div><div class="manage-item-actions"><button class="manage-btn up">↑</button><button class="manage-btn down">↓</button><button class="manage-btn danger remove">Verwijderen</button></div></article>`).join('');
}

function renderCurrent() {
  $('#manage-current').innerHTML = state.current.map((p,i)=>`<article class="manage-item" data-i="${i}"><div class="manage-item-grid">
    ${field('Functie',p.role,'f-role')}${field('Naam',p.name,'f-name')}${field('Richting',p.study,'f-study')}${field('Extra tekst',p.note,'f-note')}
    <div class="wide">${field('Foto URL of pad (optioneel)',p.photo,'f-photo')}</div>
  </div><div class="manage-item-actions"><button class="manage-btn up">↑</button><button class="manage-btn down">↓</button><button class="manage-btn danger remove">Verwijderen</button></div></article>`).join('');
}

function memberRows(yearIndex, members) {
 return members.map((m,j)=>`<div class="manage-member-row" data-member="${j}">${field('Functie',m.role,'m-role')}${field('Naam',m.name,'m-name')}<button class="manage-btn danger remove-member">×</button></div>`).join('');
}
function renderPrevious() {
  $('#manage-previous').innerHTML = state.previousYears.map((y,i)=>`<article class="manage-item" data-i="${i}"><div class="manage-item-grid">
    ${field('Academiejaar',y.year,'y-year')}<div>${field('Groepsfoto URL of pad (optioneel)',y.groupPhoto,'y-photo')}</div>
  </div><h3>Leden</h3><div class="manage-year-members">${memberRows(i,y.members||[])}</div>
  <div class="manage-item-actions"><button class="manage-btn add add-member">+ Lid</button><button class="manage-btn up">↑ Jaar</button><button class="manage-btn down">↓ Jaar</button><button class="manage-btn danger remove">Jaar verwijderen</button></div></article>`).join('');
}
function renderAll(){ renderActivities(); renderCurrent(); renderPrevious(); }

function syncActivities(){
 document.querySelectorAll('#manage-activities .manage-item').forEach(el=>{ const a=state.activities[+el.dataset.i]; a.date=el.querySelector('.f-date').value; a.title=el.querySelector('.f-title').value; a.category=el.querySelector('.f-category').value; a.label=el.querySelector('.f-label').value; });
}
function syncCurrent(){
 document.querySelectorAll('#manage-current .manage-item').forEach(el=>{ const p=state.current[+el.dataset.i]; p.role=el.querySelector('.f-role').value; p.name=el.querySelector('.f-name').value; p.study=el.querySelector('.f-study').value; p.note=el.querySelector('.f-note').value; p.photo=el.querySelector('.f-photo').value; p.initials=(p.name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase(); });
}
function syncPrevious(){
 document.querySelectorAll('#manage-previous .manage-item').forEach(el=>{ const y=state.previousYears[+el.dataset.i]; y.year=el.querySelector('.y-year').value; y.groupPhoto=el.querySelector('.y-photo').value; y.members=[...el.querySelectorAll('.manage-member-row')].map(row=>({role:row.querySelector('.m-role').value,name:row.querySelector('.m-name').value})); });
}
function syncAll(){ syncActivities(); syncCurrent(); syncPrevious(); }

function bindList(id, arrName, renderer){
 $(id).addEventListener('click', e=>{
   const item=e.target.closest('.manage-item'); if(!item) return;
   syncAll(); const i=+item.dataset.i; const arr=state[arrName];
   if(e.target.classList.contains('remove')) arr.splice(i,1);
   else if(e.target.classList.contains('up') && i>0) [arr[i-1],arr[i]]=[arr[i],arr[i-1]];
   else if(e.target.classList.contains('down') && i<arr.length-1) [arr[i+1],arr[i]]=[arr[i],arr[i+1]];
   else return; renderer();
 });
}

$('.manage-tabs').addEventListener('click',e=>{ const b=e.target.closest('.manage-tab'); if(!b)return; document.querySelectorAll('.manage-tab').forEach(x=>x.classList.toggle('active',x===b)); document.querySelectorAll('.manage-panel').forEach(x=>x.hidden=x.id!==`panel-${b.dataset.panel}`); });
$('#add-activity').onclick=()=>{ syncAll(); state.activities.push({date:'',title:'Nieuwe activiteit',category:'avond',label:'Avond'}); renderActivities(); };
$('#add-current').onclick=()=>{ syncAll(); state.current.push({role:'FUNCTIE',name:'Naam',study:'',note:'',photo:'',initials:'NN'}); renderCurrent(); };
$('#add-year').onclick=()=>{ syncAll(); state.previousYears.unshift({year:'2025–2026',groupPhoto:'',members:[{role:'Praeses',name:''}]}); renderPrevious(); };
bindList('#manage-activities','activities',renderActivities); bindList('#manage-current','current',renderCurrent); bindList('#manage-previous','previousYears',renderPrevious);
$('#manage-previous').addEventListener('click',e=>{ const item=e.target.closest('.manage-item'); if(!item)return; const i=+item.dataset.i; if(e.target.classList.contains('add-member')){ syncAll(); state.previousYears[i].members.push({role:'Functie',name:''}); renderPrevious(); } if(e.target.classList.contains('remove-member')){ syncAll(); const row=e.target.closest('.manage-member-row'); state.previousYears[i].members.splice(+row.dataset.member,1); renderPrevious(); } });

function download(name,obj){ const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
$('#download-activities').onclick=()=>{ syncAll(); download('activiteiten.json',{activities:state.activities}); };
$('#download-praesidium').onclick=()=>{ syncAll(); download('praesidium.json',{current:state.current,previousYears:state.previousYears}); };
load();
