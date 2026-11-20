// Missions per course, in the order the OAOA books work them, with the level that suits each course.
// References come from the books in Biblioteca OAOA (printed page numbers or the 2.º annual plan).
export const COURSE_ROUTES={
 1:[
  ['add',1,'Suma «en árbol» · OAOA 1.º, pág. 122'],
  ['problems',1,'Diagrama partes-todo · OAOA 1.º, pág. 153'],
  ['sacks',1,'Decenas y unidades · OAOA 1.º, págs. 60-62'],
  ['geoboard',1,'Geoplano · OAOA 1.º'],
  ['tangram',1,'Tangram · primeras figuras']
 ],
 2:[
  ['add',1,'Suma «en árbol» · OAOA 2.º, 1.er trimestre'],
  ['problems',1,'Estructura aditiva · OAOA 2.º, todo el curso'],
  ['tangram',1,'Uso del tangram · OAOA 2.º, octubre y noviembre'],
  ['geoboard',1,'Geoplano · OAOA 2.º, noviembre y abril'],
  ['sacks',2,'Número de 3 cifras · OAOA 2.º'],
  ['subtract',1,'Resta «en árbol» · OAOA 2.º, 2.º trimestre'],
  ['dresses',1,'Composición y descomposición · OAOA 2.º'],
  ['multiply',1,'Número de veces · OAOA 2.º, mayo y junio']
 ],
 3:[
  ['add',2,'Suma «en árbol» · OAOA 3.º'],
  ['problems',2,'Problemas de suma y resta · OAOA 3.º, pág. 12'],
  ['climb',1,'Resta completando · OAOA 3.º, pág. 15'],
  ['multiply',2,'Número de veces · OAOA 3.º, pág. 35'],
  ['tangram',2,'Modelo oculto · OAOA 3.º, pág. 55'],
  ['subtract',2,'Resta «en árbol» · OAOA 3.º, pág. 80'],
  ['dresses',2,'Suma por descomposición · OAOA 3.º'],
  ['geoboard',2,'Geoplano · OAOA 3.º']
 ],
 4:[
  ['add',3,'Suma «en árbol» · OAOA 4.º'],
  ['problems',3,'Problemas · OAOA 4.º'],
  ['multiply',3,'Multiplicación · OAOA 4.º, «La embotelladora»'],
  ['climb',3,'Rocódromo · OAOA 4.º, «Ejercicios y algoritmos»'],
  ['subtract',3,'Resta «en árbol» · OAOA 4.º'],
  ['dresses',3,'Suma por descomposición · OAOA 4.º'],
  ['italian',1,'Técnica italiana · OAOA 4.º, págs. 150-151'],
  ['shark',1,'Propiedad distributiva · OAOA 4.º, págs. 152-153'],
  ['geoboard',3,'Geoplano · OAOA 4.º'],
  ['tangram',3,'Tangram · siete piezas']
 ],
 5:[
  ['add',4,'Suma agrupando «en árbol» · OAOA 5.º, anexo de cálculo'],
  ['climb',4,'Resta completando · OAOA 5.º, anexo de cálculo'],
  ['problems',4,'Problemas · OAOA 5.º'],
  ['multiply',4,'Multiplicación · OAOA 5.º'],
  ['shark',3,'Propiedad distributiva · repaso de 4.º'],
  ['italian',3,'Técnica italiana · repaso de 4.º'],
  ['subtract',4,'Resta «en árbol» · OAOA 5.º'],
  ['dresses',4,'Suma por descomposición · OAOA 5.º'],
  ['geoboard',3,'Geoplano · OAOA 5.º'],
  ['tangram',4,'Modelo oculto · siete piezas']
 ],
 6:[
  ['problems',4,'Problemas · OAOA 6.º'],
  ['multiply',4,'Multiplicación · OAOA 6.º'],
  ['shark',4,'Propiedad distributiva · nivel experto'],
  ['italian',4,'Técnica italiana · nivel experto'],
  ['add',4,'Suma «en árbol» · cálculo rápido'],
  ['climb',4,'Resta completando · cálculo rápido'],
  ['subtract',4,'Resta «en árbol» · cálculo rápido'],
  ['dresses',4,'Suma por descomposición · cálculo rápido'],
  ['geoboard',4,'Geoplano · OAOA 6.º'],
  ['tangram',4,'Modelo oculto · siete piezas']
 ]
};
export const courseRoutes=course=>COURSE_ROUTES[course]||COURSE_ROUTES[3];
export function recommendedLevel(course,mode){const r=courseRoutes(course).find(([key])=>key===mode||(mode==='sackhunt'&&key==='sacks'));return r?r[1]:1}
export function routeRef(course,mode){const r=courseRoutes(course).find(([key])=>key===mode||(mode==='sackhunt'&&key==='sacks'));return r?.[2]||''}
