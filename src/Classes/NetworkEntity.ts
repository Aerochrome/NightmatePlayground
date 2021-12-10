import * as THREE from 'three'

export class NetworkEntity {
    socketId: string
    object3d: THREE.Object3D

    constructor(id: string, object3d: THREE.Object3D) {
        this.socketId = id
        this.object3d = object3d
    }

    updateObjectPosition(pos: THREE.Vector3) {
        this.object3d.position.set(pos.x, pos.y, pos.z)
    }

    updateObjectRotation(rot: THREE.Vector3) {
        this.object3d.rotation.setFromVector3(rot)
    }
    
}