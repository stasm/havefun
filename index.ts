let audio = new AudioContext();

interface Instrument {
    master: GainNode;
    waves: Array<Wave>;
}

interface Wave {
    osc: OscillatorNode;
    amp: GainNode;
}

function create_instrument(): Instrument {
    let master = audio.createGain();
    let $gg = document.querySelector(`#master-gain-amount`)! as HTMLInputElement;
    let gg = (parseInt($gg.value) / 9) ** 3;
    master.gain.value = gg;

    let $filter = document.querySelector(`#master-filter-enabled`)! as HTMLInputElement;
    if ($filter.checked) {
        let $type = document.querySelector(`#master-filter-type`)! as HTMLInputElement;
        let $freq = document.querySelector(`#master-filter-freq`)! as HTMLInputElement;
        let $q = document.querySelector(`#master-filter-q`)! as HTMLInputElement;

        let freq = parseFloat($freq.value);
        let q = parseFloat($q.value);

        let flt = audio.createBiquadFilter();
        flt.type = $type.value as BiquadFilterType;
        flt.frequency.value = freq;
        flt.Q.value = q;

        master.connect(flt);
        flt.connect(audio.destination);
    } else {
        master.connect(audio.destination);
    }

    let waves: Array<Wave> = [];
    for (let i = 0; i < 2; i++) {
        let osc = audio.createOscillator();
        let amp = audio.createGain();
        osc.connect(amp);
        amp.connect(master);
        waves.push({osc, amp});
    }
    return {master, waves};
}

function play_instr(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;

    for (let [i, wave] of instr.waves.entries()) {
        let $gg = document.querySelector(`#osc${i + 1}-gain-amount`)! as HTMLInputElement;
        let $ga = document.querySelector(`#osc${i + 1}-gain-attack`)! as HTMLInputElement;
        let $gs = document.querySelector(`#osc${i + 1}-gain-sustain`)! as HTMLInputElement;
        let $gr = document.querySelector(`#osc${i + 1}-gain-release`)! as HTMLInputElement;

        let gm = (parseInt($gg.value) / 9) ** 3;
        let ga = (parseInt($ga.value) / 9) ** 3;
        let gs = (parseInt($gs.value) / 9) ** 3;
        let gr = (parseInt($gr.value) / 6) ** 3;

        // wave.amp.gain.cancelScheduledValues(time);
        wave.amp.gain.setValueAtTime(0, time);
        wave.amp.gain.linearRampToValueAtTime(gm, time + ga);
        wave.amp.gain.setValueAtTime(gm, time + ga + gs);
        wave.amp.gain.exponentialRampToValueAtTime(0.00001, time + ga + gs + gr);

        let $fd = document.querySelector(`#osc${i + 1}-freq-detune`)! as HTMLInputElement;
        let $fa = document.querySelector(`#osc${i + 1}-freq-attack`)! as HTMLInputElement;
        let $fs = document.querySelector(`#osc${i + 1}-freq-sustain`)! as HTMLInputElement;
        let $fr = document.querySelector(`#osc${i + 1}-freq-release`)! as HTMLInputElement;

        let fd = parseInt($fd.value) ** 3;
        let fa = (parseInt($fa.value) / 9) ** 3;
        let fs = (parseInt($fs.value) / 9) ** 3;
        let fr = (parseInt($fr.value) / 6) ** 3;

        // wave.osc.frequency.cancelScheduledValues(time);
        wave.osc.detune.setValueAtTime(fd, time);

        let $freq_env = document.querySelector(`#osc${i + 1}-freq-env`)! as HTMLInputElement;
        if ($freq_env.checked) {
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
