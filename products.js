// Multiplication routes from OAOA 4.º (pp. 150-153), shared by the browser and the server.
// shark: «propiedad distributiva» with the shark's jaws, a · b = a · tens + a · units.
// italian: «técnica italiana», a rectangle split into four partial products.
export const PRODUCT_MODES=['shark','italian'];
const RANGES={
 shark:[[2,3,12,39],[4,9,13,46],[5,9,26,75],[6,9,46,88]],
 italian:[[11,23,13,38],[11,31,11,28],[11,45,11,51],[13,81,16,71]]
};
const integer=n=>Number.isInteger(n)&&n>=0;
const split=n=>[Math.floor(n/10)*10,n%10];
export const productRange=(mode,level)=>RANGES[mode]?.[level-1]||null;
export function fitsProduct(mode,a,b,level){
 const r=productRange(mode,level);
 return !!r&&Number.isInteger(a)&&Number.isInteger(b)&&a>=r[0]&&a<=r[1]&&b>=r[2]&&b<=r[3]&&b%10!==0&&(mode==='shark'||a%10!==0);
}
export function nextProduct(mode,level){
 const r=productRange(mode,level);if(!r)throw Error('Elige un nivel.');
 for(let i=0;i<500;i++){const a=r[0]+Math.floor(Math.random()*(r[1]-r[0]+1)),b=r[2]+Math.floor(Math.random()*(r[3]-r[2]+1));if(fitsProduct(mode,a,b,level))return {mode,a,b,level,digits:2}}
 throw Error('No he encontrado una multiplicación para este nivel.');
}
export function createShark(op){return {op,top:null,bottom:null,answer:null,finished:false,actions:[],log:[]}}
export function sharkStep(state,top,bottom,answer){
 const s=structuredClone(state),[t,u]=split(s.op.b),a=s.op.a;
 if(s.finished)throw Error('Ya está resuelta.');
 if(!integer(top)||top!==a*t)throw Error(`Mandíbula de arriba: multiplica ${a} · ${t}. Recuerda que el ${t/10} vale ${t}.`);
 if(!integer(bottom)||bottom!==a*u)throw Error(`Mandíbula de abajo: multiplica ${a} · ${u}.`);
 if(!integer(answer)||answer!==top+bottom)throw Error(`Ahora suma lo que ha mordido el tiburón: ${top} + ${bottom}.`);
 Object.assign(s,{top,bottom,answer,finished:true});s.actions.push({type:'shark',top,bottom,answer});
 s.log.push(`${a} · ${t} = ${top}`,`${a} · ${u} = ${bottom}`,`${top} + ${bottom} = ${answer}`);return s;
}
// Level 1 gives the split of both factors, as in the book; from level 2 the pupil splits the rectangle.
export function createItalian(op){const given=op.level===1;return {op,rows:given?split(op.a):null,cols:given?split(op.b):null,cells:null,answer:null,finished:false,actions:[],log:[]}}
export function italianParts(state,rows,cols){
 const s=structuredClone(state);
 if(s.rows)throw Error('El rectángulo ya está partido.');
 const ok=(v,n)=>Array.isArray(v)&&v.length===2&&v.every(integer)&&v[0]===split(n)[0]&&v[1]===split(n)[1];
 if(!ok(rows,s.op.a))throw Error(`Parte ${s.op.a} en decenas y unidades: por ejemplo, 23 = 20 + 3.`);
 if(!ok(cols,s.op.b))throw Error(`Parte ${s.op.b} en decenas y unidades.`);
 s.rows=rows;s.cols=cols;s.actions.push({type:'italianParts',rows,cols});s.log.push(`${s.op.a} = ${rows.join(' + ')} · ${s.op.b} = ${cols.join(' + ')}`);return s;
}
export function italianFinish(state,cells,answer){
 const s=structuredClone(state);
 if(!s.rows)throw Error('Parte primero el rectángulo.');
 const want=[s.rows[0]*s.cols[0],s.rows[0]*s.cols[1],s.rows[1]*s.cols[0],s.rows[1]*s.cols[1]];
 if(!Array.isArray(cells)||cells.length!==4||cells.some((v,i)=>!integer(v)||v!==want[i])){const i=Array.isArray(cells)?cells.findIndex((v,j)=>v!==want[j]):0;const r=s.rows[Math.floor(Math.max(i,0)/2)],c=s.cols[Math.max(i,0)%2];throw Error(`Revisa la casilla ${r} · ${c}.`)}
 if(!integer(answer)||answer!==want.reduce((x,y)=>x+y,0))throw Error('Suma las cuatro casillas para hallar el resultado.');
 Object.assign(s,{cells,answer,finished:true});s.actions.push({type:'italianFinish',cells,answer});s.log.push(`${cells.join(' + ')} = ${answer}`);return s;
}
export function validateProduct(op,actions){
 if(!fitsProduct(op.mode,op.a,op.b,op.level))throw Error('La operación no corresponde a este nivel.');
 if(!Array.isArray(actions)||!actions.length||actions.length>4)throw Error('La operación necesita pasos válidos.');
 let s=op.mode==='shark'?createShark(op):createItalian(op);
 for(const a of actions){
  if(a?.type==='shark'&&op.mode==='shark')s=sharkStep(s,a.top,a.bottom,a.answer);
  else if(a?.type==='italianParts'&&op.mode==='italian')s=italianParts(s,a.rows,a.cols);
  else if(a?.type==='italianFinish'&&op.mode==='italian')s=italianFinish(s,a.cells,a.answer);
  else throw Error('Paso inválido.');
 }
 if(!s.finished)throw Error('Completa todos los pasos.');
 return true;
}
