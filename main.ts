const WIDTH = 1024;
const HEIGHT = 1024;

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
    public system: { [name: string]: ISystem };

    constructor() {
        this.system = {};
    }

    public addSystem = (system: ISystem): void => {
        system.init();
        this.system[system.id] = system;
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
    
    init(): void;
    update(): void;
    finit(): void;
}

class GraphicsSystem implements ISystem {    
    public id: string = "";
    public canvasContext: CanvasRenderingContext2D;

    constructor() {
        this.id = "Graphics";
    }

    public init = (): void => {
        let canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;        
        document.getElementById("canvasContainer").appendChild(canvas);
        this.canvasContext = canvas.getContext("2d");
    }

    private clear = (): void => {
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
    }

    public update = (): void => {
        this.clear();
    }

    public finit = (): void => {
    }
}

class PhysicsSystem implements ISystem {
    public id: string = "";

    public timeDelta: number = 1;

    init = (): void => {
        this.id = "Physics";
    }

    update = (): void => {

    }

    finit = (): void => {

    }
}

class InputSystem implements ISystem {
    public id: string = "";

    public keyCallback: { [keycode: number]: () => void; } = {};
    public keyDown: { [keycode: number]: boolean; } = {};

    constructor() {
        this.id = "Input";
    }

    public init = (): void => {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
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

    public update = (): void => {
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
    }
}

class GameSystem implements ISystem {
    public id: string = "";

    private spawnTimer: number = 0;
    private maxTimer: number = 25;
    
    constructor() {
        this.id = "Game";
        this.spawnTimer = 0;
    }

    public init = (): void => {
        this.spawnPlayer(new Vector(WIDTH/2, HEIGHT/2), new Vector(10, 10));
    }

    public update = (): void => {
        this.spawnTimer++;
        if(this.spawnTimer == this.maxTimer)
        {
            let x: number = Math.floor((Math.random() * WIDTH) + 1);
            let y: number = Math.floor((Math.random() * HEIGHT) + 1);
            this.spawnEnemy(new Vector(x, y), new Vector(10, 10));
            this.spawnTimer = 0;
        }
    }

    public finit = (): void => {

    }

    spawnPlayer = (position: Vector, dimensions: Vector): void => {
        let playerComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new PlayerInput()
        ];
        
        let playerAttributes = [
            new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
            new Attribute("Sprite", { 'color': "black" }),
            new Attribute("Physics", { 'velocity': new Vector(0, 0), 'acceleration': 3, 'drag': 1, 'terminalVelocity': 15 }),
            new Attribute("Game", {'type': 'Player', 'active': true}),
            new Attribute("Weapon", {'rate': 5, 'power': 20})
        ];    
        
        let player = new Entity(playerComponents, playerAttributes);
        
        entities.addEntity(player);
    }

    spawnEnemy = (position: Vector, dimensions: Vector): void => {
        let enemyComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new EnemyAI()
        ];

        let enemyAttributes = [
            new Attribute("Transform", { 'position': position, 'dimensions': dimensions }),
            new Attribute("Sprite", { 'color': "red" }),
            new Attribute("Physics", { 'velocity': new Vector(0, 0), 'acceleration': 2, 'drag': 1, 'terminalVelocity': 20 }),
            new Attribute("Game", {'type': 'Enemy', 'active': true})
        ]

        let enemy = new Entity(enemyComponents, enemyAttributes);

        entities.addEntity(enemy);
    }

    spawnBullet = (position: Vector, velocity: Vector, dimensions: Vector): void => {
        let bulletComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new BulletAI()
        ];

        let bulletAttributes = [
            new Attribute("Transform", { 'position': position, 'dimensions': dimensions}),
            new Attribute("Sprite", {'color': "black"}),
            new Attribute("Physics", { 'velocity': velocity, 'acceleration': 0, 'drag': 1, 'terminalVelocity': 100}),
            new Attribute("Game", {'type': 'Bullet', 'active': true})        
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

        let ctxt: CanvasRenderingContext2D = (<GraphicsSystem>systems.system["Graphics"]).canvasContext;

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

        console.log(physics.val['velocity'].x, physics.val['velocity'].y);
    }
}

class PlayerInput implements IComponent {
    public id: string = "";

    private physics: IAttribute;
    private transform: IAttribute;
    private weapon: IAttribute;
    private cooldown: number;
    private lastOrientation: Vector = new Vector(1, 0);

    constructor() {
        this.id = "Input";
        this.cooldown = 0;

        let inputSystem = <InputSystem>systems.system["Input"];

        inputSystem.addKeycodeCallback(65, this.left);
        inputSystem.addKeycodeCallback(87, this.up);
        inputSystem.addKeycodeCallback(83, this.down);
        inputSystem.addKeycodeCallback(68, this.right);
        inputSystem.addKeycodeCallback(32, this.fire);
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        this.physics = attribute["Physics"];
        this.transform = attribute["Transform"];
        this.weapon = attribute["Weapon"];
        this.cooldown++;
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

    public fire = (): void => {
        if(this.cooldown >= this.weapon.val['rate']){
            let dx = this.physics.val['velocity'].x;
            let dy = this.physics.val['velocity'].y;

            if(dx == 0 && dy == 0){
                dx = this.lastDx;
                dy = this.lastDy;
            }

            dx = -sign(<number>dx) * this.weapon.val['power'];
            dy = -sign(<number>dy) * this.weapon.val['power'];

            this.lastDx = dx;
            this.lastDy = dy;
        
            (<GameSystem>systems.system["Game"]).spawnBullet(this.transform.val['position'], this.physics.val['velocity']);
            this.cooldown = 0;
        }
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
    }
}

class BulletAI {
    public id: string = "";

    constructor() {
        this.id = "AI";
    }

    public update = (attribute: {[name: string]: IAttribute}): void => {
        if(attribute["Physics"].val['velocity'].magnitude() == 0)
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
    index: number;

    component: { [name: string]: IComponent };
    attribute: { [name: string]: IAttribute };

    init(index: number): void;
    update(): void;
    finit(): void;
}

class Entity implements IEntity {
    public index: number;

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
        this.index = index;
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
        entities.removeEntity(this.index);
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
    systems.addSystem(new GraphicsSystem());
    systems.addSystem(new PhysicsSystem());
    systems.addSystem(new InputSystem());
    systems.addSystem(new GameSystem());    

    gameLoop();
}