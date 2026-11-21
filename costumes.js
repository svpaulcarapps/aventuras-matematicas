// Each complete animated outfit retains the selected character's identity.
export const COSTUMES=[
 {id:'hedgehog',label:'Pijama Sonic',points:0,coins:0,variants:{boy:'assets/costumes/hedgehog-v7.webp',girl:'assets/costumes/hedgehog-girl-v10.webp',curly:'assets/costumes/hedgehog-curly-v10.webp',bob:'assets/costumes/hedgehog-bob-v10.webp'}},
 {id:'electric',label:'Pijama Pikachu',points:0,coins:0,variants:{boy:'assets/costumes/electric-v8.webp',girl:'assets/costumes/electric-girl-v2.png',curly:'assets/costumes/electric-curly-v2.png',bob:'assets/costumes/electric-bob-v2.png'}},
 {id:'dino',label:'Pijama de dinosaurio',points:0,coins:10,variants:{boy:'assets/costumes/dino-v1.webp',girl:'assets/costumes/dino-girl-v1.webp',curly:'assets/costumes/dino-curly-v1.webp',bob:'assets/costumes/dino-bob-v1.webp'}},
 {id:'xmas',label:'Jersey de Navidad',points:0,coins:12,variants:{boy:'assets/costumes/xmas-v1.webp',girl:'assets/costumes/xmas-girl-v1.webp',curly:'assets/costumes/xmas-curly-v1.webp',bob:'assets/costumes/xmas-bob-v2.png'}},
 {id:'marrajo',label:'Nazareno marrajo',points:0,coins:12,variants:{boy:'assets/costumes/marrajo-v1.webp',girl:'assets/costumes/marrajo-girl-v2.png',curly:'assets/costumes/marrajo-curly-v2.png',bob:'assets/costumes/marrajo-bob-v2.png'}},
 {id:'californio',label:'Nazareno californio',points:0,coins:12,variants:{boy:'assets/costumes/californio-boy-v1.png',girl:'assets/costumes/californio-girl-v1.png',curly:'assets/costumes/californio-curly-v1.png',bob:'assets/costumes/californio-bob-v1.png'}},
 {id:'plumber',label:'Fontanero valiente',points:0,coins:15,variants:{boy:'assets/costumes/plumber-boy-v2.png',girl:'assets/costumes/plumber-girl-v2.png',curly:'assets/costumes/plumber-curly-v2.png',bob:'assets/costumes/plumber-bob-v2.png'}}
];
export const costumeById=id=>COSTUMES.find(c=>c.id===id);
