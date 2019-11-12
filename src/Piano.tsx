import * as React from "react";
import {request_midi} from "./midi";
import {Instrument, play_instr} from "./player";

type InputMode = "None" | "MIDI" | "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft";

export function Piano({audio, instr}: {audio: AudioContext; instr: Instrument}) {
    let [input_mode, set_input_mode] = React.useState<InputMode>("None");

    let ref = React.useRef({instr, input_mode});
    ref.current = {instr, input_mode};

    React.useEffect(() => {
        window.addEventListener("keydown", play_key);
        return () => {
            window.removeEventListener("keydown", play_key);
        };
    }, []);

    function play_key(evt: KeyboardEvent) {
        if (evt.key.startsWith("Arrow")) {
            evt.preventDefault();
        }
        if (evt.key === ref.current.input_mode) {
            play_instr(audio, ref.current.instr, 45, 0);
        }
    }

    React.useEffect(() => {
        if (navigator.requestMIDIAccess) {
            request_midi(play_note);
        }
    }, []);

    function play_note(note: number) {
        if (ref.current.input_mode === "MIDI") {
            play_instr(audio, ref.current.instr, note, 0);
        }
    }

    function play_button(evt: React.MouseEvent) {
        let note = evt.currentTarget.getAttribute("data-note")!;
        play_instr(audio, instr, parseInt(note), 0);
    }

    return (
        <div className="group">
            <div className="row title">
                <h2>Piano</h2>
                <label>
                    Input:
                    <select
                        value={input_mode}
                        onChange={evt => set_input_mode(evt.target.value as InputMode)}
                    >
                        <option value="None">None</option>
                        <option value="MIDI">MIDI</option>
                        <option value="ArrowUp">Arrow Up</option>
                        <option value="ArrowRight">Arrow Right</option>
                        <option value="ArrowDown">Arrow Down</option>
                        <option value="ArrowLeft">Arrow Left</option>
                    </select>
                </label>
            </div>
            <div className="row">
                <button className="key white" onClick={play_button} data-note="48"></button>
                <button className="key black" onClick={play_button} data-note="49"></button>
                <button className="key white" onClick={play_button} data-note="50"></button>
                <button className="key black" onClick={play_button} data-note="51"></button>
                <button className="key white" onClick={play_button} data-note="52"></button>
                <button className="key white" onClick={play_button} data-note="53"></button>
                <button className="key black" onClick={play_button} data-note="54"></button>
                <button className="key white" onClick={play_button} data-note="55"></button>
                <button className="key black" onClick={play_button} data-note="56"></button>
                <button className="key white" onClick={play_button} data-note="57"></button>
                <button className="key black" onClick={play_button} data-note="58"></button>
                <button className="key white" onClick={play_button} data-note="59"></button>
                <button className="key white" onClick={play_button} data-note="60"></button>
                <button className="key black" onClick={play_button} data-note="61"></button>
                <button className="key white" onClick={play_button} data-note="62"></button>
                <button className="key black" onClick={play_button} data-note="63"></button>
                <button className="key white" onClick={play_button} data-note="64"></button>
                <button className="key white" onClick={play_button} data-note="65"></button>
                <button className="key black" onClick={play_button} data-note="66"></button>
                <button className="key white" onClick={play_button} data-note="67"></button>
                <button className="key black" onClick={play_button} data-note="68"></button>
                <button className="key white" onClick={play_button} data-note="69"></button>
                <button className="key black" onClick={play_button} data-note="70"></button>
                <button className="key white" onClick={play_button} data-note="71"></button>
                <button className="key white" onClick={play_button} data-note="72"></button>
                <button className="key black" onClick={play_button} data-note="73"></button>
                <button className="key white" onClick={play_button} data-note="74"></button>
                <button className="key black" onClick={play_button} data-note="75"></button>
                <button className="key white" onClick={play_button} data-note="76"></button>
                <button className="key white" onClick={play_button} data-note="77"></button>
                <button className="key black" onClick={play_button} data-note="78"></button>
                <button className="key white" onClick={play_button} data-note="79"></button>
                <button className="key black" onClick={play_button} data-note="80"></button>
                <button className="key white" onClick={play_button} data-note="81"></button>
                <button className="key black" onClick={play_button} data-note="82"></button>
                <button className="key white" onClick={play_button} data-note="83"></button>
                <button className="key white" onClick={play_button} data-note="84"></button>
            </div>
        </div>
    );
}
