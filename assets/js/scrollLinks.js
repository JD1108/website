function onClickScroll(e){
    e.preventDefault();
    const sel=e.target.getAttribute("href");
    const el=document.querySelector(sel);
    el.scrollIntoView({behavior:"smooth",block:"start"});
}