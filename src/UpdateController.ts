import { LoopController } from "./LoopController";

export class UpdateController {
    loopController: LoopController

    constructor(loopController: LoopController) {
        this.loopController = loopController;
    }

    performUpdate() {
        if (this.loopController.gamecontroller.debugMode) console.log("Performing Update");
    }
}