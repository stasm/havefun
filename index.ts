let audio = new AudioContext();

interface Instrument {
    [InstrumentParam.MasterGainAmount]: number;
    [InstrumentParam.FilterEnabled]: boolean;
    [InstrumentParam.FilterType]: BiquadFilterType;
    [InstrumentParam.FilterFreq]: number;
    [InstrumentParam.FilterQ]: number;
    [InstrumentParam.LFOEnabled]: boolean;
    [InstrumentParam.LFOAmount]: number;
    [InstrumentParam.LFOFreq]: number;
    [InstrumentParam.FilterDetuneLFO]: boolean;
    [InstrumentParam.NoiseGainAmount]: number;
    [InstrumentParam.NoiseGainAttack]: number;
    [InstrumentParam.NoiseGainSustain]: number;
    [InstrumentParam.NoiseGainRelease]: number;
    [InstrumentParam.Oscillators]: Array<Oscillator>;
}

interface Oscillator {
    [OscillatorParam.GainAmount]: number;
    [OscillatorParam.GainAttack]: number;
    [OscillatorParam.GainSustain]: number;
    [OscillatorParam.GainRelease]: number;
    [OscillatorParam.DetuneAmount]: number;
    [OscillatorParam.DetuneLFO]: boolean;
    [OscillatorParam.FreqEnabled]: boolean;
    [OscillatorParam.FreqAttack]: number;
    [OscillatorParam.FreqSustain]: number;
    [OscillatorParam.FreqRelease]: number;
}

const enum InstrumentParam {
    MasterGainAmount,
    FilterEnabled,
    FilterType,
    FilterFreq,
    FilterQ,
    FilterDetuneLFO,
    LFOEnabled,
    LFOAmount,
    LFOFreq,
    NoiseGainAmount,
    NoiseGainAttack,
    NoiseGainSustain,
    NoiseGainRelease,
    Oscillators,
}

const enum OscillatorParam {
    GainAmount,
    GainAttack,
    GainSustain,
    GainRelease,
    DetuneAmount,
    DetuneLFO,
    FreqEnabled,
    FreqAttack,
    FreqSustain,
    FreqRelease,
}

function create_instrument(): Instrument {
    let $gg = $(`#master-gain-amount`)! as HTMLInputElement;

    let $filter = $(`#master-filter-enabled`)! as HTMLInputElement;
    let $type = $(`input[name="master-filter-type"]:checked`)! as HTMLInputElement;
    let $freq = $(`#master-filter-freq`)! as HTMLInputElement;
    let $q = $(`#master-filter-q`)! as HTMLInputElement;
    let $detune = $(`input[name="master-filter-detune-lfo"]`)! as HTMLInputElement;

    let $lfo = $('input[name="master-lfo-enabled"]')! as HTMLInputElement;
    let $lg = $('input[name="master-lfo-amount"]')! as HTMLInputElement;
    let $lf = $('input[name="master-lfo-freq"]')! as HTMLInputElement;

    let $ng = $('input[name="noise-gain-amount"]')! as HTMLInputElement;
    let $na = $('input[name="noise-gain-attack"]')! as HTMLInputElement;
    let $ns = $('input[name="noise-gain-sustain"]')! as HTMLInputElement;
    let $nr = $('input[name="noise-gain-release"]')! as HTMLInputElement;

    let instrument = [];
    instrument[InstrumentParam.MasterGainAmount] = parseInt($gg.value);

    instrument[InstrumentParam.FilterEnabled] = $filter.checked;
    instrument[InstrumentParam.FilterType] = $type.value as BiquadFilterType;
    instrument[InstrumentParam.FilterFreq] = parseInt($freq.value);
    instrument[InstrumentParam.FilterQ] = parseInt($q.value);
    instrument[InstrumentParam.FilterDetuneLFO] = $detune.checked;

    instrument[InstrumentParam.LFOEnabled] = $lfo.checked;
    instrument[InstrumentParam.LFOAmount] = parseInt($lg.value);
    instrument[InstrumentParam.LFOFreq] = parseInt($lf.value);

    instrument[InstrumentParam.NoiseGainAmount] = parseInt($ng.value);
    instrument[InstrumentParam.NoiseGainAttack] = parseInt($na.value);
    instrument[InstrumentParam.NoiseGainSustain] = parseInt($ns.value);
    instrument[InstrumentParam.NoiseGainRelease] = parseInt($nr.value);

    instrument[InstrumentParam.Oscillators] = [];

    for (let i = 1; i < 3; i++) {
        let $gg = $(`#osc${i}-gain-amount`)! as HTMLInputElement;
        let $ga = $(`#osc${i}-gain-attack`)! as HTMLInputElement;
        let $gs = $(`#osc${i}-gain-sustain`)! as HTMLInputElement;
        let $gr = $(`#osc${i}-gain-release`)! as HTMLInputElement;

        let $da = $(`input[name="osc${i}-detune-amount"]`)! as HTMLInputElement;
        let $dl = $(`input[name="osc${i}-detune-lfo"]`)! as HTMLInputElement;

        let $fe = $(`#osc${i}-freq-env`)! as HTMLInputElement;
        let $fa = $(`#osc${i}-freq-attack`)! as HTMLInputElement;
        let $fs = $(`#osc${i}-freq-sustain`)! as HTMLInputElement;
        let $fr = $(`#osc${i}-freq-release`)! as HTMLInputElement;

        let oscillator = [];
        oscillator[OscillatorParam.GainAmount] = parseInt($gg.value);
        oscillator[OscillatorParam.GainAttack] = parseInt($ga.value);
        oscillator[OscillatorParam.GainSustain] = parseInt($gs.value);
        oscillator[OscillatorParam.GainRelease] = parseInt($gr.value);

        oscillator[OscillatorParam.DetuneAmount] = parseInt($da.value);
        oscillator[OscillatorParam.DetuneLFO] = $dl.checked;

        oscillator[OscillatorParam.FreqEnabled] = $fe.checked;
        oscillator[OscillatorParam.FreqAttack] = parseInt($fa.value);
        oscillator[OscillatorParam.FreqSustain] = parseInt($fs.value);
        oscillator[OscillatorParam.FreqRelease] = parseInt($fr.value);

        (instrument[InstrumentParam.Oscillators] as Array<Oscillator>).push(
            (oscillator as unknown) as Oscillator
        );
    }

    // Meh, not ideal.
    return (instrument as unknown) as Instrument;
}

