document.addEventListener('DOMContentLoaded',()=>{
  const landing=document.getElementById('landing-container');
  const game=document.getElementById('game-container');
  const startBtn=document.getElementById('start-btn');
  const helpBtn=document.getElementById('help-btn');
  const overlay=document.getElementById('overlay');
  const closeOverlay=document.getElementById('close-overlay');
  function show(e){ if(e) e.style.display='block'; }
  function hide(e){ if(e) e.style.display='none'; }
  if(helpBtn&&overlay) helpBtn.addEventListener('click',()=>show(overlay));
  if(closeOverlay&&overlay) closeOverlay.addEventListener('click',()=>hide(overlay));
  if(startBtn&&landing&&game) startBtn.addEventListener('click',()=>{ hide(landing); show(game); if(typeof startGame==='function') startGame(); });
});
