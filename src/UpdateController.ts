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
        this.updateNetworkPosition()
    }

    updateCameraPos() {
        if (this.loopController.userInputController.userInputState.up) {
            let direction = new THREE.Vector3()
            this.loopController.camera.getWorldDirection(direction)

            direction.y = 0
            this.loopController.camera.position.add(direction.multiplyScalar(0.04))
        }

        if (this.loopController.userInputController.userInputState.down) {
            let direction = new THREE.Vector3()
            this.loopController.camera.getWorldDirection(direction)

            direction.y = 0
            this.loopController.camera.position.add(direction.multiplyScalar(-0.04))
        }
    }

    updateNetworkPosition() {
        if(!this.isConnected()) {
            return
        }

        let socket = this.loopController.gamecontroller.networkController.io

        let position = new THREE.Vector3()
        let direction = new THREE.Vector3()
        this.loopController.camera.getWorldPosition(position)
        direction = this.loopController.camera.rotation.toVector3()

        socket.emit('localPlayerLocationUpdate', position, direction)
    }

    isConnected() {
        return this.loopController.gamecontroller.networkController?.io !== undefined
    }
}