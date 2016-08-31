const WIDTH = 1024;
const HEIGHT = 1024;

enum SystemState {
    None,
    Init,
    Update,
    Finit
}

class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public magnitude = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public setMagnitude = (magnitude: number): void => {
        let angle = this.getAngle();
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    }

    public magSq = (): number => {
        return this.x * this.x + this.y * this.y;
    }

    public normalize = (): Vector => {
        let len: number = this.magnitude();
        this.x /= len;
        this.y /= len;
        return this;
    }

    public zero = (): void => {
        this.x = 0;
        this.y = 0;
    }

    public copy = (v: Vector): void => {
        this.x = v.x;
        this.y = v.y;
    }

    public rotate = (radians: number): void => {
        let cos: number = Math.cos(radians);
        let sin: number = Math.sin(radians);
        let x: number = (cos * this.x) + (sin * this.y);
        let y: number = (cos * this.y) - (sin * this.x);
        this.x = x;
        this.y = y;
    }

    public getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    }

    public multiply = (value: number): void => {
        this.x *= value;
        this.y *= value;
    }

    public add = (v: Vector): void => {
        this.x += v.x;
        this.y += v.y;
    }

    public subtract = (v: Vector): void => {
        this.x -= v.x;
        this.y -= v.y;
    }
}

function sign(x: number) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

class SystemContext {
    private system: { [name: string]: ISystem };

    constructor() {
        this.system = {};
    }

    public addSystem = (system: ISystem): void => {        
        this.system[system.id] = system;
        console.log("Register System: " + system.id);
    }

    public getSystem = (name: string): ISystem => {
        return this.system[name];
    }

    public removeSystem = (name: string): void => {
        this.system[name].finit();
        delete this.system[name];
    }    

    public updateSystems = (): void => {
        for (let key in this.system) {
            if (this.system[key].state == SystemState.None)
                this.system[key].init();
            this.system[key].update();
        }
    }
}

class EntityContext {
    public entity: { [index: string]: IEntity };
    private index: number;    
    private player: IEntity;

    constructor() {
        this.entity = {};
        this.index = 0;
    }    

    public addEntity = (entity: IEntity): void => {        
        this.entity[this.index] = (entity);
        entity.init(this.index++);
        if(entity.attribute["Game"].val["type"] === "Player")
            this.player = entity;
    }

    public getEntity = (index: number): IEntity => {
        return this.entity[index];
    }

    public getPlayer = (): IEntity => {
        return this.player;
    }

    public removeEntity = (index: number): void => {        
        delete this.entity[index];
    }

    public updateEntities = (): void => {
        for (let key in this.entity) {
            this.entity[key].update();
        }
    }
}

interface ISystem {
    id: string;
    state: SystemState;
    
    init(): void;
    update(): void;
    finit(): void;
}

class GraphicsSystem implements ISystem {    
    public id: string = "";
    public state: SystemState;
    public canvasContext: CanvasRenderingContext2D;

    constructor() {
        this.id = "Graphics";
        this.state = SystemState.None;
    }

    public init = (): void => {
        this.state = SystemState.Init;
        let canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;        
        document.getElementById("canvasContainer").appendChild(canvas);
        this.canvasContext = canvas.getContext("2d");
    }

    public update = (): void => {
        this.state = SystemState.Update;
        this.clear();
        this.renderScore();
        this.renderCooldown();
        this.renderPower();
        this.renderSpawnRate();
        this.renderSpawnAmount();
    }

    public finit = (): void => {
        this.state = SystemState.Finit;
    }

    private clear = (): void => {
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
    }

    private renderScore = (): void => {
        this.canvasContext.fillStyle = "#eee";
        this.canvasContext.font = "400px Arial";
        this.canvasContext.textAlign = "center";
        this.canvasContext.fillText("" + (<GameSystem>systems.getSystem('Game')).getCurrentScore(), WIDTH / 2, HEIGHT / 2);
    }

    private renderCooldown = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("y", 50, 50);
        this.canvasContext.fillText("+", 70, 50);
        this.canvasContext.fillText("-" + entities.getPlayer().attribute['Weapon'].val['cooldown'], 90, 50);
        this.canvasContext.fillText("(" + (<GameSystem>systems.getSystem('Game')).weaponRateCost + ')', 130, 50);
    }

    private renderPower = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("u", 50, 100);
        this.canvasContext.fillText("+", 70, 100);
        this.canvasContext.fillText("*" + entities.getPlayer().attribute['Weapon'].val['power'], 90, 100);
        this.canvasContext.fillText("(" + (<GameSystem>systems.getSystem('Game')).weaponPowerCost + ')', 130, 100);
    }

    private renderSpawnRate = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("i", 50, 150);
        this.canvasContext.fillText("+", 70, 150);
        this.canvasContext.fillText("/" + (<GameSystem>systems.getSystem('Game')).spawnTimerMax, 90, 150);
        this.canvasContext.fillText("(" + (<GameSystem>systems.getSystem('Game')).spawnTimerCost + ')', 130, 150);
    }

    private renderSpawnAmount = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("o", 50, 200);
        this.canvasContext.fillText("+", 70, 200);
        this.canvasContext.fillText("x" + (<GameSystem>systems.getSystem('Game')).spawnAmount, 90, 200);
        this.canvasContext.fillText("(" + (<GameSystem>systems.getSystem('Game')).spawnAmountCost + ')', 130, 200);
    }
}

