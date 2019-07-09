let audio = new AudioContext();

interface Instrument {
    [InstrumentParam.MasterGainAmount]: number;
    [InstrumentParam.FilterEnabled]: boolean;
    [InstrumentParam.FilterType]: BiquadFilterType;
    [InstrumentParam.FilterFreq]: number;
    [InstrumentParam.FilterQ]: number;
    [InstrumentParam.LFOEnabled]: boolean;
    [InstrumentParam.LFOType]: OscillatorType;
    [InstrumentParam.LFOAmount]: number;
    [InstrumentParam.LFOFreq]: number;
    [InstrumentParam.FilterDetuneLFO]: boolean;
    [InstrumentParam.Sources]: Array<Source>;
}

type Source = Oscillator | Buffer;

const enum SourceKind {
    Oscillator,
    Buffer,
}

interface Oscillator {
    [SourceParam.Kind]: SourceKind.Oscillator;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
    [SourceParam.OscillatorType]: OscillatorType;
    [SourceParam.DetuneAmount]: number;
    [SourceParam.DetuneLFO]: boolean;
    [SourceParam.FreqEnabled]: boolean;
    [SourceParam.FreqAttack]: number;
    [SourceParam.FreqSustain]: number;
    [SourceParam.FreqRelease]: number;
}

interface Buffer {
    [SourceParam.Kind]: SourceKind.Buffer;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
}

const enum InstrumentParam {
    MasterGainAmount,
    FilterEnabled,
    FilterType,
    FilterFreq,
    FilterQ,
    FilterDetuneLFO,
    LFOEnabled,
    LFOType,
    LFOAmount,
    LFOFreq,
    Sources,
}

const enum SourceParam {
    Kind,
    GainAmount,
    GainAttack,
    GainSustain,
    GainRelease,
    OscillatorType,
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
    let $lt = $('input[name="master-lfo-type"]:checked')! as HTMLInputElement;
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
    instrument[InstrumentParam.LFOType] = $lt.value as OscillatorType;
    instrument[InstrumentParam.LFOAmount] = parseInt($lg.value);
    instrument[InstrumentParam.LFOFreq] = parseInt($lf.value);

    instrument[InstrumentParam.Sources] = [];

    if (parseInt($ng.value) > 0) {
        let source = [];
        source[SourceParam.Kind] = SourceKind.Buffer;
        source[SourceParam.GainAmount] = parseInt($ng.value);
        source[SourceParam.GainAttack] = parseInt($na.value);
        source[SourceParam.GainSustain] = parseInt($ns.value);
        source[SourceParam.GainRelease] = parseInt($nr.value);
        (instrument[InstrumentParam.Sources] as Array<Source>).push((source as unknown) as Buffer);
    }

    for (let i = 1; i < 3; i++) {
        let $t = $(`input[name="osc1-type"]:checked`)! as HTMLInputElement;

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

        if (parseInt($gg.value) > 0) {
            let source = [];
            source[SourceParam.Kind] = SourceKind.Oscillator;

            source[SourceParam.GainAmount] = parseInt($gg.value);
            source[SourceParam.GainAttack] = parseInt($ga.value);
            source[SourceParam.GainSustain] = parseInt($gs.value);
            source[SourceParam.GainRelease] = parseInt($gr.value);

            source[SourceParam.OscillatorType] = $t.value as OscillatorType;

            source[SourceParam.DetuneAmount] = parseInt($da.value);
            source[SourceParam.DetuneLFO] = $dl.checked;

            source[SourceParam.FreqEnabled] = $fe.checked;
            source[SourceParam.FreqAttack] = parseInt($fa.value);
            source[SourceParam.FreqSustain] = parseInt($fs.value);
            source[SourceParam.FreqRelease] = parseInt($fr.value);

            (instrument[InstrumentParam.Sources] as Array<Source>).push(
                (source as unknown) as Oscillator
            );
        }
    }

    // Meh, not ideal.
    return (instrument as unknown) as Instrument;
}

function play_instr(audio: AudioContext, instr: Instrument, note: number, offset: number) {
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
        lfo.type = instr[InstrumentParam.LFOType];
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

    for (let source of instr[InstrumentParam.Sources]) {
        let amp = audio.createGain();
        amp.connect(master);

        // Gain Envelope

        let gain_amount = (source[SourceParam.GainAmount] / 9) ** 3;
        let gain_attack = (source[SourceParam.GainAttack] / 9) ** 3;
        let gain_sustain = (source[SourceParam.GainSustain] / 9) ** 3;
        let gain_release = (source[SourceParam.GainRelease] / 6) ** 3;

        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gain_amount, time + gain_attack);
        amp.gain.setValueAtTime(gain_amount, time + gain_attack + gain_sustain);
        amp.gain.exponentialRampToValueAtTime(
            0.00001,
            time + gain_attack + gain_sustain + gain_release
        );

        // XXX TypeScript doesn't recognize source[SourceParam.Kind] as the discriminant.
        if (source[0] === SourceKind.Oscillator) {
            let hfo = audio.createOscillator();
            hfo.type = source[SourceParam.OscillatorType];
            hfo.connect(amp);

            // Detune

            // [-1265,1265] i.e. one octave down and one octave up.
            let dc = 3 * (source[SourceParam.DetuneAmount] - 7.5) ** 3;
            // The intrinsic value of detune…
            hfo.detune.value = dc;
            // …can be modulated by the LFO.
            if (lfa && source[SourceParam.DetuneLFO]) {
                lfa.connect(hfo.detune);
            }

            // Frequency Envelope
            let freq = 440 * 2 ** ((note - 69) / 12);

            let fa = (source[SourceParam.FreqAttack] / 9) ** 3;
            let fs = (source[SourceParam.FreqSustain] / 9) ** 3;
            let fr = (source[SourceParam.FreqRelease] / 6) ** 3;
            if (source[SourceParam.FreqEnabled]) {
                hfo.frequency.linearRampToValueAtTime(0, time);
                hfo.frequency.linearRampToValueAtTime(freq, time + fa);
                hfo.frequency.setValueAtTime(freq, time + fa + fs);
                hfo.frequency.exponentialRampToValueAtTime(0.00001, time + fa + fs + fr);
            } else {
                hfo.frequency.setValueAtTime(freq, time);
            }

            hfo.start();
            hfo.stop(time + gain_attack + gain_sustain + gain_release);
        } else {
            let noise = audio.createBufferSource();
            noise.buffer = lazy_noise_buffer(audio);
            noise.loop = true;
            noise.connect(amp);

            noise.start();
            noise.stop(time + gain_attack + gain_sustain + gain_release);
        }

        duration = Math.max(duration, gain_attack + gain_sustain + gain_release);
    }

    if (lfo) {
        lfo.start();
        lfo.stop(time + duration);
    }
}

function play_note(note: number) {
    let instr = create_instrument();
    play_instr(audio, instr, note, 0);
}

function play_key(evt: Event) {
    let note = (evt.currentTarget! as Element).getAttribute("data-note")!;
    play_note(parseInt(note));
}

for (let key of document.querySelectorAll(".key")) {
    key.addEventListener("click", play_key);
}

function export_instr() {
    let instr = create_instrument();
    console.log(JSON.stringify(instr));
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

let noise_buffer: AudioBuffer;
function lazy_noise_buffer(audio: AudioContext) {
    if (!noise_buffer) {
        noise_buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
        let channel = noise_buffer.getChannelData(0);
        for (var i = 0; i < channel.length; i++) {
            channel[i] = Math.random() * 2 - 1;
        }
    }
    return noise_buffer;
}
