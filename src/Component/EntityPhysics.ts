import {IComponent} from "./Component";

import {IAttribute} from "../Attribute/package";

class EntityPhysics implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "Physics";
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform = attribute["Transform"];
        let physics = attribute["Physics"];

        if (physics.val['velocity'].magnitude() > physics.val['terminalVelocity']) {
            physics.val['velocity'].setMagnitude(physics.val['terminalVelocity']);
        }

        transform.val['position'].add(physics.val['velocity']);

        let magnitude = physics.val['velocity'].magnitude();
        if (magnitude > 0) {
            if (magnitude < physics.val['drag'])
                physics.val['velocity'].zero();
            else
                physics.val['velocity'].setMagnitude(magnitude - physics.val['drag']);
        }
    }
}

export {EntityPhysics};