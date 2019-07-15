import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export interface Selectable extends BaseComponent {
    selected: boolean;
    aabb?: AABB;
}

export function selectable() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Selectable;
        game[Get.Selectable][entity] = <Selectable>{
            entity,
            selected: false,
        };
    };
}

export type AABB = [number, number, number, number];
