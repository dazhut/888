
const THREE = require('three');
const { GLTFLoader } = require('three/addons/loaders/GLTFLoader.js');
const { OrbitControls } = require('three/addons/controls/OrbitControls.js'); // 新增

// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加 OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 启用阻尼效果（更平滑）
controls.dampingFactor = 0.05; // 阻尼系数

// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 加载模型
const loader = new GLTFLoader();
loader.load(
  'assets/shiba.glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // 自动调整相机位置（可选）
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    camera.position.copy(center);
    camera.position.z = size.length() * 1.5; // 调整相机距离
    camera.lookAt(center);
    controls.update(); // 更新控制器
  },
  undefined,
  (error) => console.error('加载模型失败:', error)
);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 每帧更新控制器
  renderer.render(scene, camera);
}
animate();

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});