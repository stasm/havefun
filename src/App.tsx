import * as React from "react";
import {Instrument} from "./Instrument";

export function App() {
    let [audio] = React.useState(new AudioContext());
    let [next_id, set_next_id] = React.useState(1);
    let [instruments, set_instruments] = React.useState([0]);

    function add_instrument() {
        set_instruments(instruments => [...instruments, next_id]);
        set_next_id(id => id + 1);
    }

    function remove_instrument(id: number) {
        set_instruments(instruments => instruments.filter(instrument => instrument !== id));
    }

    return (
        <>
            <h1>Have Fun Audio Editor</h1>
            {instruments.map(key => (
                <Instrument
                    key={key}
                    audio={audio}
                    add_instrument={add_instrument}
                    remove_self={() => remove_instrument(key)}
                />
            ))}
        </>
    );
}
