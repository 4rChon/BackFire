import {IComponent} from "./Component";

import {systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {PhysicsSystem} from "../System/package";
import {Vector, add, multiply, subtract} from "../Util/Util";

class EntityPhysics implements IComponent {
    id: string;

    physicsSystem: PhysicsSystem;

    constructor() {
        this.id = "Physics";
        this.physicsSystem = systems.getSystem("Physics") as PhysicsSystem;
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let currentTransform = attribute["Transform"];
        let currentPhysics = attribute["Physics"];

        // a = F/m
        currentPhysics.val["acceleration"] = multiply(currentPhysics.val["force"], 1 / currentPhysics.val["mass"]);

        let drag = this.physicsSystem.calculateDrag(currentTransform, currentPhysics);            
        currentPhysics.val["acceleration"].x -= drag.x;
        currentPhysics.val["acceleration"].y -= drag.y;

        // v += a
        currentPhysics.val["velocity"].add(currentPhysics.val["acceleration"]);

        currentTransform.val["position"].add(multiply(currentPhysics.val["velocity"], this.physicsSystem.updateCount));

        currentPhysics.val["force"].zero();
    }
}

export {EntityPhysics};