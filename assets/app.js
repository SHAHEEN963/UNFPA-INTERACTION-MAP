'use strict';
// Generated static Excel snapshot; public and internal editions have distinct data restrictions.
const $ = id => document.getElementById(id);
const $$ = query => [...document.querySelectorAll(query)];
const SVG_NS = 'http://www.w3.org/2000/svg';
const GOVS = ['Lattakia', 'Tartous', 'Hama', 'Homs'];
const PROGRAMMES = ['RH', 'GBV', 'Youth'];
const COLORS = {RH:'#3571a4',GBV:'#e38a15',Youth:'#8e9ec5'};
const LANG = {
  en:{map:'Map',directory:'Directory',insights:'Insights',quality:'Data quality',loadData:'Load data',eyebrow:'SERVICE COVERAGE · SYRIA',
    mapTitle:'Explore facilities across Syria',mapSubtitle:'A clearer view of service locations, programmes and partners.',
    dirTitle:'Facility directory',dirSubtitle:'Find a record and open its details.',insightsTitle:'Coverage insights',insightsSubtitle:'An overview of programmes and locations.',
    qualityTitle:'Data quality',qualitySubtitle:'Review records that may need location verification.', facilities:'Facilities',governorates:'Governorates',partners:'Partners',
    dataPrompt:'Facility records are loaded automatically.',dataExplain:'Records stay in this browser tab. No sign-in, server upload or API.',chooseFile:'Choose JSON file',
    filters:'Filters',moreFilters:'More filters',partner:'Implementing partner',facilityType:'Facility type',clearAll:'Clear all filters',
    mapCoverage:'Map coverage',mapHint:'Select a marker to explore',fit:'Fit locations',mapLabel:'SYRIA · 4 GOVERNORATES',gestureTip:'Drag to move · Scroll to zoom',
    programmes:'PROGRAMMES',rh:'Reproductive health',gbv:'GBV',youth:'Youth',localOnly:'17 protected GBV locations withheld',
    openDirectory:'Browse facility directory',dirExplain:'Find a record and open its details.',export:'Export CSV',code:'Facility code',programme:'Programme',governorate:'Governorate',
    noMatches:'No matching facilities.',insightExplain:'An overview of programmes and locations.',byGov:'Facilities by governorate',byProgram:'Programme mix',total:'TOTAL',byPartner:'Implementing partners',
    qualityExplain:'Review records that may need location verification.',qualityNote:'Original coordinates are preserved. Map adjustments are flagged for verification.',
    footerData:'Sensitive site coordinates excluded from this edition',allRegions:'All areas',allPrograms:'All programmes',allPartners:'All partners',allTypes:'All facility types',
    searchPlaceholder:'Find a facility, location or partner',searchDirectory:'Search records',noData:'No mapped facilities in the current selection.',
    loaded:'facilities ready',local:'On-device data',matching:'facilities',locations:'locations',mapTap:'Tap a marker to explore',mobileGesture:'Use two fingers to move or pinch to zoom',
    records:'records',record:'record',view:'View details',details:'Facility information',summary:'OVERVIEW',fullDetails:'Complete record',brochure:'Brochure information',source:'Source and verification',
    copyCode:'Copy code',copyCoords:'Copy coordinates',locate:'Show on map',close:'Close details',choice:'Choose a facility',coLocated:'facilities at this location',
    noFlags:'No flagged facilities.',invalidFile:'This JSON does not contain valid facility records.',tooLarge:'File is too large (20MB max).',loadError:'Could not load the file: ',
    confirmExport:'The CSV will contain sensitive addresses and coordinates. Export only to an authorized device?',saved:'Copied',exportSuccess:'Private CSV exported',
    regions:{Lattakia:'Lattakia',Tartous:'Tartous',Hama:'Hama',Homs:'Homs'},
    fields:{implementing_partner:'Implementing partner',facility_code:'Facility code',main_program:'Main programme',facility_type:'Facility type',mode:'Mode of facility',governorate:'Governorate',district:'District',subdistrict:'Subdistrict',commune:'Commune / village / town',neighbourhood:'Neighbourhood',site_name:'Site name / detailed address',lat:'Latitude',lon:'Longitude',source_sheet:'Source worksheet',source_row:'Source row',lat_original:'Original latitude',lon_original:'Original longitude'}},
  ar:{map:'الخريطة',directory:'الدليل',insights:'الإحصاءات',quality:'جودة البيانات',loadData:'تحميل البيانات',eyebrow:'تغطية الخدمات · سوريا',
    mapTitle:'استكشف المنشآت في سوريا',mapSubtitle:'خريطة مبسّطة لمواقع الخدمات والبرامج والشركاء.',
    dirTitle:'دليل المنشآت',dirSubtitle:'ابحث عن سجل واطّلع على تفاصيله.',insightsTitle:'تحليل التغطية',insightsSubtitle:'نظرة عامة على المواقع والبرامج.',
    qualityTitle:'جودة البيانات',qualitySubtitle:'مراجعة السجلات التي قد تتطلب تدقيق المواقع.',facilities:'منشأة',governorates:'محافظات',partners:'شريك',
    dataPrompt:'الخريطة جاهزة. حمّل ملف المنشآت الخاص للبدء.',dataExplain:'تبقى البيانات في علامة التبويب هذه، دون تسجيل دخول أو خادم أو API.',chooseFile:'اختيار ملف JSON',
    filters:'المرشحات',moreFilters:'مرشحات إضافية',partner:'الشريك المنفذ',facilityType:'نوع المنشأة',clearAll:'مسح المرشحات',
    mapCoverage:'التوزيع الجغرافي',mapHint:'اختر علامة لاستعراض الموقع',fit:'عرض المواقع',mapLabel:'سوريا · ٤ محافظات',gestureTip:'اسحب للتحريك · عجلة الفأرة للتكبير',
    programmes:'البرامج',rh:'الصحة الإنجابية',gbv:'العنف القائم على النوع الاجتماعي',youth:'الشباب',localOnly:'تم إخفاء مواقع 17 منشأة حماية',
    openDirectory:'استعراض دليل المنشآت',dirExplain:'ابحث عن سجل واطّلع على تفاصيله.',export:'تصدير CSV',code:'رمز المنشأة',programme:'البرنامج',governorate:'المحافظة',
    noMatches:'لا توجد منشآت مطابقة.',insightExplain:'نظرة عامة على المواقع والبرامج.',byGov:'المنشآت حسب المحافظة',byProgram:'توزيع البرامج',total:'الإجمالي',byPartner:'الشركاء المنفذون',
    qualityExplain:'مراجعة السجلات التي قد تتطلب تدقيق المواقع.',qualityNote:'تم الاحتفاظ بالإحداثيات الأصلية، وتحديد تعديلات العرض التي تحتاج إلى تحقق.',
    footerData:'إحداثيات المواقع الحساسة غير منشورة',allRegions:'كل المناطق',allPrograms:'كل البرامج',allPartners:'كل الشركاء',allTypes:'كل أنواع المنشآت',
    searchPlaceholder:'ابحث عن منشأة أو موقع أو شريك',searchDirectory:'البحث في السجلات',noData:'لا توجد مواقع مرسومة ضمن التحديد الحالي.',
    loaded:'منشأة جاهزة',local:'البيانات على الجهاز',matching:'منشأة',locations:'موقع',mapTap:'المس علامة لاستعراض الموقع',mobileGesture:'استخدم إصبعين لتحريك الخريطة أو تكبيرها',
    records:'سجلاً',record:'سجل',view:'عرض التفاصيل',details:'معلومات المنشأة',summary:'نظرة عامة',fullDetails:'السجل الكامل',brochure:'معلومات الكتيّب',source:'المصدر والتحقق',
    copyCode:'نسخ الرمز',copyCoords:'نسخ الإحداثيات',locate:'عرض على الخريطة',close:'إغلاق',choice:'اختر منشأة',coLocated:'منشآت في هذا الموقع',
    noFlags:'لا توجد سجلات معلّمة.',invalidFile:'لا يحتوي ملف JSON على سجلات منشآت صالحة.',tooLarge:'حجم الملف أكبر من 20 ميغابايت.',loadError:'تعذر تحميل الملف: ',
    confirmExport:'سيتضمن ملف CSV عناوين وإحداثيات حساسة. هل تريد تصديره إلى جهاز مخوّل؟',saved:'تم النسخ',exportSuccess:'تم تصدير CSV الخاص',
    regions:{Lattakia:'اللاذقية',Tartous:'طرطوس',Hama:'حماة',Homs:'حمص'},
    fields:{implementing_partner:'الشريك المنفذ',facility_code:'رمز المنشأة',main_program:'البرنامج الرئيسي',facility_type:'نوع المنشأة',mode:'وضع المنشأة',governorate:'المحافظة',district:'المنطقة',subdistrict:'الناحية',commune:'البلدة / القرية / المدينة',neighbourhood:'الحي',site_name:'اسم الموقع والعنوان التفصيلي',lat:'خط العرض',lon:'خط الطول',source_sheet:'ورقة المصدر',source_row:'رقم الصف',lat_original:'خط العرض الأصلي',lon_original:'خط الطول الأصلي'}}
};
const state = {zoomTarget:null,zoomRaf:null,pinNodes:null,lang:'en',view:'map',records:[],filtered:[],program:'',gov:'',partners:[],geo:null,mapReady:false,viewBox:{x:0,y:0,w:1200,h:760},animation:null,markers:[],pointer:null,touches:null,selected:null,filterOpen:false};
const t=key=>LANG[state.lang][key] ?? key;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const V=v=>v===undefined||v===null||v===''?'—':String(v);
const finite=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))?Number(v):null;
const programName=p=>p==='RH'?t('rh'):p==='GBV'?t('gbv'):p==='Youth'?t('youth'):p;
const progClass=p=>p==='GBV'?'gbv':p==='Youth'?'youth':'';
const svgEl=(name,attrs={},parent)=>{let e=document.createElementNS(SVG_NS,name);for(const [key,val] of Object.entries(attrs))e.setAttribute(key,String(val));if(parent)parent.append(e);return e};
function showToast(message){let e=$('toast');e.textContent=message;e.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>e.hidden=true,2800)}
function getSummary(records){const gov=Object.fromEntries(GOVS.map(g=>[g,0])),prog={RH:0,GBV:0,Youth:0},partners={};for(const r of records){gov[r.governorate_en]=(gov[r.governorate_en]||0)+1;prog[r.main_program]=(prog[r.main_program]||0)+1;partners[r.implementing_partner||'Unspecified']=(partners[r.implementing_partner||'Unspecified']||0)+1}return{gov,prog,partners,total:records.length}}
function searchMatches(r,q){return [r.facility_code,r.site_name,r.commune,r.district,r.subdistrict,r.governorate,r.governorate_en,r.implementing_partner,r.facility_type,r.brochure].join(' ').toLocaleLowerCase().includes(q.toLocaleLowerCase())}
function renderRegionPills(){const items=['',...GOVS];$('regionPills').innerHTML=items.map(g=>`<button type="button" class="region-pill ${state.gov===g?'is-active':''}" data-gov="${esc(g)}" aria-pressed="${state.gov===g}">${g?esc(t('regions')[g]):esc(t('allRegions'))}<span>${g?state.records.filter(r=>r.governorate_en===g).length:state.records.length}</span></button>`).join('');$$('[data-gov]').forEach(b=>b.addEventListener('click',()=>{state.gov=b.dataset.gov;renderRegionPills();filterData();if(state.gov)fitRecords(state.filtered);else fitRecords(state.filtered)}))}
function renderProgrammePills(){const items=['',...PROGRAMMES];$('programmePills').innerHTML=items.map(p=>`<button type="button" class="programme-pill ${state.program===p?'is-active':''}" aria-pressed="${state.program===p}" data-program="${esc(p)}"><i class="mini-dot ${p?p.toLowerCase():'all'}"></i>${esc(p?programName(p):t('allPrograms'))}</button>`).join('');$$('[data-program]').forEach(b=>b.addEventListener('click',()=>{state.program=b.dataset.program;renderProgrammePills();filterData()}))}
function fillSelect(id,items,title){const e=$(id);const val=e.value;e.textContent='';const op=document.createElement('option');op.value='';op.textContent=title;e.append(op);for(const label of items){const el=document.createElement('option');el.value=label;el.textContent=label;e.append(el)}e.value=items.includes(val)?val:''}
function updateSelectors(){fillSelect('partnerFilter',[...new Set(state.records.map(r=>r.implementing_partner).filter(Boolean))].sort(),t('allPartners'));fillSelect('typeFilter',[...new Set(state.records.map(r=>r.facility_type).filter(Boolean))].sort(),t('allTypes'));fillSelect('directoryGov',GOVS,t('allRegions'));fillSelect('directoryProgram',PROGRAMMES,t('allPrograms'))}
function filterData(){const q=$('mapSearch').value.trim();const partner=$('partnerFilter').value,facilityType=$('typeFilter').value;state.filtered=state.records.filter(r=>(!state.gov||r.governorate_en===state.gov)&&(!state.program||r.main_program===state.program)&&(!q||searchMatches(r,q))&&(!partner||r.implementing_partner===partner)&&(!facilityType||r.facility_type===facilityType));const total=state.filtered.length;const places=new Set(state.filtered.filter(r=>r.lat!==null&&r.lon!==null).map(r=>`${r.lat.toFixed(6)}|${r.lon.toFixed(6)}`)).size;$('matchCount').textContent=`${total} ${t('matching')} · ${places} ${t('locations')}`;$('statFacilities').textContent=state.records.length;$('statGov').textContent=new Set(state.records.map(r=>r.governorate_en)).size;$('statPartners').textContent=window.UNFPA_PUBLIC_MODE?15:new Set(state.records.map(r=>r.implementing_partner)).size;$('mapResultNote').textContent=state.records.length?`${places} ${t('locations')} · ${state.filtered.filter(r=>r.protected).length} protected facility locations withheld`:t('noData');let cnt=Number(!!state.program)+Number(!!state.gov)+Number(!!partner)+Number(!!facilityType)+Number(!!q);$('activeFilterCount').hidden=!cnt;$('activeFilterCount').textContent=cnt;hideTooltip();renderMarkers()}
function importRecords(input){if(!Array.isArray(input)||input.length>20000||!input.every(r=>r&&typeof r==='object'&&typeof r.facility_code==='string'&&typeof r.main_program==='string'&&typeof r.governorate_en==='string'))throw Error(t('invalidFile'));const records=input.map((r,i)=>({...r,id:String(r.id||r.facility_code||i),lat:finite(r.lat),lon:finite(r.lon),quality_flags:Array.isArray(r.quality_flags)?r.quality_flags:[]}));const ids=new Set(records.map(r=>r.id));if(ids.size!==records.length)throw Error('Facility IDs are not unique.');state.records=records;state.gov='';state.program='';$('mapSearch').value='';$('partnerFilter').value='';$('typeFilter').value='';$('directorySearch').value='';$('directoryGov').value='';$('directoryProgram').value='';updateSelectors();renderRegionPills();renderProgrammePills();filterData();renderDirectory();renderInsights();renderQuality();closeDetails();setView('map');requestAnimationFrame(fullMap);showToast(`${records.length} ${t('loaded')}`)}
function setView(v){if(!['map','directory','insights','quality'].includes(v))return;state.view=v;$$('[data-panel]').forEach(e=>e.classList.toggle('is-active',e.dataset.panel===v));$$('[data-view]').forEach(e=>e.classList.toggle('is-active',e.dataset.view===v));const name={map:'mapTitle',directory:'dirTitle',insights:'insightsTitle',quality:'qualityTitle'}[v];const sub={map:'mapSubtitle',directory:'dirSubtitle',insights:'insightsSubtitle',quality:'qualitySubtitle'}[v];$('pageTitle').innerHTML=esc(t(name))+'<span class="heading-period">.</span>';$('pageSubtitle').textContent=t(sub);hideTooltip();if(v==='map')requestAnimationFrame(()=>{updateAspect();renderMarkers()});window.scrollTo({top:0,behavior:'auto'})}
function changeLanguage(){state.lang=state.lang==='en'?'ar':'en';document.documentElement.lang=state.lang;document.body.dir=state.lang==='ar'?'rtl':'ltr';$('languageLabel').textContent=state.lang==='en'?'عربي':'EN';$$('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});$('mapSearch').placeholder=t('searchPlaceholder');$('directorySearch').placeholder=t('searchDirectory');$('gestureTip').textContent=window.innerWidth<700?t('mobileGesture'):t('gestureTip');$('detailSheet').setAttribute('aria-label',t('details'));geography();updateSelectors();renderRegionPills();renderProgrammePills();filterData();renderDirectory();renderInsights();renderQuality();setView(state.view);if(state.selected){if(state.selected.group)openGroup(state.selected.group);else openFacility(state.selected.id)}}
function renderDirectory(){const q=$('directorySearch').value.trim(),gov=$('directoryGov').value,program=$('directoryProgram').value;const recs=state.records.filter(r=>(!gov||r.governorate_en===gov)&&(!program||r.main_program===program)&&(!q||searchMatches(r,q))).sort((a,b)=>a.governorate_en.localeCompare(b.governorate_en)||a.facility_code.localeCompare(b.facility_code));$('directoryCount').textContent=`${recs.length} ${t('records')}`;$('directoryEmpty').hidden=!!recs.length;$('directoryBody').innerHTML=recs.map(r=>`<tr><td><span class="code-primary">${esc(r.facility_code)}</span><small class="record-sub">${esc(r.site_name||r.commune||'—')}</small></td><td><span class="program-tag ${progClass(r.main_program)}">${esc(programName(r.main_program))}</span></td><td>${esc(t('regions')[r.governorate_en]||r.governorate_en)}</td><td>${esc(r.implementing_partner)}</td><td><button class="record-open" data-record="${esc(r.id)}">${esc(t('view'))} →</button></td></tr>`).join('');$$('[data-record]').forEach(b=>b.addEventListener('click',()=>openFacility(b.dataset.record)))}
function renderInsights(){const s=getSummary(state.records),max=Math.max(1,...Object.values(s.gov));$('insightGovernorates').innerHTML=GOVS.map(g=>`<div class="bar-row"><div class="bar-top"><span>${esc(t('regions')[g])}</span><b>${s.gov[g]}</b></div><div class="bar-track"><div class="bar-fill" style="width:${s.gov[g]/max*100}%"></div></div></div>`).join('');const total=s.total;let accum=0;const parts=PROGRAMMES.map(p=>{const a=accum;accum+=total?s.prog[p]/total*100:0;return `${COLORS[p]} ${a}% ${accum}%`});$('programDonut').style.background=total?`conic-gradient(${parts.join(',')})`:'#e6eef5';$('insightTotal').textContent=s.total;$('donutLegend').innerHTML=PROGRAMMES.map(p=>`<div class="donut-key"><i class="legend-dot ${p.toLowerCase()}"></i><span>${esc(programName(p))}</span><b>${s.prog[p]}</b></div>`).join('');$('insightPartners').innerHTML=Object.entries(s.partners).sort((a,b)=>b[1]-a[1]).map(([partner,n])=>`<div class="partner-row"><span>${esc(partner)}</span><b>${n}</b></div>`).join('')}
function renderQuality(){const r=state.records.filter(r=>r.quality_flags.length);$('qualityList').innerHTML=r.length?r.map(x=>`<article class="quality-row"><div><strong>${esc(x.facility_code)}</strong><p>${esc(t('regions')[x.governorate_en])} · ${esc(x.implementing_partner)}</p>${x.quality_flags.map(f=>`<span class="quality-flag">${esc(f)}</span>`).join('')}</div><button class="record-open" data-quality="${esc(x.id)}">${esc(t('view'))} →</button></article>`).join(''):`<div class="empty-state">${esc(t('noFlags'))}</div>`;$$('[data-quality]').forEach(b=>b.addEventListener('click',()=>openFacility(b.dataset.quality)))}
function field(key,v,wide=false){return `<div class="detail-field ${wide?'wide':''}"><label>${esc(t('fields')[key]||key)}</label><div dir="auto">${esc(V(v))}</div></div>`}
function closeDetails(){$('drawerBackdrop').hidden=true;$('detailSheet').hidden=true;state.selected=null;document.body.style.overflow=''}
function showDetails(html){const sheet=$('detailSheet');$('detailBody').innerHTML=html;sheet.hidden=false;$('drawerBackdrop').hidden=false;document.body.style.overflow='hidden';sheet.scrollTop=0;sheet.querySelector('[data-close]').addEventListener('click',closeDetails);sheet.querySelector('[data-copy-code]')?.addEventListener('click',()=>copyText(sheet.querySelector('[data-copy-code]').dataset.copyCode));sheet.querySelector('[data-copy-coords]')?.addEventListener('click',()=>copyText(sheet.querySelector('[data-copy-coords]').dataset.copyCoords));sheet.querySelector('[data-locate]')?.addEventListener('click',()=>{const id=sheet.querySelector('[data-locate]').dataset.locate;const r=state.records.find(x=>x.id===id);if(!r)return;closeDetails();state.gov='';state.program='';$('mapSearch').value='';$('partnerFilter').value='';$('typeFilter').value='';renderRegionPills();renderProgrammePills();filterData();setView('map');flyToPoint(r.lat,r.lon,115)});setTimeout(()=>sheet.querySelector('[data-close]')?.focus({preventScroll:true}),50)}
function openFacility(id){const r=state.records.find(r=>r.id===id);if(!r)return;state.selected=r;const coords=r.lat!==null&&r.lon!==null?`${r.lat.toFixed(6)}, ${r.lon.toFixed(6)}`:'—';showDetails(`<div class="detail-head"><span class="detail-overline">${esc(t('details'))}</span><button data-close class="detail-close" type="button" aria-label="${esc(t('close'))}">×</button><h2 id="detailTitle">${esc(r.facility_code)}</h2><p dir="auto">${esc(t('regions')[r.governorate_en])} · ${esc(r.district||r.commune||'')}</p><div class="detail-tags"><span class="detail-tag">${esc(programName(r.main_program))}</span><span class="detail-tag">${esc(r.facility_type)}</span></div></div><div class="detail-content"><div class="detail-actions"><button class="small-action" data-copy-code="${esc(r.facility_code)}">${esc(t('copyCode'))}</button><button class="small-action" data-copy-coords="${esc(coords)}">${esc(t('copyCoords'))}</button><button class="small-action" data-locate="${esc(r.id)}">${esc(t('locate'))}</button></div><div class="detail-section">${esc(t('summary'))}</div><div class="detail-grid">${field('implementing_partner',r.implementing_partner,true)}${field('site_name',r.site_name||r.commune,true)}${field('mode',r.mode)}${field('governorate',r.governorate)}</div><details class="details-accordion"><summary>${esc(t('fullDetails'))}</summary><div class="accordion-inner"><div class="detail-grid">${['facility_code','main_program','facility_type','district','subdistrict','commune','neighbourhood','lat','lon'].map(k=>field(k,r[k],['commune','neighbourhood'].includes(k))).join('')}</div></div></details><details class="details-accordion"><summary>${esc(t('brochure'))}</summary><div class="accordion-inner brochure-text" dir="auto">${esc(V(r.brochure))}</div></details><details class="details-accordion"><summary>${esc(t('source'))}</summary><div class="accordion-inner"><div class="detail-grid">${['source_sheet','source_row','lat_original','lon_original'].map(k=>field(k,r[k])).join('')}</div>${r.quality_flags?.length?`<div class="notice" style="margin-top:12px">${r.quality_flags.map(esc).join('<br>')}</div>`:''}</div></details></div>`)}
function openGroup(group){state.selected={group};showDetails(`<div class="detail-head"><span class="detail-overline">${esc(t('choice'))}</span><button data-close class="detail-close" type="button" aria-label="${esc(t('close'))}">×</button><h2 id="detailTitle">${group.length} ${esc(t('coLocated'))}</h2><p>${esc(t('choice'))}</p></div><div class="detail-content">${group.map(r=>`<button class="group-choice" data-select="${esc(r.id)}"><strong>${esc(r.facility_code)}</strong><small>${esc(programName(r.main_program))} · ${esc(r.implementing_partner)}</small></button>`).join('')}</div>`);$$('[data-select]').forEach(btn=>btn.addEventListener('click',()=>openFacility(btn.dataset.select)))}
async function copyText(text){try{await navigator.clipboard.writeText(text);showToast(t('saved'))}catch{showToast(text)}}
function exportCsv(){if(!state.records.length)return;if(!window.confirm(t('confirmExport')))return;const keys=['implementing_partner','facility_code','main_program','facility_type','mode','governorate','district','subdistrict','commune','neighbourhood','site_name','lat','lon','brochure'];const csv=[keys,...state.records.map(r=>keys.map(k=>r[k]??''))].map(row=>row.map(v=>`"${String(v).replace(/^[=+@-]/,"'$&").replace(/"/g,'""')}"`).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}));let link=document.createElement('a');link.href=url;link.download='facilities-private.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);showToast(t('exportSuccess'))}
// Map: offline vector geometry, fixed-size interactive clusters, intelligent tooltip,
// wheel-centered zoom on desktop, pointer drag, double click, two-finger touch pinch/pan.
// Map engine v3: SVG geography and geodesy, fixed-size HTML markers and city labels.
// Marker coordinates are projected directly from imported WGS84 latitude/longitude.
function project(lat,lon){
  const g=state.geo;
  return {x:g.xOffset+(lon-g.lonMin)*g.scale*.81,y:g.yOffset+(g.latMax-lat)*g.scale};
}
function mapSize(){const rect=$('mapSvg').getBoundingClientRect();return {width:Math.max(1,rect.width),height:Math.max(1,rect.height)}}
function countryBounds(){const p=$('landWorld').querySelector('.land-syria');if(!p)return{x:383,y:182,width:525,height:479};return p.getBBox()}
function aspectRatio(){const s=mapSize();return s.height/s.width}
function svgToScreen(x,y){const v=state.viewBox,s=mapSize();return{x:(x-v.x)*s.width/v.w,y:(y-v.y)*s.height/v.h}}
function fitCountryBox(){
  const b=countryBounds(), aspect=aspectRatio(),pad=window.innerWidth<700?42:65;
  const w=Math.max(b.width+pad*2,(b.height+pad*2)/aspect);
  const h=w*aspect;
  return {x:b.x+b.width/2-w/2,y:b.y+b.height/2-h/2,w,h};
}
function clampView(v){
  const aspect=aspectRatio();
  const w=Math.max(28,Math.min(1500,Number(v.w)||800));
  const h=w*aspect;
  const b=countryBounds(),pad=85;
  // Clamp the focal point to the country and its nearby geographic context;
  // large arbitrary pan offsets previously caused empty white map areas.
  const cx=Math.max(b.x-pad,Math.min(b.x+b.width+pad,(Number(v.x)||0)+w/2));
  const cy=Math.max(b.y-pad,Math.min(b.y+b.height+pad,(Number(v.y)||0)+h/2));
  return{x:cx-w/2,y:cy-h/2,w,h};
}
function updateAspect(){if(!state.mapReady)return;const v=state.viewBox;setViewBox({x:v.x+v.w/2-v.w/2,y:v.y+v.h/2-(v.w*aspectRatio())/2,w:v.w})}
function setViewBox(v){state.viewBox=clampView(v);applyView()}
function applyView(){
  const v=state.viewBox;
  $('mapSvg').setAttribute('viewBox',`${v.x} ${v.y} ${v.w} ${v.h}`);
  if(state.mapReady){renderCityLabels();renderMarkers()}
}
function cancelFly(){if(state.animation!==null){cancelAnimationFrame(state.animation);state.animation=null}}
function cancelWheelZoom(){if(state.zoomRaf){cancelAnimationFrame(state.zoomRaf);state.zoomRaf=null;state.zoomTarget=null}}
function flyTo(v,duration=370){
  cancelFly();cancelWheelZoom();hideTooltip();const dest=clampView(v);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||duration===0){setViewBox(dest);return}
  const from={...state.viewBox},start=performance.now();
  function tick(now){
    const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3);
    setViewBox({x:from.x+(dest.x-from.x)*e,y:from.y+(dest.y-from.y)*e,w:from.w+(dest.w-from.w)*e});
    if(p<1){state.animation=requestAnimationFrame(tick)}else{state.animation=null;setViewBox(dest)}
  }
  state.animation=requestAnimationFrame(tick);
}
function fullMap(){flyTo(fitCountryBox())}
function fitRecords(records){
  const pts=records.filter(r=>Number.isFinite(r.lat)&&Number.isFinite(r.lon)).map(r=>project(r.lat,r.lon));
  if(!pts.length){fullMap();return}
  const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x));
  const minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
  const ar=aspectRatio(),pad=window.innerWidth<700?85:125;
  const w=Math.max(92,maxX-minX+pad,(maxY-minY+pad)/ar);
  flyTo({x:(minX+maxX-w)/2,y:(minY+maxY-w*ar)/2,w});
}
function flyToPoint(lat,lon,width=150){
  if(!Number.isFinite(lat)||!Number.isFinite(lon))return;
  const p=project(lat,lon);
  flyTo({x:p.x-width/2,y:p.y-width*aspectRatio()/2,w:width});
}
function zoomAt(factor,clientX,clientY,animate=false){
  cancelWheelZoom();
  const rect=$('mapSvg').getBoundingClientRect(),v=state.viewBox;
  const ax=clientX===undefined?.5:Math.max(0,Math.min(1,(clientX-rect.left)/rect.width));
  const ay=clientY===undefined?.5:Math.max(0,Math.min(1,(clientY-rect.top)/rect.height));
  const w=Math.max(28,Math.min(1500,v.w*factor)),h=w*aspectRatio();
  const next={x:v.x+v.w*ax-w*ax,y:v.y+v.h*ay-h*ay,w};
  if(animate)flyTo(next,420);else{cancelFly();hideTooltip();setViewBox(next)}
}
function smoothWheelZoom(factor,clientX,clientY){
  cancelFly();hideTooltip();
  const rect=$('mapSvg').getBoundingClientRect(),base=state.zoomTarget||state.viewBox;
  const ax=Math.max(0,Math.min(1,(clientX-rect.left)/rect.width));
  const ay=Math.max(0,Math.min(1,(clientY-rect.top)/rect.height));
  const w=Math.max(28,Math.min(1500,base.w*factor)),h=w*aspectRatio();
  state.zoomTarget=clampView({x:base.x+base.w*ax-w*ax,y:base.y+base.h*ay-h*ay,w});
  if(state.zoomRaf)return;
  function frame(){
    const a=state.viewBox,b=state.zoomTarget;
    if(!b){state.zoomRaf=null;return}
    const ease=.28;
    setViewBox({x:a.x+(b.x-a.x)*ease,y:a.y+(b.y-a.y)*ease,w:a.w+(b.w-a.w)*ease});
    if(Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.w-b.w)<.085){
      const goal=state.zoomTarget;state.zoomTarget=null;state.zoomRaf=null;setViewBox(goal);
    }else state.zoomRaf=requestAnimationFrame(frame);
  }
  state.zoomRaf=requestAnimationFrame(frame);
}

