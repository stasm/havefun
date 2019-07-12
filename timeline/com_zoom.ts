import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export interface Zoom extends BaseComponent {
    speed: number;
}

export function zoom(speed: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Zoom;
        game[Get.Zoom][entity] = <Zoom>{
            entity,
            speed,
        };
    };
}
