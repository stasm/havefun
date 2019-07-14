import {Get} from "./com_index.js";
import {RenderRect, render_rect} from "./com_render.js";
import {Game} from "./game.js";

export function sys_select(game: Game) {
    if (game.camera && game.event.mouse_0_down) {
        game.selection = game.add({
            translation: [game.input.mouse_x, game.input.mouse_y],
            using: [render_rect(1, 1, "rgba(0, 0, 255, 0.1)")],
        });
    }

    if (game.selection && game.input.mouse_0) {
        if (game.event.mouse_x !== 0) {
            (game[Get.Render][game.selection] as RenderRect).width += game.event.mouse_x;
        }
        if (game.event.mouse_y !== 0) {
            (game[Get.Render][game.selection] as RenderRect).height += game.event.mouse_y;
        }
    }

    if (game.selection && game.event.mouse_0_up) {
        game.destroy(game.selection);
    }
}
