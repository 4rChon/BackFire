import {ISystem, SystemState} from "./System";

import {WIDTH, HEIGHT, entities} from "../Globals";
import {Vector} from "../Util/Util";

import {Attribute} from "../Attribute/package";
import {EntityGraphics, EntityCollision, EntityPhysics, PlayerAI, PlayerInput, BulletAI, EnemyAI} from "../Component/package";
import {Entity} from "../Entity/package";

class GameSystem implements ISystem {
    public id: string;
    public state: SystemState;

    private score: number = 0;
    private currentScore: number = 0;
    private spawnTimer: number = 0;

    public spawnAmount: number = 0;
    public spawnAmountCost: number = 0;
    public spawnTimerMax: number = 0;
    public spawnTimerCost: number = 0;

    public weaponPowerCost: number = 0;
    public weaponRateCost: number = 0;

    constructor() {
        this.id = 'Game';
        this.state = SystemState.None;
    }

    public init = (): void => {
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
        this.spawnPlayer(new Vector(WIDTH / 2, HEIGHT / 2), new Vector(0, 0), new Vector(10, 10));
    }

    public update = (): void => {
        this.state = SystemState.Update;
        this.updateSpawn();
        this.updateScore();
    }

    public finit = (): void => {
        this.state = SystemState.Finit;
    }

    private updateSpawn = (): void => {
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnTimerMax) {
            for (let i = 0; i < this.spawnAmount; i++) {
                let x: number = Math.floor((Math.random() * WIDTH) + 1);
                let y: number = Math.floor((Math.random() * HEIGHT) + 1);
                this.spawnEnemy(new Vector(x, y), new Vector(0, 0), new Vector(15, 15));
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

    public addScore = (score: number): void => {
        this.score += score * this.spawnAmount;
    }

    public reduceScore = (score: number): void => {
        this.score -= score * this.spawnAmount;
    }

    public getScore = (): number => {
        return this.score;
    }

    public getCurrentScore = (): number => {
        return this.currentScore;
    }

    public upgradePower = (): void => {
        if (this.score < this.weaponPowerCost) {
            console.log("Not enough score");
            return;
        }

        let weapon = entities.getPlayer().attribute['Weapon'];

        this.score -= this.weaponPowerCost;
        this.weaponPowerCost += 25;
        weapon.val['power']++;
    }

    public upgradeCooldown = (): void => {
        let weapon = entities.getPlayer().attribute['Weapon'];

        if (weapon.val['cooldown'] == 1) {
            console.log("Already at minimum cooldown");
            return;
        }

        if (this.score < this.weaponRateCost) {
            console.log("Not enough score");
            return;
        }

        this.score -= this.weaponRateCost;
        this.weaponRateCost += 50;
        weapon.val['cooldown']--;
    }

    public upgradeSpawnRate = (): void => {
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

    public upgradeSpawnAmount = (): void => {
        if (this.score < this.spawnAmountCost) {
            console.log("Not enough score");
            return;
        }

        this.score -= this.spawnAmountCost;
        this.spawnAmountCost *= 2;
        this.spawnAmount++;
    }

    spawnPlayer = (position: Vector, velocity: Vector, dimensions: Vector): void => {
        let playerComponents = [
            new PlayerInput(),
            new PlayerAI(),
            new EntityPhysics(),
            new EntityCollision(),
            new EntityGraphics()            
        ];

        let playerAttributes = [
            new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
            new Attribute("Sprite", { 'color': "black" }),
            new Attribute("Physics", { 'velocity': velocity, 'acceleration': 3, 'drag': 1, 'terminalVelocity': 15 }),
            new Attribute("Collision", { 'collidingWith': 'Nothing' }),
            new Attribute("Game", { 'index': -1, 'type': 'Player', 'active': true }),
            new Attribute("Weapon", { 'cooldown': 10, 'power': 20 })
        ];

        let player = new Entity(playerComponents, playerAttributes);

        entities.addEntity(player);
    }

    spawnEnemy = (position: Vector, velocity: Vector, dimensions: Vector): void => {
        let enemyComponents = [
            new EnemyAI(),
            new EntityPhysics(),
            new EntityCollision(),
            new EntityGraphics()           
        ];

        let enemyAttributes = [
            new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
            new Attribute("Sprite", { 'color': "red" }),
            new Attribute("Physics", { 'velocity': velocity, 'acceleration': 2, 'drag': 1, 'terminalVelocity': 20 }),
            new Attribute("Collision", { 'collidingWith': 'Nothing' }),
            new Attribute("Game", { 'index': -1, 'type': 'Enemy', 'active': true })
        ]

        let enemy = new Entity(enemyComponents, enemyAttributes);

        entities.addEntity(enemy);
    }

    spawnBullet = (position: Vector, velocity: Vector, dimensions: Vector): void => {
        let bulletComponents = [
            new BulletAI(),
            new EntityPhysics(),
            new EntityCollision(),
            new EntityGraphics()                      
        ];

        let bulletAttributes = [
            new Attribute("Transform", { 'position': position, dimensions }),
            new Attribute("Sprite", { 'color': "black" }),
            new Attribute("Physics", { 'velocity': velocity, 'acceleration': 0, 'drag': 1, 'terminalVelocity': 100 }),
            new Attribute("Collision", { 'collidingWith': 'Nothing' }),
            new Attribute("Game", { 'index': -1, 'type': 'Bullet', 'active': true })
        ]

        let bullet = new Entity(bulletComponents, bulletAttributes);

        entities.addEntity(bullet);
    }
}

export {GameSystem};