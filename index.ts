let audio = new AudioContext();

interface Oscillator {
    gain_amount: number;
    gain_attack: number;
    gain_sustain: number;
    gain_release: number;
    detune_cents: number;
    freq_enabled: boolean;
    freq_attack: number;
    freq_sustain: number;
    freq_release: number;
    lfo_detune: boolean;
}

interface Instrument {
    gain: number;
    filter_enabled: boolean;
    filter_type: BiquadFilterType;
    filter_freq: number;
    filter_q: number;
    lfo_enabled: boolean;
    lfo_amount: number;
    lfo_freq: number;
    lfo_filter_detune: boolean;
    noise_gain_amount: number;
    noise_gain_attack: number;
    noise_gain_sustain: number;
    noise_gain_release: number;
    oscillators: Array<Oscillator>;
}

function create_instrument(): Instrument {
    let $gg = $(`#master-gain-amount`)! as HTMLInputElement;

    let $filter = $(`#master-filter-enabled`)! as HTMLInputElement;
    let $type = $(`input[name="master-filter-type"]:checked`)! as HTMLInputElement;
    let $freq = $(`#master-filter-freq`)! as HTMLInputElement;
    let $q = $(`#master-filter-q`)! as HTMLInputElement;
    let $detune = $(`input[name="master-lfo-filter-detune"]`)! as HTMLInputElement;

    let $lfo = $('input[name="master-lfo-enabled"]')! as HTMLInputElement;
    let $lg = $('input[name="master-lfo-amount"]')! as HTMLInputElement;
    let $lf = $('input[name="master-lfo-freq"]')! as HTMLInputElement;

    let $ng = $('input[name="noise-gain-amount"]')! as HTMLInputElement;
    let $na = $('input[name="noise-gain-attack"]')! as HTMLInputElement;
    let $ns = $('input[name="noise-gain-sustain"]')! as HTMLInputElement;
    let $nr = $('input[name="noise-gain-release"]')! as HTMLInputElement;

    let oscillators: Array<Oscillator> = [];
    for (let i = 1; i < 3; i++) {
        let $gg = $(`#osc${i}-gain-amount`)! as HTMLInputElement;
        let $ga = $(`#osc${i}-gain-attack`)! as HTMLInputElement;
        let $gs = $(`#osc${i}-gain-sustain`)! as HTMLInputElement;
        let $gr = $(`#osc${i}-gain-release`)! as HTMLInputElement;

        let $fd = $(`#osc${i}-freq-detune`)! as HTMLInputElement;

        let $fe = $(`#osc${i}-freq-env`)! as HTMLInputElement;
        let $fa = $(`#osc${i}-freq-attack`)! as HTMLInputElement;
        let $fs = $(`#osc${i}-freq-sustain`)! as HTMLInputElement;
        let $fr = $(`#osc${i}-freq-release`)! as HTMLInputElement;

        let $ld = $(`input[name="master-lfo-osc${i}-detune`)! as HTMLInputElement;

        oscillators.push({
            gain_amount: parseInt($gg.value),
            gain_attack: parseInt($ga.value),
            gain_sustain: parseInt($gs.value),
            gain_release: parseInt($gr.value),
            detune_cents: parseInt($fd.value),
            freq_enabled: $fe.checked,
            freq_attack: parseInt($fa.value),
            freq_sustain: parseInt($fs.value),
            freq_release: parseInt($fr.value),
            lfo_detune: $ld.checked,
        });
    }

    return {
        gain: parseInt($gg.value),

        filter_enabled: $filter.checked,
        filter_type: $type.value as BiquadFilterType,
        filter_freq: parseInt($freq.value),
        filter_q: parseInt($q.value),

        lfo_enabled: $lfo.checked,
        lfo_amount: parseInt($lg.value),
        lfo_freq: parseInt($lf.value),
        lfo_filter_detune: $detune.checked,

        noise_gain_amount: parseInt($ng.value),
        noise_gain_attack: parseInt($na.value),
        noise_gain_sustain: parseInt($ns.value),
        noise_gain_release: parseInt($nr.value),

        oscillators,
    };
}

