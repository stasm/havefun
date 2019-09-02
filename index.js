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
    if ($filter.checked) {
        instrument[1 /* FilterType */] = $type.value;
    }
    else {
        instrument[1 /* FilterType */] = false;
    }
    instrument[2 /* FilterFreq */] = parseInt($freq.value);
    instrument[3 /* FilterQ */] = parseInt($q.value);
    instrument[4 /* FilterDetuneLFO */] = $detune.checked;
    if ($lfo.checked) {
        instrument[5 /* LFOType */] = $lt.value;
    }
    else {
        instrument[5 /* LFOType */] = false;
    }
    instrument[6 /* LFOAmount */] = parseInt($lg.value);
    instrument[7 /* LFOFreq */] = parseInt($lf.value);
    instrument[8 /* Sources */] = [];
    if (parseInt($ng.value) > 0) {
        let source = [];
        source[0 /* SourceType */] = false;
        source[1 /* GainAmount */] = parseInt($ng.value);
        source[2 /* GainAttack */] = parseInt($na.value);
        source[3 /* GainSustain */] = parseInt($ns.value);
        source[4 /* GainRelease */] = parseInt($nr.value);
        instrument[8 /* Sources */].push(source);
    }
    for (let i = 1; i < 3; i++) {
        let $t = $(`input[name="osc${i}-type"]:checked`);
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
            source[0 /* SourceType */] = $t.value;
            source[1 /* GainAmount */] = parseInt($gg.value);
            source[2 /* GainAttack */] = parseInt($ga.value);
            source[3 /* GainSustain */] = parseInt($gs.value);
            source[4 /* GainRelease */] = parseInt($gr.value);
            source[5 /* DetuneAmount */] = parseInt($da.value);
            source[6 /* DetuneLFO */] = $dl.checked;
            source[7 /* FreqEnabled */] = $fe.checked;
            source[8 /* FreqAttack */] = parseInt($fa.value);
            source[9 /* FreqSustain */] = parseInt($fs.value);
            source[10 /* FreqRelease */] = parseInt($fr.value);
            instrument[8 /* Sources */].push(source);
        }
    }
    // Meh, not ideal.
    return instrument;
}
function play_instr(audio, instr, note, offset) {
    let time = audio.currentTime + offset;
    let total_duration = 0;
    let master = audio.createGain();
    master.gain.value = (instr[0 /* MasterGainAmount */] / 9) ** 3;
    let lfa, lfo;
    if (instr[5 /* LFOType */]) {
        // Frequency is mapped to [0, 125].
        lfo = audio.createOscillator();
        lfo.type = instr[5 /* LFOType */];
        lfo.frequency.value = (instr[7 /* LFOFreq */] / 3) ** 3;
        // Amount is mapped to [27, 5832].
        lfa = audio.createGain();
        lfa.gain.value = (instr[6 /* LFOAmount */] + 3) ** 3;
        lfo.connect(lfa);
    }
    if (instr[1 /* FilterType */]) {
        let filter = audio.createBiquadFilter();
        filter.type = instr[1 /* FilterType */];
        filter.frequency.value = 2 ** instr[2 /* FilterFreq */];
        filter.Q.value = instr[3 /* FilterQ */] ** 1.5;
        if (lfa && instr[4 /* FilterDetuneLFO */]) {
            lfa.connect(filter.detune);
        }
        master.connect(filter);
        filter.connect(audio.destination);
    }
    else {
        master.connect(audio.destination);
    }
    for (let source of instr[8 /* Sources */]) {
        let amp = audio.createGain();
        amp.connect(master);
        // Gain Envelope
        let gain_amount = (source[1 /* GainAmount */] / 9) ** 3;
        let gain_attack = (source[2 /* GainAttack */] / 9) ** 3;
        let gain_sustain = (source[3 /* GainSustain */] / 9) ** 3;
        let gain_release = (source[4 /* GainRelease */] / 6) ** 3;
        let gain_duration = gain_attack + gain_sustain + gain_release;
        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gain_amount, time + gain_attack);
        amp.gain.setValueAtTime(gain_amount, time + gain_attack + gain_sustain);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + gain_duration);
        if (source[0]) {
            let hfo = audio.createOscillator();
            hfo.type = source[0 /* SourceType */];
            hfo.connect(amp);
            // Detune
            // [-1265,1265] i.e. one octave down and one octave up.
            hfo.detune.value = 3 * (source[5 /* DetuneAmount */] - 7.5) ** 3;
            if (lfa && source[6 /* DetuneLFO */]) {
                lfa.connect(hfo.detune);
            }
            // Frequency Envelope
            // Frequency from note number
            let freq = 440 * 2 ** ((note - 69) / 12);
            let freq_attack = (source[8 /* FreqAttack */] / 9) ** 3;
            let freq_sustain = (source[9 /* FreqSustain */] / 9) ** 3;
            let freq_release = (source[10 /* FreqRelease */] / 6) ** 3;
            if (source[7 /* FreqEnabled */]) {
                hfo.frequency.setValueAtTime(0, time);
                hfo.frequency.linearRampToValueAtTime(freq, time + freq_attack);
                hfo.frequency.setValueAtTime(freq, time + freq_attack + freq_sustain);
                hfo.frequency.exponentialRampToValueAtTime(0.00001, time + freq_attack + freq_sustain + freq_release);
            }
            else {
                hfo.frequency.setValueAtTime(freq, time);
            }
            hfo.start(time);
            hfo.stop(time + gain_duration);
        }
        else {
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
function play_note(note) {
    let instr = create_instrument();
    play_instr(audio, instr, note, 0);
}
function play_key(evt) {
    let note = evt.currentTarget.getAttribute("data-note");
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
let noise_buffer;
function lazy_noise_buffer(audio) {
    if (!noise_buffer) {
        noise_buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
        let channel = noise_buffer.getChannelData(0);
        for (var i = 0; i < channel.length; i++) {
            channel[i] = Math.random() * 2 - 1;
        }
    }
    return noise_buffer;
}
//# sourceMappingURL=index.js.map