import {entities, systems} from "./Globals";

import {GraphicsSystem, GameSystem, InputSystem, PhysicsSystem} from "./System/package";

function gameLoop() {
    requestAnimationFrame(gameLoop);
    systems.updateSystems();
    entities.updateEntities();
}

function main() {
    systems.addSystem(new PhysicsSystem());
    systems.addSystem(new InputSystem());
    systems.addSystem(new GameSystem());
    systems.addSystem(new GraphicsSystem());

    gameLoop();
}

main();