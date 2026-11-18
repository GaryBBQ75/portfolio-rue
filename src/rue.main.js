import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

const $=id=>document.getElementById(id);
const P=[
/*__P__*/
];
/* enseignes : esprit Pigalle, sans vulgarité */
const SIGN={'Martell VS':['Very Special','cognac · ouvert la nuit'],'Tessan':['Cabines privées','consultations sans rendez-vous'],'Lunettes Pour Tous':['Peep Show','opticien'],'Grimbergen × Au Bureau':['Happy Hours','brasserie de nuit'],'Sephora Collection':['Le Boudoir','beauté et jeux'],'Renault R.S.':['Grosses cylindrées','garage · 24 h / 24'],'Air France':['7e Ciel','départs toutes les nuits'],'Tapping Now':['Massages','du bout des doigts'],'Radio':['Ondes roses','radio sans pub'],'Collection Daily':['Plaisirs quotidiens','un par jour'],'Studio Pepper & Joy':['Mariages express','faire-part minute']};
const PERSO={disq:{title:'Disquaire',brand:'Côté perso',year:'Toujours ouvert',tags:'Vinyles · Synthés',pal:['#1c0f1e','#ff3df0'],sign:['Hot Wax','vinyles · cassettes · synthés'],line:'La musique, les vinyles et les machines.',ctx:'Emplacement pour ta culture musicale : les disques qui comptent, les machines que tu utilises, ce que tu produis.',role:'À remplir avec tes références.',out:'Une vitrine perso, pas un projet client.',stack:'Vinyles · Cassettes · Synthés'},
 cine:{title:'Cinéma',brand:'Côté perso',year:'Séance de minuit',tags:'Science-fiction',pal:['#0c1424','#19e3ff'],sign:['Séance de minuit','cinéma · science-fiction'],line:'Les films et les livres de science-fiction.',ctx:'Emplacement pour ta culture SF, au cinéma comme en littérature.',role:'À remplir avec tes références.',out:'Une vitrine perso, pas un projet client.',stack:'Films · Romans'},
 gal:{title:'Galerie',brand:'Côté perso',year:'Vernissage permanent',tags:'Art · Peinture',pal:['#1a1410','#ffb000'],sign:['Nu artistique','galerie · atelier de peinture'],line:'L\'art contemporain et la peinture.',ctx:'Emplacement pour ta peinture et les artistes qui t\'inspirent.',role:'À remplir avec tes références.',out:'Une vitrine perso, pas un projet client.',stack:'Peinture · Art contemporain'}};
const byT=t=>P.find(p=>p.title===t);
const ORDER=['HERO','Martell VS','Tessan','disq','Lunettes Pour Tous','Grimbergen × Au Bureau','Sephora Collection','cine','Renault R.S.','Air France','Tapping Now','Radio','gal','Collection Daily','Studio Pepper & Joy','CONTACT'];
const NEON=['#ff2d78','#19e3ff','#ffb000','#b06cff','#ff4d2e','#35ff9b','#ff3df0'];
const MOD=7.5;
const SHOPS=ORDER.map((k,i)=>{const x=i*MOD;if(k==='HERO')return{kind:'hero',x,neon:'#ff2d78',sign:['Gary Le Grill','design · motion · code · ouvert 24 h / 24'],pal:['#1a0d14','#ff2d78']};if(k==='CONTACT')return{kind:'contact',x,neon:'#ff4d2e',sign:['Hôtel Contact','on se rappelle ?'],pal:['#1c0e0a','#ff4d2e'],p:{title:'Contact',brand:'Gary Le Grill',year:'Paris',tags:'Freelance',pal:['#1c0e0a','#ff4d2e'],line:'Un projet, une mission, une idée un peu risquée ?',ctx:'Directeur artistique freelance à Paris. Design, motion, code.',role:'Écris-moi ou réserve un créneau.',out:'gary@garylegrill.com (à confirmer)',stack:'Mail · Calendly · LinkedIn'}};const p=PERSO[k]||byT(k);return{kind:PERSO[k]?'perso':'pro',x,p,pal:p.pal,sign:p.sign||SIGN[p.title]||[p.title,p.brand],neon:NEON[i%NEON.length]};});
const X0=-3,X1=SHOPS[SHOPS.length-1].x+3;

/* ---------- Rendu ---------- */
const renderer=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();const BG=new THREE.Color('#07050b');scene.background=BG;scene.fog=new THREE.FogExp2(BG,.021);
const cam=new THREE.PerspectiveCamera(40,1,.1,200);
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,cam));
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.5,.6,.7);composer.addPass(bloom);composer.addPass(new OutputPass());
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);composer.setSize(w,h);cam.aspect=w/h;cam.fov=w/h<1?58:40;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

scene.add(new THREE.HemisphereLight('#5a5f9a','#120a14',.55));
const moon=new THREE.DirectionalLight('#8fa0ff',.35);moon.position.set(-6,12,8);scene.add(moon);
const pool=[0,1,2,3].map(()=>{const l=new THREE.PointLight('#fff',0,13,1.6);scene.add(l);return l;});

/* ---------- Outils ---------- */
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const T=(c)=>{const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;};
const rnd=(a,b)=>a+Math.random()*(b-a);
const box=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
const std=(c,r=.8,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r},o));
const glow=(col,k=2.2)=>{const m=new THREE.MeshBasicMaterial({color:new THREE.Color(col).multiplyScalar(k)});m.toneMapped=false;return m;};

/* façades d'immeuble */
function facadeTex(seed){const c=mk(512,512),e=mk(512,512),g=c.getContext('2d'),h=e.getContext('2d');
  g.fillStyle=['#17151d','#1a171c','#14151c','#19161a'][seed%4];g.fillRect(0,0,512,512);
  for(let i=0;i<900;i++){g.fillStyle='rgba(255,255,255,'+rnd(0,.025)+')';g.fillRect(rnd(0,512),rnd(0,512),rnd(2,40),1);}
  h.fillStyle='#000';h.fillRect(0,0,512,512);
  for(let r=0;r<3;r++){const y=40+r*158;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,y+128,512,8);g.fillStyle='rgba(255,255,255,.05)';g.fillRect(0,y+136,512,3);
    for(let k=0;k<4;k++){const x=44+k*118,lit=Math.random()<.3;
      g.fillStyle='#0b0a10';g.fillRect(x-6,y-6,82,132);
      if(lit){const col=['#ffc98a','#ffb3d0','#9fd8ff','#ffd9a0'][Math.floor(rnd(0,4))];g.fillStyle=col;g.fillRect(x,y,70,120);h.fillStyle=col;h.globalAlpha=.75;h.fillRect(x,y,70,120);h.globalAlpha=1;
        g.fillStyle='rgba(20,10,10,.55)';g.fillRect(x,y,rnd(8,26),120);g.fillRect(x+70-rnd(8,26),y,26,120);h.fillStyle='rgba(0,0,0,.5)';h.fillRect(x,y,18,120);h.fillRect(x+52,y,18,120);}
      else{g.fillStyle='#0e1018';g.fillRect(x,y,70,120);g.fillStyle='rgba(120,140,220,.07)';g.fillRect(x+4,y+4,26,112);}
      g.fillStyle='#0b0a10';g.fillRect(x+33,y,4,120);g.fillRect(x,y+38,70,3);
      g.strokeStyle='#07070a';g.lineWidth=2;for(let b=0;b<9;b++){g.beginPath();g.moveTo(x-8+b*10.8,y+92);g.lineTo(x-8+b*10.8,y+126);g.stroke();}g.fillStyle='#07070a';g.fillRect(x-10,y+90,90,3);g.fillRect(x-10,y+124,90,4);
      [g,h].forEach(q=>{q.fillStyle='#000';q.fillRect(x-8,y+92,86,1);});}}
  return {map:T(c),em:T(e)};}
