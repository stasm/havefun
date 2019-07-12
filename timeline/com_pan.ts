import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export interface Pan extends BaseComponent {
    speed: number;
}

export function pan(speed: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Pan;
        game[Get.Pan][entity] = <Pan>{
            entity,
            speed,
        };
    };
}
