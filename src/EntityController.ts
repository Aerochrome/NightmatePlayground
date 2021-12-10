import { NetworkEntity } from "./Classes/NetworkEntity";
import { GameController } from "./GameController";
import * as THREE from 'three'

interface networkEntities {
    [key: string]: NetworkEntity
}

export class EntityController {
    gameController: GameController

    networkEntities: networkEntities = {
    }


    constructor(gc: GameController) {
        this.gameController = gc
    }

    createNetworkEntity(id: string, object3d: THREE.Object3D) {
        this.networkEntities[id] = new NetworkEntity(id, object3d)
    }
}