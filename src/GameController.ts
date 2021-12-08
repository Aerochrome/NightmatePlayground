import { LoopController } from "./LoopController";

export class GameController {
    loopController: LoopController

    debugMode = false;
    
    constructor() {
        console.log("Starting up game ...")
        this.init()
    }

    init() {
        this.loopController = new LoopController(this)
    }
}