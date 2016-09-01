import {SystemContext, EntityContext} from "./Context/package";

const WIDTH = 1024;
const HEIGHT = 1024;

let systems = new SystemContext();
let entities = new EntityContext();

export {WIDTH, HEIGHT, systems, entities};