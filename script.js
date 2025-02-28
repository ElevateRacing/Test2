// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById('canvas-container');
const leftText = document.getElementById('left-text');
const rightText = document.getElementById('right-text');
const topText = document.getElementById('top-text');
const bottomText = document.getElementById('bottom-text');
const logo = document.getElementById('logo');
const wrapper = document.getElementById('wrapper');

renderer.setSize(container.clientWidth, container.clientHeight);
//renderer.setClearColor(0xffffff, 1);
renderer.autoClear = true;
container.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight1.position.set(5, 10, 5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight2.position.set(-5, 5, -5);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight3.position.set(0, -5, 5);
scene.add(directionalLight3);

const pointLight = new THREE.PointLight(0xffffff, 0.3, 50);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Load the Mono.3mf model
const loader = new THREE.ThreeMFLoader();
loader.load(
    'Mono.3mf', // Path to your .3mf file
    function (object) {
        scene.add(object);
        object.position.set(0, 0, 0); // Center the model
        object.scale.set(1, 1, 1);    // Adjust scale if needed
        console.log('Model loaded successfully!');
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred:', error);
    }
);

// Position the camera
camera.position.z = 5;

// Add orbit controls for manipulation
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

function resizeRenderer() {
    const totalWidth = wrapper.clientWidth;
    const leftWidth = leftText ? leftText.offsetWidth : 0;
    const rightWidth = rightText ? rightText.offsetWidth : 0;
    const canvasWidth = totalWidth - leftWidth - rightWidth;

    renderer.setSize(canvasWidth, container.clientHeight);
    camera.aspect = canvasWidth / container.clientHeight;
    camera.updateProjectionMatrix();
}

resizeRenderer();
window.addEventListener('resize', resizeRenderer);

const observer = new MutationObserver(resizeRenderer);
[logo, topText, leftText, rightText, bottomText].forEach(element => {
    if (element) observer.observe(element, { childList: true, subtree: true, characterData: true });
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.clear();
    renderer.render(scene, camera);
}
animate();
