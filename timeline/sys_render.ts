import {Camera} from "./com_camera.js";
import {Get} from "./com_index.js";
import {Render, RenderQuad, RenderRect} from "./com_render.js";
import {Transform} from "./com_transform.js";
import {Game} from "./game.js";
import {create, multiply} from "./mth_mat2d.js";

const QUERY = Get.Transform | Get.Render;

export function sys_render(game: Game, delta: number) {
    if (!game.camera) {
        return;
    }

    game.ctx.resetTransform();
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            switch (render.kind) {
                case Render.Quad:
                    draw_quad(game, game.camera, transform, render);
                    break;
                case Render.Rect:
                    draw_rect(game, game.camera, transform, render);
                    break;
            }
        }
    }
}

function draw_quad(game: Game, camera: Camera, transform: Transform, render: RenderQuad) {
    let model = multiply(create(), camera.view, transform.world);
    game.ctx.setTransform(...model);
    game.ctx.fillStyle = render.color;
    game.ctx.fillRect(-5, -5, 10, 10);
}

function draw_rect(game: Game, camera: Camera, transform: Transform, render: RenderRect) {
    let model = multiply(create(), camera.view, transform.world);
    game.ctx.setTransform(...model);
    game.ctx.fillStyle = render.color;
    game.ctx.fillRect(0, 0, render.width, render.height);
}
