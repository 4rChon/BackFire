import {ISystem, GraphicsSystem, SystemState} from "./package";
import {systems} from "../Globals";

class InputSystem implements ISystem {
    id: string;
    state: SystemState;

    private graphicsSystem: GraphicsSystem;

    keyCallback: { [keycode: number]: () => void; } = {};
    keyDown: { [keycode: number]: boolean; } = {};
    mouse: {x: number, y: number};

    constructor() {
        this.id = "Input";
        this.state = SystemState.None;
    }

    init = (): void => {
        this.state = SystemState.Init;
        document.addEventListener("keydown", this.keyboardDown);
        document.addEventListener("keyup", this.keyboardUp);
        document.addEventListener("mousedown", this.mouseDown, false);
        document.addEventListener("mouseup", this.mouseUp, false);

        this.graphicsSystem = systems.getSystem("Graphics") as GraphicsSystem;
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

    mouseDown = (event: MouseEvent): void => {
        this.mouse.x = event.x - this.graphicsSystem.canvasContext.canvas.offsetLeft;
        this.mouse.y = event.y - this.graphicsSystem.canvasContext.canvas.offsetTop;
    }

    mouseUp = (event: MouseEvent): void => {
    }

    addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }
}

export {InputSystem};