function geography(){
  const root=$('landWorld');root.replaceChildren();
  const shapes=[...state.geo.land.filter(x=>!x.is_syria),...state.geo.land.filter(x=>x.is_syria)];
  for(const item of shapes){
    const e=svgEl('path',{d:item.path,class:item.is_syria?'land-syria':'land-neighbor'},root);
    const title=svgEl('title',{},e);title.textContent=item.name;
  }
  // Pure geographic reference. No lines between cities or facility locations.
  $('mapCities').replaceChildren();
  if(state.mapReady){renderCityLabels();renderMarkers()}
}
function renderCityLabels(){
  const el=$('cityLabels');if(!el)return;el.replaceChildren();
  const zoom=state.viewBox.w;
  const allowed=new Set(['Lattakia','Tartous','Hama','Homs']);
  for(const c of state.geo.cities){
    if(!allowed.has(c.name))continue;
    const p=svgToScreen(c.x,c.y),s=mapSize();
    if(p.x<28||p.x>s.width-85||p.y<20||p.y>s.height-20)continue;
    // City labels are only orientation aids: never cover facility markers.
    const near=state.filtered.some(r=>Number.isFinite(r.lat)&&Number.isFinite(r.lon)&&
      Math.hypot(svgToScreen(project(r.lat,r.lon).x,project(r.lat,r.lon).y).x-p.x,
                 svgToScreen(project(r.lat,r.lon).x,project(r.lat,r.lon).y).y-p.y)<(zoom<180?30:47));
    if(near)continue;
    const node=document.createElement('div');node.className='map-city-label';
    node.style.left=p.x+'px';node.style.top=p.y+'px';
    const dot=document.createElement('i');dot.className='map-city-dot';
    const name=document.createElement('span');name.textContent=t('regions')[c.name]||c.name;
    node.append(dot,name);el.append(node);
  }
}

