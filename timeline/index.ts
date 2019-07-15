import {pan} from "./com_pan.js";
import {render_rect} from "./com_render.js";
import {selectable} from "./com_selectable.js";
import {zoom} from "./com_zoom.js";
import {Game} from "./game.js";

export let game = new Game();

game.add({
    translation: [0, 0],
    scale: [1, 1],
    using: [zoom(1.1), pan(1)],
    children: [
        {
            translation: [0, 100],
            using: [render_rect(480, 100, "#fff")],
            children: [
                {
                    translation: [100, 0],
                    scale: [1, 2],
                    using: [render_rect(10, 10, "#f00"), selectable()],
                },
                {
                    translation: [110, 20],
                    scale: [1, 2],
                    using: [render_rect(10, 10, "#f00"), selectable()],
                },
            ],
        },
    ],
});

game.event_update();
