import {Game} from "./game.js";

export const enum Action {
    PAN_START,
    PAN_STOP,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.PAN_START: {
            game.canvas.classList.add("panning");
            break;
        }
        case Action.PAN_STOP: {
            if (game.canvas.classList.contains("panning")) {
                game.canvas.classList.remove("panning");
            }
            break;
        }
    }
}
