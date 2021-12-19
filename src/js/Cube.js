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
    this.keyStates = {};

    this.cubeIdx = 0;

    this.hold;
    this.changeTimer;

    this.init();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });

    window.addEventListener('mousedown', () => {
      this.onMouseDown();
    })

    window.addEventListener('mouseup', () => {
      this.onMouseUp();
    })

    window.addEventListener('mousewheel', () => {
      this.onMouseWheel();
    })
  }

  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth, window.innerHeight, 1, 100000);
    this.camera.position.set(0, 0, 1000);

    const ambient = new THREE.AmbientLight( 0xffffff );
    this.scene.add(ambient);

    const loader = new THREE.CubeTextureLoader();
    loader.setPath(this.cubePath.bridge);

    this.textureCube = loader.load([ 'left.jpg', 'right.jpg', 'top.jpg', 'bottom.jpg', 'back.jpg', 'front.jpg' ]);
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
    this.controls.maxDistance = 1000;

    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      encoding: THREE.sRGBEncoding
    });

    this.cubeCamera = new THREE.CubeCamera(1, 1000, this.cubeRenderTarget);

    this.sphereMaterial = new THREE.MeshBasicMaterial( {
      envMap: this.cubeRenderTarget.texture,
      combine: THREE.MultiplyOperation,
      reflectivity: 1,
    });

    this.sphererMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(256, 256), this.sphereMaterial);
    this.scene.add(this.sphererMesh);

    this.onWindowResize();
  }

  changeCubeBackground() {
    if(this.cubeIdx < 2) this.cubeIdx += 1;
    else this.cubeIdx = 0;

    const loader = new THREE.CubeTextureLoader();
    const skyboxArr = [];
    const skybox = this.cubePath;
    for(let i in skybox) {
      skyboxArr.push(i);
    }
    loader.setPath(this.cubePath[skyboxArr[this.cubeIdx]]);

    this.textureCube = loader.load([ 'left.jpg', 'right.jpg', 'top.jpg', 'bottom.jpg', 'back.jpg', 'front.jpg' ]);
    this.textureCube.encoding = THREE.sRGBEncoding;
    this.scene.background = this.textureCube;
  }

  render() {
    this.cubeCamera.update(this.renderer, this.scene);
    this.sphereMaterial.envMap = this.cubeRenderTarget.texture;
    this.renderer.render(this.scene, this.camera);

    if(this.hold == undefined || this.hold) {
      requestAnimationFrame(this.render.bind(this));
    }

    if(!this.changeTimer) {
      this.changeTimer = setTimeout(() => {
        this.changeCubeBackground();
        this.changeTimer = null;
      }, 2000)
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  onMouseDown() {
    this.hold = true;
    this.render();
  }

  onMouseUp() {
    this.hold = false;
  }

  onMouseWheel() {
    this.render();
  }
}

export default Cube;