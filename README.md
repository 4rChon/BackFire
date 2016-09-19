# BackFire

<h2>Table of Contents</h2>
<ol>
  <li>
    <a href=https://github.com/4rChon/BackFire#1-maints>main.ts</a>
    <ul>
      <li><a href=https://github.com/4rChon/BackFire#imports>Imports</a></li>
      <li><a href=https://github.com/4rChon/BackFire#functions>Functions</a></li>
    </ul>
  </li>
  <li>
    <a href=https://github.com/4rChon/BackFire#2-attribute>Attribute</a>
    <ul>
      <li>
        <a href=https://github.com/4rChon/BackFire#attributets>Attribute.ts</a>
        <ul>
          <li><a href=https://github.com/4rChon/BackFire#exports>Exports.ts</a></li>
          <li><a href=https://github.com/4rChon/BackFire#interface-iattribute>IAttribute</a></li>
          <li><a href=https://github.com/4rChon/BackFire#class-attribute-implements-iattribute>Attribute</a></li>
        </ul>
      </li>
    </ul
  </li>
  <li>
    <a href=https://github.com/4rChon/BackFire#3-component>Component</a>
    <ul>
      <li>
        <a href=https://github.com/4rChon/BackFire#componentts>Component.ts</a>
        <ul>
          <li><a href=https://github.com/4rChon/BackFire#imports-1>Imports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#exports-1>Exports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#interface-icomponent>IComponent</a></li>
        </ul>
      </li>
    </ul
  </li>
  <li>
    <a href=https://github.com/4rChon/BackFire#4-entity>Entity</a>
    <ul>
      <li>
        <a href=https://github.com/4rChon/BackFire#entityts>Entity.ts</a>
        <ul>
          <li><a href=https://github.com/4rChon/BackFire#imports-2>Imports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#exports-2>Exports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#interface-ientity>IEntity</a></li>
          <li><a href=https://github.com/4rChon/BackFire#class-entity-implements-ientity>Entity</a></li>
        </ul>
      </li>
    </ul
  </li>
  <li>
    <a href=https://github.com/4rChon/BackFire#5-system>System</a>
    <ul>
      <li>
        <a href=https://github.com/4rChon/BackFire#systemts>System.ts</a>
        <ul>
          <li><a href=https://github.com/4rChon/BackFire#exports-3>Exports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#enum-systemstate>SystemState</a></li>
          <li><a href=https://github.com/4rChon/BackFire#interface-isystem>ISystem</a></li>
        </ul>
      </li>
    </ul
  </li>
  <li>
    <a href=https://github.com/4rChon/BackFire#6-context>Context</a>
    <ul>
      <li>
        <a href=https://github.com/4rChon/BackFire#entitycontextts>EntityContext.ts</a>
        <ul>
          <li><a href=https://github.com/4rChon/BackFire#imports-3>Imports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#exports-4>Exports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#class-entitycontext>EntityContext</a></li>
        </ul>
      </li>
      <li>
        <a href=https://github.com/4rChon/BackFire#systemcontextts>SystemContext.ts</a>
        <ul>
          <li><a href=https://github.com/4rChon/BackFire#imports-4>Imports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#exports-5>Exports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#class-systemcontext>SystemContext</a></li>
        </ul>
      </li>
    </ul
  </li>
  <li>
    <a href=https://github.com/4rChon/BackFire#7-util>Util</a>
    <ul>
      <li>
        <a href=https://github.com/4rChon/BackFire#utilts>util.ts</a>
        <ul>
          <li><a href=https://github.com/4rChon/BackFire#exports-6>Exports</a></li>
          <li><a href=https://github.com/4rChon/BackFire#class-vector>Vector</a></li>
          <li><a href=https://github.com/4rChon/BackFire#helper-functions>Helper Functions</a></li>
        </ul>
      </li>
    </ul
  </li>
  <li>
    <a href=https://github.com/4rChon/BackFire#8-globalsts>Globals.ts</a>
    <ul>
      <li><a href=https://github.com/4rChon/BackFire#imports-5>Imports</a></li>
      <li><a href=https://github.com/4rChon/BackFire#exports-7>Exports</a></li>
      <li><a href=https://github.com/4rChon/BackFire#globals>Globals</a></li>
    </ul
  </li>
</ol>

## 1. main.ts

#### Imports

From Globals: *entities*, *systems*  
From System: *GraphicsSystem*, *GameSystem*, *InputSystem*, *PhysicsSystem*

#### Functions

```typescript
gameLoop()
main()
```

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------