function play_instr(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;
    let duration = 0;

    let master = audio.createGain();
    let gg = (instr[InstrumentParam.MasterGainAmount] / 9) ** 3;
    master.gain.value = gg;

    let lfa, lfo;
    if (instr[InstrumentParam.LFOEnabled]) {
        // [27, 5832];
        let lg = (instr[InstrumentParam.LFOAmount] + 3) ** 3;
        // [0, 125]
        let lf = (instr[InstrumentParam.LFOFreq] / 3) ** 3;

        lfo = audio.createOscillator();
        lfo.frequency.value = lf;

        lfa = audio.createGain();
        lfa.gain.value = lg;

        lfo.connect(lfa);
    }

    if (instr[InstrumentParam.FilterEnabled]) {
        let freq = 2 ** instr[InstrumentParam.FilterFreq];
        let q = instr[InstrumentParam.FilterQ] ** 1.5;

        let flt = audio.createBiquadFilter();
        flt.type = instr[InstrumentParam.FilterType];
        flt.frequency.value = freq;
        flt.Q.value = q;
        if (lfa && instr[InstrumentParam.FilterDetuneLFO]) {
            lfa.connect(flt.detune);
        }

        master.connect(flt);
        flt.connect(audio.destination);
    } else {
        master.connect(audio.destination);
    }

    let ng = (instr[InstrumentParam.NoiseGainAmount] / 9) ** 3;
    if (ng > 0) {
        let noise_source = audio.createBufferSource();
        let noise_gain = audio.createGain();
        noise_source.buffer = noise_buffer;
        noise_source.loop = true;
        noise_source.connect(noise_gain);
        noise_gain.connect(master);

        let na = (instr[InstrumentParam.NoiseGainAttack] / 9) ** 3;
        let ns = (instr[InstrumentParam.NoiseGainSustain] / 9) ** 3;
        let nr = (instr[InstrumentParam.NoiseGainRelease] / 6) ** 3;

        duration = Math.max(duration, na + ns + nr);

        noise_gain.gain.setValueAtTime(0, time);
        noise_gain.gain.linearRampToValueAtTime(ng, time + na);
        noise_gain.gain.setValueAtTime(ng, time + na + ns);
        noise_gain.gain.exponentialRampToValueAtTime(0.00001, time + na + ns + nr);

        noise_source.start();
        noise_source.stop(time + na + ns + nr);
    }

    for (let osc of instr[InstrumentParam.Oscillators]) {
        let hfo = audio.createOscillator();
        let amp = audio.createGain();
        hfo.connect(amp);
        amp.connect(master);

        let gg = (osc[OscillatorParam.GainAmount] / 9) ** 3;
        let ga = (osc[OscillatorParam.GainAttack] / 9) ** 3;
        let gs = (osc[OscillatorParam.GainSustain] / 9) ** 3;
        let gr = (osc[OscillatorParam.GainRelease] / 6) ** 3;

        duration = Math.max(duration, ga + gs + gr);

        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gg, time + ga);
        amp.gain.setValueAtTime(gg, time + ga + gs);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + ga + gs + gr);

        // [-1265,1265] i.e. one octave down and one octave up.
        let dc = 3 * (osc[OscillatorParam.DetuneAmount] - 7.5) ** 3;
        let fa = (osc[OscillatorParam.FreqAttack] / 9) ** 3;
        let fs = (osc[OscillatorParam.FreqSustain] / 9) ** 3;
        let fr = (osc[OscillatorParam.FreqRelease] / 6) ** 3;

        // The intrinsic value of detune…
        hfo.detune.value = dc;
        // …can be modulated by the LFO.
        if (lfa && osc[OscillatorParam.DetuneLFO]) {
            lfa.connect(hfo.detune);
        }

        if (osc[OscillatorParam.FreqEnabled]) {
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
