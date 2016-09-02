import {ISystem, SystemState} from "./System";

import {entities} from "../Globals";
import {Vector} from "../Util/Util";

class PhysicsSystem implements ISystem {
    id: string;
    state: SystemState;
    t: number;
    dt: number;
    currentTime: number;
    accumulator: number;
    frameCount: number;

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
        this.dt = 1;
        this.currentTime = Date.now();
        this.accumulator = 0;
        this.frameCount = 0;
    }

    update = (): void => {
        this.state = SystemState.Update;
        this.t += this.dt;
        //let newTime = Date.now();
        //let frameTime = newTime - this.currentTime;

        ////if (frameTime  33)
        ////    frameTime = 33;

        //this.currentTime = newTime;
        //this.frameCount++;
        //this.accumulator += frameTime;
        //console.log(Math.round(1000/frameTime));

        //while (this.accumulator >= this.dt) {
        //    this.accumulator -= this.dt;
        //    let entityList = entities.entity;

        //    //for (let key in entityList) {
        //    //    if (entityList[key].hasComponent("Physics")) {
        //    //        entityList[key].component["Physics"].update(entityList[key].attribute);
        //    //    }
        //    //}
        //}

        //this.previousTransform = attribute["Transform"];
        //this.previousPhysics = attribute["Physics"];
        ////this.physicsSystem.integrate(this.currentPhysicsState, this.t, this.dt);
        //this.physicsSystem.t += this.physicsSystem.dt;
        //this.physicsSystem.accumulator -= this.physicsSystem.dt;

        //const alpha = this.accumulator / this.dt;

        //let physicsState = new Vector(0, 0);
        //physicsState.copy(this.currentPhysicsState);
        //physicsState.multiply(alpha);
        //physicsState.add(this.previousPhysicsState);
        //physicsState.multiply(1 - alpha);
        //}
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