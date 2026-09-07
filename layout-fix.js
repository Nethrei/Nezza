/* NEZZA — Responsive layout lock + album media + hero photo */
(() => {
  'use strict';
  const style = document.createElement('style');
  style.id = 'nezza-layout-fix';
  style.textContent = `
    .hero-grid{width:100%;max-width:1120px;margin-inline:auto}
    .hero-grid.nezza-hero-with-photo{display:block!important}
    .hero-title-row{position:relative!important;width:max-content!important;max-width:100%!important;margin:0 auto!important;display:block!important}
    .hero-title-row h2{position:relative!important;z-index:1!important;margin:0!important;padding:0!important}
    .hero-title-row .small-line{position:relative!important;display:inline-block!important;white-space:nowrap!important}
    .nezza-hero-photo{position:absolute!important;z-index:4!important;left:calc(100% + 14px)!important;bottom:-8px!important;width:clamp(125px,15vw,220px)!important;height:clamp(175px,30vw,385px)!important;display:flex!important;align-items:flex-end!important;justify-content:center!important;pointer-events:none!important;overflow:visible!important}
    .nezza-hero-photo img{display:block!important;width:auto!important;height:100%!important;max-width:145%!important;object-fit:contain!important;object-position:center bottom!important;filter:drop-shadow(0 22px 28px rgba(0,0,0,.38))!important;user-select:none!important}
    #album-view .slider-wrap{position:relative!important;display:grid!important;grid-template-columns:46px minmax(0,1fr) 46px!important;align-items:center!important;gap:12px!important;width:min(760px,100%)!important;margin:0 auto!important}
    #album-view #card-slider.card-slider{position:relative!important;display:block!important;width:100%!important;height:530px!important;min-width:0!important;overflow:hidden!important;padding:0!important;margin:0!important;scroll-snap-type:none!important;overscroll-behavior:none!important;touch-action:pan-y!important;isolation:isolate!important}
    #album-view #card-slider .memory-card{position:absolute!important;left:50%!important;top:22px!important;width:min(360px,78%)!important;height:455px!important;margin:0!important;display:block!important;overflow:hidden!important;flex:none!important;transform-origin:50% 92%!important;border-radius:5px!important;background:#f7f9fc!important;border:1px solid rgba(0,0,0,.12)!important;box-shadow:0 24px 55px rgba(0,0,0,.38)!important}
    #album-view #card-slider .memory-card:nth-child(1){z-index:3!important;transform:translateX(-50%) rotate(-4deg)!important}
    #album-view #card-slider .memory-card:nth-child(2){z-index:2!important;transform:translateX(-50%) translate(22px,12px) rotate(5deg) scale(.965)!important}
    #album-view #card-slider .memory-card:nth-child(3){z-index:1!important;transform:translateX(-50%) translate(-20px,24px) rotate(-7deg) scale(.93)!important}
    #album-view #card-slider .memory-card img{width:100%!important;height:310px!important;object-fit:cover!important;display:block!important}
    #album-view .card-info{color:#07152d!important;padding:22px!important}
    #album-view .card-info span{color:#168cff!important}.card-info h3{color:#07152d!important}.card-info p{color:#52627a!important}
    #album-view .card-number{color:#168cff!important;z-index:4!important}.slider-arrow{position:relative!important;z-index:20!important}
    #album-view .album-fotobar{position:relative!important;width:min(700px,94vw)!important;height:250px!important;margin:0 auto 34px!important;isolation:isolate!important}
    #album-view .album-fotobar-title{position:absolute!important;left:0!important;top:-30px!important;color:#72d8ff!important;font-size:9px!important;font-weight:800!important;letter-spacing:.22em!important}
    #album-view .fotobar-photo{position:absolute!important;left:50%!important;top:18px!important;width:190px!important;height:220px!important;padding:7px 7px 28px!important;border:1px solid rgba(10,25,50,.14)!important;background:#f7f9fc!important;box-shadow:0 18px 38px rgba(0,0,0,.28)!important;transform-origin:50% 85%!important}
    #album-view .fotobar-photo img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}
    #album-view .fotobar-photo:nth-child(2){transform:translateX(-50%) rotate(-10deg) translate(-105px,10px);z-index:1}.fotobar-photo:nth-child(3){transform:translateX(-50%) rotate(7deg) translate(104px,12px);z-index:2}.fotobar-photo:nth-child(4){transform:translateX(-50%) rotate(-4deg) translate(-38px,2px);z-index:4}.fotobar-photo:nth-child(5){transform:translateX(-50%) rotate(5deg) translate(42px,5px);z-index:3}
    @media(max-width:760px){html,body{width:100%;min-width:0;max-width:100%;overflow-x:hidden!important}.app-shell{box-sizing:border-box;width:100%;max-width:100vw}.hero-grid.nezza-hero-with-photo{min-height:calc(100dvh - 116px)!important}.hero-title-row{width:max-content!important;max-width:100%!important}.nezza-hero-photo{left:calc(100% + 5px)!important;bottom:-4px!important;width:clamp(88px,23vw,125px)!important;height:clamp(125px,39vw,205px)!important}.nezza-hero-photo img{max-width:150%!important}#album-view .slider-wrap{grid-template-columns:38px minmax(0,1fr) 38px!important;gap:5px!important}#album-view #card-slider.card-slider{height:470px!important}#album-view #card-slider .memory-card{top:18px!important;width:min(310px,78vw)!important;height:410px!important}#album-view #card-slider .memory-card:nth-child(1){transform:translateX(-50%) rotate(-3deg)!important}#album-view #card-slider .memory-card:nth-child(2){transform:translateX(-50%) translate(14px,10px) rotate(4deg) scale(.95)!important}#album-view #card-slider .memory-card:nth-child(3){transform:translateX(-50%) translate(-13px,20px) rotate(-5deg) scale(.90)!important}#album-view #card-slider .memory-card img{height:275px!important}#album-view .card-info{padding:18px!important}#album-view .slider-arrow{width:38px!important;height:38px!important;font-size:14px!important}#album-view .album-fotobar{width:94vw!important;height:205px!important;margin-bottom:26px!important}#album-view .album-fotobar-title{top:-24px!important;font-size:8px!important}#album-view .fotobar-photo{width:140px!important;height:170px!important;padding:5px 5px 22px!important;top:15px!important}}
    @media(max-width:380px){.nezza-hero-photo{width:82px!important;height:130px!important}#album-view #card-slider.card-slider{height:440px!important}#album-view #card-slider .memory-card{width:min(285px,76vw)!important;height:385px!important}#album-view #card-slider .memory-card img{height:255px!important}}
  `;
  document.head.appendChild(style);

  function makeTransparentHero(imgEl){
    const source=new Image();
    source.onload=()=>{
      const sx=40,sy=350,sw=405,sh=995;
      const canvas=document.createElement('canvas');canvas.width=sw;canvas.height=sh;
      const ctx=canvas.getContext('2d');ctx.drawImage(source,sx,sy,sw,sh,0,0,sw,sh);
      const mask=document.createElement('canvas');mask.width=sw;mask.height=sh;
      const m=mask.getContext('2d');m.fillStyle='#000';m.fillRect(0,0,sw,sh);m.fillStyle='#fff';
      m.beginPath();
      [[170,45],[210,20],[270,28],[300,65],[300,130],[285,165],[315,205],[370,230],[400,280],[400,500],[360,580],[335,620],[330,700],[325,970],[215,970],[195,900],[175,760],[145,610],[120,520],[110,400],[110,310],[70,270],[20,225],[20,170],[50,150],[105,115],[145,95]].forEach(([x,y],i)=>i?m.lineTo(x,y):m.moveTo(x,y));
      m.closePath();m.fill();
      ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0);ctx.globalCompositeOperation='source-over';
      imgEl.src=canvas.toDataURL('image/png');
    };
    source.src='Poster teknologi aplikasi web modern lulusan SMK.png';
  }

  function addHeroPhoto(){
    const home=document.querySelector('#home-view'),grid=home?.querySelector('.hero-grid'),copy=grid?.querySelector('.hero-copy'),title=copy?.querySelector('h2');
    if(!grid||!copy||!title||grid.querySelector('.nezza-hero-photo'))return;
    grid.classList.add('nezza-hero-with-photo');
    const row=document.createElement('div');row.className='hero-title-row';title.parentNode.insertBefore(row,title);row.appendChild(title);
    title.innerHTML='<span class="small-line">Small moments.<span class="hero-photo-slot"></span></span><br><span>Big memories.</span>';
    const visual=document.createElement('div');visual.className='nezza-hero-photo';visual.innerHTML='<img alt="Nezuro — 1788052638907.png" loading="eager" decoding="async">';row.appendChild(visual);makeTransparentHero(visual.querySelector('img'));
  }

  function addAlbumMedia(){
    const album=document.querySelector('#album-view'),slider=document.querySelector('#album-view #card-slider'),wrap=document.querySelector('#album-view .slider-wrap');if(!album||!slider||!wrap)return;
    if(!album.querySelector('.album-fotobar')){const photos=['IMG-20260828-WA0013.jpg','IMG-20260830-WA0003.jpg','IMG_20260809_123134.jpg','IMG_20260809_135935.jpg'];const fotobar=document.createElement('div');fotobar.className='album-fotobar';fotobar.innerHTML='<span class="album-fotobar-title">FOTOBAR · OUR FAVORITE FRAMES</span>'+photos.map((src,i)=>'<div class="fotobar-photo"><img src="'+src+'" alt="Foto bersama '+(i+1)+'" loading="lazy"></div>').join('');wrap.parentNode.insertBefore(fotobar,wrap)}
    const deckPhotos=['IMG_20260810_211253_277.jpg','IMG_20260812_180948_720.jpg','IMG_20260817_124324.jpg'];slider.querySelectorAll('.memory-card').forEach((card,i)=>{const img=card.querySelector('img');if(img&&deckPhotos[i]){img.src=deckPhotos[i];img.alt='Kenangan '+(i+1)}});
  }
  function init(){addHeroPhoto();addAlbumMedia()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('load',init,{once:true});window.setTimeout(init,300);
})();
