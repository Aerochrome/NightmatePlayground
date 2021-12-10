import { EntityController } from "./EntityController";
import { LoopController } from "./LoopController";
import { NetworkController } from "./NetworkController";

export class GameController {
    entityController: EntityController
    loopController: LoopController
    networkController: NetworkController

    debugMode = false;
    
    constructor() {
        console.log("Starting up game ...")
        this.init()
    }

    init() {
        this.entityController = new EntityController(this)
        this.loopController = new LoopController(this)
        this.networkController = new NetworkController(this)
    }
}