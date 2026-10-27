import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Cena, camera e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0x87ceeb, 0.012);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(0, 8, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.target.set(0, 1.5, 0);

// Iluminacao
const luzAmbiente = new THREE.HemisphereLight(0xffffff, 0x3f6212, 0.8);
scene.add(luzAmbiente);

const luzSol = new THREE.DirectionalLight(0xfffbeb, 1.6);
luzSol.position.set(15, 25, 15);
luzSol.castShadow = true;
luzSol.shadow.mapSize.width = 2048;
luzSol.shadow.mapSize.height = 2048;
luzSol.shadow.camera.left = -20;
luzSol.shadow.camera.right = 20;
luzSol.shadow.camera.top = 20;
luzSol.shadow.camera.bottom = -20;
scene.add(luzSol);

const luzFogueira = new THREE.PointLight(0xff6b00, 3, 12);
luzFogueira.position.set(3, 1.4, 2);
luzFogueira.castShadow = true;
scene.add(luzFogueira);

// --- Construcao do mapa (Ilha) ---
const ilha = new THREE.Group();
scene.add(ilha);

// Agua
const geoAgua = new THREE.PlaneGeometry(200, 200, 30, 30);
geoAgua.rotateX(-Math.PI / 2);
const matAgua = new THREE.MeshStandardMaterial({
  color: 0x0ea5e9,
  roughness: 0.3,
  flatShading: true
});
const agua = new THREE.Mesh(geoAgua, matAgua);
agua.position.y = -0.5;
agua.receiveShadow = true;
scene.add(agua);

// Areia e grama
const areia = new THREE.Mesh(
  new THREE.CylinderGeometry(14, 16, 1.2, 16),
  new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.9, flatShading: true })
);
areia.position.y = -0.4;
areia.receiveShadow = true;
ilha.add(areia);

const grama = new THREE.Mesh(
  new THREE.CylinderGeometry(12.5, 14, 0.8, 16),
  new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.85, flatShading: true })
);
grama.position.y = 0.25;
grama.receiveShadow = true;
ilha.add(grama);

const colina = new THREE.Mesh(
  new THREE.CylinderGeometry(5, 7, 2, 10),
  new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.85, flatShading: true })
);
colina.position.set(-4, 1.3, -5);
colina.castShadow = true;
colina.receiveShadow = true;
ilha.add(colina);

// Funcao para criar arvores
function criarArvore(x, y, z, escala = 1) {
  const arvore = new THREE.Group();

  const tronco = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.35, 1.5, 7),
    new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true })
  );
  tronco.position.y = 0.75;
  tronco.castShadow = true;
  arvore.add(tronco);

  const coresCopa = [0x15803d, 0x16a34a, 0x22c55e];
  for (let i = 0; i < 3; i++) {
    const copa = new THREE.Mesh(
      new THREE.ConeGeometry(1.4 - i * 0.3, 1.7 - i * 0.2, 7),
      new THREE.MeshStandardMaterial({ color: coresCopa[i], flatShading: true })
    );
    copa.position.y = 1.8 + i * 0.9;
    copa.castShadow = true;
    arvore.add(copa);
  }

  arvore.position.set(x, y, z);
  arvore.scale.setScalar(escala);
  ilha.add(arvore);
}

criarArvore(-6, 0.6, 2.5, 1.1);
criarArvore(-8, 0.6, -1.5, 0.9);
criarArvore(-5, 2.3, -6, 1.2);
criarArvore(-2.2, 2.3, -4.5, 0.9);
criarArvore(5.5, 0.6, -5.5, 1.2);
criarArvore(7.5, 0.6, -2, 1.0);
criarArvore(6.8, 0.6, 3.5, 1.1);

// Funcao para criar pedras
function criarPedra(x, y, z, sx, sy, sz) {
  const pedra = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85, flatShading: true })
  );
  pedra.position.set(x, y, z);
  pedra.scale.set(sx, sy, sz);
  pedra.rotation.set(Math.random(), Math.random(), Math.random());
  pedra.castShadow = true;
  pedra.receiveShadow = true;
  ilha.add(pedra);
}

criarPedra(-9, 0.8, 4.5, 1.1, 0.8, 1.0);
criarPedra(-8, 0.6, 5.3, 0.6, 0.5, 0.7);
criarPedra(3.5, 0.9, -7.2, 1.4, 1.1, 1.0);
criarPedra(8.8, 0.7, 0.8, 0.9, 0.7, 1.1);

// Fogueira
const fogueira = new THREE.Group();
fogueira.position.set(3, 0.65, 2);
ilha.add(fogueira);

