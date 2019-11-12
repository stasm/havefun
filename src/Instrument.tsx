import * as React from "react";
import {init_instr, with_instr} from "./adapter";
import {Master} from "./Master";
import {Noise} from "./Noise";
import {Oscillator} from "./Oscillator";
import {Piano} from "./Piano";
import {INITIAL_STATE, reducer} from "./state";

export function Instrument({
    audio,
    add_instrument,
    remove_self,
}: {
    audio: AudioContext;
    add_instrument: () => void;
    remove_self: () => void;
}) {
    let [state, dispatch] = React.useReducer(with_instr(reducer), INITIAL_STATE, init_instr);

    return (
        <>
            <div className="row">
                <div className="group">
                    <h2>Commands</h2>
                    <div>
                        <button
                            className="command"
                            onClick={() => dispatch({kind: "ADD_OSCILLATOR"})}
                        >
                            Add oscillator
                        </button>
                    </div>
                    <div>
                        <button className="command" onClick={() => dispatch({kind: "ADD_NOISE"})}>
                            Add noise
                        </button>
                    </div>
                    <hr />
                    <div>
                        <button
                            className="command"
                            onClick={() => alert(JSON.stringify(state.instrument))}
                        >
                            Export instrument
                        </button>
                    </div>
                    <div>
                        <button
                            className="command"
                            onClick={() => {
                                let instr = JSON.parse(prompt("Pase JSON:")!);
                                dispatch({kind: "IMPORT_INSTR", instr});
                            }}
                        >
                            Import instrument
                        </button>
                    </div>
                    <hr />
                    <div>
                        <button className="command" onClick={add_instrument}>
                            Add instrument
                        </button>
                    </div>
                    <div>
                        <button className="command" onClick={remove_self}>
                            Remove
                        </button>
                    </div>
                </div>
                <Master
                    change={evt =>
                        dispatch({
                            kind: "CHANGE_MASTER",
                            target: evt.target as HTMLInputElement,
                        })
                    }
                    instr={state}
                />
                {state.sources.map((source, index) => {
                    switch (source.kind) {
                        case "noise":
                            return (
                                <Noise
                                    key={index}
                                    change={evt =>
                                        dispatch({
                                            kind: "CHANGE_SOURCE",
                                            target: evt.target as HTMLInputElement,
                                            index,
                                        })
                                    }
                                    remove={() =>
                                        dispatch({
                                            kind: "REMOVE_SOURCE",
                                            index,
                                        })
                                    }
                                    source={source}
                                />
                            );
                        case "oscillator":
                            return (
                                <Oscillator
                                    key={index}
                                    change={evt =>
                                        dispatch({
                                            kind: "CHANGE_SOURCE",
                                            target: evt.target as HTMLInputElement,
                                            index,
                                        })
                                    }
                                    remove={() =>
                                        dispatch({
                                            kind: "REMOVE_SOURCE",
                                            index,
                                        })
                                    }
                                    source={source}
                                />
                            );
                    }
                })}
            </div>
            {state.instrument && (
                <div className="row">
                    <Piano audio={audio} instr={state.instrument} />
                </div>
            )}
        </>
    );
}
