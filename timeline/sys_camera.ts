import {Get} from "./com_index.js";
import {Game} from "./game.js";
import {invert} from "./mth_mat2d.js";

export function sys_camera(game: Game, delta: number) {
    if (game.camera) {
        let camera = game.camera;
        let transform = game[Get.Transform][camera.entity];
        invert(camera.view, transform.world);
    } else {
        for (let i = 0; i < game.world.length; i++) {
            if (game.world[i] & Get.Camera) {
                game.camera = game[Get.Camera][i];
                break;
            }
        }
    }
}
