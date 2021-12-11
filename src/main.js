import Cube from './js/Cube.js';

init();

function init() {
    const path = 'images/bridge/';
    const texturePath ='images/textures/studio.jpg';

    new Cube(path, texturePath);
}