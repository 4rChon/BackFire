import {SystemContext, EntityContext} from "./Context/package";

const WIDTH = 768;
const HEIGHT = 768;

let systems = new SystemContext();
let entities = new EntityContext();

export {WIDTH, HEIGHT, systems, entities};