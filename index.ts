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
    let instrument = [];
    instrument[InstrumentParam.MasterGainAmount] = $range("master-gain-amount");

    if ($checkbox("master-filter-enabled")) {
        instrument[InstrumentParam.FilterType] = $radio("master-filter-type") as BiquadFilterType;
    } else {
        instrument[InstrumentParam.FilterType] = false;
    }
    instrument[InstrumentParam.FilterFreq] = $range("master-filter-freq");
    instrument[InstrumentParam.FilterQ] = $range("master-filter-q");
    instrument[InstrumentParam.FilterDetuneLFO] = $checkbox("master-filter-detune-lfo");

    if ($checkbox("master-lfo-enabled")) {
        instrument[InstrumentParam.LFOType] = $radio("master-lfo-type") as OscillatorType;
    } else {
        instrument[InstrumentParam.LFOType] = false;
    }
    instrument[InstrumentParam.LFOAmount] = $range("master-lfo-amount");
    instrument[InstrumentParam.LFOFreq] = $range("master-lfo-freq");

    instrument[InstrumentParam.Sources] = [];

    if ($range("noise-gain-amount") > 0) {
        let source = [];
        source[SourceParam.SourceType] = false;
        source[SourceParam.GainAmount] = $range("noise-gain-amount");
        source[SourceParam.GainAttack] = $range("noise-gain-attack");
        source[SourceParam.GainSustain] = $range("noise-gain-sustain");
        source[SourceParam.GainRelease] = $range("noise-gain-release");
        (instrument[InstrumentParam.Sources] as Array<Oscillator | Buffer>).push(
            (source as unknown) as Buffer
        );
    }

    for (let i = 1; i < 3; i++) {
        if ($range(`osc${i}-gain-amount`) > 0) {
            let source = [];
            source[SourceParam.SourceType] = $radio(`osc${i}-type`) as OscillatorType;

            source[SourceParam.GainAmount] = $range(`osc${i}-gain-amount`);
            source[SourceParam.GainAttack] = $range(`osc${i}-gain-attack`);
            source[SourceParam.GainSustain] = $range(`osc${i}-gain-sustain`);
            source[SourceParam.GainRelease] = $range(`osc${i}-gain-release`);

            source[SourceParam.DetuneAmount] = $range(`osc${i}-detune-amount`);
            source[SourceParam.DetuneLFO] = $checkbox(`osc${i}-detune-lfo`);

            source[SourceParam.FreqEnabled] = $checkbox(`osc${i}-freq-env`);
            source[SourceParam.FreqAttack] = $range(`osc${i}-freq-attack`);
            source[SourceParam.FreqSustain] = $range(`osc${i}-freq-sustain`);
            source[SourceParam.FreqRelease] = $range(`osc${i}-freq-release`);

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

export function import_instr(instr: Instrument) {
    for (let form of document.querySelectorAll<HTMLFormElement>("form")) {
        form.reset();
        let selector = `input[type="range"][name$="-gain-amount"]`;
        for (let gain of document.querySelectorAll<HTMLInputElement>(selector)) {
            gain.value = "0";
        }
    }

    set_range("master-gain-amount", instr[InstrumentParam.MasterGainAmount]);
    let filter_type = instr[InstrumentParam.FilterType];
    if (filter_type) {
        set_checkbox("master-filter-enabled", true);
        set_radio("master-filter-type", filter_type);
        set_range("master-filter-freq", instr[InstrumentParam.FilterFreq]);
        set_range("master-filter-q", instr[InstrumentParam.FilterQ]);
        set_checkbox("master-filter-detune-lfo", instr[InstrumentParam.FilterDetuneLFO]);
    }
    let lfo_type = instr[InstrumentParam.LFOType];
    if (lfo_type) {
        set_checkbox("master-lfo-enabled", true);
        set_radio("master-lfo-type", lfo_type);
        set_range("master-lfo-amount", instr[InstrumentParam.LFOAmount]);
        set_range("master-lfo-freq", instr[InstrumentParam.LFOFreq]);
    }

    let i = 0;
    for (let source of instr[InstrumentParam.Sources]) {
        if (source_is_osc(source)) {
            i++;

            set_radio(`osc${i}-type`, source[SourceParam.SourceType]);

            set_range(`osc${i}-gain-amount`, source[SourceParam.GainAmount]);
            set_range(`osc${i}-gain-attack`, source[SourceParam.GainAttack]);
            set_range(`osc${i}-gain-sustain`, source[SourceParam.GainSustain]);
            set_range(`osc${i}-gain-release`, source[SourceParam.GainRelease]);

            set_range(`osc${i}-detune-amount`, source[SourceParam.DetuneAmount]);
            set_checkbox(`osc${i}-detune-lfo`, source[SourceParam.DetuneLFO]);

            set_checkbox(`osc${i}-freq-env`, source[SourceParam.FreqEnabled]);
            set_range(`osc${i}-freq-attack`, source[SourceParam.FreqAttack]);
            set_range(`osc${i}-freq-sustain`, source[SourceParam.FreqSustain]);
            set_range(`osc${i}-freq-release`, source[SourceParam.FreqRelease]);
        } else {
            set_range("noise-gain-amount", source[SourceParam.GainAmount]);
            set_range("noise-gain-attack", source[SourceParam.GainAttack]);
            set_range("noise-gain-sustain", source[SourceParam.GainSustain]);
            set_range("noise-gain-release", source[SourceParam.GainRelease]);
        }
    }
}

function source_is_osc(source: Oscillator | Buffer): source is Oscillator {
    return source[SourceParam.SourceType] !== false;
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

function $range(name: string) {
    let selector = `input[type="range"][name="${name}"]`;
    let input = document.querySelector(selector) as HTMLInputElement;
    return parseInt(input.value);
}

function $radio(name: string) {
    let selector = `input[type="radio"][name="${name}"]:checked`;
    let input = document.querySelector(selector) as HTMLInputElement;
    return input.value;
}

function $checkbox(name: string) {
    let selector = `input[type="checkbox"][name="${name}"]`;
    let input = document.querySelector(selector) as HTMLInputElement;
    return input.checked;
}

function set_range(name: string, value = 8) {
    let selector = `input[type="range"][name="${name}"]`;
    let input = document.querySelector(selector) as HTMLInputElement;
    input.value = value.toString();
}

function set_radio(name: string, value: string) {
    let selector = `input[type="radio"][name="${name}"]`;
    for (let option of document.querySelectorAll<HTMLInputElement>(selector)) {
        if (option.value === value) {
            option.checked = true;
        } else {
            option.checked = false;
        }
    }
}

function set_checkbox(name: string, checked: boolean) {
    let selector = `input[type="checkbox"][name="${name}"]`;
    let input = document.querySelector(selector) as HTMLInputElement;
    input.checked = checked;
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
