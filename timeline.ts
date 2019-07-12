import {camera} from "./timeline/com_camera.js";
import {render_rect} from "./timeline/com_render.js";
import {Game} from "./timeline/game.js";

let game = new Game();

game.add({
    translation: [0, 0],
    scale: [1, 1],
    using: [camera()],
});

game.add({
    translation: [100, 100],
    scale: [2, 2],
    using: [render_rect("#f00")],
});

game.start();