const FAC=[0,1,2,3].map(facadeTex);

/* enseigne néon */
function neonTex(main,sub,col,script){const c=mk(1024,256),g=c.getContext('2d');g.textAlign='center';g.textBaseline='middle';
  let fs=script?150:118;g.font=(script?'400 ':'400 ')+fs+'px '+(script?'"Yellowtail","Brush Script MT",cursive':'"Tilt Neon","Arial Narrow",sans-serif');
  const txt=script?main:main.toUpperCase();while(g.measureText(txt).width>960&&fs>40){fs-=6;g.font=g.font.replace(/\d+px/,fs+'px');}
  for(const b of [46,22,8]){g.shadowColor=col;g.shadowBlur=b;g.fillStyle=col;g.fillText(txt,512,sub?100:128);}
  g.shadowBlur=0;g.fillStyle='rgba(255,255,255,.92)';g.fillText(txt,512,sub?100:128);
  if(sub){g.font='400 40px "Tilt Neon","Arial Narrow",sans-serif';g.shadowColor='#fff';g.shadowBlur=10;g.fillStyle='rgba(255,244,230,.9)';g.fillText(sub.toUpperCase(),512,212);}
  return T(c);}
function bladeTex(txt,col){const c=mk(128,640),g=c.getContext('2d');g.fillStyle='#0a080d';g.fillRect(0,0,128,640);g.textAlign='center';g.textBaseline='middle';const L=txt.toUpperCase().replace(/[^A-Z0-9É]/g,'').slice(0,9).split('');const st=600/L.length;g.font='400 '+Math.min(84,st*.95)+'px "Tilt Neon","Arial Narrow",sans-serif';L.forEach((ch,i)=>{for(const b of [26,8]){g.shadowColor=col;g.shadowBlur=b;g.fillStyle=col;g.fillText(ch,64,20+st*(i+.5));}g.shadowBlur=0;g.fillStyle='rgba(255,255,255,.9)';g.fillText(ch,64,20+st*(i+.5));});return T(c);}
/* vitrine : visuel du projet derrière des rideaux */
function vitrineTex(s){const c=mk(768,480),g=c.getContext('2d'),pal=s.pal;const gr=g.createRadialGradient(420,200,20,384,240,460);gr.addColorStop(0,pal[1]);gr.addColorStop(1,pal[0]);g.fillStyle=gr;g.fillRect(0,0,768,480);
  for(let i=0;i<9;i++){g.fillStyle='rgba(255,255,255,'+rnd(.04,.13)+')';g.beginPath();g.arc(rnd(160,620),rnd(60,330),rnd(18,80),0,6.3);g.fill();}
  const cur=(x0,x1)=>{const cg=g.createLinearGradient(x0,0,x1,0);for(let i=0;i<=6;i++)cg.addColorStop(i/6,i%2?'#3d0816':'#7a1028');g.fillStyle=cg;g.fillRect(Math.min(x0,x1),0,Math.abs(x1-x0),480);};cur(0,120);cur(768,648);
  g.fillStyle='rgba(0,0,0,.45)';g.fillRect(120,330,528,150);g.fillStyle='#fff';g.textAlign='left';g.font='500 46px "Space Grotesk",Arial,sans-serif';const t=s.p?s.p.title:'Gary Le Grill';g.fillText(t,144,392,480);g.font='400 20px "JetBrains Mono",monospace';g.fillStyle='rgba(255,255,255,.8)';g.fillText((s.p?(s.p.brand+' · '+s.p.year):'Directeur artistique · Paris').toUpperCase(),144,430,480);
  g.font='400 15px "JetBrains Mono",monospace';g.fillStyle='rgba(255,255,255,.55)';g.fillText(s.kind==='perso'?'[ta référence perso]':s.kind==='pro'?'[visuel ou vidéo du projet]':'',144,458);
  return T(c);}
function doorTex(col){const c=mk(256,512),g=c.getContext('2d');g.fillStyle='#0c0a10';g.fillRect(0,0,256,512);const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,'rgba(255,255,255,.02)');gr.addColorStop(1,col);g.globalAlpha=.5;g.fillStyle=gr;g.fillRect(26,30,204,330);g.globalAlpha=1;for(let i=0;i<14;i++){g.fillStyle=i%2?'rgba(60,6,20,.9)':'rgba(120,14,40,.9)';g.fillRect(26+i*14.6,30,14.6,330);}g.fillStyle='#0c0a10';g.fillRect(26,360,204,6);g.fillStyle='#c9b27a';g.fillRect(200,250,10,60);return T(c);}
function shutterTex(){const c=mk(512,256),g=c.getContext('2d');g.fillStyle='#1b1b20';g.fillRect(0,0,512,256);for(let y=0;y<256;y+=10){g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,y,512,3);g.fillStyle='rgba(255,255,255,.04)';g.fillRect(0,y+3,512,2);}g.font='italic 700 60px Arial';g.fillStyle='rgba(255,45,120,.35)';g.save();g.translate(90,170);g.rotate(-.12);g.fillText('bientôt',0,0);g.restore();return T(c);}
const SHUT=shutterTex();

/* ---------- Martell : le bar de nuit ---------- */
const ticks=[];let AD=null,AD2=null;const POSTERS=[];
function adScreen(){const c=mk(432,768),g=c.getContext('2d');const tex=T(c);let last=-1;
  const draw=t=>{const m=AD,mw=m&&(m.videoWidth||m.naturalWidth),mh=m&&(m.videoHeight||m.naturalHeight);
    if(mw&&mh){const k=Math.max(432/mw,768/mh);g.drawImage(m,(432-mw*k)/2,(768-mh*k)/2,mw*k,mh*k);}
    else{const gr=g.createRadialGradient(320+Math.sin(t*.7)*120,170,10,320,180,420);gr.addColorStop(0,'#ffb347');gr.addColorStop(.35,'#b4520f');gr.addColorStop(1,'#140702');g.fillStyle=gr;g.fillRect(0,0,640,360);
      for(let i=0;i<7;i++){const x=((t*60+i*130)%900)-130;g.fillStyle='rgba(255,220,150,.07)';g.beginPath();g.moveTo(x,0);g.lineTo(x+70,0);g.lineTo(x-50,360);g.lineTo(x-120,360);g.fill();}
      g.textAlign='center';g.fillStyle='#fff3d6';g.shadowColor='#ff9d2e';g.shadowBlur=24;g.font='italic 400 92px "Yellowtail",Georgia,serif';g.fillText('Very Special',320,180);g.shadowBlur=0;g.font='500 20px "JetBrains Mono",monospace';g.fillStyle='rgba(255,243,214,.85)';if(Math.floor(t*1.5)%2)g.fillText('▶  TON FILM MARTELL ICI',320,236);g.font='400 15px "JetBrains Mono",monospace';g.fillStyle='rgba(255,243,214,.6)';g.fillText('glisse le mp4 sur la page pour le voir sur la façade',320,266);}
    g.fillStyle='rgba(0,0,0,.16)';for(let y=0;y<768;y+=3)g.fillRect(0,y,432,1);tex.needsUpdate=true;};
  draw(0);ticks.push(t=>{if(t-last<.07)return;last=t;draw(t);});return tex;}