function pinPositions(){
  // Each facility is an independent screen marker, including duplicate source coordinates.
  // The stored geographic anchors never move; collision offsets are visual only.
  const size=mapSize(),visible=[];
  for(const r of state.filtered){
    if(!Number.isFinite(r.lat)||!Number.isFinite(r.lon))continue;
    const geo=project(r.lat,r.lon),q=svgToScreen(geo.x,geo.y);
    if(q.x<-20||q.x>size.width+20||q.y<-20||q.y>size.height+20)continue;
    let h=0;for(const c of r.id)h=(Math.imul(h,31)+c.charCodeAt(0))|0;
    const angle=(Math.abs(h)%360)*Math.PI/180;
    visible.push({r,anchor:q,x:q.x+Math.cos(angle)*1.3,y:q.y+Math.sin(angle)*1.3});
  }
  const minDist=window.innerWidth<680?22:19;
  const maxDisplace=window.innerWidth<680?92:86;
  for(let iteration=0;iteration<38;iteration++){
    for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){
      const a=visible[i],b=visible[j];let dx=a.x-b.x,dy=a.y-b.y;
      let dist=Math.hypot(dx,dy);
      if(dist>=minDist)continue;
      if(dist<.01){dx=(i%2?1:-1)*.5;dy=(j%2?1:-1)*.5;dist=Math.hypot(dx,dy)}
      const push=(minDist-dist)*.52,ux=dx/dist,uy=dy/dist;
      a.x+=ux*push;a.y+=uy*push;b.x-=ux*push;b.y-=uy*push;
    }
    for(const p of visible){
      const restoring=iteration<16?.018:.035;
      p.x+=(p.anchor.x-p.x)*restoring;p.y+=(p.anchor.y-p.y)*restoring;
      // Keep the foreground pins on land for coastal cities, with their exact anchor retained.
      if(['Lattakia','Tartous'].includes(p.r.governorate_en)&&p.r.lon<35.99)
        p.x=Math.max(p.x,p.anchor.x-1);
      let dx=p.x-p.anchor.x,dy=p.y-p.anchor.y,d=Math.hypot(dx,dy);
      if(d>maxDisplace){p.x=p.anchor.x+dx/d*maxDisplace;p.y=p.anchor.y+dy/d*maxDisplace}
      p.x=Math.max(14,Math.min(size.width-14,p.x));p.y=Math.max(14,Math.min(size.height-14,p.y));
    }
  }
  return visible;
}
function tooltipAtRecord(r,pos){
  if(window.matchMedia('(hover:none)').matches)return;
  const el=$('mapTooltip'),s=mapSize();
  el.innerHTML=`<b>${esc(r.facility_code)}</b><small>${esc(programName(r.main_program))} · ${esc(t('regions')[r.governorate_en]||r.governorate_en)}</small>`;
  el.style.left=`${Math.max(125,Math.min(s.width-125,pos.x))}px`;
  el.style.top=pos.y+'px';el.classList.toggle('below',pos.y<105);el.hidden=false;
}
function hideTooltip(){$('mapTooltip').hidden=true}
function renderMarkers(){
  const root=$('mapPins');if(!root)return;
  const positions=pinPositions(),ids=new Set();
  if(!state.pinNodes)state.pinNodes=new Map();
  const guides=$('pinGuides');if(guides)guides.replaceChildren();
  for(const p of positions){
    ids.add(p.r.id);
    let node=state.pinNodes.get(p.r.id);
    if(!node){
      node=document.createElement('button');node.type='button';node.className='map-pin map-pin-single';
      node.setAttribute('aria-label',`${p.r.facility_code} · ${programName(p.r.main_program)}`);
      const dot=document.createElement('span');dot.className='pin-disc';node.append(dot);
      node.addEventListener('pointerenter',()=>tooltipAtRecord(p.r,node._lastPos||p));
      node.addEventListener('pointerleave',hideTooltip);
      node.addEventListener('focus',()=>tooltipAtRecord(p.r,node._lastPos||p));
      node.addEventListener('blur',hideTooltip);
      node.addEventListener('click',()=>{hideTooltip();openFacility(p.r.id)});
      state.pinNodes.set(p.r.id,node);root.append(node);
    }
    node._lastPos=p;
    node.style.left=p.x+'px';node.style.top=p.y+'px';
    node.style.setProperty('--pin-color',COLORS[p.r.main_program]||'#3571a4');
    const displacement=Math.hypot(p.x-p.anchor.x,p.y-p.anchor.y);
    // A subtle line explains visual separation between facilities sharing coordinates.
    // It is not a route or a line between cities.
    if(displacement>11&&guides){
      const line=document.createElement('span');line.className='pin-tether';
      const ang=Math.atan2(p.y-p.anchor.y,p.x-p.anchor.x)*180/Math.PI;
      line.style.left=p.anchor.x+'px';line.style.top=p.anchor.y+'px';
      line.style.width=displacement+'px';line.style.transform=`rotate(${ang}deg)`;
      guides.append(line);
    }
  }
  for(const [id,node] of state.pinNodes){if(!ids.has(id)){node.remove();state.pinNodes.delete(id)}}
}

