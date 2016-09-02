import {ISystem, SystemState} from "./System";

class InputSystem implements ISystem {
    id: string;
    state: SystemState;

    keyCallback: { [keycode: number]: () => void; } = {};
    keyDown: { [keycode: number]: boolean; } = {};

    constructor() {
        this.id = "Input";
        this.state = SystemState.None;
    }

    init = (): void => {
        this.state = SystemState.Init;
        document.addEventListener("keydown", this.keyboardDown);
        document.addEventListener("keyup", this.keyboardUp);
    }

    update = (): void => {
        this.state = SystemState.Update;
        for (let key in this.keyDown) {
            let isDown = this.keyDown[key];
            if (isDown) {
                let callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    callback();
                }
            }
        }
    }

    finit = (): void => {
        this.state = SystemState.Finit;
    }

    keyboardDown = (event: KeyboardEvent): void => {
        event.preventDefault();
        this.keyDown[event.keyCode] = true;
    }

    keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }
}

export {InputSystem};
