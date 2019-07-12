import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";
import {Mat2D} from "./mth_index.js";
import {create} from "./mth_mat2d.js";

export interface Camera extends BaseComponent {
    projection: Mat2D;
    view: Mat2D;
    pv: Mat2D;
}

export function camera() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Camera;
        game[Get.Camera][entity] = <Camera>{
            entity,
            view: create(),
        };
    };
}
