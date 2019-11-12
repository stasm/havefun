import {Instrument, play_instr} from "./player";

export function request_midi(audio: AudioContext, instr: Instrument) {
    navigator
        .requestMIDIAccess()
        .then(midi => {
            for (let input of midi.inputs.values()) {
                console.log(input);
                input.onmidimessage = message => on_midi_message(audio, instr, message);
            }
        })
        .catch(console.error);
}

function on_midi_message(
    audio: AudioContext,
    instr: Instrument,
    message: WebMidi.MIDIMessageEvent
) {
    let [command, note, velocity] = message.data;
    switch (command & 0xf0) {
        case 240:
            break;
        case 144: {
            let button = document.querySelector(`button.key[data-note="${note}"]`);
            if (velocity > 0) {
                play_instr(audio, instr, note, 0);
                button && button.classList.add("pressed");
            } else {
                button && button.classList.remove("pressed");
            }
        }
        default:
            console.log(command, note, velocity);
    }
}
