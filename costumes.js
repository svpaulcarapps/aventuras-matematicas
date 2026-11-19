// Each complete animated outfit retains the selected character's identity.
export const COSTUMES=[
 {id:'dino',label:'Pijama de dinosaurio',points:0,coins:10,variants:{boy:'assets/costumes/dino-v1.webp',girl:'assets/costumes/dino-girl-v1.webp',curly:'assets/costumes/dino-curly-v1.webp',bob:'assets/costumes/dino-bob-v1.webp'}},
 {id:'xmas',label:'Jersey de Navidad',points:0,coins:12,variants:{boy:'assets/costumes/xmas-v1.webp',girl:'assets/costumes/xmas-girl-v1.webp',curly:'assets/costumes/xmas-curly-v1.webp'}},
 {id:'marrajo',label:'Nazareno marrajo',points:0,coins:12,variants:{boy:'assets/costumes/marrajo-v1.webp'}},
 {id:'plumber',label:'Fontanero valiente',points:0,coins:15,variants:{boy:'assets/costumes/plumber-v1.webp'}}
];
export const costumeById=id=>COSTUMES.find(c=>c.id===id);