function barTex(){const c=mk(768,440),g=c.getContext('2d');g.fillStyle='#0d0603';g.fillRect(0,0,768,440);
  for(let r=0;r<3;r++){const y=40+r*118;const gl=g.createLinearGradient(0,y,0,y+104);gl.addColorStop(0,'#ff9d2e');gl.addColorStop(1,'#5a1f04');g.fillStyle=gl;g.globalAlpha=.85;g.fillRect(150,y,468,104);g.globalAlpha=1;
    for(let x=162;x<600;){const w=rnd(18,30),h=rnd(58,92),k=Math.random();g.fillStyle=k<.5?'rgba(40,12,2,.92)':'rgba(90,30,6,.8)';g.beginPath();g.roundRect(x,y+104-h*.72,w,h*.72,4);g.fill();g.fillRect(x+w*.34,y+104-h,w*.32,h*.3);g.fillStyle='rgba(255,220,160,.5)';g.fillRect(x+3,y+104-h*.6,2,h*.4);x+=w+rnd(5,12);}
    g.fillStyle='#1a0b04';g.fillRect(140,y+104,488,9);}
  const cur=(x0,x1)=>{const cg=g.createLinearGradient(x0,0,x1,0);for(let i=0;i<=6;i++)cg.addColorStop(i/6,i%2?'#2c0509':'#6a0d1c');g.fillStyle=cg;g.fillRect(Math.min(x0,x1),0,Math.abs(x1-x0),440);};cur(0,130);cur(768,638);
  g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,392,768,48);g.fillStyle='#ffe9c2';g.font='500 24px "JetBrains Mono",monospace';g.fillText('MARTELL VS · PERNOD RICARD · 2025',24,424);return T(c);}
function glassTex(col){const c=mk(256,320),g=c.getContext('2d');g.lineCap='round';g.lineJoin='round';const path=()=>{g.beginPath();g.moveTo(70,60);g.bezierCurveTo(30,150,70,205,128,205);g.bezierCurveTo(186,205,226,150,186,60);g.moveTo(128,205);g.lineTo(128,270);g.moveTo(84,276);g.lineTo(172,276);};
  for(const b of [30,14,4]){g.shadowColor=col;g.shadowBlur=b;g.strokeStyle=col;g.lineWidth=9;path();g.stroke();}g.shadowBlur=0;g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=3.5;path();g.stroke();
  g.shadowColor='#ff5a1f';g.shadowBlur=18;g.fillStyle='rgba(255,120,30,.75)';g.beginPath();g.moveTo(58,130);g.bezierCurveTo(60,185,90,196,128,196);g.bezierCurveTo(166,196,196,185,198,130);g.closePath();g.fill();return T(c);}
function tagTex(){const c=mk(768,128),g=c.getContext('2d');g.lineCap='round';const sc=(col,pts,w)=>{g.strokeStyle=col;g.lineWidth=w;g.shadowColor=col;g.shadowBlur=6;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();};
  g.font='italic 900 84px Arial';g.globalAlpha=.8;g.fillStyle='#ff2d78';g.save();g.translate(30,96);g.rotate(-.06);g.fillText('GLG',0,0);g.restore();g.fillStyle='#e9e5dc';g.font='italic 900 44px Arial';g.fillText('la nuit porte conseil',250,70);sc('#19e3ff',[[250,88],[420,80],[600,96],[720,78]],6);g.fillStyle='#ffb000';g.font='900 40px Arial';g.fillText('★ VS',640,56);return T(c);}
