import {ISystem, SystemState} from "./System";

import {WIDTH, HEIGHT, entities} from "../Globals";
import {Vector} from "../Util/Util";

import {Attribute} from "../Attribute/package";
import {EntityGraphics, EntityCollision, EntityPhysics, PlayerAI, PlayerInput, BulletAI, EnemyAI} from "../Component/package";
import {Entity} from "../Entity/package";

class GameSystem implements ISystem {
    id: string;
    state: SystemState;

    private score = 0;
    private currentScore = 0;
    private spawnTimer = 0;

    spawnAmount = 0;
    spawnAmountCost = 0;
    spawnTimerMax = 0;
    spawnTimerCost = 0;

    weaponPowerCost = 0;
    weaponRateCost = 0;

    constructor() {
        this.id = "Game";
        this.state = SystemState.None;
    }

    init = (): void => {
        this.state = SystemState.Init;
        this.score = 0;
        this.currentScore = 0;

        this.spawnAmountCost = 100;
        this.spawnTimerCost = 100;
        this.weaponPowerCost = 100;
        this.weaponRateCost = 100;

        this.spawnTimer = 0;
        this.spawnAmount = 1;
        this.spawnTimerMax = 25;
        this.spawnPlayer(new Vector(WIDTH / 2, HEIGHT / 2), new Vector(0, 0), new Vector(0, 0), new Vector(10, 10));
    }

    update = (): void => {
        this.state = SystemState.Update;
        this.updateSpawn();
        this.updateScore();
    }

    finit = (): void => {
        this.state = SystemState.Finit;
    }

    private updateSpawn = (): void => {
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnTimerMax) {
            for (let i = 0; i < this.spawnAmount; i++) {
                let x = Math.floor((Math.random() * WIDTH) + 1);
                let y = Math.floor((Math.random() * HEIGHT) + 1);
                this.spawnEnemy(new Vector(x, y), new Vector(0, 0), new Vector(0, 0), new Vector(15, 15));
                this.spawnTimer = 0;
            }
        }
    }

    private updateScore = (): void => {
        if (this.currentScore < this.score)
            this.currentScore++;
        else if (this.currentScore > this.score)
            this.currentScore--;
    }

    addScore = (score: number): void => {
        this.score += score * this.spawnAmount;
    }

    reduceScore = (score: number): void => {
        this.score -= score * this.spawnAmount;
    }

    getScore = (): number => {
        return this.score;
    }

    getCurrentScore = (): number => {
        return this.currentScore;
    }

    upgradePower = (): void => {
        if (this.score < this.weaponPowerCost) {
            console.log("Not enough score");
            return;
        }

        let weapon = entities.getPlayer().attribute["Weapon"];

        this.score -= this.weaponPowerCost;
        this.weaponPowerCost += 25;
        weapon.val["power"]++;
    }

    upgradeCooldown = (): void => {
        let weapon = entities.getPlayer().attribute["Weapon"];

        if (weapon.val["cooldown"] === 1) {
            console.log("Already at minimum cooldown");
            return;
        }

        if (this.score < this.weaponRateCost) {
            console.log("Not enough score");
            return;
        }

        this.score -= this.weaponRateCost;
        this.weaponRateCost += 50;
        weapon.val["cooldown"]--;
    }

    upgradeSpawnRate = (): void => {
        if (this.score < this.spawnTimerCost) {
            console.log("Not enough score");
            return;
        }

        this.score -= this.spawnTimerCost;
        this.spawnTimerCost += 75;
        if (this.spawnTimerMax > 0) {
            this.spawnTimerMax--;
        }
    }

    upgradeSpawnAmount = (): void => {
        if (this.score < this.spawnAmountCost) {
            console.log("Not enough score");
            return;
        }

        this.score -= this.spawnAmountCost;
        this.spawnAmountCost *= 2;
        this.spawnAmount++;
    }

    spawnPlayer = (position: Vector, velocity: Vector, force: Vector, dimensions: Vector): void => {
        let playerComponents = [
            new EntityPhysics(),
            new PlayerInput(),
            new PlayerAI(),
            new EntityCollision(),
            new EntityGraphics()            
        ];

        let playerAttributes = [
            new Attribute("Game", { "index": -1, "type": "Player", "active": true }),
            new Attribute("Transform", { "position": position, "dimensions": dimensions }),
            new Attribute("Sprite", { "color": "black" }),
            new Attribute("Physics", { "mass": 10, "velocity": velocity, "force": force, "power": 8, "acceleration": 0, "drag": 1}),
            new Attribute("Collision", { "collidingWith": {} }),            
            new Attribute("Weapon", { "cooldown": 5, "power": 20 })
        ];

        let player = new Entity(playerComponents, playerAttributes);

        entities.addEntity(player);
    }

    spawnEnemy = (position: Vector, velocity: Vector, force: Vector, dimensions: Vector): void => {
        let enemyComponents = [
            new EntityPhysics(),
            new EnemyAI(),            
            new EntityCollision(),
            new EntityGraphics()           
        ];

        let enemyAttributes = [
            new Attribute("Game", { "index": -1, "type": "Enemy", "active": true }),
            new Attribute("Transform", { "position": position, "dimensions": dimensions }),
            new Attribute("Sprite", { "color": "red" }),
            new Attribute("Physics", { "mass": 10, "velocity": velocity, "force": force, "power": 4, "acceleration": 0, "drag": 1}),
            new Attribute("Collision", { "collidingWith": {} })
        ]

        let enemy = new Entity(enemyComponents, enemyAttributes);

        entities.addEntity(enemy);
    }

    spawnBullet = (position: Vector, velocity: Vector, force: Vector, dimensions: Vector): void => {
        let bulletComponents = [
            new EntityPhysics(),
            new BulletAI(),            
            new EntityCollision(),
            new EntityGraphics()                      
        ];

        let bulletAttributes = [
            new Attribute("Game", { "index": -1, "type": "Bullet", "active": true }),
            new Attribute("Transform", { "position": position, dimensions }),
            new Attribute("Sprite", { "color": "black" }),
            new Attribute("Physics", { "mass": 2, "velocity": velocity, "force": force, "power": 0, "acceleration": 0, "drag": 5 }),
            new Attribute("Collision", { "collidingWith": {} })
        ]

        let bullet = new Entity(bulletComponents, bulletAttributes);

        entities.addEntity(bullet);
    }
}

export {GameSystem};