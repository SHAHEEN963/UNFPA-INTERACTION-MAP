'use strict';
// Standalone, entirely client-side site. Facility records are loaded from a user-selected local file only.
const $=id=>document.getElementById(id);
const svgNS='http://www.w3.org/2000/svg';
const colors={RH:'#219d91',GBV:'#d87991',Youth:'#d4a252'};
const regions=['Lattakia','Tartous','Hama','Homs'];
const $all=sel=>Array.from(document.querySelectorAll(sel));
const state={records:[],summary:null,geo:null,view:'map',lang:'en',selected:null,filtered:[],map:{x:0,y:0,w:1200,h:760},gesture:null,animation:null,mapReady:false};
const escapeHTML=value=>String(value===undefined||value===null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isRtl=s=>/[\u0600-\u06ff]/.test(s);
const pretty=s=>s?String(s).trim():(state.lang==='ar'?'غير متوفر':'Not recorded');
const programLabel=p=>({RH:'Reproductive Health',GBV:'GBV / Protection',Youth:'Youth'}[p]||p);
const colour=p=>colors[p]||'#385c68';
function showToast(message){const el=$('toast');el.textContent=message;el.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.hidden=true,2800)}
// No HTTP API, accounts, cookies, or authentication.
function makeSummary(records){
  const s={total:records.length,governorates:{},programs:{RH:0,GBV:0,Youth:0},partners:{}};
  for(const region of regions)s.governorates[region]=0;
  for(const r of records){
    s.governorates[r.governorate_en]=(s.governorates[r.governorate_en]||0)+1;
    s.programs[r.main_program]=(s.programs[r.main_program]||0)+1;
    const p=r.implementing_partner||'Unspecified';s.partners[p]=(s.partners[p]||0)+1;
  }
  return s;
}
function initializeDashboard(){
  state.geo=window.SYRIA_GEOGRAPHY;
  if(!state.geo)throw Error('The bundled Syria map could not be loaded.');
  $('todayDate').textContent=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date());
  state.summary=makeSummary([]);
  initData();initMap();setView('map');applyLanguage();
}
function useRecords(records){
  if(!Array.isArray(records)||records.length>20000)throw Error('Please select a valid JSON array (maximum 20,000 records).');
  if(records.length&&!records.every(r=>r&&typeof r==='object'&&typeof r.facility_code==='string'&&typeof r.main_program==='string'&&typeof r.governorate_en==='string'))throw Error('This is not a supported facilities JSON file.');
  state.records=records.map((r,i)=>({...r,id:String(r.id||r.facility_code||i),lat:r.lat!==null&&r.lat!==undefined&&r.lat!==''&&Number.isFinite(Number(r.lat))?Number(r.lat):null,lon:r.lon!==null&&r.lon!==undefined&&r.lon!==''&&Number.isFinite(Number(r.lon))?Number(r.lon):null,quality_flags:Array.isArray(r.quality_flags)?r.quality_flags:[]}));
  state.summary=makeSummary(state.records);
  for(const id of ['mapSearch','governorateFilter','programFilter','partnerFilter','typeFilter','directorySearch','directoryGov','directoryProgram'])$(id).value='';
  $('importCallout').hidden=true;
  $('downloadBtn').hidden=!records.length;
  $('filterRoleNotice').textContent='Loaded only in this browser tab. No upload or server storage.';
  initData();closeDrawer();flyFitFacilities();
  showToast(records.length+' facility records loaded locally');
}
$('importBtn').addEventListener('click',()=>$('dataFile').click());
$('calloutImportBtn').addEventListener('click',()=>$('dataFile').click());
$('dataFile').addEventListener('change',async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{if(file.size>20*1024*1024)throw Error('File too large (20 MB maximum).');useRecords(JSON.parse(await file.text()));}
  catch(err){console.error(err);showToast('Could not load data: '+err.message)}
  finally{event.target.value='';}
});
$('downloadBtn').addEventListener('click',()=>{
  if(!state.records.length)return;
  if(!confirm('Export includes private addresses and coordinates. Continue and keep the CSV confidential?'))return;
  const columns=['implementing_partner','facility_code','main_program','facility_type','mode','governorate','district','subdistrict','commune','neighbourhood','site_name','lat','lon','brochure'];
  const csv=[columns,...state.records.map(r=>columns.map(k=>r[k]??''))].map(row=>row.map(v=>'"'+String(v).replace(/^[=+@-]/, '\u0027$&').replace(/"/g,'""')+'"').join(',')).join('\r\n');
  const blob=new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='syria-facilities-private.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});

function addOptions(sel,items,defaultLabel){const el=$(sel);el.innerHTML='';const option=document.createElement('option');option.value='';option.textContent=defaultLabel;el.append(option);for(const v of items){const o=document.createElement('option');o.value=v;o.textContent=v;el.append(o)}}
function initData(){
  addOptions('governorateFilter',regions,'All governorates');addOptions('directoryGov',regions,'All governorates');
  addOptions('programFilter',['RH','GBV','Youth'],'All programmes');addOptions('directoryProgram',['RH','GBV','Youth'],'All programmes');
  addOptions('partnerFilter',[...new Set(state.records.map(r=>r.implementing_partner))].sort(),'All partners');
  addOptions('typeFilter',[...new Set(state.records.map(r=>r.facility_type))].sort(),'All facility types');
  $('navRegions').innerHTML=regions.map(r=>`<button class="region-link" data-region="${escapeHTML(r)}"><i></i>${escapeHTML(r)}<span>${(state.summary.governorates[r]||0)}</span></button>`).join('');
  $all('[data-region]').forEach(btn=>btn.addEventListener('click',()=>{$('governorateFilter').value=btn.dataset.region;setView('map');updateMapFilters();zoomRegion(btn.dataset.region)}));
  if(state.controlsWired){renderInsights();renderQuality();updateMapFilters();renderDirectory();return;}
  state.controlsWired=true;
  for(const sel of ['mapSearch','governorateFilter','programFilter','partnerFilter','typeFilter']){$(sel).addEventListener('input',updateMapFilters)}
  $('resetFilters').addEventListener('click',()=>{for(const id of ['mapSearch','governorateFilter','programFilter','partnerFilter','typeFilter'])$(id).value='';updateMapFilters();flyFullSyria()});
  for(const sel of ['directorySearch','directoryGov','directoryProgram'])$(sel).addEventListener('input',renderDirectory);
  renderInsights();renderQuality();updateMapFilters();renderDirectory();
}
function searchText(record,query){return [record.facility_code,record.implementing_partner,record.main_program,record.facility_type,record.mode,record.governorate,record.district,record.subdistrict,record.commune,record.neighbourhood,record.site_name,record.brochure].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())}
function updateStats(records){
  $('statFacilities').textContent=records.length;
  $('statPartners').textContent=new Set(records.map(r=>r.implementing_partner)).size;
  $('statRH').textContent=records.filter(r=>r.main_program==='RH').length;
  $('statOther').textContent=records.filter(r=>r.main_program!=='RH').length;
}
function updateMapFilters(){
  const q=$('mapSearch').value.trim().toLocaleLowerCase();const gov=$('governorateFilter').value,p=$('programFilter').value,partner=$('partnerFilter').value,type=$('typeFilter').value;
  state.filtered=state.records.filter(r=>(!gov||r.governorate_en===gov)&&(!p||r.main_program===p)&&(!partner||r.implementing_partner===partner)&&(!type||r.facility_type===type)&&(!q||searchText(r,q)));
  $('filterCount').textContent=state.filtered.length;
  $('resultTrack').style.width=(state.filtered.length/Math.max(state.records.length,1)*100).toFixed(1)+'%';
  $('mapMarkerCaption').textContent=state.records.length ? state.filtered.length+' matching records · click markers for facility details' : 'Select Load private JSON to display facility markers';
  $all('[data-region]').forEach(b=>b.classList.toggle('selected',b.dataset.region===gov));
  updateStats(state.filtered);renderMarkers();
}

function setView(name){
  state.view=name;
  $all('.view-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));
  $all('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  const names={map:'Map Explorer',directory:'Facility Directory',insights:'Statistics & Insights',quality:'Data Quality'};
  $('breadCurrent').textContent=names[name];$('pageTitle').innerHTML=escapeHTML(({map:'Syria Facilities Explorer',directory:'Facilities Directory',insights:'Coverage & Insights',quality:'Data Quality Review'})[name])+' <span class="heading-star">✳</span>';
  $('pageSubtitle').textContent=({map:'An integrated geographic view of programmes, partners, and service locations.',directory:'A searchable inventory of detailed service facility records.',insights:'A clear view of programme coverage and implementing partnerships.',quality:'Coordinate normalization and completeness checks from the source workbook.'})[name];
  if(name==='map'){requestAnimationFrame(()=>{correctAspect();renderMarkers()})}
  window.scrollTo({top:0,behavior:'smooth'});
  if(state.lang==='ar')applyLanguage();
}
$all('.nav-link').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));

function renderDirectory(){
  const q=$('directorySearch').value.trim().toLowerCase(),gov=$('directoryGov').value,p=$('directoryProgram').value;
  const records=state.records.filter(r=>(!gov||r.governorate_en===gov)&&(!p||r.main_program===p)&&(!q||searchText(r,q))).sort((a,b)=>a.governorate_en.localeCompare(b.governorate_en)||a.facility_code.localeCompare(b.facility_code));
  $('directoryCount').textContent=records.length+' records';$('directoryEmpty').hidden=records.length>0;
  $('directoryBody').innerHTML=records.map(r=>`<tr><td><span class="code-cell">${escapeHTML(r.facility_code)}</span><small class="sub-cell">${escapeHTML(r.site_name||r.commune||'Address not listed')}</small></td><td><span class="table-badge ${escapeHTML(r.main_program.toLowerCase())}">${escapeHTML(r.main_program)}</span></td><td>${escapeHTML(r.facility_type)}</td><td>${escapeHTML(r.governorate_en)}</td><td>${escapeHTML(r.implementing_partner)}</td><td><button class="record-view" data-record="${escapeHTML(r.id)}">View ↗</button></td></tr>`).join('');
  $('directoryBody').querySelectorAll('[data-record]').forEach(b=>b.addEventListener('click',()=>openFacility(b.dataset.record)));
}
function renderInsights(){
  const s=state.summary;if(!s)return;
  const max=Math.max(1,...Object.values(s.governorates));
  $('insightGovernorates').innerHTML=regions.map(k=>`<div class="bar-row"><div class="bar-row-head"><span>${escapeHTML(k)}</span><b>${s.governorates[k]} facilities</b></div><div class="bar-track"><div class="bar-fill" style="width:${Math.round(s.governorates[k]/max*100)}%"></div></div></div>`).join('');
  $('insightTotal').textContent=s.total;
  const total=s.total;let offset=0;const stops=['RH','GBV','Youth'].map(p=>{const from=offset;offset+=(total?s.programs[p]/total*100:0);return `${colour(p)} ${from.toFixed(3)}% ${offset.toFixed(3)}%`});
  $('programDonut').style.background=total?`conic-gradient(${stops.join(',')})`:'conic-gradient(#e2eeec 0% 100%)';
  $('donutLegend').innerHTML=['RH','GBV','Youth'].map(p=>`<div class="donut-key"><i class="legend-dot ${p.toLowerCase()}"></i>${escapeHTML(p)}<b>${s.programs[p]}</b></div>`).join('');
  $('insightPartners').innerHTML=Object.entries(s.partners).sort((a,b)=>b[1]-a[1]).map(([p,n])=>`<div class="partner-row"><span>${escapeHTML(p)}</span><b>${n}</b></div>`).join('');
}
function renderQuality(){
  const rows=state.records.filter(r=>r.quality_flags?.length);
  $('qualityCount').textContent=rows.length+' flagged records';
  $('qualityList').innerHTML=rows.length?rows.map(r=>`<article class="quality-row"><div><h4>${escapeHTML(r.facility_code)}</h4><p>${escapeHTML(r.governorate_en)} · Source row ${r.source_row} · ${escapeHTML(r.implementing_partner)}</p>${r.quality_flags.map(f=>`<span class="quality-flag">${escapeHTML(f)}</span>`).join('')}</div><button class="record-view" data-qa-record="${escapeHTML(r.id)}">Review ↗</button></article>`).join(''):'<div class="empty">No flagged facilities.</div>';
  $('qualityList').querySelectorAll('[data-qa-record]').forEach(b=>b.addEventListener('click',()=>openFacility(b.dataset.qaRecord)));
}
function regionInfo(r){return `${r.governorate_en} · ${r.district||'District not recorded'}`}
function field(label,value,wide=false){label=state.lang==='ar'?(AR_FIELDS[label]||label):label;return `<div class="info-field${wide?' wide':''}"><label>${escapeHTML(label)}</label><div dir="auto">${escapeHTML(pretty(value))}</div></div>`}
function closeDrawer(){$('detailDrawer').hidden=true;$('drawerShade').hidden=true;state.selected=null;}
$('drawerShade').addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
const AR_FIELDS={'Final implementing partner':'الشريك المنفذ النهائي','Facility code':'رمز المنشأة','Main programme':'البرنامج الرئيسي','Main facility type':'نوع المنشأة','Mode of facility':'وضع المنشأة','Governorate | المحافظة':'المحافظة','District | المنطقة':'المنطقة','Sub district | الناحية':'الناحية','Commune / village / town':'البلدة / القرية / المدينة','Neighbourhood | الحي':'الحي','Site name / detailed address | العنوان':'اسم الموقع والعنوان التفصيلي','Latitude':'خط العرض','Longitude':'خط الطول','Source worksheet':'ورقة المصدر','Source row':'رقم الصف','Original latitude':'خط العرض الأصلي','Original longitude':'خط الطول الأصلي'};
function openFacility(code){
  const r=state.records.find(x=>x.id===code);
  if(!r){showToast('This record is not loaded.');return}
  state.selected=r;
  const loc=[r.lat,r.lon].map(n=>n===null?'—':n.toFixed(6)).join(', ');
  $('drawerContent').innerHTML=`<div class="drawer-head"><div class="drawer-top"><span class="eyebrow"><span class="pulse-dot"></span> FACILITY RECORD • LOCAL DATA</span><button id="drawerClose" class="drawer-close" aria-label="Close details">×</button></div><h2>${escapeHTML(r.facility_code)}</h2><div class="drawer-subtitle">${escapeHTML(regionInfo(r))}</div><div class="drawer-tag-row"><span class="drawer-tag">${escapeHTML(programLabel(r.main_program))}</span><span class="drawer-tag">${escapeHTML(r.facility_type)}</span><span class="drawer-tag">${escapeHTML(r.implementing_partner)}</span></div></div><div class="drawer-content-body"><div class="drawer-section-heading">IDENTITY & PROGRAMME</div><div class="info-grid">${field('Final implementing partner',r.implementing_partner)}${field('Facility code',r.facility_code)}${field('Main programme',r.main_program)}${field('Main facility type',r.facility_type)}${field('Mode of facility',r.mode,true)}</div><div class="drawer-section-heading">GEOGRAPHY & ADDRESS</div><div class="info-grid">${field('Governorate | المحافظة',r.governorate)}${field('District | المنطقة',r.district)}${field('Sub district | الناحية',r.subdistrict)}${field('Commune / village / town',r.commune)}${field('Neighbourhood | الحي',r.neighbourhood,true)}${field('Site name / detailed address | العنوان',r.site_name,true)}${field('Latitude',r.lat)}${field('Longitude',r.lon)}</div><div class="drawer-actions"><button class="drawer-action" id="copyCode">▧ Copy facility code</button><button class="drawer-action" id="copyCoords">⌖ Copy coordinates</button><button class="drawer-action" id="locateRecord">◎ Locate on map</button></div><div class="drawer-section-heading">DETAILED INFORMATION FOR BROCHURE</div><div class="brochure-content" dir="auto">${escapeHTML(r.brochure||'Not provided')}</div><div class="drawer-section-heading">SOURCE & VALIDATION</div><div class="info-grid">${field('Source worksheet',r.source_sheet)}${field('Source row',r.source_row)}${field('Original latitude',r.lat_original)}${field('Original longitude',r.lon_original)}</div>${r.quality_flags?.length?`<div class="drawer-alert"><b>Data validation notes</b><br>${r.quality_flags.map(escapeHTML).join('<br>')}</div>`:''}</div>`;
  $('detailDrawer').hidden=false;$('drawerShade').hidden=false;
  $('drawerClose').addEventListener('click',closeDrawer);
  $('copyCode').addEventListener('click',()=>copy(r.facility_code));
  $('copyCoords').addEventListener('click',()=>copy(loc));
  $('locateRecord').addEventListener('click',()=>{closeDrawer();$('governorateFilter').value='';$('programFilter').value='';$('partnerFilter').value='';$('typeFilter').value='';$('mapSearch').value='';setView('map');updateMapFilters();flyToPoint(r.lat,r.lon,105)});
}
async function copy(str){try{await navigator.clipboard.writeText(String(str));showToast('Copied to clipboard')}catch{showToast('Copy unavailable. Please select the text.')}}
function openGroup(group){
  $('drawerContent').innerHTML=`<div class="drawer-head"><div class="drawer-top"><span class="eyebrow">CO-LOCATED SERVICE POINTS</span><button id="drawerClose" class="drawer-close">×</button></div><h2>${group.length} facilities at this location</h2><div class="drawer-subtitle">Choose a record to inspect full service details</div></div><div class="drawer-content-body">${group.map(r=>`<button class="group-item" data-group-record="${escapeHTML(r.id)}"><b>${escapeHTML(r.facility_code)}</b><small>${escapeHTML(r.facility_type)} · ${escapeHTML(r.implementing_partner)}</small></button>`).join('')}</div>`;
  $('detailDrawer').hidden=false;$('drawerShade').hidden=false;
  $('drawerClose').addEventListener('click',closeDrawer);
  $('drawerContent').querySelectorAll('[data-group-record]').forEach(btn=>btn.addEventListener('click',()=>openFacility(btn.dataset.groupRecord)));
}

// OFFLINE MAP - no third-party map, tile, or analytics requests are made.
// All positions are projected from actual WGS84 lat/lon values.
const S=(name,attrs={},parent=null)=>{const el=document.createElementNS(svgNS,name);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(parent)parent.append(el);return el};
function project(lat,lon){const g=state.geo;return{x:g.xOffset+(lon-g.lonMin)*g.scale*.81,y:g.yOffset+(g.latMax-lat)*g.scale}}
function renderGeography(){
  const g=state.geo;
  const grid=$('mapGrid');grid.textContent='';
  for(let lon=33;lon<=44;lon++){
    const a=project(31.2,lon),b=project(39.2,lon);S('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'map-grid-line'},grid)
  }
  for(let lat=32;lat<=39;lat++){
    const a=project(lat,32.4),b=project(lat,44.5);S('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'map-grid-line'},grid)
  }
  const world=$('landWorld');world.textContent='';
  for(const item of g.land.filter(i=>!i.is_syria).concat(g.land.filter(i=>i.is_syria))) {
    const p=S('path',{d:item.path,class:item.is_syria?'land-syria':'land-neighbor','data-country':item.name},world);
    const title=S('title',{},p);title.textContent=item.name;
  }
  const labels=$('mapCities');labels.textContent='';
  for(const c of g.cities){
    S('circle',{cx:c.x,cy:c.y,r:3,class:'city-dot'},labels);
    const name=S('text',{x:c.x+9,y:c.y+4,class:'city-label '+(regions.includes(c.name)?'main':'')},labels);name.textContent=c.name;
  }
  const names=[{name:'TURKEY',lat:37.82,lon:38.5},{name:'IRAQ',lat:34.5,lon:41.5},{name:'JORDAN',lat:32.4,lon:37.3},{name:'LEBANON',lat:34,lon:35.7}];
  for(const n of names){const p=project(n.lat,n.lon),txt=S('text',{x:p.x,y:p.y,class:'city-label-neighbor','text-anchor':'middle'},labels);txt.textContent=n.name;}
}
function correctAspect(){
  const el=$('mapSvg');if(!el.clientWidth||!el.clientHeight)return;
  const ratio=el.clientHeight/el.clientWidth;
  const v=state.map;const centerY=v.y+v.h/2;
  v.h=v.w*ratio;v.y=centerY-v.h/2;applyViewBox();
}
function applyViewBox(){const v=state.map;$('mapSvg').setAttribute('viewBox',[v.x,v.y,v.w,v.h].join(' '));}
function displayRegionMatches(){return state.filtered.filter(r=>Number.isFinite(r.lat)&&Number.isFinite(r.lon))}
function groupMarkers(records){
  const v=state.map,svg=$('mapSvg');const width=svg.clientWidth||900,height=svg.clientHeight||560;
  const points=records.map(r=>({...project(r.lat,r.lon),r}));
  const clusters=[];
  for(const p of points){
    let target=null;
    for(const c of clusters){if(Math.hypot((c.x-p.x)*width/v.w,(c.y-p.y)*height/v.h)<29){target=c;break;}}
    if(target){const n=target.records.length;target.x=(target.x*n+p.x)/(n+1);target.y=(target.y*n+p.y)/(n+1);target.records.push(p.r)}
    else clusters.push({x:p.x,y:p.y,records:[p.r]});
  }
  return clusters;
}
function renderMarkers(){
  if(!state.geo||!state.mapReady)return;
  const root=$('mapMarkers');root.textContent='';
  const clusters=groupMarkers(displayRegionMatches());const unit=state.map.w/Math.max($('mapSvg').clientWidth,1);
  for(const c of clusters){
    const multi=c.records.length>1;const p=c.records[0].main_program;const fill=multi&&new Set(c.records.map(r=>r.main_program)).size>1?'#395966':colour(p);
    const node=S('g',{class:'marker-node',transform:`translate(${c.x} ${c.y})`},root);
    S('circle',{r:(multi?22:17)*unit,fill,'class':'marker-halo'},node);
    S('circle',{r:(multi?16:10)*unit,fill,stroke:'#fff','stroke-width':2.5*unit,'class':'marker-ring'},node);
    if(multi){const text=S('text',{x:0,y:unit,'font-size':12*unit,class:'marker-count'},node);text.textContent=c.records.length;}
    else S('circle',{r:2.7*unit,fill:'#fff'},node);
    const title=S('title',{},node);title.textContent=multi?`${c.records.length} facilities · click to explore`:c.records[0].facility_code;
    node.addEventListener('pointerdown',ev=>ev.stopPropagation());
    node.addEventListener('click',ev=>{ev.stopPropagation();if(!multi){openFacility(c.records[0].id);return}const coords=new Set(c.records.map(r=>`${r.lat},${r.lon}`));if(state.map.w>155&&coords.size>1){flyTo({x:c.x-state.map.w*.3,y:c.y-state.map.h*.3,w:state.map.w*.6,h:state.map.h*.6});}else openGroup(c.records);});
  }
  const placeCount=new Set(state.filtered.map(r=>`${r.lat},${r.lon}`)).size;
  $('mapScale').textContent=`${state.filtered.length} facilities • ${placeCount} positions`;
}
function flyTo(target,duration=580){
  if(!state.mapReady)return;
  if(state.animation)cancelAnimationFrame(state.animation);
  const from={...state.map};const ratio=$('mapSvg').clientHeight/Math.max($('mapSvg').clientWidth,1);
  target={...target,h:target.w*ratio};
  const start=performance.now();const animate=now=>{const t=Math.min(1,(now-start)/duration);const eased=1-Math.pow(1-t,3);
    for(const prop of ['x','y','w','h'])state.map[prop]=from[prop]+(target[prop]-from[prop])*eased;
    applyViewBox();renderMarkers();if(t<1)state.animation=requestAnimationFrame(animate);else state.animation=null;
  };state.animation=requestAnimationFrame(animate);
}
function flyToPoint(lat,lon,width=125){if(lat==null||lon==null)return;const p=project(lat,lon),ratio=$('mapSvg').clientHeight/Math.max($('mapSvg').clientWidth,1);flyTo({x:p.x-width/2,y:p.y-width*ratio/2,w:width})}
function flyFullSyria(){flyTo({x:0,y:0,w:1200})}
function flyFitFacilities(){
  const records=displayRegionMatches();if(!records.length){flyFullSyria();return}
  const positions=records.map(r=>project(r.lat,r.lon));const xs=positions.map(p=>p.x),ys=positions.map(p=>p.y);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const ratio=$('mapSvg').clientHeight/Math.max($('mapSvg').clientWidth,1);
  const w=Math.min(1200,Math.max(190,(maxX-minX)*1.5,(maxY-minY)*1.5/ratio));const centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
  flyTo({x:centerX-w/2,y:centerY-w*ratio/2,w});
}
function zoomRegion(region){const subset=state.records.filter(r=>r.governorate_en===region);if(!subset.length)return;const pts=subset.map(r=>project(r.lat,r.lon));const xx=pts.map(p=>p.x),yy=pts.map(p=>p.y);const rx=Math.max(...xx)-Math.min(...xx),ry=Math.max(...yy)-Math.min(...yy);const ratio=$('mapSvg').clientHeight/Math.max($('mapSvg').clientWidth,1);const w=Math.max(90,rx*1.8,ry*1.8/ratio);const cx=(Math.max(...xx)+Math.min(...xx))/2,cy=(Math.max(...yy)+Math.min(...yy))/2;flyTo({x:cx-w/2,y:cy-w*ratio/2,w})}
function zoom(factor,clientX,clientY){const svg=$('mapSvg'),box=svg.getBoundingClientRect(),v=state.map;const dx=clientX===undefined?.5:(clientX-box.left)/box.width,dy=clientY===undefined?.5:(clientY-box.top)/box.height;const w=Math.max(55,Math.min(1600,v.w*factor)),h=w*box.height/box.width;const ox=v.x+dx*v.w,oy=v.y+dy*v.h;flyTo({x:ox-dx*w,y:oy-dy*h,w},300)}
function initMap(){
  renderGeography();state.mapReady=true;correctAspect();renderMarkers();
  if(state.mapControlsWired)return;state.mapControlsWired=true;
  $('fitMapBtn').addEventListener('click',flyFitFacilities);$('syriaMapBtn').addEventListener('click',flyFullSyria);
  $('mapZoomIn').addEventListener('click',()=>zoom(.66));$('mapZoomOut').addEventListener('click',()=>zoom(1.5));
  const svg=$('mapSvg');svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.28:.78,e.clientX,e.clientY)},{passive:false});
  svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;state.gesture={x:e.clientX,y:e.clientY,v:{...state.map}};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');if(state.animation)cancelAnimationFrame(state.animation)});
  svg.addEventListener('pointermove',e=>{if(!state.gesture)return;const box=svg.getBoundingClientRect(),g=state.gesture;state.map.x=g.v.x-(e.clientX-g.x)*g.v.w/box.width;state.map.y=g.v.y-(e.clientY-g.y)*g.v.h/box.height;applyViewBox();renderMarkers()});
  const up=()=>{state.gesture=null;svg.classList.remove('dragging')};svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  window.addEventListener('resize',()=>{if(state.mapReady)correctAspect();renderMarkers()});
}

// Arabic user-interface toggle, including RTL layout; spreadsheet field contents remain verbatim.
const AR={
  'Map Explorer':'مستكشف الخريطة','Facility Directory':'دليل المنشآت','Statistics & Insights':'الإحصاءات والتحليلات','Data Quality':'جودة البيانات',
  'Syria Facilities Explorer':'خريطة المنشآت في سوريا','Facilities Directory':'دليل المنشآت','Coverage & Insights':'التغطية والتحليلات','Data Quality Review':'مراجعة جودة البيانات',
  'Find a location':'ابحث عن موقع','Geographic distribution':'التوزيع الجغرافي','Fit facilities':'إظهار المنشآت','Full Syria':'كامل سوريا',
  'Export records':'تصدير البيانات','All governorates':'كل المحافظات','All programmes':'كل البرامج','All partners':'كل الشركاء','All facility types':'كل أنواع المنشآت',
  'Lattakia':'اللاذقية','Tartous':'طرطوس','Hama':'حماة','Homs':'حمص'
};
$('languageBtn').addEventListener('click',()=>{state.lang=state.lang==='en'?'ar':'en';applyLanguage()});
function applyLanguage(){
  document.documentElement.lang=state.lang;document.body.dir=state.lang==='ar'?'rtl':'ltr';
  $('languageBtn').textContent=state.lang==='ar'?'English / EN':'عربي / EN';
  const name=({map:'Map Explorer',directory:'Facility Directory',insights:'Statistics & Insights',quality:'Data Quality'})[state.view];
  $('breadCurrent').textContent=state.lang==='ar'?AR[name]:name;
  const page=({map:'Syria Facilities Explorer',directory:'Facilities Directory',insights:'Coverage & Insights',quality:'Data Quality Review'})[state.view];
  $('pageTitle').innerHTML=escapeHTML(state.lang==='ar'?AR[page]:page)+' <span class="heading-star">✳</span>';
  $all('.nav-link').forEach(b=>{const text=b.dataset.view===state.view?name:({map:'Map Explorer',directory:'Facility Directory',insights:'Statistics & Insights',quality:'Data Quality'})[b.dataset.view];const textnode=Array.from(b.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());if(textnode)textnode.textContent=' '+(state.lang==='ar'?AR[text]:text)+' ';});
  $all('.region-link').forEach(b=>{const textnode=Array.from(b.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());if(textnode)textnode.textContent=state.lang==='ar'?AR[b.dataset.region]:b.dataset.region;});
  $('mapSearch').placeholder=state.lang==='ar'?'الاسم، الرمز، الشريك...':'Name, code, partner...';
  translateInterface();
}


const translations=[
  ['.page-heading .eyebrow','HUMANITARIAN SERVICE COVERAGE','التغطية الجغرافية للخدمات الإنسانية'],
  ['.nav-label','WORKSPACE','مساحة العمل'],['.regions-title','COVERAGE REGIONS','المحافظات المستهدفة'],
  ['.metric:nth-child(1) .metric-label','TOTAL FACILITIES','إجمالي المنشآت'],
  ['.metric:nth-child(2) .metric-label','IMPLEMENTING PARTNERS','الشركاء المنفذون'],
  ['.metric:nth-child(3) .metric-label','REPRODUCTIVE HEALTH','الصحة الإنجابية'],
  ['.metric:nth-child(4) .metric-label','PROTECTION & YOUTH','الحماية والشباب'],
  ['.filter-head small','EXPLORE FACILITIES','استكشاف المنشآت'],['.filter-head h3','Find a location','ابحث عن موقع'],
  ['.filter-label[for="mapSearch"]','SEARCH FACILITIES','ابحث في المنشآت'],
  ['.filter-label[for="governorateFilter"]','GOVERNORATE','المحافظة'],
  ['.filter-label[for="programFilter"]','MAIN PROGRAMME','البرنامج الرئيسي'],
  ['.filter-label[for="partnerFilter"]','IMPLEMENTING PARTNER','الشريك المنفذ'],
  ['.filter-label[for="typeFilter"]','FACILITY TYPE','نوع المنشأة'],
  ['#resetFilters','↻ Reset all filters','↻ مسح كل المرشحات'],
  ['.filter-foot-count>span','matching facilities','منشآت مطابقة'],
  ['.map-top h2','Geographic distribution','التوزيع الجغرافي'],
  ['.map-top p','Drag to pan · Scroll to zoom · Select a marker','اسحب للتحريك · مرّر للتكبير · اختر علامة'],
  ['#fitMapBtn','⌾ Fit facilities','⌾ عرض المنشآت'],
  ['#syriaMapBtn','▣ Full Syria','▣ سوريا كاملة'],
  ['.map-overlay-label','SYRIA • LIVE MAP EXPLORER','سوريا • مستكشف الخريطة التفاعلية'],
  ['.map-legend>span','PROGRAMME TYPE','نوع البرنامج'],
  ['.map-legend>div:nth-child(2)','Reproductive health','الصحة الإنجابية'],
  ['.map-legend>div:nth-child(3)','GBV / protection','العنف القائم على النوع الاجتماعي'],
  ['.map-legend>div:nth-child(4)','Youth','الشباب'],
  ['#directoryPanel .section-title-row h2','Facility directory','دليل المنشآت'],
  ['#directoryPanel .section-title-row p','Search and inspect facility records loaded into this browser tab.','ابحث واستعرض سجلات المنشآت المحملة محلياً في المتصفح.'],
  ['#insightsPanel .section-title-row h2','Coverage intelligence','تحليلات التغطية'],
  ['#insightsPanel .section-title-row p','Aggregated distribution across all four governorates.','التوزيع الإجمالي عبر المحافظات الأربع.'],
  ['#qualityPanel .section-title-row h2','Data quality review','مراجعة جودة البيانات'],
  ['#qualityPanel .section-title-row p','Normalization notes from the original Excel records. Please verify locations before operational use.','ملاحظات تنسيق ملف إكسل الأصلي. يرجى تدقيق المواقع قبل الاستخدام الميداني.'],
  ['#downloadBtn span','Export CSV','تصدير CSV'],
  ['.sidebar-card b','Local data session','جلسة بيانات محلية'],
  ['.sidebar-card p','Open the private JSON file from your computer to display full facility records. Data stays in this browser tab.','حمّل ملف البيانات الخاص من جهازك لعرض المنشآت. تبقى البيانات داخل علامة التبويب هذه.'],
  ['.sidebar-card .green-lock','NO DATA IN GITHUB','لا توجد بيانات خاصة في GitHub'],
  ['.live-status','ON-DEVICE DATA','بيانات على الجهاز']
];
function translateInterface(){
  const ar=state.lang==='ar';
  for(const [selector,en,arabic] of translations){
    const el=document.querySelector(selector);if(!el)continue;
    if(el.children.length){const t=Array.from(el.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());if(t)t.textContent=' '+(ar?arabic:en)+' '}
    else el.textContent=ar?arabic:en;
  }
  for(const [id,en,arText] of [
    ['governorateFilter','All governorates','كل المحافظات'],
    ['programFilter','All programmes','كل البرامج'],
    ['partnerFilter','All partners','كل الشركاء'],
    ['typeFilter','All facility types','كل أنواع المنشآت'],
    ['directoryGov','All governorates','كل المحافظات'],
    ['directoryProgram','All programmes','كل البرامج']]){
    const o=$(id)?.querySelector('option[value=""]');if(o)o.textContent=ar?arText:en;
  }
  $('directorySearch').placeholder=ar?'بحث بالرمز أو الاسم أو المنطقة أو الشريك...':'Search by name, code, district, partner or brochure...';
  $('todayDate').textContent=new Intl.DateTimeFormat(ar?'ar-SY':'en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date());
  const metric=document.querySelector('.metric:nth-child(1) .metric-label');
  if(metric){const node=Array.from(metric.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());if(node)node.textContent=' '+(ar?'إجمالي المنشآت':'TOTAL FACILITIES')+' ';}
  $('filterRoleNotice').textContent=ar?'البيانات المحملة تبقى في صفحة المتصفح فقط.':'Data loaded only in this browser tab.';
}

try{initializeDashboard()}catch(err){console.error(err);alert('Unable to load map: '+err.message)}
