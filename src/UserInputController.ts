import { InputState } from "./Interfaces/InputState";
import { LoopController } from "./LoopController";
import { PointerLockControls } from "./PointerLockControls";

export class UserInputController {
    loopController: LoopController
    userInputState: InputState = {
        'left': false,
        'right': false,
        'up': false,
        'down': false
    }
    keyMap: {[key:string]: string} = {
        'KeyD': 'right',
        'KeyA': 'left',
        'KeyW': 'up',
        'KeyS': 'down'
    }

    pointerLockControls: PointerLockControls

    constructor(loopController: LoopController) {
        this.loopController = loopController;
        this.registerEventHandlers();
    }

    registerPointerLockControls() {
        console.log("Initializing pointerlockcontrols")
        this.pointerLockControls = new PointerLockControls(this.loopController.camera, document.body)

        window.addEventListener("click", () => {
            this.pointerLockControls.lock()
        })
    }

    registerEventHandlers() {
        window.addEventListener("keydown", (event: KeyboardEvent) => 
            {this.keyDown(event)}
        , false);

        window.addEventListener("keyup", (event: KeyboardEvent) => 
            {this.keyUp(event)}
        , false);
    }

    keyDown(event: KeyboardEvent) {
        if (event.repeat) return;
        if (this.loopController.gamecontroller.debugMode) console.log("keydown!")

        if (event.code in this.keyMap) {
            this.userInputState[this.keyMap[event.code]] = true
        }
    }

    keyUp(event: KeyboardEvent) {
        if (event.repeat) return;
        if (this.loopController.gamecontroller.debugMode) console.log("keyUp!")

        if (event.code in this.keyMap) {
            this.userInputState[this.keyMap[event.code]] = false
        }
    }
}