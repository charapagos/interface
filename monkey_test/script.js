"use strict";

// simplified on three.js/examples/webgl_loader_collada_skinning.html
function main() {
    // renderer
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(800, 600);
    document.body.appendChild(renderer.domElement);

    // camera
    const camera = new THREE.PerspectiveCamera(30, 800 / 600, 1, 10000);
    const len = 10.0;
    camera.position.set(0, 0, len);
    camera.up.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // scene and lights
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xcccccc));
    
    // load collada model and texture
    // data from three.js/examples/models/collada/
    // NOTE: texture file names are embeded in dae XML
    const objs = {};
    const loader = new THREE.ColladaLoader();
    loader.load("./monkey_test.dae", collada => {
        const obj = {collada};
        collada.scene.traverse(child => {
            if (!(child instanceof THREE.SkinnedMesh)) return;
            if (child.geometry.animation) obj.animation = new THREE.Animation(
                child, child.geometry.animation);
        });
        objs.monkey = obj;
        collada.scene.position.set(0, 0, 0);
        scene.add(collada.scene);
        if (obj.animation) obj.animation.play();
    });
    
    // animation rendering
    const clock = new THREE.Clock();
    (function animate() {
        THREE.AnimationHandler.update(clock.getDelta());
        const timer = Date.now() * 0.001;
        camera.position.set(Math.sin(timer) * len, 0, Math.cos(timer) * len);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    })();
    return objs;
}
const objs = main();