function martell(g,s){const amber='#ff9d2e',nm=glow(amber,2.1),gold=std('#b8892f',.28,{metalness:1});
  const front=box(6.9,3.5,.1,std('#070606',.2,{metalness:.35}));front.position.set(0,1.78,-2.82);g.add(front);
  [3.5,.08].forEach(y=>{const t=box(6.9,.06,.04,gold);t.position.set(0,y+.05,-2.75);g.add(t);});
  const vit=new THREE.Mesh(new THREE.PlaneGeometry(3.4,1.95),new THREE.MeshBasicMaterial({map:barTex(),color:'#e6e6e6'}));vit.position.set(-1.3,1.72,-2.76);g.add(vit);vit.userData.shop=s;clickables.push(vit);
  [[0,1.0,3.5,.045],[0,-1.0,3.5,.045],[-1.73,0,.045,2.04],[1.73,0,.045,2.04]].forEach(([dx,dy,w,h])=>{const t=box(w,h,.05,gold);t.position.set(-1.3+dx,1.72+dy,-2.74);g.add(t);});
  const tg=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.57),new THREE.MeshBasicMaterial({map:tagTex(),transparent:true,color:'#bbb'}));tg.position.set(-1.3,.4,-2.76);g.add(tg);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.25,2.5),new THREE.MeshBasicMaterial({map:doorTex(amber),color:'#bdbdbd'}));door.position.set(2.05,1.33,-2.76);g.add(door);door.userData.shop=s;clickables.push(door);
  [[0,1.28,1.37,.05],[-.66,0,.05,2.56],[.66,0,.05,2.56]].forEach(([dx,dy,w,h])=>{const t=box(w,h,.05,nm);t.position.set(2.05+dx,1.33+dy,-2.72);g.add(t);});
  const mat=new THREE.MeshBasicMaterial({map:neonTex('Very Special','bar de nuit · cognac',amber,true),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:new THREE.Color(1.5,1.5,1.5)});mat.toneMapped=false;const sg=new THREE.Mesh(new THREE.PlaneGeometry(3.7,.93),mat);sg.position.set(1.6,4.45,-2.55);g.add(sg);s.signMat=mat;s.flick=true;
  const gm=new THREE.MeshBasicMaterial({map:glassTex(amber),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:new THREE.Color(1.6,1.6,1.6)});gm.toneMapped=false;const gl=new THREE.Mesh(new THREE.PlaneGeometry(1.7,2.1),gm);gl.position.set(1.6,7.0,-2.55);gl.rotation.z=-.12;g.add(gl);
  /* produit qui tourne dans la vitrine (ou ta vidéo produit si tu la déposes) */
  const ped=new THREE.Mesh(new THREE.CylinderGeometry(.34,.38,.1,40),gold);ped.position.set(-1.3,.82,-2.42);g.add(ped);
  const bt=new THREE.Group();const prof=[[0,0],[.2,0],[.215,.03],[.215,.5],[.2,.62],[.12,.74],[.075,.8],[.07,1.0],[.085,1.02],[.085,1.06],[0,1.06]].map(p=>new THREE.Vector2(p[0],p[1]));
  const glassM=new THREE.MeshPhysicalMaterial({color:'#a4460c',roughness:.08,metalness:0,clearcoat:1,emissive:'#7a2c04',emissiveIntensity:.9});const bo=new THREE.Mesh(new THREE.LatheGeometry(prof,64),glassM);bt.add(bo);
  const lab=new THREE.Mesh(new THREE.CylinderGeometry(.218,.218,.26,48,1,true),std('#efe6d2',.6));lab.position.y=.3;bt.add(lab);const cp=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.12,24),gold);cp.position.y=1.1;bt.add(cp);
  bt.position.set(-1.3,.87,-2.42);bt.scale.setScalar(1.25);g.add(bt);const spot=new THREE.PointLight('#ffd9a0',14,3.2,1.8);spot.position.set(-1.3,2.5,-1.9);g.add(spot);
  const v2m=new THREE.MeshBasicMaterial({color:'#000'});const v2=new THREE.Mesh(new THREE.PlaneGeometry(3.4,1.95),v2m);v2.position.set(-1.3,1.72,-2.755);v2.visible=false;g.add(v2);let v2t=null;
  ticks.push(t=>{bt.rotation.y=t*.9;ped.rotation.y=t*.9;if(AD2&&AD2.videoWidth&&!v2t){v2t=new THREE.VideoTexture(AD2);v2t.colorSpace=THREE.SRGBColorSpace;v2m.map=v2t;v2m.color.set('#fff');v2m.needsUpdate=true;v2.visible=true;bt.visible=false;ped.visible=false;}});
  /* panneau d'affichage rétroéclairé sur le trottoir : tes affiches */
  const pc2=mk(512,768),pg=pc2.getContext('2d'),ptex=T(pc2);let pi=-1,pl=-9;
  const drawP=t=>{const n=POSTERS.length;const k=n?Math.floor(t/4)%n:0;if(k===pi&&n)return;if(!n&&pi===-2)return;pi=n?k:-2;
    if(n){const m=POSTERS[k],r=Math.max(512/m.naturalWidth,768/m.naturalHeight);pg.fillStyle='#000';pg.fillRect(0,0,512,768);pg.drawImage(m,(512-m.naturalWidth*r)/2,(768-m.naturalHeight*r)/2,m.naturalWidth*r,m.naturalHeight*r);}
    else{const gr=pg.createLinearGradient(0,0,0,768);gr.addColorStop(0,'#1a0803');gr.addColorStop(.6,'#8a3a08');gr.addColorStop(1,'#ffb347');pg.fillStyle=gr;pg.fillRect(0,0,512,768);pg.fillStyle='#fff3d6';pg.textAlign='center';pg.font='italic 400 120px "Yellowtail",Georgia,serif';pg.fillText('Very',256,300);pg.fillText('Special',256,420);pg.font='500 22px "JetBrains Mono",monospace';pg.fillText('[ TON AFFICHE ICI ]',256,640);pg.textAlign='left';}
    ptex.needsUpdate=true;};drawP(0);ticks.push(t=>{if(t-pl>.5){pl=t;drawP(t);}});
  const pfr=box(1.36,2.0,.16,std('#0a0a0c',.35,{metalness:.5}));pfr.position.set(-3.2,1.75,-.9);g.add(pfr);const leg=box(.5,.6,.1,std('#0a0a0c',.35,{metalness:.5}));leg.position.set(-3.2,.46,-.9);g.add(leg);
  const pmm=new THREE.MeshBasicMaterial({map:ptex,color:new THREE.Color(1.15,1.15,1.15)});pmm.toneMapped=false;const pp=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.8),pmm);pp.position.set(-3.2,1.77,-.81);g.add(pp);pp.userData.shop=s;clickables.push(pp);
  /* écran publicitaire sur la façade */
  const fr=box(2.95,5.05,.3,std('#08080a',.4));fr.position.set(-2.0,6.75,-2.8);g.add(fr);
  const sm=new THREE.MeshBasicMaterial({map:adScreen(),color:new THREE.Color(1.25,1.25,1.25)});sm.toneMapped=false;const scr=new THREE.Mesh(new THREE.PlaneGeometry(2.7,4.8),sm);scr.position.set(-2.0,6.75,-2.64);g.add(scr);scr.userData.shop=s;clickables.push(scr);
  const tc=mk(2048,64),tgx=tc.getContext('2d');tgx.fillStyle='#050505';tgx.fillRect(0,0,2048,64);tgx.fillStyle='#ffb347';tgx.font='500 40px "JetBrains Mono",monospace';tgx.fillText('MARTELL VS  ·  FILM DE MARQUE GÉNÉRÉ PAR IA  ·  DIRECTION ARTISTIQUE GARY LE GRILL  ·  OUVERT LA NUIT  ·  ',10,46);const tt2=T(tc);tt2.wrapS=THREE.RepeatWrapping;tt2.repeat.x=.3;const tm=new THREE.MeshBasicMaterial({map:tt2,color:new THREE.Color(1.4,1.4,1.4)});tm.toneMapped=false;const tk=new THREE.Mesh(new THREE.PlaneGeometry(3.7,.26),tm);tk.position.set(1.6,5.3,-2.64);g.add(tk);ticks.push((t)=>{tt2.offset.x=(t*.06)%1;});
  const al=new THREE.PointLight(amber,55,17,1.5);al.position.set(-1.4,6,1.4);g.add(al);ticks.push(t=>{al.intensity=50+Math.sin(t*5.1)*6+Math.sin(t*1.3)*8;});
  /* cordon, poubelles, bouteilles */
  [[1.2,-1.5],[2.9,-1.5]].forEach(([px,pz])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.95,10),gold);p.position.set(px,.63,pz);g.add(p);const b=new THREE.Mesh(new THREE.CylinderGeometry(.14,.16,.04,16),gold);b.position.set(px,.18,pz);g.add(b);const k=new THREE.Mesh(new THREE.SphereGeometry(.055,12,10),gold);k.position.set(px,1.12,pz);g.add(k);
    const cv=new THREE.CatmullRomCurve3([new THREE.Vector3(px,1.02,pz),new THREE.Vector3(px,.78,(pz-2.7)/2),new THREE.Vector3(px,1.0,-2.7)]);const rp2=new THREE.Mesh(new THREE.TubeGeometry(cv,16,.028,8),std('#7a0d1e',.7));g.add(rp2);});
  const bag=std('#0c0c0f',.3);[[-3.3,-1.9,.42],[-2.75,-2.2,.36],[-3.15,-1.35,.3]].forEach(([bx,bz,r])=>{const b=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),bag);b.scale.y=.78;b.position.set(bx,.16+r*.7,bz);b.rotation.y=rnd(0,6);g.add(b);});
  const gls=new THREE.MeshPhysicalMaterial({color:'#2c5a2e',roughness:.1,transmission:.5,thickness:.2});[[-2.2,-.7,1.2],[-1.7,-1.1,.4],[.4,-.5,2.2]].forEach(([bx,bz,ry])=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.26,10),gls);b.rotation.z=Math.PI/2;b.rotation.y=ry;b.position.set(bx,.2,bz);g.add(b);});
  const cr=box(.5,.34,.36,std('#3a2a18',.8));cr.position.set(-2.3,.33,-2.35);cr.rotation.y=.3;g.add(cr);
  /* hologramme géant projeté dans la rue */
  const hm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{map:{value:null},time:{value:0},on:{value:0}},
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:`uniform sampler2D map;uniform float time,on;varying vec2 vUv;
   void main(){vec2 uv=vUv;float band=floor(uv.y*46.+time*2.5);float gl=step(.93,fract(sin(band*91.7)*43758.5));uv.x+=gl*.035*sin(time*23.+band);
    float sh=.004+.003*sin(time*3.);vec3 c=vec3(texture2D(map,uv+vec2(sh,0.)).r,texture2D(map,uv).g,texture2D(map,uv-vec2(sh,0.)).b);
    float l=dot(c,vec3(.3,.59,.11));vec3 tint=mix(vec3(.15,.55,1.),vec3(1.,.25,.75),clamp(uv.y*.7+.25*sin(time*.6),0.,1.));
    vec3 col=c*.55+l*tint*1.5;float scan=.62+.38*sin(uv.y*700.-time*7.);
    float edge=smoothstep(0.,.14,uv.x)*smoothstep(1.,.86,uv.x)*smoothstep(0.,.3,uv.y)*smoothstep(1.,.92,uv.y);
    float fl=.82+.18*sin(time*41.)*sin(time*5.3);float drop=step(.004,fract(sin(floor(time*9.)*12.9)*4375.5));
    gl_FragColor=vec4(col*1.25,edge*scan*fl*drop*(.22+l*1.3)*on);}`});
  const holo=new THREE.Mesh(new THREE.PlaneGeometry(5.6,9.95),hm);holo.position.set(MOD/2+.1,5.6,-.7);holo.rotation.y=-.16;g.add(holo);let ht=null;
  const cy='#39d6ff';const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,.035,10,64),glow(cy,2.4));ring.rotation.x=Math.PI/2;ring.position.set(MOD/2+.1,.2,-.7);g.add(ring);const ring2=new THREE.Mesh(new THREE.TorusGeometry(.7,.02,10,48),glow('#ff3df0',2.2));ring2.rotation.x=Math.PI/2;ring2.position.copy(ring.position);g.add(ring2);
  const cone=new THREE.Mesh(new THREE.CylinderGeometry(2.9,.5,10,40,1,true),new THREE.MeshBasicMaterial({color:cy,transparent:true,opacity:.035,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));cone.position.set(MOD/2+.1,5.2,-.7);g.add(cone);
  const hc=mk(1024,64),hg=hc.getContext('2d');hg.font='500 44px "JetBrains Mono",monospace';hg.fillStyle='#bff3ff';hg.fillText('VERY SPECIAL  ///  特別  ///  OUVERT LA NUIT  ///  ',6,48);const hct=T(hc);hct.wrapS=THREE.RepeatWrapping;hct.repeat.x=2;
  const hr=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.28,48,1,true),new THREE.MeshBasicMaterial({map:hct,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,color:new THREE.Color(1.3,1.3,1.3)}));hr.material.toneMapped=false;hr.position.set(MOD/2+.1,1.25,-.7);g.add(hr);
  const hl=new THREE.PointLight('#5a8cff',30,12,1.5);hl.position.set(MOD/2+.1,3.5,1.2);g.add(hl);
  ticks.push(t=>{hm.uniforms.time.value=t;hr.rotation.y=t*.5;ring2.scale.setScalar(1+.25*Math.sin(t*2.2));if(AD&&AD.videoWidth&&!ht){ht=new THREE.VideoTexture(AD);ht.colorSpace=THREE.SRGBColorSpace;hm.uniforms.map.value=ht;hm.uniforms.on.value=1;}hl.intensity=26+8*Math.sin(t*41.)*Math.sin(t*5.3);});
  s.vit=vit;s.fake=[bt,ped];const bl2=new THREE.PointLight('#2a4bff',26,9,1.6);bl2.position.set(2.05,2.2,-1.6);g.add(bl2);
  s.doorman=new THREE.Vector3(s.x+3.05,.16,-1.9);}
