import {IComponent} from "./Component";

import {entities, systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {GameSystem} from "../System/package";

class EnemyAI implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "AI";
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        let player = entities.getPlayer();
        let playerTransform = player.attribute["Transform"].val;
        let enemyPhysics = attribute["Physics"].val;

        if (playerTransform['position'].x < attribute["Transform"].val['position'].x)
            enemyPhysics['velocity'].x -= enemyPhysics['acceleration'];
        if (playerTransform['position'].x > attribute["Transform"].val['position'].x)
            enemyPhysics['velocity'].x += enemyPhysics['acceleration'];
        if (playerTransform['position'].y < attribute["Transform"].val['position'].y)
            enemyPhysics['velocity'].y -= enemyPhysics['acceleration'];
        if (playerTransform['position'].y > attribute["Transform"].val['position'].y)
            enemyPhysics['velocity'].y += enemyPhysics['acceleration'];

        if (attribute["Collision"].val['collidingWith'] === 'Bullet') {
            (<GameSystem>systems.getSystem("Game")).addScore(5);
            attribute["Game"].val['active'] = false;
        }
        else if (attribute["Collision"].val['collidingWith'] === 'Player') {
            (<GameSystem>systems.getSystem("Game")).reduceScore(20);
            attribute["Game"].val['active'] = false;
        }
    }
}

export {EnemyAI};