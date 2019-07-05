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

    let master1 = (document.querySelector("#osc1-gain-master")! as HTMLInputElement).value;
    let m1 = parseFloat(master1);

    let osc1_gain_env = document.querySelector("#osc1-gain-env")! as HTMLInputElement;
    if (osc1_gain_env.checked) {
        let a_val = (document.querySelector("#osc1-gain-attack")! as HTMLInputElement).value;
        let s_val = (document.querySelector("#osc1-gain-sustain")! as HTMLInputElement).value;
        let r_val = (document.querySelector("#osc1-gain-release")! as HTMLInputElement).value;

        let a = envelope(a_val);
        let s = envelope(s_val);
        let r = envelope(r_val);

        instr.gain1.gain.linearRampToValueAtTime(0, time);
        instr.gain1.gain.linearRampToValueAtTime(m1, time + a);
        instr.gain1.gain.setValueAtTime(m1, time + a + s);
        instr.gain1.gain.exponentialRampToValueAtTime(0.00001, time + a + s + r);
        return time + a + s + r;
    } else {
        instr.gain1.gain.linearRampToValueAtTime(m1, time);
        return time + 1;
    }
}

/**
 * Map the value of the envelope slider from range (-10,10) to ca. (0, 8).
 * @param value Value of the envelope slider.
 */
function envelope(value: string) {
    return 2 ** (parseFloat(value) / Math.E);
}

function play_key(evt: Event) {
    let freq = (evt.currentTarget! as Element).getAttribute("data-freq")!;
    let instr = create_instrument();
    let end = play(instr, parseFloat(freq), 0);
    instr.osc1.start();
    instr.osc1.stop(end);
}

for (let key of document.querySelectorAll(".key")) {
    key.addEventListener("click", play_key);
}
