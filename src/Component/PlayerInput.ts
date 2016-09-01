import {IComponent} from "./Component";

import {systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {GameSystem, InputSystem} from "../System/package";

class PlayerInput implements IComponent {
    public id: string = "";

    private physics: IAttribute;
    private transform: IAttribute;

    constructor() {
        this.id = "Input";

        let inputSystem = <InputSystem>systems.getSystem("Input");
        let gameSystem = <GameSystem>systems.getSystem("Game");

        inputSystem.addKeycodeCallback(65, this.left);
        inputSystem.addKeycodeCallback(87, this.up);
        inputSystem.addKeycodeCallback(83, this.down);
        inputSystem.addKeycodeCallback(68, this.right);
        inputSystem.addKeycodeCallback(89, gameSystem.upgradeCooldown);
        inputSystem.addKeycodeCallback(85, gameSystem.upgradePower);
        inputSystem.addKeycodeCallback(73, gameSystem.upgradeSpawnRate);
        inputSystem.addKeycodeCallback(79, gameSystem.upgradeSpawnAmount);
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        this.physics = attribute["Physics"];
        this.transform = attribute["Transform"];
    }

    public left = (): void => {
        if (this.physics.val['velocity'].x > 0)
            this.physics.val['velocity'].x = 0;
        this.physics.val['velocity'].x -= this.physics.val['acceleration'];
    }

    public up = (): void => {
        if (this.physics.val['velocity'].y > 0)
            this.physics.val['velocity'].y = 0;
        this.physics.val['velocity'].y -= this.physics.val['acceleration'];
    }

    public down = (): void => {
        if (this.physics.val['velocity'].y < 0)
            this.physics.val['velocity'].y = 0;
        this.physics.val['velocity'].y += this.physics.val['acceleration'];
    }

    public right = (): void => {
        if (this.physics.val['velocity'].x < 0)
            this.physics.val['velocity'].x = 0;
        this.physics.val['velocity'].x += this.physics.val['acceleration'];
    }
}

export {PlayerInput};