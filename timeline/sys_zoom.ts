import {Get} from "./com_index.js";
import {Entity, Game} from "./game.js";
import {get_scaling} from "./mth_mat2d.js";

const QUERY = Get.Transform | Get.Zoom;

export function sys_zoom(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let zoom = game[Get.Zoom][entity];

    if (game.input.wheel_y_delta > 0) {
        let current_scale = get_scaling([0, 0], transform.world);
        let factor = current_scale[0] * (1 + zoom.speed * delta);
        transform.scale = [factor, 1];
        transform.dirty = true;
    }

    if (game.input.wheel_y_delta < 0) {
        let current_scale = get_scaling([0, 0], transform.world);
        let factor = current_scale[0] / (1 + zoom.speed * delta);
        transform.scale = [factor, 1];
        transform.dirty = true;
    }
}
