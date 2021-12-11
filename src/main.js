import * as THREE from '../node_modules/three';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls';

let scene = null;
let camera = null;
let renderer = null;
let controls = null;

let textureCube, textureBox;
let sphereMesh, sphereMaterial;

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth, window.innerHeight, 1, 100000);
    camera.position.set(0, 0, 1000);

    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add(ambient);

    const loader = new THREE.CubeTextureLoader();
    // loader.setPath('images/textures/');
    loader.setPath('images/bridge/');

    // textureCube = loader.load([ 'left.png', 'right.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ]);
    textureCube = loader.load( [ 'left.jpg', 'right.jpg', 'top.jpg', 'bottom.jpg', 'back.jpg', 'front.jpg' ] );
    textureCube.encoding = THREE.sRGBEncoding;

    const textureLoader = new THREE.TextureLoader();

    textureBox = textureLoader.load('images/textures/studio.jpg');
    textureBox.mapping = THREE.EquirectangularReflectionMapping;
    textureBox.encoding = THREE.sRGBEncoding;

    scene.background = textureCube;

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 2500;

    window.addEventListener( 'resize', onWindowResize );
    onWindowResize();
}

function render() {
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}