import * as THREE from '../../node_modules/three';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls';

class Cube {
  constructor(cubePath, texturePath) {
    this.cubePath = cubePath;
    this.texturePath = texturePath;
    this.textureCube = null;
    this.textureBox = null;
    this.sphereMesh = null;
    this.sphereMaterial = null;

    this.init();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });
  }

  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth, window.innerHeight, 1, 100000);
    this.camera.position.set(0, 0, 1000);

    const ambient = new THREE.AmbientLight( 0xffffff );
    this.scene.add(ambient);

    const loader = new THREE.CubeTextureLoader();
    // loader.setPath('images/textures/');
    loader.setPath(this.cubePath);

    // textureCube = loader.load([ 'left.png', 'right.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ]);
    this.textureCube = loader.load( [ 'left.jpg', 'right.jpg', 'top.jpg', 'bottom.jpg', 'back.jpg', 'front.jpg' ] );
    this.textureCube.encoding = THREE.sRGBEncoding;

    const textureLoader = new THREE.TextureLoader();

    this.textureBox = textureLoader.load(this.texturePath);
    this.textureBox.mapping = THREE.EquirectangularReflectionMapping;
    this.textureBox.encoding = THREE.sRGBEncoding;

    this.scene.background = this.textureCube;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 500;
    this.controls.maxDistance = 2500;

    this.onWindowResize();
  }

  render() {
    const scene = this.scene;
    const camera = this.camera;
    const renderer = this.renderer;

    function frame() {
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Cube;