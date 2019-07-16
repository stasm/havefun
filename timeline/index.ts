import {Get} from "./com_index.js";
import {pan} from "./com_pan.js";
import {render_rect} from "./com_render.js";
import {selectable} from "./com_selectable.js";
import {anchor} from "./com_transform.js";
import {zoom} from "./com_zoom.js";
import {Game} from "./game.js";

export let game = new Game();

let timeline = game.add({
    translation: [0, 10],
    scale: [1, 1],
    using: [zoom(1.1), pan(1)],
});

let tracks = [
    {
        notes: [72, , , , 74, , , , 72, 0, 127],
    },
];

for (let track of tracks) {
    let track_entity = game.add({
        translation: [0, 0],
        scale: [1, 1],
        using: [render_rect(track.notes.length * 10, 160, "#fff")],
    });

    anchor(game[Get.Transform][timeline], game[Get.Transform][track_entity]);

    for (let i = 0; i < track.notes.length; i++) {
        let note = track.notes[i];
        if (note !== undefined) {
            let note_entity = game.add({
                translation: [i * 10, 128 - note],
                using: [render_rect(10, 32, "#f00"), selectable()],
            });
            anchor(game[Get.Transform][track_entity], game[Get.Transform][note_entity]);
        }
    }
}

game.event_update();