class PhysicsSystem implements ISystem {
    public id: string;
    public state: SystemState;

    constructor() {
        this.id = 'Physics';
        this.state = SystemState.None;
    }

    init = (): void => {
        this.state = SystemState.Init;
    }

    update = (): void => {
        this.state = SystemState.Update;
    }

    finit = (): void => {
        this.state = SystemState.Finit;
    }
}

class InputSystem implements ISystem {
    public id: string;
    public state: SystemState;

    public keyCallback: { [keycode: number]: () => void; } = {};
    public keyDown: { [keycode: number]: boolean; } = {};

    constructor() {
        this.id = 'Input';
        this.state = SystemState.None;
    }

    public init = (): void => {
        this.state = SystemState.Init;
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public update = (): void => {
        this.state = SystemState.Update;
        for (var key in this.keyDown) {
            var is_down: boolean = this.keyDown[key];
            if (is_down) {
                var callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    callback();
                }
            }
        }
    }

    public finit = (): void => {
        this.state = SystemState.Finit;
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        event.preventDefault();
        this.keyDown[event.keyCode] = true;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }
}

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
            for (let i = 0; i < this.spawnAmount; i++){
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
            new EntityGraphics(),
            new EntityPhysics(),
            new EntityCollision(),
            new PlayerInput(),
            new PlayerAI()
        ];
        
        let playerAttributes = [
            new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
            new Attribute("Sprite", { 'color': "black" }),
            new Attribute("Physics", { 'velocity': velocity, 'acceleration': 3, 'drag': 1, 'terminalVelocity': 15 }),
            new Attribute("Collision", { 'collidingWith': 'Nothing' }),
            new Attribute("Game", {'index': -1, 'type': 'Player', 'active': true}),
            new Attribute("Weapon", {'cooldown': 10, 'power': 20})
        ];    
        
        let player = new Entity(playerComponents, playerAttributes);
        
        entities.addEntity(player);
    }

    spawnEnemy = (position: Vector, velocity: Vector, dimensions: Vector): void => {
        let enemyComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new EntityCollision(),
            new EnemyAI()
        ];

        let enemyAttributes = [
            new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
            new Attribute("Sprite", { 'color': "red" }),
            new Attribute("Physics", { 'velocity': velocity, 'acceleration': 2, 'drag': 1, 'terminalVelocity': 20 }),
            new Attribute("Collision", { 'collidingWith': 'Nothing' }),
            new Attribute("Game", { 'index': -1, 'type': 'Enemy', 'active': true})
        ]

        let enemy = new Entity(enemyComponents, enemyAttributes);

        entities.addEntity(enemy);
    }

    spawnBullet = (position: Vector, velocity: Vector, dimensions: Vector): void => {
        let bulletComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new EntityCollision(),
            new BulletAI()
        ];

        let bulletAttributes = [
            new Attribute("Transform", { 'position': position, dimensions }),
            new Attribute("Sprite", {'color': "black"}),
            new Attribute("Physics", { 'velocity': velocity, 'acceleration': 0, 'drag': 1, 'terminalVelocity': 100}),
            new Attribute("Collision", { 'collidingWith': 'Nothing' }),
            new Attribute("Game", { 'index': -1, 'type': 'Bullet', 'active': true})        
        ]

        let bullet = new Entity(bulletComponents, bulletAttributes);

        entities.addEntity(bullet);
    }
}

interface IComponent {
    id: string;

    update(attribute: { [name: string]: IAttribute }): void;
}

class EntityGraphics implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "Graphics";
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform = attribute["Transform"];
        let sprite = attribute["Sprite"];

        let ctxt: CanvasRenderingContext2D = (<GraphicsSystem>systems.getSystem("Graphics")).canvasContext;

        ctxt.fillStyle = sprite.val['color'];
        ctxt.fillRect(transform.val['position'].x, transform.val['position'].y, transform.val['dimensions'].x, transform.val['dimensions'].y);
    }
}

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

