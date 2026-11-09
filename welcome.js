(() => {
  const root = document.getElementById('welcome');
  const film = root.querySelector('.welcome-film');
  const video = root.querySelector('video');
  const choices = root.querySelector('.welcome-choices');
  const skip = root.querySelector('.welcome-skip');
  const play = root.querySelector('.welcome-play');
  const sound = root.querySelector('.welcome-sound');
  const progress = root.querySelector('.welcome-progress');
  const background = [...document.body.children].filter(el => el !== root && !['SCRIPT','LINK'].includes(el.tagName));
  const copy = {
    ro:{soundOn:'Pornește muzica ♪',soundOff:'Oprește sunetul',skip:'Vezi categoriile ↗',play:'Redă filmul ▷',filmTitle:'O seară la noi.',title:'Bine ai venit la Cocof.',menu:'Meniu & rezervări',replay:'Revezi atmosfera ▷',close:'Intră pe site ↗',booking:'Ai ales ce îți place? Rezervă o masă.',call:'Rezervă o masă ↗'},
    ru:{soundOn:'Включить музыку ♪',soundOff:'Выключить звук',skip:'К разделам ↗',play:'Смотреть видео ▷',filmTitle:'Вечер у нас.',title:'Добро пожаловать в Cocof.',menu:'Меню и бронь',replay:'Посмотреть ещё раз ▷',close:'Открыть сайт ↗',booking:'Выбрали любимое блюдо? Забронируйте столик.',call:'Забронировать ↗'},
    en:{soundOn:'Play music ♪',soundOff:'Mute sound',skip:'Explore categories ↗',play:'Play film ▷',filmTitle:'An evening with us.',title:'Welcome to Cocof.',menu:'Menu & reservations',replay:'Watch again ▷',close:'Enter the website ↗',booking:'Found your favourite? Book a table.',call:'Book a table ↗'}
  };
  const booking = document.createElement('div');
  booking.className = 'menu-booking';
  booking.innerHTML = '<p data-welcome="booking"></p><a href="tel:+37368330088" data-welcome="call"></a>';
  const menuHeading = document.querySelector('#food .wrap');
  if(menuHeading){ const bookingWrap=document.createElement('div'); bookingWrap.className='wrap'; bookingWrap.append(booking); menuHeading.before(bookingWrap); }
  function translate(){
    const t = copy[document.documentElement.lang] || copy.ro;
    document.querySelectorAll('[data-welcome]').forEach(el => el.textContent = t[el.dataset.welcome]);
    skip.textContent = choices.hidden ? t.skip : t.close;
    sound.textContent = video.muted ? t.soundOn : t.soundOff;
    sound.setAttribute('aria-pressed', String(!video.muted));
  }
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  function close(target){
    video.pause(); root.hidden = true; document.body.classList.remove('welcome-open');
    background.forEach(el => el.inert = false);
    if(target){location.hash=target; const section=document.querySelector(target); section?.scrollIntoView(); if(section){section.tabIndex=-1;section.focus({preventScroll:true});}}
    else document.querySelector('.brand')?.focus();
  }
  function showChoices(){
    video.pause(); film.hidden=true; choices.hidden=false; root.scrollTop=0;translate();
    choices.querySelector('a').focus({preventScroll:true});
  }
  async function startFilm(){
    film.hidden=false;choices.hidden=true;play.hidden=true;video.currentTime=0;translate();
    try{await video.play();}catch{play.hidden=false;}
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
  play.addEventListener('click',()=>{video.muted=false;startFilm();});
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
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();root.hidden=false;document.body.classList.add('welcome-open');background.forEach(el=>el.inert=true);showChoices();});
  translate();
  if(!location.hash || location.hash==='#home') open();
})();
