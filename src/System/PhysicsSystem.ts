import {ISystem, SystemState} from "./System";

import {entities} from "../Globals";
import {Vector, add, multiply, subtract, sign} from "../Util/Util";

import {IAttribute} from "../Attribute/Attribute";

class PhysicsSystem implements ISystem {
    id: string;
    state: SystemState;
    t: number;
    frameCount: number;
    dt: number;
    currentTime: number;
    updateCount: number;
    fps: number;

    constructor() {
        this.id = "Physics";
        this.state = SystemState.None;        
    }

    init = (): void => {
        this.state = SystemState.Init;
        this.t = 0;
        this.frameCount = 0;
        this.dt = 16;
        this.currentTime = Date.now();
    }

    update = (): void => {
        this.frameCount ++;
        this.state = SystemState.Update;
        let newTime = Date.now();
        let frameTime = newTime - this.currentTime;
        this.currentTime = newTime;        
        this.t += frameTime;
        this.fps = 1000 / frameTime;

        this.updateCount = frameTime / this.dt;
    }

    finit = (): void => {
        this.state = SystemState.Finit;
    }

    calculateDrag = (transform: IAttribute, physics: IAttribute): Vector => {
        let dragCoeff = physics.val["drag"];
        let fluidDensity = 0.002;

        //F_d = 1/2 * p * v^2 * C_d * A
        let drag = (1 / 2) * fluidDensity * dragCoeff * transform.val["dimensions"].x;
        let dragX = drag * Math.pow(physics.val["velocity"].x, 2) * sign(physics.val["velocity"].x);
        let dragY = drag * Math.pow(physics.val["velocity"].y, 2) * sign(physics.val["velocity"].y);
        dragX = Math.abs(dragX) > 0 && Math.abs(dragX) < 0.2 ? 0.2 * sign(dragX) : dragX;
        dragY = Math.abs(dragY) > 0 && Math.abs(dragY) < 0.2 ? 0.2 * sign(dragY) : dragY;
        return new Vector(dragX, dragY);
    }
}

export {PhysicsSystem};