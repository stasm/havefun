import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export type RenderGeneric = RenderRect | RenderGrid;

export const enum Render {
    Rect,
    Grid,
}

export interface RenderRect extends BaseComponent {
    kind: Render.Rect;
    width: number;
    height: number;
    color: string;
}

export function render_rect(width: number, height: number, color: string) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Render;
        game[Get.Render][entity] = <RenderRect>{
            entity,
            kind: Render.Rect,
            width,
            height,
            color,
        };
    };
}

export interface RenderGrid extends BaseComponent {
    kind: Render.Grid;
    rows: number;
    cols: number;
    cell_width: number;
    cell_height: number;
    border: string;
}

export function render_grid(
    rows: number,
    cols: number,
    cell_width: number,
    cell_height: number,
    border: string
) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Render;
        game[Get.Render][entity] = <RenderGrid>{
            entity,
            kind: Render.Grid,
            rows,
            cols,
            cell_width,
            cell_height,
            border,
        };
    };
}
