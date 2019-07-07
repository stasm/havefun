let audio = new AudioContext();

interface Instrument {
    [Parameter.MasterGainAmount]: number;
    [Parameter.FilterEnabled]: boolean;
    [Parameter.FilterType]: BiquadFilterType;
    [Parameter.FilterFreq]: number;
    [Parameter.FilterQ]: number;
    [Parameter.LFOEnabled]: boolean;
    [Parameter.LFOAmount]: number;
    [Parameter.LFOFreq]: number;
    [Parameter.LFOFilterDetune]: boolean;
    [Parameter.NoiseGainAmount]: number;
    [Parameter.NoiseGainAttack]: number;
    [Parameter.NoiseGainSustain]: number;
    [Parameter.NoiseGainRelease]: number;
    [Parameter.Oscillator1GainAmount]: number;
    [Parameter.Oscillator1GainAttack]: number;
    [Parameter.Oscillator1GainSustain]: number;
    [Parameter.Oscillator1GainRelease]: number;
    [Parameter.Oscillator1DetuneAmount]: number;
    [Parameter.Oscillator1DetuneLFO]: boolean;
    [Parameter.Oscillator1FreqEnabled]: boolean;
    [Parameter.Oscillator1FreqAttack]: number;
    [Parameter.Oscillator1FreqSustain]: number;
    [Parameter.Oscillator1FreqRelease]: number;
    [Parameter.Oscillator2GainAmount]: number;
    [Parameter.Oscillator2GainAttack]: number;
    [Parameter.Oscillator2GainSustain]: number;
    [Parameter.Oscillator2GainRelease]: number;
    [Parameter.Oscillator2DetuneAmount]: number;
    [Parameter.Oscillator2DetuneLFO]: boolean;
    [Parameter.Oscillator2FreqEnabled]: boolean;
    [Parameter.Oscillator2FreqAttack]: number;
    [Parameter.Oscillator2FreqSustain]: number;
    [Parameter.Oscillator2FreqRelease]: number;
}

