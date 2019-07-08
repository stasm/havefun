"use strict";
let audio = new AudioContext();
function create_instrument() {
    let $gg = $(`#master-gain-amount`);
    let $filter = $(`#master-filter-enabled`);
    let $type = $(`input[name="master-filter-type"]:checked`);
    let $freq = $(`#master-filter-freq`);
    let $q = $(`#master-filter-q`);
    let $detune = $(`input[name="master-filter-detune-lfo"]`);
    let $lfo = $('input[name="master-lfo-enabled"]');
    let $lt = $('input[name="master-lfo-type"]:checked');
    let $lg = $('input[name="master-lfo-amount"]');
    let $lf = $('input[name="master-lfo-freq"]');
    let $ng = $('input[name="noise-gain-amount"]');
    let $na = $('input[name="noise-gain-attack"]');
    let $ns = $('input[name="noise-gain-sustain"]');
    let $nr = $('input[name="noise-gain-release"]');
    let instrument = [];
    instrument[0 /* MasterGainAmount */] = parseInt($gg.value);
    instrument[1 /* FilterEnabled */] = $filter.checked;
    instrument[2 /* FilterType */] = $type.value;
    instrument[3 /* FilterFreq */] = parseInt($freq.value);
    instrument[4 /* FilterQ */] = parseInt($q.value);
    instrument[5 /* FilterDetuneLFO */] = $detune.checked;
    instrument[6 /* LFOEnabled */] = $lfo.checked;
    instrument[7 /* LFOType */] = $lt.value;
    instrument[8 /* LFOAmount */] = parseInt($lg.value);
    instrument[9 /* LFOFreq */] = parseInt($lf.value);
    instrument[10 /* Sources */] = [];
    if (parseInt($ng.value) > 0) {
        let source = [];
        source[0 /* Kind */] = 1 /* Buffer */;
        source[1 /* GainAmount */] = parseInt($ng.value);
        source[2 /* GainAttack */] = parseInt($na.value);
        source[3 /* GainSustain */] = parseInt($ns.value);
        source[4 /* GainRelease */] = parseInt($nr.value);
        instrument[10 /* Sources */].push(source);
    }
    for (let i = 1; i < 3; i++) {
        let $t = $(`input[name="osc1-type"]:checked`);
        let $gg = $(`#osc${i}-gain-amount`);
        let $ga = $(`#osc${i}-gain-attack`);
        let $gs = $(`#osc${i}-gain-sustain`);
        let $gr = $(`#osc${i}-gain-release`);
        let $da = $(`input[name="osc${i}-detune-amount"]`);
        let $dl = $(`input[name="osc${i}-detune-lfo"]`);
        let $fe = $(`#osc${i}-freq-env`);
        let $fa = $(`#osc${i}-freq-attack`);
        let $fs = $(`#osc${i}-freq-sustain`);
        let $fr = $(`#osc${i}-freq-release`);
        if (parseInt($gg.value) > 0) {
            let source = [];
            source[0 /* Kind */] = 0 /* Oscillator */;
            source[1 /* GainAmount */] = parseInt($gg.value);
            source[2 /* GainAttack */] = parseInt($ga.value);
            source[3 /* GainSustain */] = parseInt($gs.value);
            source[4 /* GainRelease */] = parseInt($gr.value);
            source[5 /* OscillatorType */] = $t.value;
            source[6 /* DetuneAmount */] = parseInt($da.value);
            source[7 /* DetuneLFO */] = $dl.checked;
            source[8 /* FreqEnabled */] = $fe.checked;
            source[9 /* FreqAttack */] = parseInt($fa.value);
            source[10 /* FreqSustain */] = parseInt($fs.value);
            source[11 /* FreqRelease */] = parseInt($fr.value);
            instrument[10 /* Sources */].push(source);
        }
    }
    // Meh, not ideal.
    return instrument;
}
function play_instr(instr, freq, offset) {
    let time = audio.currentTime + offset;
    let duration = 0;
    let master = audio.createGain();
    let gg = (instr[0 /* MasterGainAmount */] / 9) ** 3;
    master.gain.value = gg;
    let lfa, lfo;
    if (instr[6 /* LFOEnabled */]) {
        // [27, 5832];
        let lg = (instr[8 /* LFOAmount */] + 3) ** 3;
        // [0, 125]
        let lf = (instr[9 /* LFOFreq */] / 3) ** 3;
        lfo = audio.createOscillator();
        lfo.type = instr[7 /* LFOType */];
        lfo.frequency.value = lf;
        lfa = audio.createGain();
        lfa.gain.value = lg;
        lfo.connect(lfa);
    }
    if (instr[1 /* FilterEnabled */]) {
        let freq = 2 ** instr[3 /* FilterFreq */];
        let q = instr[4 /* FilterQ */] ** 1.5;
        let flt = audio.createBiquadFilter();
        flt.type = instr[2 /* FilterType */];
        flt.frequency.value = freq;
        flt.Q.value = q;
        if (lfa && instr[5 /* FilterDetuneLFO */]) {
            lfa.connect(flt.detune);
        }
        master.connect(flt);
        flt.connect(audio.destination);
    }
    else {
        master.connect(audio.destination);
    }
    for (let source of instr[10 /* Sources */]) {
        let amp = audio.createGain();
        amp.connect(master);
        // Gain Envelope
        let gain_amount = (source[1 /* GainAmount */] / 9) ** 3;
        let gain_attack = (source[2 /* GainAttack */] / 9) ** 3;
        let gain_sustain = (source[3 /* GainSustain */] / 9) ** 3;
        let gain_release = (source[4 /* GainRelease */] / 6) ** 3;
        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gain_amount, time + gain_attack);
        amp.gain.setValueAtTime(gain_amount, time + gain_attack + gain_sustain);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + gain_attack + gain_sustain + gain_release);
        // XXX TypeScript doesn't recognize source[SourceParam.Kind] as the discriminant.
        if (source[0] === 0 /* Oscillator */) {
            let hfo = audio.createOscillator();
            hfo.type = source[5 /* OscillatorType */];
            hfo.connect(amp);
            // Detune
            // [-1265,1265] i.e. one octave down and one octave up.
            let dc = 3 * (source[6 /* DetuneAmount */] - 7.5) ** 3;
            // The intrinsic value of detune…
            hfo.detune.value = dc;
            // …can be modulated by the LFO.
            if (lfa && source[7 /* DetuneLFO */]) {
                lfa.connect(hfo.detune);
            }
            // Frequency Envelope
            let fa = (source[9 /* FreqAttack */] / 9) ** 3;
            let fs = (source[10 /* FreqSustain */] / 9) ** 3;
            let fr = (source[11 /* FreqRelease */] / 6) ** 3;
            if (source[8 /* FreqEnabled */]) {
                hfo.frequency.linearRampToValueAtTime(0, time);
                hfo.frequency.linearRampToValueAtTime(freq, time + fa);
                hfo.frequency.setValueAtTime(freq, time + fa + fs);
                hfo.frequency.exponentialRampToValueAtTime(0.00001, time + fa + fs + fr);
            }
            else {
                hfo.frequency.setValueAtTime(freq, time);
            }
            hfo.start();
            hfo.stop(time + gain_attack + gain_sustain + gain_release);
        }
        else {
            let noise = audio.createBufferSource();
            noise.buffer = noise_buffer;
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
function freq_from_note(note) {
    return 440 * 2 ** ((note - 69) / 12);
}
function play_note(note) {
    let freq = freq_from_note(note);
    let instr = create_instrument();
    play_instr(instr, freq, 0);
}
function play_key(evt) {
    let note = evt.currentTarget.getAttribute("data-note");
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
    }
    catch (err) {
        console.error(err);
    }
}
if (navigator.requestMIDIAccess) {
    request_midi();
}
function on_midi_message(message) {
    let [command, note, velocity] = message.data;
    switch (command & 0xf0) {
        case 240:
            break;
        case 144: {
            let button = $(`button.key[data-note="${note}"]`);
            if (velocity > 0) {
                play_note(note);
                button && button.classList.add("pressed");
            }
            else {
                button && button.classList.remove("pressed");
            }
        }
        default:
            console.log(command, note, velocity);
    }
}
function $(selector) {
    return document.querySelector(selector);
}
let buffer_size = 2 * audio.sampleRate;
let noise_buffer = audio.createBuffer(1, buffer_size, audio.sampleRate);
let output = noise_buffer.getChannelData(0);
for (var i = 0; i < buffer_size; i++) {
    output[i] = Math.random() * 2 - 1;
}
//# sourceMappingURL=index.js.map