class EntityCollision implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "Collision";
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        let entityList = entities.entity;
        for (let key in entityList) {
            if (key == attribute["Game"].val['index'])
                continue;

            if (attribute["Collision"].val['collidingWith'] !== 'Nothing')
                return;

            let collideWith: { [name: string]: Vector } = {};

            collideWith['position'] = entityList[key].attribute["Transform"].val['position'];
            collideWith['dimensions'] = entityList[key].attribute["Transform"].val['dimensions'];

            let dimensions: Vector = new Vector(0, 0);

            dimensions.add(collideWith['dimensions']);
            dimensions.add(attribute["Transform"].val['dimensions']);
            dimensions.multiply(0.5);

            let difference: Vector = new Vector(0, 0);

            difference.copy(collideWith['position']);
            difference.subtract(attribute["Transform"].val['position']);
            difference.x = Math.abs(difference.x);
            difference.y = Math.abs(difference.y);

            if (difference.x < dimensions.x && difference.y < dimensions.y) {
                attribute["Collision"].val['collidingWith'] = entityList[key].attribute["Game"].val['type'];
                entityList[key].attribute["Collision"].val['collidingWith'] = attribute["Game"].val['type'];
            }
        }
    }
}

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
        //inputSystem.addKeycodeCallback(32, this.fire);
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

class PlayerAI {
    public id: string = "";

    private cooldown: number;
    private lastOrientation: Vector;    
    private physics: IAttribute;
    private transform: IAttribute;
    private weapon: IAttribute;

    constructor() {
        this.id = "AI";
        this.cooldown = 0;
        this.lastOrientation = new Vector(1, 0);
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        this.physics = attribute['Physics'];
        this.transform = attribute['Transform'];
        this.weapon = attribute['Weapon'];
        this.cooldown++;
        if (this.cooldown >= this.weapon.val['cooldown']) {
            this.fire();
            this.cooldown = 0;
        }            
    }

    public fire = (): void => {
        let orientation = new Vector(0, 0);
        orientation.copy(this.physics.val['velocity']);

        if (orientation.magnitude() == 0) {
            orientation.copy(this.lastOrientation);
        }

        orientation.normalize().multiply(-this.weapon.val['power']);

        this.lastOrientation.copy(orientation);
        let position = this.transform.val['position'];
        (<GameSystem>systems.getSystem("Game")).spawnBullet(new Vector(position.x, position.y), orientation, new Vector(5, 5));
    }
}

class EnemyAI {
    public id: string = "";

    constructor() {
        this.id = "AI";
    }

    public update = (attribute: {[name: string]: IAttribute}): void => {
        let player = entities.getPlayer();
        let playerTransform = player.attribute["Transform"].val;
        let enemyPhysics = attribute["Physics"].val;

        if(playerTransform['position'].x < attribute["Transform"].val['position'].x)
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

class BulletAI {
    public id: string = "";

    constructor() {
        this.id = "AI";
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        if (attribute["Physics"].val['velocity'].magnitude() == 0)
            attribute["Game"].val['active'] = false;
        if (attribute["Collision"].val['collidingWith'] === 'Enemy')
            attribute["Game"].val['active'] = false;
    }
}

interface IAttribute {
    id: string;
    val: { [name: string]: any };
}

class Attribute implements IAttribute {
    public id: string = "";
    public val: { [name: string]: any } = {};

    constructor(id: string, val: { [name: string]: any }) {
        this.id = id;
        this.val = val;
    }
}

interface IEntity {
    component: { [name: string]: IComponent };
    attribute: { [name: string]: IAttribute };

    init(index: number): void;
    update(): void;
    finit(): void;
}

class Entity implements IEntity {
    public component: { [name: string]: IComponent };
    public attribute: { [name: string]: IAttribute };

    constructor(components : IComponent[], attributes : IAttribute[]) {
        this.component = {};
        for (let key in components) {
            this.component[components[key].id] = components[key];
        }
        this.attribute = {};
        for (let key in attributes) {
            this.attribute[attributes[key].id] = attributes[key];
        }
    }

    init = (index: number): void => {
        this.attribute["Game"].val['index'] = index;
    }

    update = (): void => {
        if(!this.attribute["Game"].val['active'])
        {
            this.finit();
            return;
        }

        for (let key in this.component) {
            this.component[key].update(this.attribute);
        }
    }

    finit = (): void => {
        entities.removeEntity(this.attribute["Game"].val['index']);
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    systems.updateSystems();
    entities.updateEntities();
}

let systems = new SystemContext();
let entities = new EntityContext();

window.onload = () => {        
    systems.addSystem(new PhysicsSystem());
    systems.addSystem(new InputSystem());    
    systems.addSystem(new GameSystem());
    systems.addSystem(new GraphicsSystem());

    gameLoop();
}