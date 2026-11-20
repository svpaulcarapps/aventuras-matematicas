import {tangramChallenge,checkTangram,placePiece,tangramEvidence,TANGRAM_COLORS,TANGRAM_NAMES} from './tangram.js?v=20261119-mult-v1';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LEVELS=['Pocas piezas, con líneas','Modelo oculto, pocas piezas','Siete piezas, con líneas','Modelo oculto, siete piezas'];
const STYLE=`<style>.tg-page{max-width:1240px;margin:auto;padding:24px 16px 48px;color:#143756}.tg-page button{font:inherit}.tg-page button:disabled{opacity:.5;cursor:default}.tg-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.tg-board{max-width:960px;margin:auto;background:#fffefa;border:2px solid #c9d8e6;border-radius:16px;touch-action:none;user-select:none;width:100%;height:auto;display:block}.tg-piece{cursor:grab;stroke:#22313f;stroke-width:.06;stroke-linejoin:round}.tg-piece.sel{stroke:#ffcf33;stroke-width:.14}.tg-tools{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.tg-msg{min-height:1.5em;font-weight:600}.tg-ok{padding:18px;background:#e9f8ee;border:1px solid #71ae87;border-radius:12px;margin-top:12px}.tg-levels{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.tg-levels button[aria-pressed=true]{background:#ffe08a}.tg-pista{display:inline-block;background:#fde7e4;border:1px solid #e8a49b;border-radius:8px;padding:4px 10px;margin:0}</style>`;
export function openTangram({host,level=1,player,api,home,onPoints}){
 let showLines=null,difficulty=Number(level),seed=Math.floor(Math.random()*10000),task,pieces,selected=null,run=null,solved=false,busy=false,mistakes=0,revision=0,drag=null;
 const root=document.createElement('section');root.className='tg-page';host.replaceChildren(root);
 const $=s=>root.querySelector(s),active=()=>host.contains(root),message=t=>{const m=$('#tg-msg');if(m)m.textContent=t};
 const poly=p=>placePiece(p.type,p),centre=pts=>[pts.reduce((s,p)=>s+p[0],0)/pts.length,pts.reduce((s,p)=>s+p[1],0)/pts.length];
 // Pull a piece onto whole-number points when one of its corners is close to one.
 // Imán: si la pieza está cerca de su sitio en la figura y con la misma forma girada, encaja exacta.
 const key=pts=>pts.map(v=>v.map(n=>Math.round(n*1000)/1000).join(',')).sort().join('|');
 const magnet=p=>{const mine=poly(p),c=centre(mine);let best=null;
  task.solution.forEach((slot,k)=>{if(slot.type!==p.type)return;if(pieces.some(q=>q!==p&&key(poly(q))===key(slot.pts)))return;const sc=centre(slot.pts),dx=sc[0]-c[0],dy=sc[1]-c[1],d=Math.hypot(dx,dy);if(d>1.3)return;
   const moved=mine.map(v=>[v[0]+dx,v[1]+dy]);if(key(moved)!==key(slot.pts))return;if(!best||d<best.d)best={d,dx,dy}});
  if(best){p.x=Math.round((p.x+best.dx)*1e6)/1e6;p.y=Math.round((p.y+best.dy)*1e6)/1e6;return true}return false};
 const snap=p=>{if(magnet(p))return;let best=null;for(const v of poly(p)){const t=[Math.round(v[0]),Math.round(v[1])],d=Math.hypot(t[0]-v[0],t[1]-v[1]);if(!best||d<best.d)best={d,dx:t[0]-v[0],dy:t[1]-v[1]}}if(best&&best.d<.6){p.x=Math.round((p.x+best.dx)*1e6)/1e6;p.y=Math.round((p.y+best.dy)*1e6)/1e6}};
 const turn=(p,change)=>{const before=centre(poly(p));change(p);const after=centre(poly(p));p.x+=before[0]-after[0];p.y+=before[1]-after[1];snap(p)};
 const choose=()=>{revision++;showLines=null;task=tangramChallenge({a:seed,level:difficulty});pieces=task.pieces.map(p=>({...p}));selected=null;run=null;solved=false;mistakes=0};
 const svgPoint=e=>{const svg=$('#tg-board'),pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())};
 const board=()=>{
  const sil=task.solution.map(p=>`<polygon points="${p.pts.map(v=>v.join(',')).join(' ')}" fill="#2d3b55" stroke="${(showLines??task.lines)?'#fffefa':'#2d3b55'}" stroke-width="${(showLines??task.lines)?.05:.02}" stroke-linejoin="round"/>`).join('');
  const ps=pieces.map((p,i)=>`<polygon class="tg-piece${selected===i?' sel':''}" data-piece="${i}" tabindex="0" role="button" aria-label="${TANGRAM_NAMES[p.type]}" points="${poly(p).map(v=>v.join(',')).join(' ')}" fill="${TANGRAM_COLORS[p.type]}" fill-opacity=".92"/>`).join('');
  $('#tg-board').innerHTML=`<rect x="10.6" y=".3" width="9.1" height="10.4" rx=".4" fill="#eef4fa"/><text x="15.15" y="10.4" text-anchor="middle" font-size=".45" fill="#6a819a">Piezas</text>${sil}${ps}`;
  // Draw the selected piece last so it stays on top.
  if(selected!==null){const el=$(`[data-piece="${selected}"]`);el?.parentNode.append(el)}
  $('#tg-check').disabled=solved;
  $('#tg-board').querySelectorAll('[data-piece]').forEach(el=>{
   el.onpointerdown=e=>{if(solved)return;e.preventDefault();const i=Number(el.dataset.piece),pt=svgPoint(e);selected=i;drag={i,dx:pieces[i].x-pt.x,dy:pieces[i].y-pt.y,moved:false};el.setPointerCapture?.(e.pointerId);board()};
   el.onkeydown=e=>{const i=Number(el.dataset.piece),p=pieces[i];selected=i;const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[e.key]){e.preventDefault();p.x+=moves[e.key][0];p.y+=moves[e.key][1]}else if(e.key==='r'||e.key==='R'){turn(p,q=>q.r=(q.r+1)%8)}else if(e.key==='f'||e.key==='F'){turn(p,q=>q.f=!q.f)}else return;board();$(`[data-piece="${i}"]`)?.focus();auto()};
  });
 };
 // Comprueba solo, sin contar fallo, cuando la figura queda completa.
 const auto=()=>{if(solved||busy||!run)return;try{checkTangram(task,pieces)}catch{return}void check()};
 const onMove=e=>{if(!drag)return;const pt=svgPoint(e),p=pieces[drag.i];p.x=pt.x+drag.dx;p.y=pt.y+drag.dy;drag.moved=true;const el=$(`[data-piece="${drag.i}"]`);if(el)el.setAttribute('points',poly(p).map(v=>v.join(',')).join(' '))};
 const onUp=()=>{if(!drag)return;const p=pieces[drag.i];if(drag.moved)snap(p);else turn(p,q=>q.r=(q.r+1)%8);drag=null;board();auto()};
 const render=()=>{
  root.innerHTML=`${STYLE}<div class="tg-head"><div><span class="eyebrow">MODELO OCULTO · OAOA</span><h1>El tangram</h1></div><button id="tg-home" class="secondary">Volver a las misiones</button></div><div class="tg-levels" role="group" aria-label="Nivel">${LEVELS.map((l,i)=>`<button class="secondary" data-level="${i+1}" aria-pressed="${difficulty===i+1}">${i+1} · ${l}</button>`).join('')}</div><p><b>${esc(task.name)}.</b> ${esc(task.prompt)}</p>${task.level<=3?`<p class="tg-pista"><b>Pista:</b> ${esc(task.hint)}</p>`:''}<svg id="tg-board" class="tg-board" viewBox="0 0 20 11" role="group" aria-label="Tablero del tangram"></svg><div class="tg-tools"><button id="tg-left" class="secondary">⟲ Girar</button><button id="tg-right" class="secondary">⟳ Girar</button><button id="tg-flip" class="secondary">⇋ Dar la vuelta</button><button id="tg-check" class="primary">Comprobar mi tangram</button>${task.lines?`<button id="tg-lines" class="secondary">${(showLines??task.lines)?'🙈 Ocultar piezas':'👁 Ver piezas'}</button>`:''}<button id="tg-next" class="secondary">Otro reto</button></div><p class="tg-hint">Arrastra las piezas a la silueta. Toca una pieza sin moverla para girarla. Con el teclado: flechas para mover, R para girar y F para dar la vuelta.</p><p id="tg-msg" class="tg-msg" role="status" aria-live="polite"></p><div id="tg-result"></div>`;
  $('#tg-home').onclick=()=>{cleanup();home()};
  root.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{difficulty=Number(b.dataset.level);seed=Math.floor(Math.random()*10000);choose();render()});
  const act=fn=>()=>{if(selected===null||solved){message('Primero toca una pieza.');return}turn(pieces[selected],fn);board();auto()};
  $('#tg-left').onclick=act(p=>p.r=(p.r+7)%8);$('#tg-right').onclick=act(p=>p.r=(p.r+1)%8);$('#tg-flip').onclick=act(p=>p.f=!p.f);
  $('#tg-next').onclick=()=>{let next;do{next=Math.floor(Math.random()*10000)}while(next===seed);seed=next;choose();render()};
  $('#tg-check').onclick=check;if($('#tg-lines'))$('#tg-lines').onclick=()=>{showLines=!(showLines??task.lines);$('#tg-lines').textContent=showLines?'🙈 Ocultar piezas':'👁 Ver piezas';board()};
  board();void begin();
 };
 async function begin(){const rev=revision;busy=true;message('Preparando el reto…');try{const data=await api({action:'start',...player,mode:'tangram',level:difficulty,a:seed,b:0});if(rev===revision&&active()){run=data.id;message('Arrastra las piezas a la silueta.')}}catch(e){if(rev===revision&&active()){message(e.message);$('#tg-result').innerHTML='<button id="tg-retry" class="primary">Intentar conectar de nuevo</button>';$('#tg-retry').onclick=()=>{$('#tg-result').innerHTML='';void begin()}}}finally{if(rev===revision&&active()){busy=false;board()}}}
 async function check(){
  if(solved)return;if(busy||!run){message(run?'Un momento, estoy guardando…':'Todavía estoy conectando con el juego. Espera un segundo y vuelve a pulsar.');if(!run&&!busy)void begin();return}
  try{checkTangram(task,pieces)}catch(e){mistakes=Math.min(1000,mistakes+1);message(e.message);return}
  busy=true;board();message('Guardando el reto…');
  try{const saved=await api({action:'finish',id:run,actions:[tangramEvidence(pieces)],mistakes});solved=true;onPoints?.(saved);if(active()){$('#tg-result').innerHTML=`<div class="tg-ok"><strong>¡Tangram conseguido!</strong><p>+${saved.points} puntos${saved.coins?' · +'+saved.coins+' monedas':''}</p></div>`;message('¡Muy bien! Prueba otro reto.')}}
  catch(e){if(active()){message(e.message+' Tus piezas siguen en su sitio.')}}
  finally{busy=false;if(active())board()}
 }
 const cleanup=()=>{window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp)};
 window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);
 choose();render();
 return root;
}
