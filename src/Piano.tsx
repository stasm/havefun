import * as React from "react";
import {request_midi} from "./midi";
import {Instrument, play_instr} from "./player";

export function Piano({instr}: {instr: Instrument}) {
    let [audio] = React.useState(new AudioContext());
    let instr_ref = React.useRef(instr);
    instr_ref.current = instr;

    React.useEffect(() => {
        if (navigator.requestMIDIAccess) {
            request_midi(play_note);
        }
    }, []);

    function play_note(note: number) {
        play_instr(audio, instr_ref.current, note, 0);
    }

    function play_key(evt: React.MouseEvent) {
        let note = evt.currentTarget.getAttribute("data-note")!;
        play_instr(audio, instr, parseInt(note), 0);
    }

    return (
        <div className="group">
            <h2>Piano</h2>
            <div className="row">
                <button className="key white" onClick={play_key} data-note="48"></button>
                <button className="key black" onClick={play_key} data-note="49"></button>
                <button className="key white" onClick={play_key} data-note="50"></button>
                <button className="key black" onClick={play_key} data-note="51"></button>
                <button className="key white" onClick={play_key} data-note="52"></button>
                <button className="key white" onClick={play_key} data-note="53"></button>
                <button className="key black" onClick={play_key} data-note="54"></button>
                <button className="key white" onClick={play_key} data-note="55"></button>
                <button className="key black" onClick={play_key} data-note="56"></button>
                <button className="key white" onClick={play_key} data-note="57"></button>
                <button className="key black" onClick={play_key} data-note="58"></button>
                <button className="key white" onClick={play_key} data-note="59"></button>
                <button className="key white" onClick={play_key} data-note="60"></button>
                <button className="key black" onClick={play_key} data-note="61"></button>
                <button className="key white" onClick={play_key} data-note="62"></button>
                <button className="key black" onClick={play_key} data-note="63"></button>
                <button className="key white" onClick={play_key} data-note="64"></button>
                <button className="key white" onClick={play_key} data-note="65"></button>
                <button className="key black" onClick={play_key} data-note="66"></button>
                <button className="key white" onClick={play_key} data-note="67"></button>
                <button className="key black" onClick={play_key} data-note="68"></button>
                <button className="key white" onClick={play_key} data-note="69"></button>
                <button className="key black" onClick={play_key} data-note="70"></button>
                <button className="key white" onClick={play_key} data-note="71"></button>
                <button className="key white" onClick={play_key} data-note="72"></button>
                <button className="key black" onClick={play_key} data-note="73"></button>
                <button className="key white" onClick={play_key} data-note="74"></button>
                <button className="key black" onClick={play_key} data-note="75"></button>
                <button className="key white" onClick={play_key} data-note="76"></button>
                <button className="key white" onClick={play_key} data-note="77"></button>
                <button className="key black" onClick={play_key} data-note="78"></button>
                <button className="key white" onClick={play_key} data-note="79"></button>
                <button className="key black" onClick={play_key} data-note="80"></button>
                <button className="key white" onClick={play_key} data-note="81"></button>
                <button className="key black" onClick={play_key} data-note="82"></button>
                <button className="key white" onClick={play_key} data-note="83"></button>
                <button className="key white" onClick={play_key} data-note="84"></button>
            </div>
        </div>
    );
}