for (let i = 0; i < 4; i++) {
  const lenha = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 1.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x451a03, flatShading: true })
  );
  lenha.rotation.z = Math.PI / 2.3;
  lenha.rotation.y = (i * Math.PI) / 4;
  lenha.position.y = 0.15;
  fogueira.add(lenha);
}

const fogo = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.4, 0),
  new THREE.MeshStandardMaterial({
    color: 0xff5500,
    emissive: 0xff4500,
    emissiveIntensity: 1.5,
    flatShading: true
  })
);
fogo.position.y = 0.5;
fogueira.add(fogo);

// Pier de madeira
const pier = new THREE.Group();
pier.position.set(0, 0.35, 11.5);
ilha.add(pier);

const matMadeira = new THREE.MeshStandardMaterial({ color: 0x92400e, flatShading: true });
for (let i = 0; i < 7; i++) {
  const tabua = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.5), matMadeira);
  tabua.position.set(0, 0, i * 0.65);
  tabua.castShadow = true;
  tabua.receiveShadow = true;
  pier.add(tabua);
}

// --- Carregamento do Modelo 3D (Sketchfab) e 3 Animacoes ---
const loader = new GLTFLoader();
const personagemGrupo = new THREE.Group();
personagemGrupo.position.set(-0.5, 0.65, 2);
scene.add(personagemGrupo);

let mixer = null;
let acaoIdle, acaoWalk, acaoRun;
let acaoAtual = null;

loader.load('./azri_cycles_-_idle_walk_run.glb', (gltf) => {
  const modelo = gltf.scene;

  modelo.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  // Ajusta o tempo inicial dos clipes exportados do Maya (Walk e Run)
  gltf.animations.forEach((clip) => {
    const inicio = clip.tracks[0].times[0];
    if (inicio > 0) {
      clip.tracks.forEach((track) => {
        track.shift(-inicio);
      });
      clip.resetDuration();
    }
  });

  // Escala proporcional para a ilha
  modelo.scale.set(1.5, 1.5, 1.5);
  modelo.position.set(0, 0, 0);

  personagemGrupo.add(modelo);

  // Configura as 3 animacoes principais do modelo do Sketchfab:
  // 0: Idle | 2: Walk | 4: Run
  mixer = new THREE.AnimationMixer(modelo);
  acaoIdle = mixer.clipAction(gltf.animations[0]);
  acaoWalk = mixer.clipAction(gltf.animations[2]);
  acaoRun = mixer.clipAction(gltf.animations[4]);

  // Inicia na animacao Idle
  acaoIdle.play();
  acaoAtual = acaoIdle;
});

function trocarAnimacao(novaAcao, idBotao) {
  if (!novaAcao || novaAcao === acaoAtual) return;

  novaAcao.reset().fadeIn(0.25).play();
  if (acaoAtual) {
    acaoAtual.fadeOut(0.25);
  }
  acaoAtual = novaAcao;

  document.querySelectorAll('.btn-anim').forEach((btn) => {
    btn.classList.remove('ativo');
  });
  document.getElementById(idBotao).classList.add('ativo');
}

document.getElementById('btn1').addEventListener('click', () => trocarAnimacao(acaoIdle, 'btn1'));
document.getElementById('btn2').addEventListener('click', () => trocarAnimacao(acaoWalk, 'btn2'));
document.getElementById('btn3').addEventListener('click', () => trocarAnimacao(acaoRun, 'btn3'));

// Controles do teclado
const teclas = {};
window.addEventListener('keydown', (e) => {
  teclas[e.code] = true;

  if (e.key === '1') trocarAnimacao(acaoIdle, 'btn1');
  if (e.key === '2') trocarAnimacao(acaoWalk, 'btn2');
  if (e.key === '3') trocarAnimacao(acaoRun, 'btn3');
});

window.addEventListener('keyup', (e) => {
  teclas[e.code] = false;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Loop de animacao
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const tempo = clock.getElapsedTime();

  if (mixer) mixer.update(delta);

  // Movimento com WASD
  const vel = 4 * delta;
  let dx = 0;
  let dz = 0;

  if (teclas['KeyW'] || teclas['ArrowUp']) dz -= 1;
  if (teclas['KeyS'] || teclas['ArrowDown']) dz += 1;
  if (teclas['KeyA'] || teclas['ArrowLeft']) dx -= 1;
  if (teclas['KeyD'] || teclas['ArrowRight']) dx += 1;

  if (dx !== 0 || dz !== 0) {
    personagemGrupo.position.x += dx * vel;
    personagemGrupo.position.z += dz * vel;
    personagemGrupo.rotation.y = Math.atan2(dx, dz);
  }

  // Efeito simples no fogo
  fogo.scale.y = 1 + Math.sin(tempo * 10) * 0.2;
  fogo.rotation.y = tempo * 2;

  controls.update();
  renderer.render(scene, camera);
}

animate();
