let audio = new AudioContext();

interface Instrument {
    master: GainNode;
    waves: Array<Wave>;
    lfo?: OscillatorNode;
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

    let lfa, lfo;
    let $lfo = $('input[name="master-lfo-enabled"]')! as HTMLInputElement;
    if ($lfo.checked) {
        let $lg = $('input[name="master-lfo-amount"]')! as HTMLInputElement;
        let $lf = $('input[name="master-lfo-freq"]')! as HTMLInputElement;

        // [27, 5832];
        let lg = (parseFloat($lg.value) + 3) ** 3;
        // [0, 225]
        let lf = parseFloat($lf.value) ** 2;

        lfo = audio.createOscillator();
        lfo.frequency.value = lf;

        lfa = audio.createGain();
        lfa.gain.value = lg;

        lfo.connect(lfa);
    }

    let $filter = $(`#master-filter-enabled`)! as HTMLInputElement;
    if ($filter.checked) {
        let $type = $(`input[name="master-filter-type"]:checked`)! as HTMLInputElement;
        let $freq = $(`#master-filter-freq`)! as HTMLInputElement;
        let $q = $(`#master-filter-q`)! as HTMLInputElement;
        let $detune = $(`input[name="master-lfo-filter-detune"]`)! as HTMLInputElement;

        let freq = 2 ** parseInt($freq.value);
        let q = parseFloat($q.value) ** 1.5;

        let flt = audio.createBiquadFilter();
        flt.type = $type.value as BiquadFilterType;
        flt.frequency.value = freq;
        flt.Q.value = q;
        if (lfa && $detune.checked) {
            lfa.connect(flt.detune);
        }

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
    return {master, waves, lfo};
}

function play_instr(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;
    let duration = 0;

    for (let [i, wave] of instr.waves.entries()) {
        let $gg = document.querySelector(`#osc${i + 1}-gain-amount`)! as HTMLInputElement;
        let $ga = document.querySelector(`#osc${i + 1}-gain-attack`)! as HTMLInputElement;
        let $gs = document.querySelector(`#osc${i + 1}-gain-sustain`)! as HTMLInputElement;
        let $gr = document.querySelector(`#osc${i + 1}-gain-release`)! as HTMLInputElement;

        let gm = (parseInt($gg.value) / 9) ** 3;
        let ga = (parseInt($ga.value) / 9) ** 3;
        let gs = (parseInt($gs.value) / 9) ** 3;
        let gr = (parseInt($gr.value) / 6) ** 3;

        duration = Math.max(duration, ga + gs + gr);

        // wave.amp.gain.cancelScheduledValues(time);
        wave.amp.gain.setValueAtTime(0, time);
        wave.amp.gain.linearRampToValueAtTime(gm, time + ga);
        wave.amp.gain.setValueAtTime(gm, time + ga + gs);
        wave.amp.gain.exponentialRampToValueAtTime(0.00001, time + ga + gs + gr);

        let $fd = document.querySelector(`#osc${i + 1}-freq-detune`)! as HTMLInputElement;
        let $fa = document.querySelector(`#osc${i + 1}-freq-attack`)! as HTMLInputElement;
        let $fs = document.querySelector(`#osc${i + 1}-freq-sustain`)! as HTMLInputElement;
        let $fr = document.querySelector(`#osc${i + 1}-freq-release`)! as HTMLInputElement;

        // [-1265,1265] i.e. one octave down and one octave up.
        let fd = 3 * (parseInt($fd.value) - 7.5) ** 3;
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

    if (instr.lfo) {
        instr.lfo.start();
        instr.lfo.stop(time + duration);
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

function $(selector: string) {
    return document.querySelector(selector);
}
