import {Action, effect} from "./actions.js";
import {Camera} from "./com_camera.js";
import {BaseComponent, Get} from "./com_index.js";
import {Pan} from "./com_pan.js";
import {RenderGeneric} from "./com_render.js";
import {Transform, transform} from "./com_transform.js";
import {Zoom} from "./com_zoom.js";
import {Rad, Vec2} from "./mth_index.js";
import {sys_camera} from "./sys_camera.js";
import {sys_pan} from "./sys_pan.js";
import {sys_render} from "./sys_render.js";
import {sys_select} from "./sys_select.js";
import {sys_transform} from "./sys_transform.js";
import {sys_zoom} from "./sys_zoom.js";

export type Entity = number;

export interface Input {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
    mouse_x_delta: number;
    mouse_y_delta: number;
    wheel_y_delta: number;
}

type Mixin = (game: Game) => (entity: Entity) => void;

export interface Blueprint {
    translation?: Vec2;
    rotation?: Rad;
    scale?: Vec2;
    using?: Array<Mixin>;
    children?: Array<Blueprint>;
}

interface Dispatch {
    (action: Action, ...args: Array<unknown>): void;
}

export class Game extends Array<Array<BaseComponent>> {
    public world: Array<number> = [];
    public [Get.Transform]: Array<Transform> = [];
    public [Get.Render]: Array<RenderGeneric> = [];
    public [Get.Camera]: Array<Camera> = [];
    public [Get.Zoom]: Array<Zoom> = [];
    public [Get.Pan]: Array<Pan> = [];

    public canvas: HTMLCanvasElement = document.querySelector("canvas")!;
    public dispatch: Dispatch;
    public ctx: CanvasRenderingContext2D;
    public input: Input = {
        mouse_x: 0,
        mouse_y: 0,
        mouse_x_delta: 0,
        mouse_y_delta: 0,
        wheel_y_delta: 0,
    };
    public camera?: Camera;
    public selection?: Entity;

    private raf: number = 0;

    constructor() {
        super();

        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.stop() : this.start()
        );

        this.dispatch = (action: Action, ...args: Array<unknown>) => {
            effect(this, action, args);
        };

        window.addEventListener("keydown", evt => (this.input[evt.code] = 1));
        window.addEventListener("keyup", evt => (this.input[evt.code] = 0));
        this.canvas.addEventListener("mouseenter", evt => {
            this.input.mouse_x = evt.offsetX;
            this.input.mouse_y = evt.offsetY;
        });
        this.canvas.addEventListener("mousedown", evt => {
            this.input[`mouse_${evt.button}_down`] = 1;
            this.input[`mouse_${evt.button}`] = 1;
        });
        this.canvas.addEventListener("mouseup", evt => {
            this.input[`mouse_${evt.button}_up`] = 1;
            this.input[`mouse_${evt.button}`] = 0;
        });
        this.canvas.addEventListener("mousemove", evt => {
            this.input.mouse_x += evt.movementX;
            this.input.mouse_y += evt.movementY;
            this.input.mouse_x_delta = evt.movementX;
            this.input.mouse_y_delta = evt.movementY;
        });
        this.canvas.addEventListener("wheel", (evt: WheelEvent) => {
            this.input.wheel_y_delta = evt.deltaY;
        });

        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.imageSmoothingEnabled = false;
    }

    create_entity(mask: number) {
        for (let i = 0; i < this.world.length; i++) {
            if (!this.world[i]) {
                this.world[i] = mask;
                return i;
            }
        }

        this.world.push(mask);
        return this.world.length - 1;
    }

    frame_update(delta: number) {
        sys_zoom(this, delta);
        sys_pan(this, delta);
        sys_select(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_render(this, delta);
    }

    start() {
        let last = performance.now();

        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            this.frame_update(delta);

            for (let name in this.input) {
                if (name.endsWith("_delta") || name.endsWith("_down") || name.endsWith("_up")) {
                    this.input[name] = 0;
                }
            }

            last = now;
            this.raf = requestAnimationFrame(tick);
        };

        this.stop();
        tick(last);
    }

    stop() {
        cancelAnimationFrame(this.raf);
    }

    add({translation, rotation, scale, using = [], children = []}: Blueprint) {
        let entity = this.create_entity(Get.Transform);
        transform(translation, rotation, scale)(this)(entity);
        for (let mixin of using) {
            mixin(this)(entity);
        }
        let entity_transform = this[Get.Transform][entity];
        for (let subtree of children) {
            let child = this.add(subtree);
            let child_transform = this[Get.Transform][child];
            child_transform.parent = entity_transform;
            entity_transform.children.push(child_transform);
        }
        return entity;
    }

    destroy(entity: Entity) {
        let mask = this.world[entity];
        if (mask & Get.Transform) {
            for (let child of this[Get.Transform][entity].children) {
                this.destroy(child.entity);
            }
        }
        this.world[entity] = Get.None;
    }
}
