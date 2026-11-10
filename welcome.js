(() => {
  const root = document.getElementById('welcome');
  const film = root.querySelector('.welcome-film');
  const video = root.querySelector('video');
  const choices = root.querySelector('.welcome-choices');
  const skip = root.querySelector('.welcome-skip');
  const play = root.querySelector('.welcome-play');
  const sound = root.querySelector('.welcome-sound');
  const progress = root.querySelector('.welcome-progress');
  const back = document.querySelector('.section-back');
  const toolbar = document.querySelector('.section-toolbar');
  const backCopy={ro:'Înapoi la categorii',ru:'Назад к разделам',en:'Back to categories'};
  const sectionIds = ['about','food','dessert','wines','terrace','events','contact'];
  const background = [...document.body.children].filter(el => el !== root && !['SCRIPT','LINK'].includes(el.tagName));
  const copy = {
    ro:{soundOn:'Pornește muzica ♪',soundOff:'Oprește sunetul',skip:'Vezi categoriile ↗',play:'Pornește sunetul ♪',filmTitle:'O seară la noi.',title:'Bine ai venit la Cocof.',menu:'Meniu & rezervări',replay:'Revezi atmosfera ▷',close:'Intră pe site ↗',booking:'Ai ales ce îți place? Rezervă o masă.',call:'Rezervă o masă ↗'},
    ru:{soundOn:'Включить музыку ♪',soundOff:'Выключить звук',skip:'К разделам ↗',play:'Включить звук ♪',filmTitle:'Вечер у нас.',title:'Добро пожаловать в Cocof.',menu:'Меню и бронь',replay:'Посмотреть ещё раз ▷',close:'Открыть сайт ↗',booking:'Выбрали любимое блюдо? Забронируйте столик.',call:'Забронировать ↗'},
    en:{soundOn:'Play music ♪',soundOff:'Mute sound',skip:'Explore categories ↗',play:'Turn on sound ♪',filmTitle:'An evening with us.',title:'Welcome to Cocof.',menu:'Menu & reservations',replay:'Watch again ▷',close:'Enter the website ↗',booking:'Found your favourite? Book a table.',call:'Book a table ↗'}
  };
  const panelCopy={
    ro:{intro:'Cu ce începem?',foodNote:'De la micul dejun la cină',wineNote:'Descoperă colecția',dessertNote:'Un final dulce',aboutNote:'Povestea locului',terraceNote:'Seri în aer liber',eventsNote:'Împreună, la aceeași masă',contactNote:'Ne găsești în centru',book:'Rezervă o masă'},
    ru:{intro:'С чего начнём?',foodNote:'От завтрака до ужина',wineNote:'Откройте коллекцию',dessertNote:'Сладкое завершение',aboutNote:'История нашего места',terraceNote:'Вечера на свежем воздухе',eventsNote:'Вместе за одним столом',contactNote:'Мы в центре города',book:'Забронировать столик'},
    en:{intro:'Where shall we start?',foodNote:'From breakfast to dinner',wineNote:'Explore the collection',dessertNote:'Something sweet',aboutNote:'Get to know our place',terraceNote:'Evenings outdoors',eventsNote:'Together around the table',contactNote:'Find us in the centre',book:'Book a table'}
  };
  const booking = document.createElement('div');
  booking.className = 'menu-booking';
  booking.innerHTML = '<p data-welcome="booking"></p><a href="tel:+37368330088" data-welcome="call"></a>';
  const menuHeading = document.querySelector('#food .wrap');
  if(menuHeading){ const bookingWrap=document.createElement('div'); bookingWrap.className='wrap'; bookingWrap.append(booking); menuHeading.before(bookingWrap); }
  function translate(){
    const t = copy[document.documentElement.lang] || copy.ro;
    const panel = panelCopy[document.documentElement.lang] || panelCopy.ro;
    root.querySelectorAll('[data-panel-copy]').forEach(el=>el.textContent=panel[el.dataset.panelCopy]);
    document.querySelectorAll('[data-welcome]').forEach(el => el.textContent = t[el.dataset.welcome]);
    skip.textContent = choices.hidden ? t.skip : t.close;
    sound.textContent = video.muted ? t.soundOn : t.soundOff;
    sound.setAttribute('aria-pressed', String(!video.muted));
    document.querySelector('[data-section-back]').textContent=backCopy[document.documentElement.lang]||backCopy.ro;
    document.querySelectorAll('[data-section-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sectionLang===document.documentElement.lang)));
  }
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  function close(target){
    video.pause(); root.hidden = true; document.body.classList.remove('welcome-open');
    if(target && sectionIds.includes(target.slice(1))){document.body.dataset.section=target.slice(1);toolbar.hidden=false;}else{delete document.body.dataset.section;toolbar.hidden=true;}
    background.forEach(el => el.inert = false);
    if(target){location.hash=target; const section=document.querySelector(target); section?.scrollIntoView(); if(section){section.tabIndex=-1;section.focus({preventScroll:true});}}
    else document.querySelector('.brand')?.focus();
  }
  function showChoices(){
    root.classList.add('showing-choices');
    video.pause(); film.hidden=true; choices.hidden=false; root.scrollTop=0;choices.scrollTop=0;requestAnimationFrame(()=>{root.scrollTop=0;choices.scrollTop=0;});translate();
    choices.querySelector('a').focus({preventScroll:true});
  }
  async function startFilm(){
    root.classList.remove('showing-choices');
    film.hidden=false;choices.hidden=true;play.hidden=true;video.currentTime=0;
    video.muted=false;translate();
    try{await video.play();}
    catch{
      video.muted=true;translate();
      try{await video.play();}catch{play.hidden=false;}
      play.hidden=false;
    }
  }
  function open(){
    root.hidden=false; document.body.classList.add('welcome-open'); background.forEach(el=>el.inert=true);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) showChoices();
    else {startFilm(); skip.focus({preventScroll:true});}
  }
  skip.addEventListener('click',()=>choices.hidden?showChoices():close('#home'));
  sound.addEventListener('click',()=>{
    video.muted = !video.muted;
    translate();
    if(video.paused) video.play().catch(()=>{play.hidden=false;});
  });
  video.addEventListener('volumechange',translate);
  play.addEventListener('click',()=>{video.muted=false;play.hidden=true;video.play().catch(()=>{play.hidden=false;});translate();});
  root.querySelector('.welcome-replay').addEventListener('click',startFilm);
  video.addEventListener('ended',showChoices);
  video.addEventListener('error',showChoices);
  video.querySelector('source').addEventListener('error',showChoices);
  video.addEventListener('timeupdate',()=>{progress.style.width=`${video.duration ? video.currentTime/video.duration*100 : 0}%`;});
  root.querySelectorAll('.welcome-links a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();close(a.getAttribute('href'));}));
  root.addEventListener('keydown',e=>{
    if(e.key==='Escape'){choices.hidden?showChoices():close();}
    if(e.key==='Tab'){
      const elements=[...root.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);
      const first=elements[0],last=elements[elements.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  document.querySelectorAll('[data-section-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.sectionLang)));
  back.addEventListener('click',()=>{delete document.body.dataset.section;toolbar.hidden=true;root.hidden=false;document.body.classList.add('welcome-open');background.forEach(el=>el.inert=true);history.replaceState(null,'',location.pathname);showChoices();});
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();root.hidden=false;document.body.classList.add('welcome-open');background.forEach(el=>el.inert=true);showChoices();});
  translate();
  if(location.hash && sectionIds.includes(location.hash.slice(1))){document.body.dataset.section=location.hash.slice(1);toolbar.hidden=false;}else open();
})();
