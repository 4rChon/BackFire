# BackFire
## 1. main.ts
#### Imports
From Globals: *entities*, *systems*  
From System: *GraphicsSystem*, *GameSystem*, *InputSystem*, *PhysicsSystem*

#### Functions
```typescript
gameLoop()
main()
```
---
## 2. Attribute
### Attribute.ts
#### Exports
*IAttribute*, *Attribute*

#### *interface* IAttribute
```typescript
id: string
val: { [name: string]: any }
```

#### *class* Attribute implements IAttribute
```typescript
constructor(id: string, val: {[name: string]: any})
```

---
## 3. Component
### Component.ts
#### Imports
From Attribute: IAttribute

#### Exports
IComponent

#### *interface* IComponent
```typescript
id: string

update(attribute: { [name: string]: IAttribute }): void
```
---
## 4. Entity
### Entity.ts
#### Imports
From Globals: *entities*  
From Attribute: *IAttribute*  
From Component: *IComponent*

#### Exports
*IEntity*, *Entity*

#### *interface* IEntity
```typescript
component: { [name: string]: IComponent }
attribute: { [name: string]: IAttribute }

init(index: number): void
update(): void
finit(): void

hasComponent(name: string): boolean
hasAttribute(name: string): boolean
```
#### *class* Entity implements IEntity
```typescript
constructor(components: IComponent[], attributes: IAttribute[])
```
---
## 5. System
### System.ts

#### Exports
*SystemState*, *ISystem*

#### *enum* SystemState
```typescript
None,
Init,
Update,
Finit
```
#### *interface* ISystem
```typescript
id: string;
state: SystemState;

init(): void;
update(): void;
finit(): void;
```
---
## 6. Context
### EntityContext.ts

#### Imports
From Entity: *IEntity*

#### Exports
*EntityContext*

#### *class* EntityContext
```typescript
entity: {[index: number]: IEntity}  
private index: number  
private player: IEntity

constructor()

addEntity(entity: IEntity): void
getEntity(index: number): IEntity
getEntitiesWithComponent(componentId: string): IEntity[]
getPlayer(): IEntity
removeEntity(index: number): void
updateEntities(): void
```
---
### SystemContext.ts

#### Imports
From System: *ISystem*, *SystemState*

#### Exports
*SystemContext*

#### *class* SystemContext
```typescript
private system: {[name: string]: ISystem}

constructor()

addSystem(system: ISystem): void
getSystem(name: string): ISystem
removeSystem(name: string): void
updateSystems(): void
```
---
## 7. Util
### util.ts
#### Exports
*Vector*, *sign*, *add*, *multiply*, *subtract*
#### *class* Vector
```typescript
x: number
y: number

constructor(x: number, y: number)

magnitude(): number
setMagnitude(magnitude: number): void
magSq(): number
normalize(): Vector
zero(): void
copy(v: Vector): void
getCopy(): Vector
rotate(radians: number): void
getRotate(radians: number): Vector
getAngle(): number
multiply(value: number): void
add(v: Vector): void
subtract(v: Vector): void
```
#### Helper Functions
```typescript
sign(x: number): number
add(v1: Vector, v2: Vector): Vector
multiply(v: Vector, value: number): Vector
subtract(v1: Vector, v2: Vector): Vector
```
---
## 8. Globals.ts
#### Imports
From Context: *SystemContext*, *EntityContext*
#### Exports
*WIDTH*, *HEIGHT*, *systems*, *entities*
#### Globals
```typescript
const WIDTH = 1024;
const HEIGHT = 1024;

let systems = new SystemContext();
let entities = new EntityContext();
```
---
