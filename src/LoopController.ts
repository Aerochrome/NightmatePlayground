import { GameController } from './GameController'
import { UpdateController } from './UpdateController';
import { UserInputController } from './UserInputController';
import * as THREE from 'three'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export class LoopController {

    readonly MS_PER_UPDATE: number = 33.33; // 30 FPS

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

    constructor(gamecontroller: GameController) {
        this.gamecontroller = gamecontroller
        this.updateController = new UpdateController(this);
        this.userInputController = new UserInputController(this);
  
        this.initThree()
        this.initGameLoop()
    }

    initThree() {
        //this.canvasElement = <HTMLCanvasElement> document.getElementById('maingame')
        //this.canvasContext = this.canvasElement.getContext('2d')

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
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

        this.render(timestamp)

        window.requestAnimationFrame((timestamp: number) => this.gameLoop(timestamp))
    }

    update() {
        if (this.gamecontroller.debugMode) console.log("I should run on 30 fps");
        this.updateController.performUpdate();
    }

    render(delta: number) {
        if (this.gamecontroller.debugMode) console.log("rendering")

        this.renderer.render(this.scene, this.camera)
    }
}