let mixer2=null;
function spawnDoorman(gl){const s=SHOPS.find(q=>q.doorman);if(!s)return;const m=skClone(gl.scene);const surf=std('#0d0d11',.4,{metalness:.2}),seam=new THREE.MeshStandardMaterial({color:'#2a1a05',emissive:'#ff9d2e',emissiveIntensity:1.2});m.traverse(o=>{if(o.isMesh){o.frustumCulled=false;o.material=/joint/i.test(o.name)?seam:surf;}});m.scale.setScalar(1.12);m.position.copy(s.doorman);m.rotation.y=-.35;scene.add(m);mixer2=new THREE.AnimationMixer(m);const a=mixer2.clipAction(THREE.AnimationClip.findByName(gl.animations,'idle'));a.play();a.time=1.3;}
/* glisser-déposer : le film sur la façade */
(function(){const setV=src=>{const v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.src=src;v.addEventListener('loadeddata',()=>{AD=v;v.play().catch(()=>{});});v.load();};const setI=src=>{const i=new Image();i.onload=()=>{if(!AD)AD=i;};i.src=src;};import('./martell.js').then(m=>{const d=m.default;const bin=Uint8Array.from(atob(d.video),c=>c.charCodeAt(0));setV(URL.createObjectURL(new Blob([bin],{type:'video/mp4'})));d.posters.forEach(u=>{const im=new Image();im.onload=()=>POSTERS.push(im);im.src=u;});const vi=new Image();vi.onload=()=>{const s=SHOPS.find(q=>q.vit);if(!s)return;const c=mk(768,440),g=c.getContext('2d');g.drawImage(vi,0,0,768,440);const cur=(x0,x1)=>{const cg=g.createLinearGradient(x0,0,x1,0);for(let i=0;i<=6;i++)cg.addColorStop(i/6,i%2?'#0a1238':'#1a2a7a');g.fillStyle=cg;g.fillRect(Math.min(x0,x1),0,Math.abs(x1-x0),440);};cur(0,84);cur(768,684);s.vit.material.map=T(c);s.vit.material.color.set('#fff');s.vit.material.needsUpdate=true;s.fake.forEach(o=>o.visible=false);};vi.src=d.vitrine;}).catch(()=>{});
 addEventListener('dragover',e=>e.preventDefault());const setV2=src=>{const v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.src=src;v.addEventListener('loadeddata',()=>{AD2=v;v.play().catch(()=>{});});v.load();};addEventListener('drop',e=>{e.preventDefault();const fs=[...(e.dataTransfer?e.dataTransfer.files:[])];const vids=fs.filter(f=>f.type.startsWith('video')).sort((a,b)=>b.size-a.size);vids.forEach((f,i)=>{const u=URL.createObjectURL(f);if(i===0&&!(AD&&AD.videoWidth&&vids.length===1&&!AD2&&false))setV(u);else setV2(u);});fs.filter(f=>f.type.startsWith('image')).forEach(f=>{const im=new Image();im.onload=()=>POSTERS.push(im);im.src=URL.createObjectURL(f);});});})();

/* ---------- Rue ---------- */
const world=new THREE.Group();scene.add(world);const clickables=[];
function building(x,seed,s){const g=new THREE.Group();g.position.x=x;const f=FAC[seed%4];
  const up=new THREE.Mesh(new THREE.PlaneGeometry(MOD,8),new THREE.MeshStandardMaterial({map:f.map,emissiveMap:f.em,emissive:'#fff',emissiveIntensity:.5,roughness:.9}));up.position.set(0,7.6,-3);g.add(up);
  const cor=box(MOD,.22,.5,std('#0d0c11'));cor.position.set(0,3.62,-2.85);g.add(cor);
  const band=box(MOD,3.6,.3,std(s?new THREE.Color(s.pal[0]).lerp(new THREE.Color('#0c0b10'),.45):'#121117',.55));band.position.set(0,1.8,-3);g.add(band);
  [-1,1].forEach(k=>{const pil=box(.34,3.6,.42,std('#0b0a0e',.5));pil.position.set(k*(MOD/2-.17),1.8,-2.9);g.add(pil);});
  if(!s){const sh=new THREE.Mesh(new THREE.PlaneGeometry(5.6,2.5),new THREE.MeshStandardMaterial({map:SHUT,roughness:.6}));sh.position.set(0,1.35,-2.84);g.add(sh);world.add(g);return;}
  if(s.p&&s.p.title==='Martell VS'){martell(g,s);world.add(g);return;}
  const nm=glow(s.neon,2.0);
  const vit=new THREE.Mesh(new THREE.PlaneGeometry(3.5,2.19),new THREE.MeshBasicMaterial({map:vitrineTex(s),color:'#d8d8d8'}));vit.position.set(-1.15,1.5,-2.84);g.add(vit);vit.userData.shop=s;clickables.push(vit);
  [[0,1.14,3.62,.05],[0,-1.14,3.62,.05],[-1.78,0,.05,2.3],[1.78,0,.05,2.3]].forEach(([dx,dy,w,h])=>{const t=box(w,h,.05,nm);t.position.set(-1.15+dx,1.5+dy,-2.8);g.add(t);});
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.25,2.5),new THREE.MeshBasicMaterial({map:doorTex(s.neon),color:'#bdbdbd'}));door.position.set(2.05,1.25,-2.84);g.add(door);door.userData.shop=s;clickables.push(door);
  [[0,1.28,1.37,.05],[-.66,0,.05,2.56],[.66,0,.05,2.56]].forEach(([dx,dy,w,h])=>{const t=box(w,h,.05,nm);t.position.set(2.05+dx,1.25+dy,-2.8);g.add(t);});
  const mat=new THREE.MeshBasicMaterial({map:neonTex(s.sign[0],s.sign[1],s.neon,s.kind==='hero'||seed%3===1),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:new THREE.Color(1.5,1.5,1.5)});mat.toneMapped=false;
  const big=s.kind==='hero';const sg=new THREE.Mesh(new THREE.PlaneGeometry(big?7:5.9,big?1.75:1.48),mat);sg.position.set(0,big?4.9:3.15,-2.62);g.add(sg);s.signMat=mat;
  if(seed%2===0&&!big){const bm=new THREE.MeshBasicMaterial({map:bladeTex(s.sign[0],s.neon),color:new THREE.Color(1.5,1.5,1.5)});bm.toneMapped=false;const dk=std('#0a080d');const bl=box(.62,3.2,.12,[dk,dk,dk,dk,bm,dk]);bl.position.set(MOD/2-.45,6.2,-2.5);g.add(bl);const arm=box(.06,.06,.5,std('#0a080d'));arm.position.set(MOD/2-.45,7.6,-2.78);g.add(arm);}
  world.add(g);}
