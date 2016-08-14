var scene;
var camera;
var mesh;
var noise = new Noise(0.5);
var height = 10;
var width = height;
var noiseMatrix = [];


function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 7;
    camera.position.y = -7;
    camera.rotation.x = Math.PI / 4.5;

    mesh = createGeometry();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // some lights...
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    dirLight = new THREE.DirectionalLight(0xffffff, 4);
    dirLight.name = 'Dir. Light';
    dirLight.position.set(7, 0, 4);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;

    dirLight.shadow.mapSize.width = 1024 * 2;
    dirLight.shadow.mapSize.height = 1024 * 2;

    scene.add(dirLight);

    document.body.appendChild(renderer.domElement);

}


function createGeometry() {

    var plane = new THREE.PlaneGeometry(height, width, 100, 100);

    var material = new THREE.MeshPhongMaterial({
        color: 0x333300,
        wireframe: true
    });
    var mesh = new THREE.Mesh(plane, material);

    mesh.geometry.vertices.forEach(function(vert) {
        noiseMatrix.push({
            x: vert.x + height / 2,
            y: vert.y - width / 2
        });
    })

    return mesh;
}


function getZ(vert) {
    var z = 1.5 * ((noise.simplex2(vert.x * 0.1, vert.y * 0.1) + 1) / 2) +
        0.1 * ((noise.simplex2(vert.x * 1, vert.y * 1) + 1) / 2) +
        0.03 * ((noise.simplex2(vert.x * 5, vert.y * 5) + 1) / 2);
    z = Math.pow(z, 2.75);
    return z;
}

function animate() {
    mesh.geometry.vertices.forEach(function(vert, index) {
        vert.z = getZ(noiseMatrix[index]);
    });

    noiseMatrix.forEach(function(vert) {
        vert.y += 0.1;
    });

    mesh.geometry.verticesNeedUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}

window.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowUp') {
        noiseMatrix.forEach(function(vert) {
            vert.y += 0.25;
        });
    }
    if (event.code === 'ArrowDown') {
        noiseMatrix.forEach(function(vert) {
            vert.y -= 0.25;
        });
    }
    if (event.code === 'ArrowRight') {
        noiseMatrix.forEach(function(vert) {
            vert.x += 0.25;
        });
    }
    if (event.code === 'ArrowLeft') {
        noiseMatrix.forEach(function(vert) {
            vert.x -= 0.25;
        });
    }
})

init();
animate()
