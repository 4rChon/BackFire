import {ISystem, SystemState} from "./System";

import {Vector} from "../Util/Util";

class PhysicsSystem implements ISystem {
    id: string;
    state: SystemState;
    t: number;
    dt: number;
    currentTime: number;
    accumulator: number;

    previousPhysicsState: Vector;
    currentPhysicsState: Vector;

    constructor() {
        this.id = "Physics";
        this.state = SystemState.None;        
    }

    init = (): void => {
        this.state = SystemState.Init;
        this.previousPhysicsState = new Vector(0, 0);
        this.currentPhysicsState = new Vector(0, 0);
        this.t = 0;
        this.dt = 0.01;
        this.currentTime = Date.now();
        this.accumulator = 0;
    }

    update = (): void => {
        this.state = SystemState.Update;
        let newTime = Date.now();
        let frameTime = newTime - this.currentTime;
        if (frameTime > 0.25)
            frameTime = 0.25;
        this.currentTime = newTime;

        this.accumulator += frameTime;
    }

    finit = (): void => {
        this.state = SystemState.Finit;
    }

    private acceleration(physicsState: Vector, t: number) {
        let k = 10;
        let b = 1;
        return -k * physicsState.x - b * physicsState.y;
    }

    private evaluate = (initialPhysicsState: Vector, t: number, dt: number, d: Vector): Vector => {
        let physicsState = new Vector(0, 0);
        physicsState.x = initialPhysicsState.x + d.x * dt;
        physicsState.y = initialPhysicsState.y + d.y * dt;

        let output = new Vector(0, 0);
        output.x = physicsState.y;
        output.y = this.acceleration(physicsState, t + dt);
        return output;
    }

    private integrate = (physicsState: Vector, t: number, dt: number): void => {
        let a = this.evaluate(physicsState, t, 0, new Vector(0, 0));
        let b = this.evaluate(physicsState, t, dt * 0.5, a);
        let c = this.evaluate(physicsState, t, dt * 0.5, b);
        let d = this.evaluate(physicsState, t, dt, c);

        let dxdt = 1 / 6 * (a.x + 2 * (b.x + c.x) + d.x);
        let dvdt = 1 / 6 * (a.y + 2 * (b.y + c.y) + d.y);

        physicsState.x = physicsState.x + dxdt * dt;
        physicsState.y = physicsState.y + dvdt * dt;
    }
}

export {PhysicsSystem};