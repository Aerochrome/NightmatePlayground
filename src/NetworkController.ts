import { GameController } from "./GameController";
import {io, Socket} from 'socket.io-client'

export class NetworkController {
    gameController: GameController
    io: Socket
    readonly serverUrl: string = 'ws://localhost:3001'

    constructor(gc: GameController) {
        this.gameController = gc

        this.initConnection()
        this.registerEventHandlers()
    }

    initConnection() {
        this.io = io(this.serverUrl)

        this.io.on('connect', () => {
            console.log('connected!')
        })
    }

    registerEventHandlers() {
        this.io.on('playerConnect', (name) => {
            console.log("New player just connected!", name)
            this.spawnPlayer(name)
        })

        this.io.on('playerDisconnect', (id) => {
            let entity = this.gameController.entityController.networkEntities[id]

            if (entity !== undefined) {
                this.gameController.loopController.scene.remove(entity.object3d)
                delete this.gameController.entityController.networkEntities[id]
            }
        })

        this.io.on('playerLocationUpdate', (id: string, pos, dir) => {
            console.log(this.gameController.entityController.networkEntities)
            console.log(id)
            let entity = this.gameController.entityController.networkEntities[id]

            if (entity === undefined) {
                this.spawnPlayer(id)
                entity = this.gameController.entityController.networkEntities[id]
            }
            entity.updateObjectPosition(pos)
            entity.updateObjectRotation(dir)
        })
    }

    spawnPlayer(id: string) {
        let object3d = this.gameController.loopController.createPlayerObject3d()
        this.gameController.entityController.createNetworkEntity(id, object3d)
    }
}