let SIGNS_READY=false;
function buildStreet(){for(let i=-2;i<0;i++)building(i*MOD,i+8,null);SHOPS.forEach((s,i)=>building(s.x,i,s));for(let i=0;i<2;i++)building((SHOPS.length+i)*MOD,i+5,null);SIGNS_READY=true;}

/* trottoir */
const LEN=(SHOPS.length+6)*MOD,CX=(SHOPS.length-1)*MOD/2;
const walkC=mk(256,256);{const g=walkC.getContext('2d');g.fillStyle='#1c1b21';g.fillRect(0,0,256,256);g.strokeStyle='#0c0b0f';g.lineWidth=3;g.strokeRect(0,0,256,256);for(let i=0;i<300;i++){g.fillStyle='rgba(255,255,255,'+rnd(0,.04)+')';g.fillRect(rnd(0,256),rnd(0,256),2,2);}}
const wt=T(walkC);wt.wrapS=wt.wrapT=THREE.RepeatWrapping;wt.repeat.set(LEN/1.4,2);
const walk=box(LEN,.16,2.9,new THREE.MeshStandardMaterial({map:wt,roughness:.35,metalness:.1}));walk.position.set(CX,.08,-1.45);scene.add(walk);
const kerb=box(LEN,.17,.16,std('#2a2930',.4));kerb.position.set(CX,.085,.05);scene.add(kerb);

/* pavés mouillés : miroir flouté + pavés par-dessus */
const RS=Reflector.ReflectorShader;
const wetShader={name:'Wet',uniforms:THREE.UniformsUtils.clone(RS.uniforms),vertexShader:RS.vertexShader,fragmentShader:`
uniform vec3 color;uniform sampler2D tDiffuse;varying vec4 vUv;
#include <logdepthbuf_pars_fragment>
void main(){
  #include <logdepthbuf_fragment>
  vec2 uv=vUv.xy/vUv.w;vec3 acc=vec3(0.);float tot=0.;
  for(int i=-4;i<=4;i++){float f=float(i);float w=1.-abs(f)/5.5;vec2 o=vec2(sin(uv.y*240.+f)*.0018,f*.011);acc+=texture2D(tDiffuse,uv+o).rgb*w;tot+=w;}
  gl_FragColor=vec4(acc/tot*color,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`};
const mirror=new Reflector(new THREE.PlaneGeometry(LEN,14),{textureWidth:1024,textureHeight:512,color:0x8a8a94,shader:wetShader,clipBias:.003});mirror.rotation.x=-Math.PI/2;mirror.position.set(CX,0,7.1);scene.add(mirror);
const pc=mk(512,512);{const g=pc.getContext('2d');g.clearRect(0,0,512,512);g.fillStyle='rgba(4,4,6,.97)';g.fillRect(0,0,512,512);const cw=64,chh=51.2;for(let r=0;r<10;r++)for(let k=-1;k<9;k++){const x=k*cw+(r%2?cw/2:0)+rnd(-2,2),y=r*chh+rnd(-1.5,1.5);const a=rnd(.38,.78),v=Math.floor(rnd(20,44));g.clearRect(x+4,y+4,cw-8,chh-8);g.fillStyle='rgba('+v+','+v+','+(v+6)+','+a+')';g.beginPath();g.roundRect(x+4,y+4,cw-8,chh-8,9);g.fill();g.fillStyle='rgba(255,255,255,'+rnd(.02,.07)+')';g.beginPath();g.roundRect(x+8,y+7,cw-22,6,3);g.fill();
  const wrap=(xx)=>{if(xx<0){g.fillStyle='rgba('+v+','+v+','+(v+6)+','+a+')';}};wrap(x);}}
const pt=new THREE.CanvasTexture(pc);pt.colorSpace=THREE.SRGBColorSpace;pt.wrapS=pt.wrapT=THREE.RepeatWrapping;pt.repeat.set(LEN/2.6,14/2.6);pt.anisotropy=8;
const paves=new THREE.Mesh(new THREE.PlaneGeometry(LEN,14),new THREE.MeshBasicMaterial({map:pt,transparent:true,depthWrite:false}));paves.rotation.x=-Math.PI/2;paves.position.set(CX,.012,7.1);scene.add(paves);

/* réverbères et colonne d'affichage */
function lamp(x){const g=new THREE.Group();const m=std('#0c0d0c',.45,{metalness:.6});const pole=new THREE.Mesh(new THREE.CylinderGeometry(.05,.09,4.3,12),m);pole.position.y=2.3;g.add(pole);const foot=new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,.5,12),m);foot.position.y=.4;g.add(foot);const cap=new THREE.Mesh(new THREE.ConeGeometry(.3,.22,6),m);cap.position.y=4.95;g.add(cap);const lan=new THREE.Mesh(new THREE.CylinderGeometry(.2,.13,.42,6),glow('#ffcf8a',1.9));lan.position.y=4.65;g.add(lan);g.position.set(x,.16,-.35);scene.add(g);}
for(let x=MOD/2;x<X1+8;x+=MOD*2)lamp(x);
function colonne(x){const c=mk(1024,512),g=c.getContext('2d');g.fillStyle='#e9e2d2';g.fillRect(0,0,1024,512);const cols=['#ff2d78','#0b3fae','#111','#e31837'];['ILS SONT PASSÉS ICI','Pernod Ricard · Sephora · Air France','Renault · MACSF · Tessan','Lunettes Pour Tous · Grimbergen','ET 30 AUTRES'].forEach((t,i)=>{g.fillStyle=i===0?'#111':cols[i%4];g.font=(i===0?'700 54px':'600 40px')+' "Space Grotesk",Arial,sans-serif';g.fillText(t,40,90+i*92,940);});const t=T(c);t.wrapS=THREE.RepeatWrapping;
  const g3=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,2.6,32,1,true),new THREE.MeshStandardMaterial({map:t,roughness:.9,color:'#8d8880',emissiveMap:t,emissive:'#fff',emissiveIntensity:.04}));body.position.y=1.75;g3.add(body);const m=std('#12261c',.4);const base=new THREE.Mesh(new THREE.CylinderGeometry(.68,.72,.45,32),m);base.position.y=.22;g3.add(base);const top=new THREE.Mesh(new THREE.CylinderGeometry(.72,.66,.22,32),m);top.position.y=3.15;g3.add(top);const dome=new THREE.Mesh(new THREE.SphereGeometry(.6,32,12,0,6.3,0,1.5),m);dome.scale.y=.75;dome.position.y=3.24;g3.add(dome);g3.position.set(x,.16,-1.3);scene.add(g3);}

