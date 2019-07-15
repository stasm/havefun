import {Get} from "./com_index.js";
import {RenderRect} from "./com_render.js";
import {Game} from "./game.js";
import {Mat2D, Vec2} from "./mth_index.js";
import {transform_point} from "./mth_mat2d.js";

const QUERY = Get.Transform | Get.Render | Get.Selectable;

export function sys_intersect(game: Game) {
    if (game.selection) {
        let selection_transform = game[Get.Transform][game.selection];
        let selection_render = game[Get.Render][game.selection] as RenderRect;

        let selection_aabb = compute_aabb(
            [0, 0],
            [selection_render.width, selection_render.height],
            selection_transform.world
        );

        for (let i = 0; i < game.world.length; i++) {
            if ((game.world[i] & QUERY) === QUERY) {
                let selectable = game[Get.Selectable][i];

                let selectable_transform = game[Get.Transform][i];
                let selectable_render = game[Get.Render][i] as RenderRect;
                let selectable_aabb = compute_aabb(
                    [0, 0],
                    [selectable_render.width, selectable_render.height],
                    selectable_transform.world
                );

                if (intersect_aabb(selection_aabb, selectable_aabb)) {
                    selectable.selected = true;
                } else {
                    selectable.selected = false;
                }
            }
        }
    }
}

type AABB = [number, number, number, number];

function compute_aabb(top_left: Vec2, bottom_right: Vec2, matrix: Mat2D) {
    return [
        ...transform_point(top_left, top_left, matrix),
        ...transform_point(bottom_right, bottom_right, matrix),
    ] as AABB;
}

function intersect_aabb(a: AABB, b: AABB) {
    return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
}
