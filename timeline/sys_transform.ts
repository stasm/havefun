import {Get} from "./com_index.js";
import {Transform} from "./com_transform.js";
import {Game} from "./game.js";
import {
    create,
    from_rotation,
    from_scaling,
    from_translation,
    invert,
    multiply,
} from "./mth_mat2d.js";

const QUERY = Get.Transform;

export function sys_transform(game: Game) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game[Get.Transform][i]);
        }
    }
}

function update(transform: Transform) {
    if (transform.dirty) {
        transform.dirty = false;
        set_children_as_dirty(transform);

        // TODO Optimize this.
        let translation = from_translation(create(), transform.translation);
        let rotation = from_rotation(create(), transform.rotation);
        let scale = from_scaling(create(), transform.scale);

        multiply(transform.world, translation, rotation);
        multiply(transform.world, transform.world, scale);

        if (transform.parent) {
            multiply(transform.world, transform.parent.world, transform.world);
        }

        invert(transform.self, transform.world);
    }
}

function set_children_as_dirty(transform: Transform) {
    for (let child of transform.children) {
        child.dirty = true;
        set_children_as_dirty(child);
    }
}
