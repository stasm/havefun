let audio = new AudioContext();

interface Instrument {
    osc: OscillatorNode;
    gain: GainNode;
}

function create_instrument(): Instrument {
    let osc1 = audio.createOscillator();
    let gain = audio.createGain();
    osc1.connect(gain);
    gain.connect(audio.destination);
    return {osc: osc1, gain};
}

function play(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;
    let a = 0.01;
    let s = 0.125;
    let r = 0.25;

    instr.osc.frequency.setValueAtTime(freq, time);
    instr.gain.gain.cancelScheduledValues(time);
    instr.gain.gain.linearRampToValueAtTime(0, time);
    instr.gain.gain.linearRampToValueAtTime(1, time + a);
    instr.gain.gain.setValueAtTime(1, time + s);
    instr.gain.gain.exponentialRampToValueAtTime(0.00001, time + s + r);
}

function play_key(evt: Event) {
    let freq = (evt.currentTarget! as Element).getAttribute("data-freq")!;
    let instr = create_instrument();
    play(instr, parseFloat(freq), 0);
    instr.osc.start();
}

for (let key of document.querySelectorAll(".key")) {
    key.addEventListener("click", play_key);
}
