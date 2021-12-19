import Cube from './js/Cube.js';

init();

function init() {
    const path = {
        bridge: 'images/bridge/',
        milkyway: 'images/milkyway/',
        sun: 'images/sun/'
    }
    const texturePath ='images/textures/studio.jpg';

    new Cube(path, texturePath);
}