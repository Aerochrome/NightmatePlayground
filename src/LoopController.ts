import { GameController } from './GameController'
import { UpdateController } from './UpdateController';
import { UserInputController } from './UserInputController';
import * as THREE from 'three'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GLTFLoader } from './GLTFLoader';

export class LoopController {

    readonly MS_PER_UPDATE: number = 16.66; // 30 FPS

    gamecontroller: GameController
    updateController: UpdateController
    userInputController: UserInputController

    // Three
    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera

    oldTimestamp: number
    elapsed: number
    lag: number = 0.0

    clock: THREE.Clock
    mixer: THREE.AnimationMixer

    constructor(gamecontroller: GameController) {
        this.gamecontroller = gamecontroller
        this.updateController = new UpdateController(this);
        this.userInputController = new UserInputController(this);
  
        this.initThree()
        this.createFloor()
        this.createLight()
        //this.createCube()
        this.loadChristmasTree()
        this.initGameLoop()

        this.userInputController.registerPointerLockControls()
    }

    initThree() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

        this.camera.rotation.set(0, Math.PI, 0)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.clock = new THREE.Clock();
        document.body.appendChild(this.renderer.domElement);
    }

    createLight() {
        let light = new THREE.PointLight( 0xffffff, 2, 100 );
        light.position.set( 0, 2, 0 );
        light.castShadow = true; // default false
        this.scene.add(light)

        let lHelper = new THREE.PointLightHelper(light)
        this.scene.add(lHelper)

        let ambient = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambient)

        // let dirLight = new THREE.DirectionalLight(0xffffff, 1)
        // dirLight.position.set( -1, 0.75, 1 );
        // dirLight.position.multiplyScalar( 50);
        // dirLight.name = "dirlight";
        // // dirLight.shadowCameraVisible = true;

        // this.scene.add( dirLight );

        // dirLight.castShadow = true;
        // dirLight.shadow.map.width = dirLight.shadow.map.height = 1024*2;

        // var d = 300;

        // dirLight.shadow.camera.left = -d;
        // dirLight.shadow.camera.right = d;
        // dirLight.shadow.camera.top = d;
        // dirLight.shadow.camera.bottom = -d;

        // dirLight.shadow.camera.far = 3500;
        // dirLight.shadow.bias = -0.0001;
    }

    createFloor() {
        let floorMaterial = new THREE.MeshPhongMaterial({ color:  0x969393})
        let floorGeometry = new THREE.PlaneGeometry(1000, 1000)
        let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)

        floorMesh.rotation.x = -Math.PI / 2.0;
        floorMesh.position.y = -3;
        floorMesh.receiveShadow = true
        floorMesh.matrixAutoUpdate = false;
        floorMesh.updateMatrix();

        this.scene.add(floorMesh)
    }

    createCube() {
        let cubeMaterial = new THREE.MeshPhongMaterial({color: 0xffae00})
        let cubeGeo = new THREE.BoxGeometry()
        let cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial)
        cubeMesh.position.z = 1
        this.scene.add(cubeMesh)
    }

    loadChristmasTree() {
        const loader = new GLTFLoader();

        let scene = this.scene
        let that = this

        loader.load('/models/merry_christmas/scene.gltf', function (gltf:any) {
            gltf.scene.scale.set(0.005, 0.005, 0.005)
            gltf.scene.position.y = -1
            gltf.scene.position.z = 3
            gltf.scene.rotation.set(0, Math.PI, 0)

            that.mixer = new THREE.AnimationMixer(gltf.scene)
            /*gltf.animations.forEach( ( clip:any ) => {
                that.mixer.clipAction( clip ).play()
            } );*/

            that.mixer.clipAction(gltf.animations[0]).play()
            
            scene.add( gltf.scene );
        
        }, undefined, function ( error:any ) {
        
            console.error( error );
        
        } );
    }

    createPlayerObject3d() {
        let cubeMaterial = new THREE.MeshPhongMaterial({color: 0xffae00})
        let cubeMaterialFront = new THREE.MeshPhongMaterial({color: 0x62cc3f})

        let cubeGeo = new THREE.BoxGeometry(0.1, 0.2, 0.1)
        let cubeMesh = new THREE.Mesh(cubeGeo, [
            cubeMaterial,
            cubeMaterial,
            cubeMaterial,
            cubeMaterial,
            cubeMaterial,
            cubeMaterialFront
        ])

        this.scene.add(cubeMesh)

        return cubeMesh
    }

    initGameLoop() {
        window.requestAnimationFrame((timestamp: number) => this.gameLoop(timestamp))
    }

    // https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-smooth-canvas-animation
    gameLoop(timestamp: number) {
        this.elapsed = (timestamp - this.oldTimestamp)
        this.oldTimestamp = timestamp;

        if (!isNaN(this.elapsed)) {
            this.lag += this.elapsed
        }

        while (this.lag >= this.MS_PER_UPDATE) {
            this.update()
            this.lag -= this.MS_PER_UPDATE
        }

        let delta = this.clock.getDelta()
        if (this.mixer) this.mixer.update(delta)

        this.render()

        window.requestAnimationFrame((timestamp: number) => this.gameLoop(timestamp))
    }

    update() {
        if (this.gamecontroller.debugMode) console.log("I should run on 30 fps");
        this.updateController.performUpdate();
    }

    render() {
        if (this.gamecontroller.debugMode) console.log("rendering")

        // Here a cube could be rendered.

        this.renderer.render(this.scene, this.camera)
    }
}
