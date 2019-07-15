import {Entity} from "./game.js";

export interface BaseComponent {
    entity: Entity;
}

export const enum Get {
    None = 0,
    Transform = 1,
    Render = 2,
    Camera = 4,
    Zoom = 8,
    Pan = 16,
    Overlay = 32,
    Selectable = 64,
}
