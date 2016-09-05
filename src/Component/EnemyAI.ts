import {IComponent} from "./Component";

import {entities, systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {GameSystem} from "../System/package";

class EnemyAI implements IComponent {
    id: string;

    gameSystem: GameSystem;

    constructor() {
        this.id = "AI";
        this.gameSystem = systems.getSystem("Game") as GameSystem;
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let player = entities.getPlayer();
        let playerTransform = player.attribute["Transform"].val;
        let enemyPhysics = attribute["Physics"].val;

        if (playerTransform["position"].x < attribute["Transform"].val["position"].x)
            enemyPhysics["force"].x = -enemyPhysics["power"];
        if (playerTransform["position"].x > attribute["Transform"].val["position"].x)
            enemyPhysics["force"].x = enemyPhysics["power"];
        if (playerTransform["position"].y < attribute["Transform"].val["position"].y)
            enemyPhysics["force"].y = -enemyPhysics["power"];
        if (playerTransform["position"].y > attribute["Transform"].val["position"].y)
            enemyPhysics["force"].y = enemyPhysics["power"];

        
        let collisionList = attribute["Collision"].val["collidingWith"];
        for (let key in collisionList) {
            if (key == attribute["Game"].val["index"])
                continue;
            let type = collisionList[key].attribute["Game"].val["type"];
            ////console.log(type);
            if (type === "Bullet") {
                this.gameSystem.addScore(5);
                attribute["Game"].val["active"] = false;
                return;
            }

            if (type === "Player") {
                this.gameSystem.reduceScore(20);
                attribute["Game"].val["active"] = false;
                return;
            }

            if (type === "Enemy") {
                this.gameSystem.addScore(1);
                attribute["Game"].val["active"] = false;
                return;
            }
        }
    }
}

export {EnemyAI};