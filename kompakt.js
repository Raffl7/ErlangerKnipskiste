// Erklärungen gezielt auswählen, direkte Links öffnen den passenden Bereich.
const infoTabs=[...document.querySelectorAll('[data-info-tab]')];
const infoPanels=[...document.querySelectorAll('[data-info-panel]')];
if(infoTabs.length){
 function selectInfo(group){infoPanels.forEach(panel=>panel.hidden=panel.dataset.infoPanel!==group);infoTabs.forEach(tab=>{if(tab.dataset.infoTab===group)tab.setAttribute('aria-current','location');else tab.removeAttribute('aria-current');});document.dispatchEvent(new Event('info-panel-change'));}
 function showTarget(scroll=false){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{id='';}const target=document.getElementById(id);selectInfo(target?.closest('[data-info-panel]')?.dataset.infoPanel||'funktion');if(scroll&&target)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'auto'}));}
 infoTabs.forEach(tab=>tab.addEventListener('click',event=>{event.preventDefault();selectInfo(tab.dataset.infoTab);history.replaceState(null,'',tab.getAttribute('href'));}));window.addEventListener('hashchange',()=>showTarget(true));showTarget(Boolean(location.hash));
}

// Endloses Galerie-Karussell: Kopien sorgen für nahtlosen Übergang in beide Richtungen.
const galleryTrack=document.querySelector('.homeGalleryTrack');
if(galleryTrack){
 const carousel=document.querySelector('.homeGalleryCarousel');
 const controls=carousel.querySelector('.homeGalleryControls');
 const dots=controls.querySelector('.homeGalleryDots');
 const prev=carousel.querySelector('[data-gallery-step="-1"]');
 const next=carousel.querySelector('[data-gallery-step="1"]');
 const cards=[...galleryTrack.children];
 let stride=1,base=0,span=0,pageWidth=1,pages=1,timer;
 function copyCard(card){const copy=card.cloneNode(true);copy.tabIndex=-1;copy.dataset.galleryCopy='true';copy.addEventListener('click',()=>openBox(copy.dataset.large,copy.dataset.caption,copy));return copy;}
 cards.forEach(card=>galleryTrack.append(copyCard(card)));
 [...cards].reverse().forEach(card=>galleryTrack.prepend(copyCard(card)));
 const wrap=(value,total)=>((value%total)+total)%total;
 function updateDots(){const page=wrap(Math.round((galleryTrack.scrollLeft-base)/pageWidth),pages);[...dots.children].forEach((dot,index)=>dot.setAttribute('aria-pressed',String(index===page)));}
 function normalize(){if(galleryTrack.scrollLeft<base-1||galleryTrack.scrollLeft>=base+span-1){galleryTrack.scrollTo({left:base+wrap(galleryTrack.scrollLeft-base,span),behavior:'instant'});}updateDots();}
 function size(){
  const oldIndex=span?wrap(Math.round((galleryTrack.scrollLeft-base)/stride),cards.length):0;
  const gap=parseFloat(getComputedStyle(galleryTrack).gap)||0;
  stride=cards[0].getBoundingClientRect().width+gap;
  const perPage=Math.max(1,Math.round((galleryTrack.clientWidth+gap)/stride));
  span=cards.length*stride;base=span;pageWidth=perPage*stride;pages=Math.ceil(cards.length/perPage);
  dots.replaceChildren();
  for(let index=0;index<pages;index++){const dot=document.createElement('button');dot.type='button';dot.className='galleryDot';dot.setAttribute('aria-label',`Galerievorschau ${index+1} von ${pages}`);dot.addEventListener('click',()=>galleryTrack.scrollTo({left:base+index*pageWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));dots.append(dot);}
  galleryTrack.scrollTo({left:base+oldIndex*stride,behavior:'instant'});controls.hidden=pages<2;prev.hidden=next.hidden=pages<2;updateDots();
 }
 [prev,next].forEach(button=>button.addEventListener('click',()=>{clearTimeout(timer);galleryTrack.scrollTo({left:base+(Math.round((galleryTrack.scrollLeft-base)/pageWidth)+Number(button.dataset.galleryStep))*pageWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
 galleryTrack.addEventListener('scroll',()=>{updateDots();clearTimeout(timer);timer=setTimeout(normalize,160);},{passive:true});
 galleryTrack.addEventListener('scrollend',normalize);
 window.addEventListener('resize',size);size();
}

// Eine Auswahl bestimmt Design und Aufpreis; keine zweite Auswahlliste.
const enquiry=document.querySelector('#bookingForm');
if(enquiry){
 const design=enquiry.elements.Designvorlage;
 const price=enquiry.elements.Mietpreis;
 const names=['Design 1 – Salbei & Gold','Design 2 – Schwarz & Gold','Design 3 – Hochzeit Weiß','Design 4 – Eiche &amp; Grün','Design 5 – Business Flow'];
 const buttons=[...enquiry.querySelectorAll('[data-template-index], [data-design-choice]')];
 function updateDesign(){const custom=design.value==='Custom – individuelles Design';price.value=custom?'200 € (175 € + 25 € eigenes Design)':'175 €';buttons.forEach(button=>{const value=button.dataset.templateIndex?names[Number(button.dataset.templateIndex)-1]:button.dataset.designChoice==='custom'?'Custom – individuelles Design':'Noch nicht festgelegt';button.setAttribute('aria-pressed',String(value===design.value));});}
 buttons.forEach(button=>button.addEventListener('click',()=>{design.value=button.dataset.templateIndex?names[Number(button.dataset.templateIndex)-1]:button.dataset.designChoice==='custom'?'Custom – individuelles Design':'Noch nicht festgelegt';updateDesign();}));updateDesign();
}
