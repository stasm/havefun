import {Entity} from "./game.js";

export interface BaseComponent {
    entity: Entity;
}

export const enum Get {
    None = 0,
    Transform = 1,
    Render = 2,
    Zoom = 8,
    Pan = 16,
    Selectable = 64,
}
