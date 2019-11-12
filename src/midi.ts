export function request_midi(play_note: (note: number) => void) {
    navigator
        .requestMIDIAccess()
        .then(midi => {
            for (let input of midi.inputs.values()) {
                input.onmidimessage = message => on_midi_message(play_note, message);
            }
        })
        .catch(console.error);
}

function on_midi_message(play_note: (note: number) => void, message: WebMidi.MIDIMessageEvent) {
    let [command, note, velocity] = message.data;
    switch (command & 0xf0) {
        case 240:
            break;
        case 144: {
            let button = document.querySelector(`button.key[data-note="${note}"]`);
            if (velocity > 0) {
                play_note(note);
                button && button.classList.add("pressed");
            } else {
                button && button.classList.remove("pressed");
            }
        }
        default:
            console.log(command, note, velocity);
    }
}
