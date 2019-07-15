import {Get} from "./com_index.js";
import {Render, RenderRect} from "./com_render.js";
import {Transform} from "./com_transform.js";
import {Game} from "./game.js";

const QUERY = Get.Transform | Get.Render;

export function sys_render(game: Game) {
    game.ctx.resetTransform();
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            switch (render.kind) {
                case Render.Rect:
                    draw_rect(game, transform, render);
                    break;
            }
        }
    }
}

function draw_rect(game: Game, transform: Transform, render: RenderRect) {
    game.ctx.setTransform(...transform.world);
    game.ctx.fillStyle = render.color;
    game.ctx.fillRect(0, 0, render.width, render.height);
}
