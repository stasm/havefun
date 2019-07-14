import {camera} from "./timeline/com_camera.js";
import {pan} from "./timeline/com_pan.js";
import {render_rect} from "./timeline/com_render.js";
import {zoom} from "./timeline/com_zoom.js";
import {Game} from "./timeline/game.js";

let game = new Game();

game.add({
    translation: [0, 0],
    scale: [1, 1],
    using: [camera(), zoom(1.1), pan(1)],
});

game.add({
    translation: [100, 100],
    scale: [1, 2],
    using: [render_rect(10, 10, "#f00")],
});
game.add({
    translation: [110, 120],
    scale: [1, 2],
    using: [render_rect(10, 10, "#f00")],
});
game.add({
    translation: [130, 140],
    scale: [1, 2],
    using: [render_rect(10, 10, "#f00")],
});

game.event_update();