function initMap(){
  state.geo=window.SYRIA_GEOGRAPHY;
  if(!state.geo)throw Error('Offline map geometry missing');
  state.mapReady=true;
  geography();
  setViewBox(fitCountryBox());
  $('zoomInBtn').addEventListener('click',()=>zoomAt(.73,undefined,undefined,true));
  $('zoomOutBtn').addEventListener('click',()=>zoomAt(1/.73,undefined,undefined,true));
  $('fullMapBtn').addEventListener('click',fullMap);
  $('fitMapBtn').addEventListener('click',()=>state.filtered.length?fitRecords(state.filtered):fullMap());
  const svg=$('mapSvg');
  svg.addEventListener('wheel',e=>{
    if(window.matchMedia('(pointer: coarse)').matches)return;
    e.preventDefault();
    const factor=Math.max(.88,Math.min(1.13,Math.exp(e.deltaY*.00055)));
    smoothWheelZoom(factor,e.clientX,e.clientY);
  },{passive:false});
  svg.addEventListener('dblclick',e=>{e.preventDefault();zoomAt(.65,e.clientX,e.clientY,true)});
  svg.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'||e.button!==0)return;
    cancelFly();cancelWheelZoom();hideTooltip();
    state.pointer={x:e.clientX,y:e.clientY,start:{...state.viewBox},id:e.pointerId};
    svg.setPointerCapture(e.pointerId);svg.classList.add('is-grabbing');
  });
  svg.addEventListener('pointermove',e=>{
    const g=state.pointer;if(!g||g.id!==e.pointerId)return;
    const rect=svg.getBoundingClientRect();
    setViewBox({x:g.start.x-(e.clientX-g.x)*g.start.w/rect.width,
      y:g.start.y-(e.clientY-g.y)*g.start.h/rect.height,w:g.start.w});
  });
  const pointerUp=()=>{state.pointer=null;svg.classList.remove('is-grabbing')};
  svg.addEventListener('pointerup',pointerUp);svg.addEventListener('pointercancel',pointerUp);
  svg.addEventListener('lostpointercapture',pointerUp);
  // Touch stays scroll-safe with one finger. Two-finger pan and pinch is supported.
  svg.addEventListener('touchstart',e=>{
    if(e.touches.length!==2){state.touches=null;return}
    const a=e.touches[0],b=e.touches[1];
    state.touches={distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),
      center:{x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2},start:{...state.viewBox}};
  },{passive:true});
  svg.addEventListener('touchmove',e=>{
    if(e.touches.length!==2||!state.touches)return;
    e.preventDefault();cancelFly();cancelWheelZoom();hideTooltip();
    const a=e.touches[0],b=e.touches[1],g=state.touches,rect=svg.getBoundingClientRect();
    const dist=Math.max(10,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY));
    const center={x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2};
    const ax=(g.center.x-rect.left)/rect.width,ay=(g.center.y-rect.top)/rect.height;
    const w=Math.max(28,Math.min(1500,g.start.w*g.distance/dist));
    const h=w*aspectRatio();
    setViewBox({x:g.start.x+ax*g.start.w-w*(center.x-rect.left)/rect.width,
      y:g.start.y+ay*g.start.h-h*(center.y-rect.top)/rect.height,w});
  },{passive:false});
  svg.addEventListener('touchend',e=>{if(e.touches.length<2)state.touches=null},{passive:true});
  svg.addEventListener('touchcancel',()=>state.touches=null,{passive:true});
  const resize=()=>{if(!state.mapReady)return;updateAspect();$('gestureTip').textContent=window.innerWidth<700?t('mobileGesture'):t('gestureTip')};
  if('ResizeObserver'in window){new ResizeObserver(resize).observe($('mapStage'))}
  window.addEventListener('resize',resize);
}

