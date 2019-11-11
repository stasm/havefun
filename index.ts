let audio = new AudioContext();

interface Instrument {
    [InstrumentParam.MasterGainAmount]: number;
    [InstrumentParam.FilterType]: false | BiquadFilterType;
    [InstrumentParam.FilterFreq]: number;
    [InstrumentParam.FilterQ]: number;
    [InstrumentParam.LFOType]: false | OscillatorType;
    [InstrumentParam.LFOAmount]: number;
    [InstrumentParam.LFOFreq]: number;
    [InstrumentParam.FilterDetuneLFO]: boolean;
    [InstrumentParam.Sources]: Array<Oscillator | Buffer>;
}

interface Oscillator {
    [SourceParam.SourceType]: OscillatorType;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
    [SourceParam.DetuneAmount]: number;
    [SourceParam.DetuneLFO]: boolean;
    [SourceParam.FreqEnabled]: boolean;
    [SourceParam.FreqAttack]: number;
    [SourceParam.FreqSustain]: number;
    [SourceParam.FreqRelease]: number;
}

interface Buffer {
    [SourceParam.SourceType]: false;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
}

const enum InstrumentParam {
    MasterGainAmount,
    FilterType,
    FilterFreq,
    FilterQ,
    FilterDetuneLFO,
    LFOType,
    LFOAmount,
    LFOFreq,
    Sources,
}

const enum SourceParam {
    SourceType,
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
    let $gg = $input("master-gain-amount");

    let $filter = $input("master-filter-enabled");
    let $type = $radio("master-filter-type");
    let $freq = $input("master-filter-freq");
    let $q = $input("master-filter-q");
    let $detune = $input("master-filter-detune-lfo");

    let $lfo = $input("master-lfo-enabled");
    let $lt = $radio("master-lfo-type");
    let $lg = $input("master-lfo-amount");
    let $lf = $input("master-lfo-freq");

    let $ng = $input("noise-gain-amount");
    let $na = $input("noise-gain-attack");
    let $ns = $input("noise-gain-sustain");
    let $nr = $input("noise-gain-release");

    let instrument = [];
    instrument[InstrumentParam.MasterGainAmount] = parseInt($gg.value);

    if ($filter.checked) {
        instrument[InstrumentParam.FilterType] = $type.value as BiquadFilterType;
    } else {
        instrument[InstrumentParam.FilterType] = false;
    }
    instrument[InstrumentParam.FilterFreq] = parseInt($freq.value);
    instrument[InstrumentParam.FilterQ] = parseInt($q.value);
    instrument[InstrumentParam.FilterDetuneLFO] = $detune.checked;

    if ($lfo.checked) {
        instrument[InstrumentParam.LFOType] = $lt.value as OscillatorType;
    } else {
        instrument[InstrumentParam.LFOType] = false;
    }
    instrument[InstrumentParam.LFOAmount] = parseInt($lg.value);
    instrument[InstrumentParam.LFOFreq] = parseInt($lf.value);

    instrument[InstrumentParam.Sources] = [];

    if (parseInt($ng.value) > 0) {
        let source = [];
        source[SourceParam.SourceType] = false;
        source[SourceParam.GainAmount] = parseInt($ng.value);
        source[SourceParam.GainAttack] = parseInt($na.value);
        source[SourceParam.GainSustain] = parseInt($ns.value);
        source[SourceParam.GainRelease] = parseInt($nr.value);
        (instrument[InstrumentParam.Sources] as Array<Oscillator | Buffer>).push(
            (source as unknown) as Buffer
        );
    }

    for (let i = 1; i < 3; i++) {
        let $t = $radio(`osc${i}-type`);

        let $gg = $input(`osc${i}-gain-amount`);
        let $ga = $input(`osc${i}-gain-attack`);
        let $gs = $input(`osc${i}-gain-sustain`);
        let $gr = $input(`osc${i}-gain-release`);

        let $da = $input(`osc${i}-detune-amount`);
        let $dl = $input(`osc${i}-detune-lfo`);

        let $fe = $input(`osc${i}-freq-env`);
        let $fa = $input(`osc${i}-freq-attack`);
        let $fs = $input(`osc${i}-freq-sustain`);
        let $fr = $input(`osc${i}-freq-release`);

        if (parseInt($gg.value) > 0) {
            let source = [];
            source[SourceParam.SourceType] = $t.value as OscillatorType;

            source[SourceParam.GainAmount] = parseInt($gg.value);
            source[SourceParam.GainAttack] = parseInt($ga.value);
            source[SourceParam.GainSustain] = parseInt($gs.value);
            source[SourceParam.GainRelease] = parseInt($gr.value);

            source[SourceParam.DetuneAmount] = parseInt($da.value);
            source[SourceParam.DetuneLFO] = $dl.checked;

            source[SourceParam.FreqEnabled] = $fe.checked;
            source[SourceParam.FreqAttack] = parseInt($fa.value);
            source[SourceParam.FreqSustain] = parseInt($fs.value);
            source[SourceParam.FreqRelease] = parseInt($fr.value);

            (instrument[InstrumentParam.Sources] as Array<Oscillator | Buffer>).push(
                (source as unknown) as Oscillator
            );
        }
    }

    // Meh, not ideal.
    return (instrument as unknown) as Instrument;
}

