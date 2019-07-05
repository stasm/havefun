let audio = new AudioContext();

interface Instrument {
    waves: Array<Wave>;
}

interface Wave {
    osc: OscillatorNode;
    amp: GainNode;
}

function create_instrument(): Instrument {
    let waves: Array<Wave> = [];
    for (let i = 0; i < 2; i++) {
        let osc = audio.createOscillator();
        let amp = audio.createGain();
        osc.connect(amp);
        amp.connect(audio.destination);
        waves.push({osc, amp});
    }
    return {waves};
}

function play_instr(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;

    for (let [i, wave] of instr.waves.entries()) {
        wave.osc.frequency.setValueAtTime(freq, time);
        wave.amp.gain.cancelScheduledValues(time);

        let M = (document.querySelector(`#osc${i + 1}-gain-master`)! as HTMLInputElement).value;
        let A = (document.querySelector(`#osc${i + 1}-gain-attack`)! as HTMLInputElement).value;
        let S = (document.querySelector(`#osc${i + 1}-gain-sustain`)! as HTMLInputElement).value;
        let R = (document.querySelector(`#osc${i + 1}-gain-release`)! as HTMLInputElement).value;

        let m = gain(M);
        let a = envelope(A);
        let s = envelope(S);
        let r = envelope(R);

        let end;
        let gain_env = document.querySelector(`#osc${i + 1}-gain-env`)! as HTMLInputElement;
        if (gain_env.checked) {
            wave.amp.gain.linearRampToValueAtTime(0, time);
            wave.amp.gain.linearRampToValueAtTime(m, time + a);
            wave.amp.gain.setValueAtTime(m, time + a + s);
            wave.amp.gain.exponentialRampToValueAtTime(0.00001, time + a + s + r);
            end = time + a + s + r;
        } else {
            wave.amp.gain.linearRampToValueAtTime(m, time);
            end = time + 1;
        }
        wave.osc.start();
        wave.osc.stop(end);
    }
}

/**
 * Map the value of the envelope slider from range (-10,10) to ca. (0, 8).
 * @param value Value of the envelope slider.
 */
function envelope(value: string) {
    return 2 ** (parseFloat(value) / Math.E);
}

function gain(value: string) {
    return parseFloat(value) ** Math.E;
}

function freq_from_note(note: number) {
    return 440 * 2 ** ((note - 69) / 12);
}

function play_note(note: number) {
    let freq = freq_from_note(note);
    let instr = create_instrument();
    play_instr(instr, freq, 0);
}

function play_key(evt: Event) {
    let note = (evt.currentTarget! as Element).getAttribute("data-note")!;
    play_note(parseInt(note));
}

for (let key of document.querySelectorAll(".key")) {
    key.addEventListener("click", play_key);
}

async function request_midi() {
    try {
        let midi = await navigator.requestMIDIAccess();
        for (let input of midi.inputs.values()) {
            input.onmidimessage = on_midi_message;
        }
    } catch (err) {
        console.error(err);
    }
}

if (navigator.requestMIDIAccess) {
    request_midi();
}

function on_midi_message(message: WebMidi.MIDIMessageEvent) {
    let [command, note, velocity] = message.data;
    switch (command & 0xf0) {
        case 240:
            break;
        case 144: {
            let button = document.querySelector(`button.key[data-note="${note}"]`)!;
            if (velocity > 0) {
                play_note(note);
                button.classList.add("pressed");
            } else {
                button.classList.remove("pressed");
            }
        }
        default:
            console.log(command, note, velocity);
    }
}
