import {BaseComponent, Get} from "./com_index.js";
import {Entity, Game} from "./game.js";

export type RenderGeneric = RenderRect;

export const enum Render {
    Rect,
}

export interface RenderRect extends BaseComponent {
    kind: Render.Rect;
    color: string;
}

export function render_rect(color: string) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Render;
        game[Get.Render][entity] = <RenderRect>{
            entity,
            kind: Render.Rect,
            color,
        };
    };
}
