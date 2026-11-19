// Tangram shared by the browser and the server. Units: the full set fills a 4 × 4 square (area 16).
// y grows downwards, as in SVG. Every solution keeps its vertices on whole-number points.
export const TANGRAM_SHAPES={
 L:[[0,0],[4,0],[2,2]],
 M:[[0,0],[2,0],[0,2]],
 S:[[0,0],[2,0],[1,1]],
 Q:[[1,0],[2,1],[1,2],[0,1]],
 P:[[0,0],[2,0],[3,1],[1,1]]
};
// Names and colours of the OAOA books: C, R, Tp, Tm and TG.
export const TANGRAM_NAMES={L:'Triángulo grande (TG)',M:'Triángulo mediano (Tm)',S:'Triángulo pequeño (Tp)',Q:'Cuadrado (C)',P:'Romboide (R)'};
export const TANGRAM_CODES={L:'TG',M:'Tm',S:'Tp',Q:'C',P:'R'};
export const TANGRAM_COLORS={L:'#2f6fd6',M:'#f2b630',S:'#3cae5a',Q:'#e8463a',P:'#f5d327'};
const T=(type,...pts)=>({type,pts});
// Each figure is a real solution: the silhouette is the union of these pieces.
export const TANGRAM_FIGURES=[
 // Nivel 1 · dos o tres piezas
 {level:1,name:'Un cuadrado con dos triángulos',pieces:[T('S',[0,1],[1,0],[2,1]),T('S',[0,1],[2,1],[1,2])]},
 {level:1,name:'Un triángulo con dos triángulos',pieces:[T('S',[0,0],[2,0],[1,1]),T('S',[0,0],[1,1],[0,2])]},
 {level:1,name:'Un romboide con dos triángulos',pieces:[T('S',[0,0],[2,0],[1,1]),T('S',[2,0],[3,1],[1,1])]},
 {level:1,name:'Un romboide con un cuadrado',pieces:[T('S',[2,0],[4,0],[3,1]),T('Q',[2,0],[3,1],[2,2],[1,1]),T('S',[1,1],[2,2],[0,2])]},
 {level:1,name:'Un cuadrado grande',pieces:[T('M',[0,0],[2,0],[0,2]),T('S',[2,0],[2,2],[1,1]),T('S',[0,2],[2,2],[1,1])]},
 // Nivel 2 · cuatro piezas
 {level:2,name:'Un rectángulo',pieces:[T('L',[0,0],[4,0],[2,2]),T('M',[0,0],[2,2],[0,2]),T('S',[4,0],[4,2],[3,1]),T('S',[4,2],[2,2],[3,1])]},
 {level:2,name:'Un triángulo grande',pieces:[T('L',[0,0],[4,0],[2,2]),T('M',[0,2],[2,2],[0,4]),T('S',[0,0],[0,2],[1,1]),T('S',[0,2],[2,2],[1,1])]},
 {level:2,name:'Un barco de vela',pieces:[T('L',[0,2],[4,2],[2,0]),T('M',[0,2],[2,2],[2,4]),T('S',[2,2],[4,2],[3,3]),T('S',[2,2],[3,3],[2,4])]},
 // Niveles 3 y 4 · las siete piezas
 {level:3,name:'El cuadrado del tangram',pieces:[T('L',[0,0],[4,0],[2,2]),T('L',[0,0],[2,2],[0,4]),T('S',[4,0],[4,2],[3,1]),T('Q',[2,2],[3,1],[4,2],[3,3]),T('S',[2,2],[3,3],[1,3]),T('P',[0,4],[1,3],[3,3],[2,4]),T('M',[2,4],[4,2],[4,4])]},
 {level:3,name:'Un gran triángulo',pieces:[T('L',[0,4],[4,4],[2,2]),T('L',[4,4],[4,0],[2,2]),T('M',[4,4],[6,4],[4,2]),T('S',[4,0],[4,2],[5,1]),T('Q',[4,2],[5,1],[6,2],[5,3]),T('S',[5,3],[6,2],[7,3]),T('P',[5,3],[7,3],[8,4],[6,4])]},
 {level:3,name:'Un romboide gigante',pieces:[T('L',[0,4],[4,4],[2,2]),T('L',[4,0],[4,4],[2,2]),T('M',[4,0],[6,0],[4,2]),T('S',[4,4],[4,2],[5,3]),T('Q',[4,2],[5,3],[6,2],[5,1]),T('S',[5,1],[6,2],[7,1]),T('P',[5,1],[7,1],[8,0],[6,0])]}
];
const area=pts=>Math.abs(pts.reduce((s,p,i)=>{const q=pts[(i+1)%pts.length];return s+p[0]*q[1]-q[0]*p[1]},0))/2;
const AREA={L:4,M:2,S:1,Q:2,P:2};
export function placePiece(type,{x=0,y=0,r=0,f=false}={}){
 const a=r*Math.PI/4,c=Math.round(Math.cos(a)*1e9)/1e9,s=Math.round(Math.sin(a)*1e9)/1e9;
 return TANGRAM_SHAPES[type].map(([px,py])=>{const fx=f?-px:px;return [fx*c-py*s+x,fx*s+py*c+y]});
}
function inside(p,poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>p[1])!==(yj>p[1]))&&(p[0]<(xj-xi)*(p[1]-yi)/(yj-yi)+xi))hit=!hit}return hit}
function mulberry32(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
// Rotate (quarter turns) and mirror the whole figure, then move it into the drawing area.
function orient(pieces,turns,mirror){
 const moved=pieces.map(p=>({type:p.type,pts:p.pts.map(([x,y])=>{let X=mirror?-x:x,Y=y;for(let i=0;i<turns;i++)[X,Y]=[-Y,X];return [X,Y]})}));
 const all=moved.flatMap(p=>p.pts),minX=Math.min(...all.map(p=>p[0])),minY=Math.min(...all.map(p=>p[1])),maxX=Math.max(...all.map(p=>p[0])),maxY=Math.max(...all.map(p=>p[1]));
 const dx=Math.round(5-(maxX+minX)/2),dy=Math.round(5-(maxY+minY)/2);
 return moved.map(p=>({type:p.type,pts:p.pts.map(([x,y])=>[x+dx,y+dy])}));
}
export function tangramChallenge(op){
 const seed=Number(op.a),level=Number(op.level);
 if(!Number.isInteger(seed)||seed<0||seed>9999||![1,2,3,4].includes(level))throw Error('Ese reto del tangram no existe.');
 const pool=TANGRAM_FIGURES.filter(f=>f.level===Math.min(level,3)),R=mulberry32(seed*131+level*7919);
 const figure=pool[Math.floor(R()*pool.length)],turns=Math.floor(R()*4),mirror=R()<.5;
 const solution=orient(figure.pieces,turns,mirror);
 const types=solution.map(p=>p.type).sort((a,b)=>'LMQPS'.indexOf(a)-'LMQPS'.indexOf(b));
 // Pieces wait in the tray to the right of the figure.
 const tray=[];let tx=11.5,ty=.8,rowH=0;
 for(const type of types){const w=type==='L'?4:type==='P'?3:2,h=type==='L'?2:type==='S'?1:2;if(tx+w>19.5){tx=11.5;ty+=rowH+.6;rowH=0}tray.push({type,x:tx,y:ty,r:0,f:false});tx+=w+.6;rowH=Math.max(rowH,h)}
 const hint=types.map(t=>TANGRAM_CODES[t]).join(' + ');
 return {seed,level,name:figure.name,hint,solution,pieces:tray,lines:level===1||level===3,width:20,height:11,
  prompt:level===1?`Coloca las ${types.length} piezas para formar: ${figure.name.toLowerCase()}.`:level===2?`Modelo oculto: no se ven las piezas. Usa ${types.length} piezas para formar: ${figure.name.toLowerCase()}.`:level===3?'Usa las siete piezas. Las líneas te ayudan a ver dónde va cada una.':'Usa las siete piezas. Esta vez solo ves la silueta: ¡piensa cómo encajarlas!',
  source:'Tangram clásico de siete piezas · OAOA'};
}
// Compare the pieces with the silhouette by sampling a fine grid.
export function checkTangram(task,placed){
 if(!Array.isArray(placed)||placed.length!==task.pieces.length)throw Error('Coloca todas las piezas del reto.');
 const polys=placed.map((p,i)=>{
  if(!p||typeof p!=='object'||![p.x,p.y].every(Number.isFinite)||!Number.isInteger(p.r)||p.r<0||p.r>7)throw Error('Hay una pieza que no se puede leer.');
  return placePiece(task.pieces[i].type,{x:p.x,y:p.y,r:p.r,f:!!p.f});
 });
 const target=task.solution.map(p=>p.pts),step=.1;let total=0,covered=0,outside=0,overlap=0;
 for(let x=-2+step/2;x<task.width+2;x+=step)for(let y=-2+step/2;y<task.height+2;y+=step){
  const p=[x,y],inT=target.some(t=>inside(p,t)),n=polys.reduce((k,q)=>k+(inside(p,q)?1:0),0);
  if(inT){total++;if(n)covered++}else if(n)outside++;
  if(n>1)overlap++;
 }
 if(overlap>total*.06)throw Error('Hay piezas montadas unas sobre otras. En el tangram las piezas se tocan, pero no se pisan.');
 if(outside>total*.07)throw Error('Alguna pieza se sale de la silueta. Gírala o cámbiala de sitio.');
 if(covered<total*.92)throw Error('Todavía queda un hueco por cubrir. Mira qué pieza encaja en él.');
 return true;
}
export const tangramEvidence=pieces=>({type:'tangram',pieces:pieces.map(p=>({x:p.x,y:p.y,r:p.r,f:!!p.f}))});
export function validateTangram(op,actions){if(!Array.isArray(actions)||actions.length!==1||actions[0]?.type!=='tangram')throw Error('Falta la construcción del tangram.');return checkTangram(tangramChallenge(op),actions[0].pieces);}
export function tangramFigureCheck(){return TANGRAM_FIGURES.map(f=>{const a=f.pieces.reduce((s,p)=>s+area(p.pts),0),b=f.pieces.reduce((s,p)=>s+AREA[p.type],0);return {name:f.name,ok:f.pieces.every(p=>Math.abs(area(p.pts)-AREA[p.type])<1e-9),a,b}})}