const enum Parameter {
    MasterGainAmount,
    FilterEnabled,
    FilterType,
    FilterFreq,
    FilterQ,
    LFOEnabled,
    LFOAmount,
    LFOFreq,
    LFOFilterDetune,
    NoiseGainAmount,
    NoiseGainAttack,
    NoiseGainSustain,
    NoiseGainRelease,
    Oscillator1GainAmount,
    Oscillator1GainAttack,
    Oscillator1GainSustain,
    Oscillator1GainRelease,
    Oscillator1DetuneAmount,
    Oscillator1DetuneLFO,
    Oscillator1FreqEnabled,
    Oscillator1FreqAttack,
    Oscillator1FreqSustain,
    Oscillator1FreqRelease,
    Oscillator2GainAmount,
    Oscillator2GainAttack,
    Oscillator2GainSustain,
    Oscillator2GainRelease,
    Oscillator2DetuneAmount,
    Oscillator2DetuneLFO,
    Oscillator2FreqEnabled,
    Oscillator2FreqAttack,
    Oscillator2FreqSustain,
    Oscillator2FreqRelease,
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
    instrument[Parameter.MasterGainAmount] = parseInt($gg.value);

    instrument[Parameter.FilterEnabled] = $filter.checked;
    instrument[Parameter.FilterType] = $type.value as BiquadFilterType;
    instrument[Parameter.FilterFreq] = parseInt($freq.value);
    instrument[Parameter.FilterQ] = parseInt($q.value);

    instrument[Parameter.LFOEnabled] = $lfo.checked;
    instrument[Parameter.LFOAmount] = parseInt($lg.value);
    instrument[Parameter.LFOFreq] = parseInt($lf.value);
    instrument[Parameter.LFOFilterDetune] = $detune.checked;

    instrument[Parameter.NoiseGainAmount] = parseInt($ng.value);
    instrument[Parameter.NoiseGainAttack] = parseInt($na.value);
    instrument[Parameter.NoiseGainSustain] = parseInt($ns.value);
    instrument[Parameter.NoiseGainRelease] = parseInt($nr.value);

    // Oscillator 1

    let $gg1 = $("#osc1-gain-amount")! as HTMLInputElement;
    let $ga1 = $("#osc1-gain-attack")! as HTMLInputElement;
    let $gs1 = $("#osc1-gain-sustain")! as HTMLInputElement;
    let $gr1 = $("#osc1-gain-release")! as HTMLInputElement;

    let $da1 = $('input[name="osc1-detune-amount"]')! as HTMLInputElement;
    let $dl1 = $('input[name="osc1-detune-lfo"]')! as HTMLInputElement;

    let $fe1 = $("#osc1-freq-env")! as HTMLInputElement;
    let $fa1 = $("#osc1-freq-attack")! as HTMLInputElement;
    let $fs1 = $("#osc1-freq-sustain")! as HTMLInputElement;
    let $fr1 = $("#osc1-freq-release")! as HTMLInputElement;

    instrument[Parameter.Oscillator1GainAmount] = parseInt($gg1.value);
    instrument[Parameter.Oscillator1GainAttack] = parseInt($ga1.value);
    instrument[Parameter.Oscillator1GainSustain] = parseInt($gs1.value);
    instrument[Parameter.Oscillator1GainRelease] = parseInt($gr1.value);

    instrument[Parameter.Oscillator1DetuneAmount] = parseInt($da1.value);
    instrument[Parameter.Oscillator1DetuneLFO] = $dl1.checked;

    instrument[Parameter.Oscillator1FreqEnabled] = $fe1.checked;
    instrument[Parameter.Oscillator1FreqAttack] = parseInt($fa1.value);
    instrument[Parameter.Oscillator1FreqSustain] = parseInt($fs1.value);
    instrument[Parameter.Oscillator1FreqRelease] = parseInt($fr1.value);

    // Oscillator 2

    let $gg2 = $("#osc2-gain-amount")! as HTMLInputElement;
    let $ga2 = $("#osc2-gain-attack")! as HTMLInputElement;
    let $gs2 = $("#osc2-gain-sustain")! as HTMLInputElement;
    let $gr2 = $("#osc2-gain-release")! as HTMLInputElement;

    let $da2 = $('input[name="osc2-detune-amount"]')! as HTMLInputElement;
    let $dl2 = $('input[name="osc2-detune-lfo"]')! as HTMLInputElement;

    let $fe2 = $("#osc2-freq-env")! as HTMLInputElement;
    let $fa2 = $("#osc2-freq-attack")! as HTMLInputElement;
    let $fs2 = $("#osc2-freq-sustain")! as HTMLInputElement;
    let $fr2 = $("#osc2-freq-release")! as HTMLInputElement;

    instrument[Parameter.Oscillator2GainAmount] = parseInt($gg2.value);
    instrument[Parameter.Oscillator2GainAttack] = parseInt($ga2.value);
    instrument[Parameter.Oscillator2GainSustain] = parseInt($gs2.value);
    instrument[Parameter.Oscillator2GainRelease] = parseInt($gr2.value);

    instrument[Parameter.Oscillator2DetuneAmount] = parseInt($da2.value);
    instrument[Parameter.Oscillator2DetuneLFO] = $dl2.checked;

    instrument[Parameter.Oscillator2FreqEnabled] = $fe2.checked;
    instrument[Parameter.Oscillator2FreqAttack] = parseInt($fa2.value);
    instrument[Parameter.Oscillator2FreqSustain] = parseInt($fs2.value);
    instrument[Parameter.Oscillator2FreqRelease] = parseInt($fr2.value);

    // Meh, not ideal.
    return (instrument as unknown) as Instrument;
}