function play_instr(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;
    let duration = 0;

    let master = audio.createGain();
    let gg = (instr.gain / 9) ** 3;
    master.gain.value = gg;

    let lfa, lfo;
    if (instr.lfo_enabled) {
        // [27, 5832];
        let lg = (instr.lfo_amount + 3) ** 3;
        // [0, 125]
        let lf = (instr.lfo_freq / 3) ** 3;

        lfo = audio.createOscillator();
        lfo.frequency.value = lf;

        lfa = audio.createGain();
        lfa.gain.value = lg;

        lfo.connect(lfa);
    }

    if (instr.filter_enabled) {
        let freq = 2 ** instr.filter_freq;
        let q = instr.filter_q ** 1.5;

        let flt = audio.createBiquadFilter();
        flt.type = instr.filter_type;
        flt.frequency.value = freq;
        flt.Q.value = q;
        if (lfa && instr.lfo_filter_detune) {
            lfa.connect(flt.detune);
        }

        master.connect(flt);
        flt.connect(audio.destination);
    } else {
        master.connect(audio.destination);
    }

    let ng = (instr.noise_gain_amount / 9) ** 3;
    if (ng > 0) {
        let noise_source = audio.createBufferSource();
        let noise_gain = audio.createGain();
        noise_source.buffer = noise_buffer;
        noise_source.loop = true;
        noise_source.connect(noise_gain);
        noise_gain.connect(master);

        let na = (instr.noise_gain_attack / 9) ** 3;
        let ns = (instr.noise_gain_sustain / 9) ** 3;
        let nr = (instr.noise_gain_release / 6) ** 3;

        duration = Math.max(duration, na + ns + nr);

        noise_gain.gain.setValueAtTime(0, time);
        noise_gain.gain.linearRampToValueAtTime(ng, time + na);
        noise_gain.gain.setValueAtTime(ng, time + na + ns);
        noise_gain.gain.exponentialRampToValueAtTime(0.00001, time + na + ns + nr);

        noise_source.start();
        noise_source.stop(time + na + ns + nr);
    }

    for (let osc of instr.oscillators) {
        let hfo = audio.createOscillator();
        let amp = audio.createGain();
        hfo.connect(amp);
        amp.connect(master);

        let gg = (osc.gain_amount / 9) ** 3;
        let ga = (osc.gain_attack / 9) ** 3;
        let gs = (osc.gain_sustain / 9) ** 3;
        let gr = (osc.gain_release / 6) ** 3;

        duration = Math.max(duration, ga + gs + gr);

        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gg, time + ga);
        amp.gain.setValueAtTime(gg, time + ga + gs);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + ga + gs + gr);

        // [-1265,1265] i.e. one octave down and one octave up.
        let dc = 3 * (osc.detune_cents - 7.5) ** 3;
        let fa = (osc.freq_attack / 9) ** 3;
        let fs = (osc.freq_sustain / 9) ** 3;
        let fr = (osc.freq_release / 6) ** 3;

        // The intrinsic value of detune…
        hfo.detune.value = dc;
        // …can be modulated by the LFO.
        if (lfa && osc.lfo_detune) {
            lfa.connect(hfo.detune);
        }

        if (osc.freq_enabled) {
            hfo.frequency.linearRampToValueAtTime(0, time);
            hfo.frequency.linearRampToValueAtTime(freq, time + fa);
            hfo.frequency.setValueAtTime(freq, time + fa + fs);
            hfo.frequency.exponentialRampToValueAtTime(0.00001, time + fa + fs + fr);
        } else {
            hfo.frequency.setValueAtTime(freq, time);
        }

        hfo.start();
        hfo.stop(time + ga + gs + gr);
    }

    if (lfo) {
        lfo.start();
        lfo.stop(time + duration);
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
            let button = $(`button.key[data-note="${note}"]`);
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

let buffer_size = 2 * audio.sampleRate;
let noise_buffer = audio.createBuffer(1, buffer_size, audio.sampleRate);
let output = noise_buffer.getChannelData(0);

for (var i = 0; i < buffer_size; i++) {
    output[i] = Math.random() * 2 - 1;
}
