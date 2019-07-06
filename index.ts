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
        let GM = (document.querySelector(`#osc${i + 1}-gain-master`)! as HTMLInputElement).value;
        let GA = (document.querySelector(`#osc${i + 1}-gain-attack`)! as HTMLInputElement).value;
        let GS = (document.querySelector(`#osc${i + 1}-gain-sustain`)! as HTMLInputElement).value;
        let GR = (document.querySelector(`#osc${i + 1}-gain-release`)! as HTMLInputElement).value;

        let gm = (parseInt(GM) / 9) ** 3;
        let ga = (parseInt(GA) / 9) ** 3;
        let gs = (parseInt(GS) / 9) ** 3;
        let gr = (parseInt(GR) / 6) ** 3;

        // wave.amp.gain.cancelScheduledValues(time);
        wave.amp.gain.setValueAtTime(0, time);
        wave.amp.gain.linearRampToValueAtTime(gm, time + ga);
        wave.amp.gain.setValueAtTime(gm, time + ga + gs);
        wave.amp.gain.exponentialRampToValueAtTime(0.00001, time + ga + gs + gr);

        let FD = (document.querySelector(`#osc${i + 1}-freq-detune`)! as HTMLInputElement).value;
        let FA = (document.querySelector(`#osc${i + 1}-freq-attack`)! as HTMLInputElement).value;
        let FS = (document.querySelector(`#osc${i + 1}-freq-sustain`)! as HTMLInputElement).value;
        let FR = (document.querySelector(`#osc${i + 1}-freq-release`)! as HTMLInputElement).value;

        let fd = parseInt(FD) ** 3;
        let fa = (parseInt(FA) / 9) ** 3;
        let fs = (parseInt(FS) / 9) ** 3;
        let fr = (parseInt(FR) / 6) ** 3;

        // wave.osc.frequency.cancelScheduledValues(time);
        wave.osc.detune.setValueAtTime(fd, time);

        let freq_env = document.querySelector(`#osc${i + 1}-freq-env`)! as HTMLInputElement;
        if (freq_env.checked) {
            wave.osc.frequency.linearRampToValueAtTime(0, time);
            wave.osc.frequency.linearRampToValueAtTime(freq, time + fa);
            wave.osc.frequency.setValueAtTime(freq, time + fa + fs);
            wave.osc.frequency.exponentialRampToValueAtTime(0.00001, time + fa + fs + fr);
        } else {
            wave.osc.frequency.setValueAtTime(freq, time);
        }

        wave.osc.start();
        wave.osc.stop(time + ga + gs + gr);
    }
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
