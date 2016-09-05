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
        if (magnitude == 0)
            this.zero();
        else {
            let ratio = magnitude / this.magnitude();
            console.log("Ratio: ", magnitude, "/", this.magnitude(), " = ", ratio);
        }
        //this.x *= ratio;//magnitude * Math.cos(angle) * sign(this.x);
        //this.y *= ratio;//magnitude * Math.sin(angle) * sign(this.y);
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

    getCopy = (): Vector => {
        return new Vector(this.x, this.y);
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
        let angle = Math.atan2(this.y, this.x);
        return angle;
        //if (this.x > 0 && this.y > 0)
        //    return angle;
        //if (this.x < 0 && this.y > 0)
        //    return (Math.PI * 4) + angle;
        //else
        //    return Math.PI * 2 + angle;
    }

    multiply = (value: number): void => {
        this.x *= value;
        this.y *= value;
    }

    add = (v: Vector): void => {
        this.x += v.x;
        this.y += v.y;
    }

    subtract = (v: Vector): void => {
        this.x -= v.x;
        this.y -= v.y;
    }
}

let sign = (x: number): number => {
    return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

let add = (v1: Vector, v2: Vector): Vector => {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
}

let multiply = (v: Vector, value: number): Vector => {
    return new Vector(v.x * value, v.y * value);
}

let subtract = (v1: Vector, v2: Vector): Vector => {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
}

export {Vector, sign, add, multiply, subtract};