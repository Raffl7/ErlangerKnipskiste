// Navigation, Paket-/Designauswahl und Bildansicht für die ursprünglichen Seiten.
const menu=document.querySelector('.mobileMenuButton'),nav=document.querySelector('.topbar nav');
if(menu&&nav){nav.id='main-nav';menu.setAttribute('aria-controls','main-nav');menu.setAttribute('aria-expanded','false');menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}));}
const form=document.querySelector('#bookingForm');
if(form){const params=new URLSearchParams(location.search);const design=Number(params.get('design'));if(params.get('design')==='custom'||params.get('paket')==='custom')form.elements.Designvorlage.value='Custom – individuelles Design';else if(Number.isInteger(design)&&design>=1&&design<=5)form.elements.Designvorlage.value=['Design 1 – Salbei & Gold','Design 2 – Schwarz & Gold','Design 3 – Hochzeit Weiß','Design 4 – Eiche &amp; Grün','Design 5 – Business Flow'][design-1];form.addEventListener('submit',()=>{const button=form.querySelector('[type="submit"]');button.disabled=true;button.textContent='Wird gesendet …';});window.addEventListener('pageshow',()=>{const button=form.querySelector('[type="submit"]');button.disabled=false;button.textContent='Unverbindlich anfragen';});}
const box=document.querySelector('#lightbox'),image=document.querySelector('#lightboxImage'),caption=document.querySelector('#lightboxCaption'),close=document.querySelector('.lightboxClose');
let previousFocus,savedOverflow='',savedPadding='',lightboxItems=[],lightboxIndex=0;
function lockPageScroll(){const body=document.body;savedOverflow=body.style.overflow;savedPadding=body.style.paddingRight;const gap=window.innerWidth-document.documentElement.clientWidth;if(!CSS.supports('scrollbar-gutter: stable')&&gap>0)body.style.paddingRight=(parseFloat(getComputedStyle(body).paddingRight)+gap)+'px';body.style.overflow='hidden';}
function unlockPageScroll(){document.body.style.overflow=savedOverflow;document.body.style.paddingRight=savedPadding;}
function placeholder(label){return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#252729"/><text x="600" y="400" text-anchor="middle" fill="#f1f0ec" font-family="Arial" font-size="36">'+label.replace(/[<>&]/g,'')+'</text></svg>');}
function lightboxEntry(trigger){const label=trigger.dataset.caption||trigger.querySelector('img')?.alt||trigger.textContent.trim();return{src:trigger.dataset.large||trigger.dataset.src||trigger.querySelector('img')?.getAttribute('src')||placeholder(label),label};}
const lightboxPrev=document.createElement('button'),lightboxNext=document.createElement('button'),lightboxHelp=document.createElement('p');
if(box){
 lightboxPrev.type=lightboxNext.type='button';lightboxPrev.className='lightboxPrev';lightboxNext.className='lightboxNext';lightboxPrev.textContent='‹';lightboxNext.textContent='›';lightboxPrev.setAttribute('aria-label','Vorheriges Bild');lightboxNext.setAttribute('aria-label','Nächstes Bild');lightboxHelp.className='lightboxHelp';lightboxHelp.setAttribute('aria-live','polite');box.append(lightboxPrev,lightboxNext,lightboxHelp);caption?.setAttribute('aria-live','polite');
}
function renderBox(){const item=lightboxItems[lightboxIndex];if(!item)return;image.src=item.src;image.alt=item.label;caption.textContent=item.label;lightboxPrev.hidden=lightboxNext.hidden=lightboxItems.length<2;lightboxHelp.textContent=lightboxItems.length>1?`${lightboxIndex+1} / ${lightboxItems.length} · Wischen oder Pfeile nutzen`:'Bildansicht · Mit × oder Zurück schließen';}
function revealBox(){if(box.classList.contains('is-open'))return;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Bildansicht');box.setAttribute('aria-hidden','false');box.classList.add('is-open');lockPageScroll();['main','header','footer'].forEach(s=>document.querySelector(s)?.setAttribute('inert',''));close?.focus();}
function openBox(src,label,trigger){if(!box)return;previousFocus=trigger;const group=trigger?.closest('.boothSlides,.simpleDesignPhotos,.galleryGroup,.homeGalleryTrack,.bookingTemplates');const seen=new Set();lightboxItems=[];if(group)group.querySelectorAll('.galleryItem,.inlineImageTag[data-large],.lightboxTrigger').forEach(el=>{const item=lightboxEntry(el);if(!seen.has(item.src)){seen.add(item.src);lightboxItems.push(item);}});lightboxIndex=lightboxItems.findIndex(item=>item.src===src);if(lightboxIndex<0){lightboxItems=[{src,label}];lightboxIndex=0;}if(!box.classList.contains('is-open'))history.pushState({...history.state,knipskisteLightbox:true,lightboxIndex},'',location.href);renderBox();revealBox();}
function hideBox(){if(!box?.classList.contains('is-open'))return;box.classList.remove('is-open');box.setAttribute('aria-hidden','true');unlockPageScroll();['main','header','footer'].forEach(s=>document.querySelector(s)?.removeAttribute('inert'));previousFocus?.focus({preventScroll:true});}
function closeBox(){if(!box?.classList.contains('is-open'))return;hideBox();if(history.state?.knipskisteLightbox)history.back();}
window.addEventListener('popstate',event=>{if(event.state?.knipskisteLightbox&&lightboxItems.length){lightboxIndex=Math.min(event.state.lightboxIndex||0,lightboxItems.length-1);renderBox();revealBox();}else hideBox();});
function stepBox(step){if(!box?.classList.contains('is-open')||lightboxItems.length<2)return;lightboxIndex=(lightboxIndex+step+lightboxItems.length)%lightboxItems.length;renderBox();if(history.state?.knipskisteLightbox)history.replaceState({...history.state,lightboxIndex},'',location.href);}
lightboxPrev.addEventListener('click',()=>stepBox(-1));lightboxNext.addEventListener('click',()=>stepBox(1));
let imageTouch;
box?.addEventListener('touchstart',event=>{imageTouch=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
box?.addEventListener('touchend',event=>{if(!imageTouch)return;const touch=event.changedTouches[0],dx=touch.clientX-imageTouch.x,dy=touch.clientY-imageTouch.y;imageTouch=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)stepBox(dx<0?1:-1);},{passive:true});
box?.addEventListener('touchcancel',()=>imageTouch=null,{passive:true});
document.querySelectorAll('.galleryItem,.inlineImageTag[data-large],.lightboxTrigger').forEach(t=>{const item=lightboxEntry(t);if(t.tagName!=='BUTTON'){t.tabIndex=0;t.setAttribute('role','button');t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openBox(item.src,item.label,t);}});}t.addEventListener('click',()=>openBox(item.src,item.label,t));});
close?.addEventListener('click',closeBox);box?.addEventListener('click',e=>{if(e.target===box)closeBox();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeBox();nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}if(!box?.classList.contains('is-open'))return;if(e.key==='ArrowLeft'){e.preventDefault();stepBox(-1);}if(e.key==='ArrowRight'){e.preventDefault();stepBox(1);}if(e.key==='Tab'){const buttons=[...box.querySelectorAll('button')].filter(b=>!b.hidden);const current=buttons.indexOf(document.activeElement);e.preventDefault();buttons[(current+(e.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();}});

// FAQ: native Details bleiben bedienbar, die Ansicht bleibt beim Umschalten stehen.
const faqGrid=document.querySelector('#faq .faqGrid');
if(faqGrid){
 const reserveHeight=()=>{faqGrid.style.minHeight='';if(faqGrid.offsetParent!==null)faqGrid.style.minHeight=Math.ceil(faqGrid.getBoundingClientRect().height)+'px';};
 document.addEventListener('info-panel-change',()=>requestAnimationFrame(reserveHeight));
 document.fonts.ready.then(reserveHeight);
 let faqResize;
 window.addEventListener('resize',()=>{clearTimeout(faqResize);faqResize=setTimeout(reserveHeight,150);});
 faqGrid.querySelectorAll('summary').forEach(summary=>summary.addEventListener('click',event=>{
  event.preventDefault();
  const y=window.scrollY,details=summary.closest('details');
  const previousHeight=faqGrid.getBoundingClientRect().height;
  details.open=!details.open;
  faqGrid.style.minHeight=Math.ceil(Math.max(previousHeight,faqGrid.getBoundingClientRect().height))+'px';
  window.scrollTo({top:y,behavior:'instant'});
 }));
}
// Kurze Hinweise folgen dem Mauszeiger, ohne den Seiteninhalt zu verschieben.
const hint=document.createElement('div');hint.className='hoverHint';hint.setAttribute('role','tooltip');hint.id='hover-hint';hint.hidden=true;document.body.append(hint);
function placeHint(x,y){const width=hint.offsetWidth,height=hint.offsetHeight;hint.style.left=Math.max(8,Math.min(x+14,innerWidth-width-8))+'px';hint.style.top=Math.max(8,Math.min(y+16,innerHeight-height-8))+'px';}
document.querySelectorAll('[data-hint]').forEach(trigger=>{function show(e){hint.textContent=trigger.dataset.hint;hint.hidden=false;trigger.setAttribute('aria-describedby','hover-hint');const r=trigger.getBoundingClientRect();placeHint(r.left,r.bottom);}function hide(){hint.hidden=true;trigger.removeAttribute('aria-describedby');}trigger.addEventListener('mouseenter',show);trigger.addEventListener('mouseleave',hide);trigger.addEventListener('focus',show);trigger.addEventListener('blur',hide);trigger.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});if(trigger.tagName==='BUTTON')trigger.addEventListener('click',e=>{e.preventDefault();show(e);});});
const templateCarousel=document.querySelector('[data-carousel]');
if(templateCarousel){
 const slides=[...templateCarousel.children],controls=document.querySelector('.boothControls');let current=0,startTouch,suppressClickUntil=0;
 const showSlide=()=>{slides.forEach((slide,index)=>slide.hidden=index!==current);controls.querySelectorAll('[data-slide-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.slideIndex)===current)));};
 const advance=step=>{current=(current+step+slides.length)%slides.length;showSlide();};
 controls.hidden=false;showSlide();controls.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>advance(button.dataset.slide==='next'?1:-1)));
 controls.querySelectorAll('[data-slide-index]').forEach(button=>button.addEventListener('click',()=>{current=Number(button.dataset.slideIndex);showSlide();}));
 templateCarousel.addEventListener('touchstart',e=>{startTouch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
 templateCarousel.addEventListener('touchend',e=>{if(!startTouch)return;const t=e.changedTouches[0],dx=t.clientX-startTouch.x,dy=t.clientY-startTouch.y;startTouch=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5){suppressClickUntil=Date.now()+400;advance(dx<0?1:-1);}},{passive:true});
 templateCarousel.addEventListener('touchcancel',()=>startTouch=null,{passive:true});
 templateCarousel.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
}

// Kurze Custom-Erklärung direkt am Auslöser, ohne den Seiteninhalt zu verschieben.
const customInfoTriggers=[...document.querySelectorAll('[data-custom-info]')];
if(customInfoTriggers.length){
 const popup=document.createElement('div');popup.className='customInfoPopup';popup.id='custom-design-info';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','Eigenes Design erklärt');
 popup.innerHTML='<button class="customInfoClose" type="button" aria-label="Erklärung schließen">×</button><h3>Was ist ein Design auf der Fotobox?</h3><p>Wir gestalten den Startbildschirm auf dem Touchscreen und die passenden Rahmen für Einzelbilder und Collagen nach deinen Wünschen – etwa mit deinen Farben, Motiven, Namen oder einem Firmenlogo.</p><p>Den Entwurf stimmen wir vorab mit dir ab. Der Gesamtpreis für Fotobox und eigenes Design beträgt 200 €. Der Stoffhintergrund hinter den Gästen ist davon unabhängig.</p><a href="funktionierts.html#design-pakete">Mehr erfahren →</a>';
 document.body.append(popup);let activeTrigger;
 function placeCustomInfo(){if(popup.hidden||!activeTrigger)return;const r=activeTrigger.getBoundingClientRect(),w=popup.offsetWidth,h=popup.offsetHeight;const left=Math.max(12,Math.min(r.left,innerWidth-w-12));let top=r.bottom+8;if(top+h>innerHeight-12)top=r.top-h-8;popup.style.left=left+'px';popup.style.top=Math.max(12,Math.min(top,innerHeight-h-12))+'px';}
 function hideCustomInfo(restoreFocus=false){popup.hidden=true;activeTrigger?.setAttribute('aria-expanded','false');if(restoreFocus)activeTrigger?.focus({preventScroll:true});activeTrigger=null;}
 customInfoTriggers.forEach(trigger=>{trigger.setAttribute('aria-controls',popup.id);trigger.setAttribute('aria-haspopup','dialog');trigger.addEventListener('click',()=>{if(activeTrigger===trigger&&!popup.hidden){hideCustomInfo(true);return;}hideCustomInfo();activeTrigger=trigger;trigger.setAttribute('aria-expanded','true');popup.hidden=false;placeCustomInfo();popup.querySelector('button').focus();});});
 popup.querySelector('button').addEventListener('click',()=>hideCustomInfo(true));
 document.addEventListener('click',event=>{if(!popup.hidden&&!popup.contains(event.target)&&!customInfoTriggers.some(t=>t.contains(event.target)))hideCustomInfo();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!popup.hidden){event.preventDefault();hideCustomInfo(true);}});
 window.addEventListener('resize',placeCustomInfo);window.addEventListener('scroll',placeCustomInfo,{passive:true});
}