/* pluie */
const NR=700,rp=new Float32Array(NR*6),rv=[];for(let i=0;i<NR;i++)rv.push({x:rnd(-16,16),y:rnd(0,11),z:rnd(-2.6,9),s:rnd(13,20)});
const rainG=new THREE.BufferGeometry();rainG.setAttribute('position',new THREE.BufferAttribute(rp,3));const rain=new THREE.LineSegments(rainG,new THREE.LineBasicMaterial({color:'#9fb0ff',transparent:true,opacity:.22}));rain.frustumCulled=false;scene.add(rain);

/* ---------- Le personnage ---------- */
const me=new THREE.Group();scene.add(me);const rig={};
{const jacket=std('#1b1a24',.55),pants=std('#0f0f15',.7),skin=std('#c49a7c',.7),shoe=std('#e9e5dc',.5),beanie=std('#ff5a2a',.8);
 const cap=(r,l,m)=>new THREE.Mesh(new THREE.CapsuleGeometry(r,l,6,16),m);
 const body=new THREE.Group();me.add(body);rig.body=body;
 const torso=cap(.185,.36,jacket);torso.scale.set(1,1,.68);torso.position.y=1.27;body.add(torso);
 const hem=new THREE.Mesh(new THREE.CylinderGeometry(.2,.22,.22,20),jacket);hem.scale.z=.7;hem.position.y=.98;body.add(hem);
 const neck=cap(.055,.06,skin);neck.position.y=1.55;body.add(neck);
 const head=new THREE.Group();head.position.y=1.68;body.add(head);rig.head=head;
 const sk=new THREE.Mesh(new THREE.SphereGeometry(.118,24,18),skin);sk.scale.set(.92,1.08,1);head.add(sk);
 const bn=new THREE.Mesh(new THREE.SphereGeometry(.125,24,12,0,6.3,0,1.45),beanie);bn.position.y=.03;bn.rotation.x=-.18;head.add(bn);const cuff=new THREE.Mesh(new THREE.TorusGeometry(.118,.026,10,28),beanie);cuff.rotation.x=Math.PI/2-.18;cuff.position.y=.045;head.add(cuff);
 const hood=new THREE.Mesh(new THREE.TorusGeometry(.12,.05,10,24),jacket);hood.rotation.x=Math.PI/2+.25;hood.position.set(0,1.5,-.03);body.add(hood);
 rig.legs=[-1,1].map(s=>{const hip=new THREE.Group();hip.position.set(s*.095,.95,0);me.add(hip);const th=cap(.078,.3,pants);th.position.y=-.21;hip.add(th);const knee=new THREE.Group();knee.position.y=-.43;hip.add(knee);const sh=cap(.06,.3,pants);sh.position.y=-.2;knee.add(sh);const ft=new THREE.Mesh(new THREE.CapsuleGeometry(.05,.15,4,10),shoe);ft.rotation.x=Math.PI/2;ft.position.set(0,-.45,.06);knee.add(ft);return{hip,knee};});
 rig.arms=[-1,1].map(s=>{const sh=new THREE.Group();sh.position.set(s*.245,1.45,0);body.add(sh);const up=cap(.058,.22,jacket);up.position.y=-.16;sh.add(up);const el=new THREE.Group();el.position.y=-.31;sh.add(el);const fo=cap(.05,.2,jacket);fo.position.y=-.14;el.add(fo);const hd=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),skin);hd.position.y=-.29;el.add(hd);return{sh,el,s};});}
const WALK=2.7,RUN=6.8;let mixer=null,acts=null;const proc=me.children.slice();
import('./xbot.js').then(mod=>{const bin=Uint8Array.from(atob(mod.default),c=>c.charCodeAt(0)).buffer;new GLTFLoader().parse(bin,'',g=>{const m=g.scene;const surf=new THREE.MeshStandardMaterial({color:'#24232e',roughness:.38,metalness:.2}),seam=new THREE.MeshStandardMaterial({color:'#2a0a14',emissive:'#ff2d78',emissiveIntensity:1.6,roughness:.5});m.traverse(o=>{if(o.isMesh){o.frustumCulled=false;o.material=/joint/i.test(o.name)?seam:surf;}});proc.forEach(o=>o.visible=false);me.add(m);mixer=new THREE.AnimationMixer(m);acts={};['idle','walk','run'].forEach(n=>{const a=mixer.clipAction(THREE.AnimationClip.findByName(g.animations,n));a.play();a.setEffectiveWeight(n==='idle'?1:0);acts[n]=a;});window.__model=true;spawnDoorman(g);},()=>{});}).catch(()=>{});
const ME={x:0,v:0,tx:null,face:1,ph:0,z:3.0};me.position.set(0,0,ME.z);

