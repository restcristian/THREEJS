'use strict';
function main() {
    const canvas = document.querySelector('#my-canvas');
    // Creates a renderer
    const renderer = new THREE.WebGLRenderer({ canvas });
    // Creates a Camera while defining Fustrum
    const fov = 40,
        aspect_ratio = window.innerWidth / window.innerHeight,
        near = 0.1,
        far = 1000,
        camera = new THREE.PerspectiveCamera(fov, aspect_ratio, near, far);
    // Moving the camera two units away from the origin. (0,0,0)
    camera.position.z = 120;

    // Creating a Scene Object
    const scene = new THREE.Scene();

    // Creating a BoxGeometry object
    const boxWidth = 1,
        boxHeight = 1,
        boxDepth = 1,
        geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];

    // Adding light

    const lightColor = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(lightColor, intensity);

    light.position.set(-1, 2, 4);

    scene.add(light);

    renderer.render(scene, camera);

    function render(time) {
        time *= 0.001 //Convert time into seconds

        // Always update aspect ratio
        if(resizeRenderToDisplaySize(renderer)){

            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

        }
       

        cubes.forEach((cube, idx) => {
            const speed = 1 + idx * .1;
            const rotVal = time * speed;
            cube.rotation.x = rotVal;
            cube.rotation.y = rotVal;
        });

        objects.forEach((cube, idx) => {
            const speed = 1 + idx * .1;
            const rotVal = time * speed;
            cube.rotation.x = rotVal;
            cube.rotation.y = rotVal;
        }); 

        

        renderer.render(scene, camera);

        requestAnimationFrame(render);

    }

    function makeInstance(geometry, color, x) {
        // Creating Material (How to draw the object, shiny or flat, color,texture, etc)
        // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });

        // Using MeshPhongMaterial as this one is affected by light.
        const material = new THREE.MeshPhongMaterial({ color });

        // Creating a Mesh : Combination of Geometry, and the Material
        const cube = new THREE.Mesh(geometry, material);

        // Adding cube to the sceneS
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    function resizeRenderToDisplaySize(rendeder){
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio; 
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        const needResize = canvas.width !== width || canvas.height !== height;
        if(needResize){
            rendeder.setSize(width, height, false);
        }
    }

    const objects = [];
    const spread = 15;

    function addObject(x, y, obj){
        obj.position.x = x * spread;
        obj.position.y = y * spread;

        scene.add(obj);
        objects.push(obj);

    }

    function createMaterial(){
        const material = new THREE.MeshPhongMaterial({
            side:THREE.DoubleSide
        });

        const hue = Math.random();
        const saturation = 1;
        const luminance = .5;

        material.color.setHSL(hue, saturation, luminance);

        return material;
    }

    function addSolidGeometry(x, y, geometry){
        const mesh = new THREE.Mesh(geometry, createMaterial());
        addObject(x,y, mesh);
    }

    function exampleGeometry(){
        const width = 3;
        const height = 3;
        const depth = 3;

        addSolidGeometry(0, -1, new THREE.BoxBufferGeometry(width, height, depth));
    }

    function exampleFont(){
        const loader = new THREE.FontLoader();
        loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font)=> {
            const geometry = new THREE.TextBufferGeometry('biotch', {
                font:font,
                size:5.0,
                height:.2,
                curveSegments:12,
                bevelEnabled:true,
                bevelThickness:0.15,
                bevelSize:.3,
                bevelSegments:5
            });
            const mesh = new THREE.Mesh(geometry, createMaterial());
            geometry.computeBoundingBox();
            geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

            const parent = new THREE.Object3D();
            parent.add(mesh);
            addObject(-1,1, parent);
        });
    }

    exampleGeometry();
    exampleFont();


    render();

}

main();

