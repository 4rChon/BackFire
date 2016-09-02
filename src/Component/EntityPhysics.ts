import {IComponent} from "./Component";

import {systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {PhysicsSystem} from "../System/package";

class EntityPhysics implements IComponent {
    id: string;

    physicsSystem: PhysicsSystem;

    constructor() {
        this.id = "Physics";
        this.physicsSystem = systems.getSystem("Physics") as PhysicsSystem;
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform = attribute["Transform"];
        let physics = attribute["Physics"];

        if (physics.val["velocity"].magnitude() > physics.val["terminalVelocity"]) {
            physics.val["velocity"].setMagnitude(physics.val["terminalVelocity"]);
        }

        transform.val["position"].add(physics.val["velocity"]);

        let magnitude = physics.val["velocity"].magnitude();
        if (magnitude > 0) {
            if (magnitude < physics.val["drag"])
                physics.val["velocity"].zero();
            else
                physics.val["velocity"].setMagnitude(magnitude - physics.val["drag"]);
        }

        let accumulator = this.physicsSystem.accumulator;
        //while (accumulator >= this.dt) {
        //    this.previousPhysicsState = this.currentPhysicsState;
        //    this.integrate(this.currentPhysicsState, this.t, this.dt);
        //    this.t += this.dt;
        //    this.accumulator -= this.dt;
        //}

        //const alpha = this.accumulator / this.dt;

        //let physicsState = new Vector(0, 0);
        //physicsState.copy(this.currentPhysicsState);
        //physicsState.multiply(alpha);
        //physicsState.add(this.previousPhysicsState);
        //physicsState.multiply(1 - alpha);
    }
}

export {EntityPhysics};