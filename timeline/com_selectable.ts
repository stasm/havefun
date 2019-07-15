import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export interface Selectable extends BaseComponent {
    selected: boolean;
}

export function selectable() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Selectable;
        game[Get.Selectable][entity] = <Selectable>{entity};
    };
}
