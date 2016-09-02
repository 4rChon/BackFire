import {IComponent} from "./Component";

import {systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {PhysicsSystem} from "../System/package";
import {Vector} from "../Util/Util";

class EntityPhysics implements IComponent {
    id: string;

    previousTransform: IAttribute;
    previousPhysics: IAttribute;

    physicsSystem: PhysicsSystem;

    constructor() {
        this.id = "Physics";
        this.physicsSystem = systems.getSystem("Physics") as PhysicsSystem;
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform = attribute["Transform"];
        let physics = attribute["Physics"];

        //if (physics.val["velocity"].magnitude() > physics.val["terminalVelocity"]) {
        //    physics.val["velocity"].setMagnitude(physics.val["terminalVelocity"]);
        //}

        transform.val["position"].add(physics.val["velocity"].getMultiply(this.physicsSystem.dt));
        physics.val["velocity"]
            .add(physics.val["force"]
            .getMultiply(physics.val["mass"])
            .getMultiply(this.physicsSystem.dt));

        //let magnitude = physics.val["velocity"].magnitude();
        //if (magnitude > 0) {
        //    if (magnitude < physics.val["drag"])
        //        physics.val["velocity"].zero();
        //    else
        //        physics.val["velocity"].setMagnitude(magnitude - (physics.val["drag"]));
        //}

        //let accumulator = this.physicsSystem.accumulator;
        //while (accumulator >= this.physicsSystem.dt) {
        //    this.previousTransform = attribute["Transform"];
        //    this.previousPhysics = attribute["Physics"];
        //    //this.physicsSystem.integrate(this.currentPhysicsState, this.t, this.dt);
        //    this.physicsSystem.t += this.physicsSystem.dt;
        //    this.physicsSystem.accumulator -= this.physicsSystem.dt;

        //    //const alpha = this.accumulator / this.dt;

        //    //let physicsState = new Vector(0, 0);
        //    //physicsState.copy(this.currentPhysicsState);
        //    //physicsState.multiply(alpha);
        //    //physicsState.add(this.previousPhysicsState);
        //    //physicsState.multiply(1 - alpha);
        //}
    }
}

export {EntityPhysics};