import { LoopController } from "./LoopController";
import * as THREE from 'three'

export class UpdateController {
    loopController: LoopController

    constructor(loopController: LoopController) {
        this.loopController = loopController;
    }

    performUpdate() {
        if (this.loopController.gamecontroller.debugMode) console.log("Performing Update");

        this.updateCameraPos()
    }

    updateCameraPos() {
        if (this.loopController.userInputController.userInputState.up) {
            let direction = new THREE.Vector3()
            this.loopController.camera.getWorldDirection(direction)

            direction.y = 0
            console.log(direction)
            this.loopController.camera.position.add(direction.multiplyScalar(0.04))
        }

        if (this.loopController.userInputController.userInputState.down) {
            let direction = new THREE.Vector3()
            this.loopController.camera.getWorldDirection(direction)

            direction.y = 0
            console.log(direction)
            this.loopController.camera.position.add(direction.multiplyScalar(-0.04))
        }
    }
}