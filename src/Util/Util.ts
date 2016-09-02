class Vector {
    x = 0;
    y = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    magnitude = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMagnitude = (magnitude: number): void => {
        let angle = this.getAngle();
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    }

    magSq = (): number => {
        return this.x * this.x + this.y * this.y;
    }

    normalize = (): Vector => {
        let len = this.magnitude();
        this.x /= len;
        this.y /= len;
        return this;
    }

    zero = (): void => {
        this.x = 0;
        this.y = 0;
    }

    copy = (v: Vector): void => {
        this.x = v.x;
        this.y = v.y;
    }

    rotate = (radians: number): void => {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let x = (cos * this.x) + (sin * this.y);
        let y = (cos * this.y) - (sin * this.x);
        this.x = x;
        this.y = y;
    }

    getRotate = (radians: number): Vector => {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let x = (cos * this.x) + (sin * this.y);
        let y = (cos * this.y) - (sin * this.x);
        return new Vector(x, y);
    }

    getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    }

    multiply = (value: number): void => {
        this.x *= value;
        this.y *= value;
    }

    getMultiply = (value: number): Vector => {
        return new Vector(this.x * value, this.y * value);
    }

    add = (v: Vector): void => {
        this.x += v.x;
        this.y += v.y;
    }

    getAdd = (v: Vector): Vector => {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract = (v: Vector): void => {
        this.x -= v.x;
        this.y -= v.y;
    }

    getSubtract = (v: Vector): Vector => {
        return new Vector(this.x + v.x, this.y + v.y);
    }
}

function sign(x: number) {
    return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

export {Vector, sign};