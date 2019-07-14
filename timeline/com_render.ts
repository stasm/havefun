import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export type RenderGeneric = RenderQuad | RenderRect;

export const enum Render {
    Quad,
    Rect,
}

export interface RenderQuad extends BaseComponent {
    kind: Render.Quad;
    color: string;
}

export function render_quad(color: string) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Render;
        game[Get.Render][entity] = <RenderQuad>{
            entity,
            kind: Render.Quad,
            color,
        };
    };
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
