import {Action} from "./actions.js";
import {Get} from "./com_index.js";
import {Entity, Game} from "./game.js";
import {get_translation} from "./mth_mat2d.js";

const QUERY = Get.Transform | Get.Pan;

export function sys_pan(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let pan = game[Get.Pan][entity];

    if (game.input.mouse_1 && game.input.mouse_x !== 0) {
        let current_translation = get_translation([0, 0], transform.world);
        transform.translation = [
            current_translation[0] - game.input.mouse_x * pan.speed * delta,
            current_translation[1],
        ];
        transform.dirty = true;

        game.dispatch(Action.PAN_START);
    }

    if (!game.input.mouse_1) {
        game.dispatch(Action.PAN_STOP);
    }
}