function play_instr(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;
    let duration = 0;

    let master = audio.createGain();
    let gg = (instr[Parameter.MasterGainAmount] / 9) ** 3;
    master.gain.value = gg;

    let lfa, lfo;
    if (instr[Parameter.LFOEnabled]) {
        // [27, 5832];
        let lg = (instr[Parameter.LFOAmount] + 3) ** 3;
        // [0, 125]
        let lf = (instr[Parameter.LFOFreq] / 3) ** 3;

        lfo = audio.createOscillator();
        lfo.frequency.value = lf;

        lfa = audio.createGain();
        lfa.gain.value = lg;

        lfo.connect(lfa);
    }

    if (instr[Parameter.FilterEnabled]) {
        let freq = 2 ** instr[Parameter.FilterFreq];
        let q = instr[Parameter.FilterQ] ** 1.5;

        let flt = audio.createBiquadFilter();
        flt.type = instr[Parameter.FilterType];
        flt.frequency.value = freq;
        flt.Q.value = q;
        if (lfa && instr[Parameter.LFOFilterDetune]) {
            lfa.connect(flt.detune);
        }

        master.connect(flt);
        flt.connect(audio.destination);
    } else {
        master.connect(audio.destination);
    }

    let ng = (instr[Parameter.NoiseGainAmount] / 9) ** 3;
    if (ng > 0) {
        let noise_source = audio.createBufferSource();
        let noise_gain = audio.createGain();
        noise_source.buffer = noise_buffer;
        noise_source.loop = true;
        noise_source.connect(noise_gain);
        noise_gain.connect(master);

        let na = (instr[Parameter.NoiseGainAttack] / 9) ** 3;
        let ns = (instr[Parameter.NoiseGainSustain] / 9) ** 3;
        let nr = (instr[Parameter.NoiseGainRelease] / 6) ** 3;

        duration = Math.max(duration, na + ns + nr);

        noise_gain.gain.setValueAtTime(0, time);
        noise_gain.gain.linearRampToValueAtTime(ng, time + na);
        noise_gain.gain.setValueAtTime(ng, time + na + ns);
        noise_gain.gain.exponentialRampToValueAtTime(0.00001, time + na + ns + nr);

        noise_source.start();
        noise_source.stop(time + na + ns + nr);
    }

    // Oscillator 1
    {
        let hfo = audio.createOscillator();
        let amp = audio.createGain();
        hfo.connect(amp);
        amp.connect(master);

        let gg = (instr[Parameter.Oscillator1GainAmount] / 9) ** 3;
        let ga = (instr[Parameter.Oscillator1GainAttack] / 9) ** 3;
        let gs = (instr[Parameter.Oscillator1GainSustain] / 9) ** 3;
        let gr = (instr[Parameter.Oscillator1GainRelease] / 6) ** 3;

        duration = Math.max(duration, ga + gs + gr);

        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gg, time + ga);
        amp.gain.setValueAtTime(gg, time + ga + gs);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + ga + gs + gr);

        // [-1265,1265] i.e. one octave down and one octave up.
        let dc = 3 * (instr[Parameter.Oscillator1DetuneAmount] - 7.5) ** 3;
        let fa = (instr[Parameter.Oscillator1FreqAttack] / 9) ** 3;
        let fs = (instr[Parameter.Oscillator1FreqSustain] / 9) ** 3;
        let fr = (instr[Parameter.Oscillator1FreqRelease] / 6) ** 3;

        // The intrinsic value of detune…
        hfo.detune.value = dc;
        // …can be modulated by the LFO.
        if (lfa && instr[Parameter.Oscillator1DetuneLFO]) {
            lfa.connect(hfo.detune);
        }

        if (instr[Parameter.Oscillator1FreqEnabled]) {
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

    // Oscillator 2
    {
        let hfo = audio.createOscillator();
        let amp = audio.createGain();
        hfo.connect(amp);
        amp.connect(master);

        let gg = (instr[Parameter.Oscillator2GainAmount] / 9) ** 3;
        let ga = (instr[Parameter.Oscillator2GainAttack] / 9) ** 3;
        let gs = (instr[Parameter.Oscillator2GainSustain] / 9) ** 3;
        let gr = (instr[Parameter.Oscillator2GainRelease] / 6) ** 3;

        duration = Math.max(duration, ga + gs + gr);

        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gg, time + ga);
        amp.gain.setValueAtTime(gg, time + ga + gs);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + ga + gs + gr);

        // [-1265,1265] i.e. one octave down and one octave up.
        let dc = 3 * (instr[Parameter.Oscillator2DetuneAmount] - 7.5) ** 3;
        let fa = (instr[Parameter.Oscillator2FreqAttack] / 9) ** 3;
        let fs = (instr[Parameter.Oscillator2FreqSustain] / 9) ** 3;
        let fr = (instr[Parameter.Oscillator2FreqRelease] / 6) ** 3;

        // The intrinsic value of detune…
        hfo.detune.value = dc;
        // …can be modulated by the LFO.
        if (lfa && instr[Parameter.Oscillator2DetuneLFO]) {
            lfa.connect(hfo.detune);
        }

        if (instr[Parameter.Oscillator2FreqEnabled]) {
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
