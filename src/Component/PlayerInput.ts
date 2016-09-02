import {IComponent} from "./Component";

import {systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {GameSystem, InputSystem} from "../System/package";

class PlayerInput implements IComponent {
    id: string;

    private physics: IAttribute;
    private transform: IAttribute;
    private gameSystem: GameSystem;
    private inputSystem: InputSystem;

    constructor() {
        this.id = "Input";

        this.inputSystem = systems.getSystem("Input") as InputSystem;
        this.gameSystem = systems.getSystem("Game") as GameSystem;

        this.inputSystem.addKeycodeCallback(65, this.left);
        this.inputSystem.addKeycodeCallback(87, this.up);
        this.inputSystem.addKeycodeCallback(83, this.down);
        this.inputSystem.addKeycodeCallback(68, this.right);
        this.inputSystem.addKeycodeCallback(89, this.gameSystem.upgradeCooldown);
        this.inputSystem.addKeycodeCallback(85, this.gameSystem.upgradePower);
        this.inputSystem.addKeycodeCallback(73, this.gameSystem.upgradeSpawnRate);
        this.inputSystem.addKeycodeCallback(79, this.gameSystem.upgradeSpawnAmount);
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        this.physics = attribute["Physics"];
        this.transform = attribute["Transform"];
    }

    left = (): void => {
        if (this.physics.val["velocity"].x > 0)
            this.physics.val["velocity"].x = 0;
        this.physics.val["velocity"].x -= this.physics.val["acceleration"];
    }

    up = (): void => {
        if (this.physics.val["velocity"].y > 0)
            this.physics.val["velocity"].y = 0;
        this.physics.val["velocity"].y -= this.physics.val["acceleration"];
    }

    down = (): void => {
        if (this.physics.val["velocity"].y < 0)
            this.physics.val["velocity"].y = 0;
        this.physics.val["velocity"].y += this.physics.val["acceleration"];
    }

    right = (): void => {
        if (this.physics.val["velocity"].x < 0)
            this.physics.val["velocity"].x = 0;
        this.physics.val["velocity"].x += this.physics.val["acceleration"];
    }
}

export {PlayerInput};