import {Get} from "./com_index.js";
import {Render, RenderRect} from "./com_render.js";
import {Game} from "./game.js";
import {Mat2D} from "./mth_index.js";
import {create, multiply} from "./mth_mat2d.js";

const QUERY = Get.Transform | Get.Render;

export function sys_render(game: Game) {
    game.ctx.resetTransform();
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            let model;
            if (game.world[i] & Get.Overlay) {
                model = transform.world;
            } else if (game.camera) {
                model = multiply(create(), game.camera.view, transform.world);
            } else {
                continue;
            }

            switch (render.kind) {
                case Render.Rect:
                    draw_rect(game, model, render);
                    break;
            }
        }
    }
}

function draw_rect(game: Game, model: Mat2D, render: RenderRect) {
    game.ctx.setTransform(...model);
    game.ctx.fillStyle = render.color;
    game.ctx.fillRect(0, 0, render.width, render.height);
}