/* ---------- Entrées ---------- */
const keys={};let started=false,panelOpen=false,near=null,hold=0;
const panel=$('panel');
function openPanel(p){$('p-title').textContent=p.title;$('p-meta').textContent=p.brand+' · '+p.year+' · '+p.tags;$('p-line').textContent=p.line;$('p-ctx').textContent=p.ctx;$('p-role').textContent=p.role;$('p-out').textContent=p.out;$('p-stack').textContent=p.stack;$('p-media').style.background=`radial-gradient(circle at 70% 30%, ${p.pal[1]}, ${p.pal[0]} 72%)`;const pm=$('p-media');pm.textContent='[Galerie, vidéo et images]';if(p.title==='Martell VS'&&AD&&AD.videoWidth){pm.textContent='';const v=document.createElement('video');v.src=AD.src;v.muted=true;v.loop=true;v.autoplay=true;v.controls=true;v.playsInline=true;v.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:10px';pm.style.padding='0';pm.appendChild(v);}else pm.style.padding='';panel.classList.add('open');panel.setAttribute('aria-hidden','false');panelOpen=true;}
function closePanel(){panel.classList.remove('open');panel.setAttribute('aria-hidden','true');panelOpen=false;}
panel.querySelector('.close').onclick=closePanel;
function enter(){if(near&&near.p)openPanel(near.p);}
function start(){started=true;$('intro').classList.add('off');}
$('b-start').onclick=start;$('cap-b').onclick=enter;
addEventListener('keydown',e=>{if(e.key==='Escape'){closePanel();$('menu').classList.remove('open');return;}if(!started&&(e.key==='Enter'||e.key===' ')){start();return;}keys[e.key.toLowerCase()]=true;if(['arrowleft','arrowright','arrowup','arrowdown',' '].includes(e.key.toLowerCase()))e.preventDefault();if((e.key==='Enter'||e.key==='ArrowUp'||e.key.toLowerCase()==='z')&&started&&!panelOpen)enter();if(['arrowleft','arrowright','q','a','d'].includes(e.key.toLowerCase())){ME.tx=null;if(panelOpen)closePanel();}});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
addEventListener('wheel',e=>{if(panelOpen||!started)return;const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;ME.tx=Math.max(X0,Math.min(X1,(ME.tx??ME.x)+d*.012));},{passive:true});
const ray=new THREE.Raycaster(),m2=new THREE.Vector2();let pd=null;
$('c').addEventListener('pointerdown',e=>{if(!started)return;pd={x:e.clientX,y:e.clientY,t:performance.now()};hold=e.clientX<innerWidth/2?-1:1;if(panelOpen)closePanel();});
addEventListener('pointerup',e=>{const wasHold=pd&&performance.now()-pd.t>220;hold=0;if(!pd)return;const tap=!wasHold&&Math.hypot(e.clientX-pd.x,e.clientY-pd.y)<8;pd=null;if(!tap)return;m2.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(m2,cam);const h=ray.intersectObjects(clickables)[0];if(h){const s=h.object.userData.shop;ME.tx=s.x+2.05;ME.then=s;}else{const pl=new THREE.Plane(new THREE.Vector3(0,1,0),0),pt3=new THREE.Vector3();if(ray.ray.intersectPlane(pl,pt3))ME.tx=Math.max(X0,Math.min(X1,pt3.x));}});
$('c').addEventListener('pointermove',e=>{if(pd&&performance.now()-pd.t>220)hold=e.clientX<innerWidth/2?-1:1;m2.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(m2,cam);$('c').style.cursor=ray.intersectObjects(clickables).length?'pointer':'default';});
/* menu */
const menu=$('menu');SHOPS.filter(s=>s.p).forEach(s=>{const b=document.createElement('button');b.innerHTML=`<span>${s.p.title}</span><small>${s.kind==='pro'?s.p.zone:s.kind==='perso'?'Perso':''}</small>`;b.onclick=()=>{menu.classList.remove('open');$('b-menu').setAttribute('aria-expanded','false');if(!started)start();closePanel();fadeTo(s.x+.6);};menu.appendChild(b);});
$('b-menu').onclick=()=>{const o=menu.classList.toggle('open');$('b-menu').setAttribute('aria-expanded',o);};
$('b-reset').onclick=()=>{closePanel();fadeTo(0);};
function fadeTo(x){const f=$('fade');f.classList.add('on');setTimeout(()=>{ME.x=x;ME.v=0;ME.tx=null;camX=x;f.classList.remove('on');},320);}

/* ---------- Boucle ---------- */
let camK=0,camX=0,last=performance.now(),tt=0;const lookV=new THREE.Vector3();
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;tt+=dt;
  let dir=0;if(started&&!panelOpen){if(keys['arrowright']||keys['d'])dir+=1;if(keys['arrowleft']||keys['q']||keys['a'])dir-=1;if(!dir&&hold)dir=hold;}
  const run=keys['shift'];let target=0;
  if(dir){target=dir*(run?RUN:WALK);ME.tx=null;ME.then=null;}
  else if(ME.tx!=null){const d=ME.tx-ME.x;if(Math.abs(d)<.06){ME.tx=null;if(ME.then){near=ME.then;ME.then=null;enter();}}else target=Math.sign(d)*Math.min(Math.abs(d)>9?RUN:WALK,Math.abs(d)*3+.6);}
  ME.v+=(target-ME.v)*Math.min(1,dt*9);ME.x=Math.max(X0,Math.min(X1,ME.x+ME.v*dt));
  if(Math.abs(ME.v)>.15)ME.face=Math.sign(ME.v);
  const sp=Math.abs(ME.v),a=Math.min(1,sp/WALK),rn=Math.max(0,Math.min(1,(sp-WALK)/(RUN-WALK)));ME.ph+=dt*(2.6+sp*1.55)*(sp>.1?1:0);
  const idle=1-a;
  me.position.set(ME.x,mixer?0:Math.abs(Math.sin(ME.ph))*.045*a,ME.z);
  if(mixer){acts.idle.setEffectiveWeight(1-a);acts.walk.setEffectiveWeight(a*(1-rn));acts.run.setEffectiveWeight(a*rn);acts.walk.setEffectiveTimeScale(Math.max(.7,Math.min(1.8,sp/1.75)));acts.run.setEffectiveTimeScale(Math.max(.8,Math.min(1.5,sp/5.2)));mixer.update(dt);}
  const ty=panelOpen||(idle>.9&&near)?Math.PI:ME.face>0?Math.PI/2:-Math.PI/2;let dy=ty-me.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));me.rotation.y+=dy*Math.min(1,dt*9);
  rig.legs.forEach((L,i)=>{const p=ME.ph+i*Math.PI;L.hip.rotation.x=-Math.sin(p)*(.55+.3*rn)*a;L.knee.rotation.x=(Math.max(0,Math.sin(p+1.9))*(1.0+.6*rn)+.06)*a+.03;});
  rig.arms.forEach((A,i)=>{const p=ME.ph+(1-i)*Math.PI;A.sh.rotation.x=-Math.sin(p)*(.5+.4*rn)*a+idle*.05;A.sh.rotation.z=A.s*(.1+.03*Math.sin(tt*1.3)*idle);A.el.rotation.x=-(.25+.75*rn)*a-Math.max(0,-Math.sin(p))*.4*a-idle*.12;});
  rig.body.rotation.x=(.06+.16*rn)*a;rig.body.position.y=Math.sin(tt*1.6)*.006*idle;rig.body.rotation.y=Math.sin(ME.ph)*.12*a;rig.head.rotation.y=-Math.sin(ME.ph)*.08*a+Math.sin(tt*.5)*.25*idle;
  /* caméra */
  camX+=(ME.x+ME.v*.4-camX)*Math.min(1,dt*3.2);const narrow=cam.aspect<1;
  const tall=SHOPS.find(q=>q.doorman);camK+=((tall&&(ME.x-tall.x>-4.6&&ME.x-tall.x<7)?1:0)-camK)*Math.min(1,dt*1.8);cam.position.set(camX+(narrow?0:1.1)*(1-camK),1.95+(narrow?.5:0),13.4+(narrow?2:0)+4.4*camK);lookV.set(camX+(narrow?0:1.1)*(1-camK)+ME.v*.05,2.35+1.75*camK,-3);cam.lookAt(lookV);
  /* lumières des vitrines proches */
  const sorted=SHOPS.slice().sort((p,q)=>Math.abs(p.x-ME.x)-Math.abs(q.x-ME.x));pool.forEach((l,i)=>{const s=sorted[i];l.position.set(s.x,2.4,-.9);l.color.set(s.neon);l.intensity=34;});
  /* néons qui grésillent */
  SHOPS.forEach((s,i)=>{if(!s.signMat)return;const f=s.flick?((Math.sin(tt*17)>.55&&Math.sin(tt*2.9)>.35)?.3:1):Math.sin(tt*31+i*7)>.985||Math.sin(tt*2.3+i*3.1)>.992?.45:1;s.signMat.color.setScalar(1.5*f);});
  ticks.forEach(f=>f(tt,dt));if(mixer2)mixer2.update(dt);
  /* pluie */
  for(let i=0;i<NR;i++){const r=rv[i];r.y-=r.s*dt;if(r.y<0){r.y=11;r.x=rnd(-16,16);}const x=camX+r.x;rp[i*6]=x;rp[i*6+1]=r.y;rp[i*6+2]=r.z;rp[i*6+3]=x+.03;rp[i*6+4]=r.y+.42;rp[i*6+5]=r.z;}rainG.attributes.position.needsUpdate=true;
  /* légende */
  let best=null,bd=2.6;SHOPS.forEach(s=>{const d=Math.abs(s.x+.6-ME.x);if(d<bd&&s.p){bd=d;best=s;}});
  if(best!==near){near=best;const c=$('cap');if(best){const idx=SHOPS.filter(s=>s.kind==='pro').indexOf(best);$('cap-n').textContent=best.kind==='pro'?String(idx+1).padStart(2,'0')+' / 11 · '+best.p.zone:best.kind==='perso'?'Côté perso':'La suite';$('cap-t').textContent=best.p.title;$('cap-l').textContent=best.p.line;$('cap-b').firstChild.textContent=best.kind==='contact'?'Prendre contact ':'Entrer ';c.classList.add('on');}else c.classList.remove('on');}
  $('bar').style.transform='scaleX('+Math.max(0,Math.min(1,(ME.x-X0)/(X1-X0)))+')';
  if(sp>.5)$('help').style.opacity=0;
  composer.render();}
window.__me=ME;window.__start=start;
Promise.race([new Promise(r=>setTimeout(r,2500)),Promise.all(['400 100px "Tilt Neon"','400 100px "Yellowtail"','500 40px "Space Grotesk"','400 20px "JetBrains Mono"'].map(f=>document.fonts.load(f)))]).catch(()=>{}).then(()=>{buildStreet();colonne(MOD*3.5+0);colonne(MOD*9.5);requestAnimationFrame(tick);});
