import {sharkStep,italianParts,italianFinish} from './products.js?v=20261120-cursos-v1';
const box=(id,label,value='')=>`<input id="${id}" class="pr-in" aria-label="${label}" type="number" inputmode="numeric" min="0" step="1" required autocomplete="off" value="${value}">`;
const num=id=>{const e=document.getElementById(id);if(!e||e.value.trim()==='')throw Error('Escribe todas las casillas.');return Number(e.value)};
export const PRODUCT_STYLE=`<style>.pr-card{background:#fffefa;border:2px solid #c9d8e6;border-radius:16px;padding:18px;max-width:640px;margin:12px auto}.pr-card .pr-in{width:6.5em!important;max-width:100%;box-sizing:border-box;font:inherit;font-size:1.25rem;text-align:center;padding:6px;border:2px solid #9fb6cc;border-radius:10px;background:#fff}.pr-shark{display:grid;grid-template-columns:auto auto;justify-content:center;align-items:center;gap:6px 14px;font-size:1.6rem;font-weight:700;color:#143756}.pr-shark svg{width:100%;max-width:260px}.pr-card .pr-grid{width:auto!important;min-width:0!important;border-collapse:collapse;margin:12px auto;max-width:100%;font-size:1.3rem;font-weight:700}.pr-card .pr-grid td,.pr-card .pr-grid th{padding:6px!important;text-align:center;width:auto!important;min-width:0!important}.pr-card .pr-grid th{font-size:1.3rem}.pr-grid td.cell{border:3px solid #2d3b55;width:8em;height:3.2em;background:#f2f8ff}.pr-total{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:10px;font-size:1.3rem;font-weight:700}.pr-help{color:#4a627a;font-size:.95rem;margin:.6em 0 0}</style>`;
function sharkHtml(s){
 const a=s.op.a,b=s.op.b,t=Math.floor(b/10)*10,u=b%10,done=s.finished;
 const v=(id,label,val)=>done?`<b>${val}</b>`:box(id,label);
 return `<div class="pr-card"><div class="pr-shark"><div style="grid-column:1/3;text-align:center">🦈 ${a} · <span style="color:#d04b36">${Math.floor(b/10)}</span><span style="color:#2678ab">${u}</span> = ${done?s.answer:'?'}</div>
 <svg viewBox="0 0 260 120" aria-hidden="true" style="grid-column:1/3;margin:auto"><path d="M60 58 Q95 8 140 50" fill="none" stroke="#d04b36" stroke-width="4"/><path d="M60 70 Q110 118 160 72" fill="none" stroke="#2678ab" stroke-width="4"/><text x="40" y="70" font-size="26" font-weight="700" fill="#143756">${a}</text><text x="128" y="70" font-size="26" font-weight="700" fill="#d04b36">${Math.floor(b/10)}</text><text x="155" y="70" font-size="26" font-weight="700" fill="#2678ab">${u}</text></svg>
 <span style="color:#d04b36">Arriba: ${a} · ${t} =</span>${v('pr-top','Mandíbula de arriba',s.top)}
 <span style="color:#2678ab">Abajo: ${a} · ${u} =</span>${v('pr-bottom','Mandíbula de abajo',s.bottom)}
 <span>Total:</span>${v('pr-answer','Resultado',s.answer)}</div>
 ${done?'':'<button id="pr-check" class="primary" style="margin-top:14px">Comprobar ✓</button><p class="pr-help">El tiburón muerde las decenas (arriba) y las unidades (abajo). Después junta los dos mordiscos.</p>'}</div>`;
}
function italianHtml(s){
 const a=s.op.a,b=s.op.b,parted=!!s.rows,done=s.finished;
 const head=(i,arr,id,label)=>parted?`<b>${arr[i]}</b>`:box(id,label);
 const cell=i=>done?`<b>${s.cells[i]}</b>`:parted?box('pr-c'+i,'Casilla '+(i+1)):'';
 return `<div class="pr-card"><div style="text-align:center;font-size:1.6rem;font-weight:700;color:#143756">🧮 ${a} · ${b} = ${done?s.answer:'?'}</div>
 <table class="pr-grid" aria-label="Rectángulo de la técnica italiana"><tr><th></th><th>${head(0,s.cols,'pr-b0','Decenas de '+b)}</th><th>${head(1,s.cols,'pr-b1','Unidades de '+b)}</th></tr>
 <tr><th>${head(0,s.rows,'pr-a0','Decenas de '+a)}</th><td class="cell">${cell(0)}</td><td class="cell">${cell(1)}</td></tr>
 <tr><th>${head(1,s.rows,'pr-a1','Unidades de '+a)}</th><td class="cell">${cell(2)}</td><td class="cell">${cell(3)}</td></tr></table>
 ${parted&&!done?`<div class="pr-total">Total ${box('pr-answer','Resultado')}</div>`:''}
 ${done?'':`<button id="pr-check" class="primary" style="margin-top:14px">${parted?'Comprobar ✓':'Partir el rectángulo ✓'}</button><p class="pr-help">${parted?'Multiplica la fila por la columna en cada casilla y suma las cuatro.':`Escribe arriba las decenas y unidades de ${b} y a la izquierda las de ${a}.`}</p>`}</div>`;
}
export const productHtml=s=>PRODUCT_STYLE+(s.op.mode==='shark'?sharkHtml(s):italianHtml(s));
export function bindProduct(s,{commit,error}){
 const b=document.getElementById('pr-check');if(!b)return;
 const run=()=>{try{
  if(s.op.mode==='shark')commit(sharkStep(s,num('pr-top'),num('pr-bottom'),num('pr-answer')));
  else if(!s.rows)commit(italianParts(s,[num('pr-a0'),num('pr-a1')],[num('pr-b0'),num('pr-b1')]));
  else commit(italianFinish(s,[0,1,2,3].map(i=>num('pr-c'+i)),num('pr-answer')));
 }catch(e){error(e.message)}};
 b.onclick=run;document.querySelectorAll('.pr-in').forEach(i=>i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();run()}});
 document.querySelector('.pr-in')?.focus();
}
