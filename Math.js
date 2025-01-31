class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static fromArray = (arr) => {
        return new Vec2(arr[0], arr[1]);
    }

    clamp = (lower, upper) => {
        let x = this.x;
        let y = this.y; 

        if (this.x < lower) x = lower;
        else if (this.x > upper) x = upper;

        if (this.y < lower) y = lower;
        else if (this.y > upper) y = upper;

        return new Vec2(x, y);
    }

    scale = (scalar) => {
        this.x *= scalar;
        this.y *= scalar;
    }

    scaled = (scalar) => {
        return new Vec2(scalar * this.x, scalar * this.y);
    }

    plus = (other) => {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    static add = (v1, v2) => {
        return new v1.plus(v2);
    }

    minus = (other) => {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    static subtract = (v1, v2) => {
        return v1.minus(v2);
    }

    neg = () => {
        this.x = -this.x;
        this.y = -this.y;
    }

    inverse = () => {
        return new Vec2(-this.x, -this.y);
    }

    dot = (other) => {
        return this.x * other.x + this.y * other.y;
    }

    normSq = () => {
        return this.x * this.x + this.y * this.y;
    }

    norm = () => {
        return Math.sqrt(this.normSq());
    }

    normalized = () => {
        const norm = this.norm();
        return new Vec2(this.x / norm, this.y / norm);
    }

    dist = (other) => {
        return this.minus(other).norm();
    }

    static distance = (v1, v2) => {
        return v1.dist(v2);
    }

    equals = (other) => {
        return this.x === other.x && this.y === other.y;
    }

    static equal = (v1, v2) => {
        return v1.eq(v2);
    }

    str = () => {
        return `(${this.x}, ${this.y})`;
    }

    static zero = () => {
        return new Vec2(0, 0);
    }

    static unitNorm = (v) => {
        const tolerance = 0.0001;
        return Math.abs(v.normSq() - 1) < tolerance;
    }

}


class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static fromArray = (arr) => {
        return new Vec3(arr[0], arr[1], arr[2]);
    }

    clamp = (lower, upper) => {
        let x = this.x;
        let y = this.y; 
        let z = this.z;
        if (this.x < lower) x = lower;
        else if (this.x > upper) x = upper;

        if (this.y < lower) y = lower;
        else if (this.y > upper) y = upper;

        if (this.z < lower) z = lower;
        else if (this.z > upper) z = upper;

        return new Vec3(x, y, z);
    }

    toArray = () => {
        return [this.x,this.y,this.z];
    }

    toRgba = () => {
        return Rgba.fromArray(this.toArray());
    }

    scale = (scalar) => {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }

    scaled = (scalar) => {
        return new Vec3(scalar * this.x, scalar * this.y, scalar * this.z);
    }

    plus = (other) => {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    static add = (v1, v2) => {
        return new v1.plus(v2);
    }

    minus = (other) => {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    static subtract = (v1, v2) => {
        return v1.minus(v2);
    }

    neg = () => {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    inverse = () => {
        return new Vec3(-this.x, -this.y, -this.z);
    }

    dot = (other) => {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross = (other) => {
        return new Vec3(this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x);
    }

    normSq = () => {
        return this.dot(this);
    }

    norm = () => {
        return Math.sqrt(this.normSq());
    }

    normalized = () => {
        const norm = this.norm();
        return new Vec3(this.x / norm, this.y / norm, this.z / norm);
    }

    dist = (other) => {
        return this.minus(other).norm();
    }

    static distance = (v1, v2) => {
        return v1.dist(v2);
    }

    equals = (other) => {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    static equal = (v1, v2) => {
        return v1.eq(v2);
    }

    str = () => {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

    static zero = () => {
        return new Vec3(0, 0, 0);
    }

    static unitNorm = (v) => {
        const tolerance = 0.0001;
        return Math.abs(v.normSq() - 1) < tolerance;
    }
}
// end given math.js code


// 2x2 matrix constructor
class Mat2 {
constructor(a, b, c, d) {
    this.m = [
        [a, b],
        [c, d]
    ];
}

// identity matrix
static identity() {
    return new Mat2(1, 0, 0, 1);
}

// matrix multiplication w this matrix to another
mMult(other) {
    return new Mat2(
        this.m[0][0] * other.m[0][0] + this.m[0][1] * other.m[1][0],
        this.m[0][0] * other.m[0][1] + this.m[0][1] * other.m[1][1],
        this.m[1][0] * other.m[0][0] + this.m[1][1] * other.m[1][0],
        this.m[1][0] * other.m[0][1] + this.m[1][1] * other.m[1][1]
    );
}

// matrix mult by single vector
vMult(vec) {
    return new Vec2(
        this.m[0][0] * vec.x + this.m[0][1] * vec.y,
        this.m[1][0] * vec.x + this.m[1][1] * vec.y
    );
}

// scale matrix by some scalar value
sMult(scalar) {
    return new Mat2(
        this.m[0][0] * scalar, this.m[0][1] * scalar,
        this.m[1][0] * scalar, this.m[1][1] * scalar
    );
}

// return matrix as a flattened array
toArray() {
    return this.m;
}
}