function init(){initMap();$$('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));$('brandLink').addEventListener('click',e=>{e.preventDefault();setView('map')});$('toDirectoryBtn').addEventListener('click',()=>setView('directory'));$('languageBtn').addEventListener('click',changeLanguage);$('mapSearch').addEventListener('input',filterData);$('partnerFilter').addEventListener('change',filterData);$('typeFilter').addEventListener('change',filterData);$('directorySearch').addEventListener('input',renderDirectory);$('directoryGov').addEventListener('change',renderDirectory);$('directoryProgram').addEventListener('change',renderDirectory);$('exportBtn').addEventListener('click',exportCsv);$('drawerBackdrop').addEventListener('click',closeDetails);document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDetails();if(state.filterOpen)toggleFilters(false)}if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&state.view==='map'){e.preventDefault();$('mapSearch').focus()}});$('filtersBtn').addEventListener('click',()=>toggleFilters(!state.filterOpen));$('closeFiltersBtn').addEventListener('click',()=>toggleFilters(false));$('clearFiltersBtn').addEventListener('click',()=>{state.gov='';state.program='';$('mapSearch').value='';$('partnerFilter').value='';$('typeFilter').value='';renderRegionPills();renderProgrammePills();filterData();fitRecords(state.filtered);toggleFilters(false)});document.addEventListener('pointerdown',e=>{if(state.filterOpen&&!$('advancedFilters').contains(e.target)&&!$('filtersBtn').contains(e.target))toggleFilters(false)});renderRegionPills();renderProgrammePills();updateSelectors();filterData();renderDirectory();renderInsights();renderQuality();changeLanguage();changeLanguage();importRecords(window.UNFPA_FACILITIES||[]);setView('map');$('gestureTip').textContent=window.innerWidth<700?t('mobileGesture'):t('gestureTip')}
function toggleFilters(open){state.filterOpen=open;$('advancedFilters').hidden=!open;$('filtersBtn').classList.toggle('is-active',open);$('filtersBtn').setAttribute('aria-expanded',String(open))}
try{init()}catch(error){console.error('Dashboard error:',error);showToast('Could not initialize the offline map: '+error.message)}
