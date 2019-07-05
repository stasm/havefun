let audio = new AudioContext();

interface Instrument {
    osc1: OscillatorNode;
    gain1: GainNode;
}

function create_instrument(): Instrument {
    let osc1 = audio.createOscillator();
    let gain1 = audio.createGain();
    osc1.connect(gain1);
    gain1.connect(audio.destination);

    return {osc1, gain1};
}

function play(instr: Instrument, freq: number, offset: number) {
    let time = audio.currentTime + offset;

    instr.osc1.frequency.setValueAtTime(freq, time);
    instr.gain1.gain.cancelScheduledValues(time);

    let osc1_gain_env = document.querySelector("#osc1-gain-env")! as HTMLInputElement;
    if (osc1_gain_env.checked) {
        let a = (document.querySelector("#osc1-gain-attack")! as HTMLInputElement).value;
        let s = (document.querySelector("#osc1-gain-sustain")! as HTMLInputElement).value;
        let r = (document.querySelector("#osc1-gain-release")! as HTMLInputElement).value;

        instr.gain1.gain.linearRampToValueAtTime(0, time);
        instr.gain1.gain.linearRampToValueAtTime(1, time + envelope(a));
        instr.gain1.gain.setValueAtTime(1, time + envelope(s));
        instr.gain1.gain.exponentialRampToValueAtTime(0.00001, time + envelope(s) + envelope(r));
    } else {
        instr.gain1.gain.linearRampToValueAtTime(1, time);
    }
}

/**
 * Map the value of the envelope slider from range (-10,10) to ca. (0, 8).
 * @param value Value of the envelope slider.
 */
function envelope(value: string) {
    return Math.E ** (parseFloat(value) / 5);
}

function play_key(evt: Event) {
    let freq = (evt.currentTarget! as Element).getAttribute("data-freq")!;
    let instr = create_instrument();
    play(instr, parseFloat(freq), 0);
    instr.osc1.start();
}

for (let key of document.querySelectorAll(".key")) {
    key.addEventListener("click", play_key);
}
