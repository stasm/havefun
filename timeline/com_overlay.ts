import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export interface Overlay extends BaseComponent {}

export function overlay() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Overlay;
        game[Get.Overlay][entity] = <Overlay>{entity};
    };
}
