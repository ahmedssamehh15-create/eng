/* script.js */

/* ----------------------------
  Helper: play small load sound (WebAudio)
-----------------------------*/
function playLoadTone(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    o.connect(g); g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.stop(ctx.currentTime + 0.6);
  }catch(e){/*ignore autoplay blocking*/ }
}

/* ----------------------------
 Matrix rain background
-----------------------------*/
(function matrixRain(){
  const canvas = document.getElementById('matrix');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const cols = Math.floor(w / 14);
  const ypos = Array(cols).fill(0);

  function draw(){
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#00ffb2';
    ctx.font = '12px monospace';
    ypos.forEach((y, idx)=>{
      const text = String.fromCharCode(0x30A0 + Math.random()*96);
      const x = idx * 14;
      ctx.fillText(text, x, y);
      if(y > h + Math.random()*10000) ypos[idx] = 0;
      else ypos[idx] = y + 14;
    });
  }
  window.addEventListener('resize', ()=>{
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });
  setInterval(draw, 50);
})();

/* ----------------------------
  Loader control & play sound
-----------------------------*/
window.addEventListener('load', ()=>{
  // small delay to allow animations
  setTimeout(()=>{
    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';
    playLoadTone();
    // start terminal typing after load
    startTerminal();
  }, 800);
});

/* ----------------------------
  Terminal typing (chosen phrases)
-----------------------------*/
const phrases = [
  "Access Granted...",
  "Injecting UI...",
  "Deploying Front-End...",
  "Hacking Creativity...",
  "Target: Global Clients..."
];

function startTerminal(){
  const t = document.getElementById('termLines') || document.getElementById('termLinesEn');
  if(!t) return;
  let i=0, char=0;
  function typeLine(){
    if(i>=phrases.length) { i=0; setTimeout(()=>{ t.innerHTML=''; }, 2000); return setTimeout(typeLine, 2200); }
    const line = phrases[i];
    if(char < line.length){
      t.innerHTML = (t.innerHTML) + line.charAt(char);
      char++;
      setTimeout(typeLine, 60 + Math.random()*40);
    } else {
      t.innerHTML += '<br/>';
      i++; char=0;
      setTimeout(typeLine, 600);
    }
  }
  typeLine();
}

/* ----------------------------
  Language & Dark Mode
-----------------------------*/
function changeLang(lang){
  if(lang === 'en') window.location.href = 'index-en.html';
  else window.location.href = 'index.html';
}
const modeToggle = document.getElementById('modeToggle');
if(modeToggle){
  modeToggle.addEventListener('click', ()=>{
document.body.classList.toggle('light-mode');
if(document.body.classList.contains('light-mode')) {
  modeToggle.textContent = "🌙";
} else {
  modeToggle.textContent = "☀️";
}
  });
}

/* ----------------------------
  Three.js: Wireframe Hologram (wireframe + glow)
-----------------------------*/
(function holo(){
  const canvas = document.getElementById('holo') || document.getElementById('holoEn');
  if(!canvas) return;
  // renderer
  const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(window.devicePixelRatio);
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0,0,4);

  // lights
  const light1 = new THREE.PointLight(0x00ffd1, 1.2, 10);
  light1.position.set(2,2,2);
  scene.add(light1);
  const light2 = new THREE.AmbientLight(0x00a2ff, 0.4);
  scene.add(light2);

  // geometry (wireframe hologram style)
  const geom = new THREE.TorusKnotGeometry(0.9, 0.25, 150, 20);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x00eaff,
    metalness: 0.2,
    roughness: 0.05,
    emissive: 0x003344,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.95
  });
  const mesh = new THREE.Mesh(geom, mat);
  scene.add(mesh);

  // wireframe overlay (lines)
  const geoLines = new THREE.EdgesGeometry(geom);
  const matLine = new THREE.LineBasicMaterial({color:0x00ffd1, linewidth:1, transparent:true, opacity:0.9});
  const wire = new THREE.LineSegments(geoLines, matLine);
  scene.add(wire);

  // subtle floating
  let start = Date.now();
  function resize(){
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if(canvas.width !== w || canvas.height !== h){
      renderer.setSize(w,h,false);
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
    }
  }

  function animate(){
    resize();
    const t = (Date.now() - start) * 0.001;
    mesh.rotation.x = t * 0.18;
    mesh.rotation.y = t * 0.26;
    wire.rotation.x = mesh.rotation.x;
    wire.rotation.y = mesh.rotation.y;
    // bobbing
    mesh.position.y = Math.sin(t*0.7) * 0.08;
    wire.position.y = mesh.position.y;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  // initial render size
  renderer.setSize(canvas.clientWidth || 420, canvas.clientHeight || 420, false);
  animate();
})();
function sendWhatsApp(e) {
  e.preventDefault();
  const name = document.getElementById("w_name").value;
  const msg = document.getElementById("w_msg").value;

  const text = `الاسم: ${name}%0Aالرسالة: ${msg}`;
  const phone = "201557481699"; // رقمك

  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}