function play_instr(audio: AudioContext, instr: Instrument, note: number, offset: number) {
    let time = audio.currentTime + offset;
    let total_duration = 0;

    let master = audio.createGain();
    master.gain.value = (instr[InstrumentParam.MasterGainAmount] / 9) ** 3;

    let lfa, lfo;
    if (instr[InstrumentParam.LFOType]) {
        // Frequency is mapped to [0, 125].
        lfo = audio.createOscillator();
        lfo.type = instr[InstrumentParam.LFOType] as OscillatorType;
        lfo.frequency.value = (instr[InstrumentParam.LFOFreq] / 3) ** 3;

        // Amount is mapped to [27, 5832].
        lfa = audio.createGain();
        lfa.gain.value = (instr[InstrumentParam.LFOAmount] + 3) ** 3;

        lfo.connect(lfa);
    }

    if (instr[InstrumentParam.FilterType]) {
        let filter = audio.createBiquadFilter();
        filter.type = instr[InstrumentParam.FilterType] as BiquadFilterType;
        filter.frequency.value = 2 ** instr[InstrumentParam.FilterFreq];
        filter.Q.value = instr[InstrumentParam.FilterQ] ** 1.5;
        if (lfa && instr[InstrumentParam.FilterDetuneLFO]) {
            lfa.connect(filter.detune);
        }

        master.connect(filter);
        filter.connect(audio.destination);
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
        let gain_duration = gain_attack + gain_sustain + gain_release;

        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gain_amount, time + gain_attack);
        amp.gain.setValueAtTime(gain_amount, time + gain_attack + gain_sustain);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + gain_duration);

        if (source[0]) {
            let hfo = audio.createOscillator();
            hfo.type = source[SourceParam.SourceType];
            hfo.connect(amp);

            // Detune

            // [-1265,1265] i.e. one octave down and one octave up.
            hfo.detune.value = 3 * (source[SourceParam.DetuneAmount] - 7.5) ** 3;
            if (lfa && source[SourceParam.DetuneLFO]) {
                lfa.connect(hfo.detune);
            }

            // Frequency Envelope

            // Frequency from note number
            let freq = 440 * 2 ** ((note - 69) / 12);
            let freq_attack = (source[SourceParam.FreqAttack] / 9) ** 3;
            let freq_sustain = (source[SourceParam.FreqSustain] / 9) ** 3;
            let freq_release = (source[SourceParam.FreqRelease] / 6) ** 3;
            if (source[SourceParam.FreqEnabled]) {
                hfo.frequency.setValueAtTime(0, time);
                hfo.frequency.linearRampToValueAtTime(freq, time + freq_attack);
                hfo.frequency.setValueAtTime(freq, time + freq_attack + freq_sustain);
                hfo.frequency.exponentialRampToValueAtTime(
                    0.00001,
                    time + freq_attack + freq_sustain + freq_release
                );
            } else {
                hfo.frequency.setValueAtTime(freq, time);
            }

            hfo.start(time);
            hfo.stop(time + gain_duration);
        } else {
            let noise = audio.createBufferSource();
            noise.buffer = lazy_noise_buffer(audio);
            noise.loop = true;
            noise.connect(amp);

            noise.start(time);
            noise.stop(time + gain_duration);
        }

        if (gain_duration > total_duration) {
            total_duration = gain_duration;
        }
    }

    if (lfo) {
        lfo.start(time);
        lfo.stop(time + total_duration);
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

export function export_instr() {
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

function $input(name: string) {
    return document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

function $radio(name: string) {
    return document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement;
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
