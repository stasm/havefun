import {Get} from "./com_index.js";
import {Render, RenderGrid, RenderRect} from "./com_render.js";
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
                case Render.Grid:
                    draw_grid(game, transform, render);
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

function draw_grid(game: Game, transform: Transform, render: RenderGrid) {
    game.ctx.setTransform(...transform.world);
    game.ctx.beginPath();

    let width = render.cols * render.cell_width;
    let height = render.rows * render.cell_height;

    for (let i = 0; i <= render.rows; i++) {
        game.ctx.moveTo(0, i * render.cell_height);
        game.ctx.lineTo(width, i * render.cell_height);
    }

    for (let i = 0; i <= render.cols; i++) {
        game.ctx.moveTo(i * render.cell_width, 0);
        game.ctx.lineTo(i * render.cell_width, height);
    }

    game.ctx.lineWidth = 1;
    game.ctx.strokeStyle = render.border;
    game.ctx.stroke();
}
