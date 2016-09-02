interface IAttribute {
    id: string;
    val: { [name: string]: any };
}

class Attribute implements IAttribute {
    id: string;
    val: { [name: string]: any } = {};

    constructor(id: string, val: { [name: string]: any }) {
        this.id = id;
        this.val = val;
    }
}

export {IAttribute, Attribute};
