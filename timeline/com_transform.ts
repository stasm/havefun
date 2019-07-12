import {Entity, Game} from "./game.js";
import {create} from "./mth_mat2d.js";
import {Rad, Vec2, Mat2D} from "./mth_index.js";
import {BaseComponent, Get} from "./com_index.js";

export interface Transform extends BaseComponent {
    /** Absolute matrix relative to the world. */
    world: Mat2D;
    /** World to self matrix. */
    self: Mat2D;
    /** Local translation relative to the parent. */
    translation: Vec2;
    /** Local rotation relative to the parent. */
    rotation: Rad;
    /** Local scale relative to the parent. */
    scale: Vec2;
    /** This Transform's entity id. */
    readonly entity: Entity;
    parent?: Transform;
    children: Array<Transform>;
    dirty: boolean;
}

export function transform(translation: Vec2 = [0, 0], rotation: Rad = 0, scale: Vec2 = [1, 1]) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= Get.Transform;
        game[Get.Transform][entity] = <Transform>{
            entity,
            world: create(),
            self: create(),
            translation,
            rotation,
            scale,
            children: [],
            dirty: true,
        };
    };
}

/**
 * Get all component instances of a given type from the current entity and all
 * its children.
 *
 * @param game Game object which stores the component data.
 * @param transform The transform to traverse.
 * @param mask Component mask to look for.
 */
export function* components_of_type<T>(
    game: Game,
    transform: Transform,
    mask: Get
): IterableIterator<T> {
    if (game.world[transform.entity] & mask) {
        yield (game[mask][transform.entity] as unknown) as T;
    }
    for (let child of transform.children) {
        yield* components_of_type<T>(game, child, mask);
    }
}
