﻿import {IComponent} from "./Component";

import {systems} from "../Globals";
import {Vector, multiply} from "../Util/Util";

import {IAttribute} from "../Attribute/package";
import {GameSystem, PhysicsSystem} from "../System/package";

class PlayerAI implements IComponent {
    id: string;

    gameSystem: GameSystem;
    physicsSystem: PhysicsSystem;

    private cooldown: number;
    private lastOrientation: Vector;
    private physics: IAttribute;
    private transform: IAttribute;
    private weapon: IAttribute;

    constructor() {
        this.id = "AI";
        this.gameSystem = systems.getSystem("Game") as GameSystem;
        this.physicsSystem = systems.getSystem("Physics") as PhysicsSystem;
        this.cooldown = 0;
        this.lastOrientation = new Vector(1, 0);        
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        this.physics = attribute["Physics"];
        this.transform = attribute["Transform"];
        this.weapon = attribute["Weapon"];
        this.cooldown += this.physicsSystem.updateCount;
        if (this.cooldown >= this.weapon.val["cooldown"]) {
            this.fire();
            this.cooldown = 0;
        }
    }

    fire = (): void => {
        let orientation = new Vector(0, 0);
        orientation.copy(this.physics.val["velocity"]);

        if (orientation.magnitude() === 0) {
            orientation.copy(this.lastOrientation);
        }

        orientation.normalize().multiply(-this.weapon.val["power"]);

        this.lastOrientation.copy(orientation);
        let position = this.transform.val["position"];
        this.gameSystem.spawnBullet(new Vector(position.x, position.y), new Vector(0, 0), orientation, new Vector(5, 5));
    }
}

export {PlayerAI};