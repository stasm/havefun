import {Buffer, Instrument, InstrumentParam, Oscillator, SourceParam} from "./player";
import {Action, State} from "./state";

export function with_instr(reducer: React.Reducer<State, Action>) {
    return function(state: State, action: Action) {
        let next = reducer(state, action);
        return init_instr(next);
    };
}

export function init_instr(state: State) {
    return {
        ...state,
        instrument: export_instr(state),
    } as State;
}

export function export_instr(state: State) {
    let instr = [];
    instr[InstrumentParam.MasterGainAmount] = state.gain_amount;

    if (state.filter_enabled) {
        instr[InstrumentParam.FilterType] = state.filter_type;
    } else {
        instr[InstrumentParam.FilterType] = false;
    }
    instr[InstrumentParam.FilterFreq] = state.filter_freq;
    instr[InstrumentParam.FilterQ] = state.filter_q;
    instr[InstrumentParam.FilterDetuneLFO] = state.filter_detune_lfo;

    if (state.lfo_enabled) {
        instr[InstrumentParam.LFOType] = state.lfo_type;
    } else {
        instr[InstrumentParam.LFOType] = false;
    }
    instr[InstrumentParam.LFOAmount] = state.lfo_amount;
    instr[InstrumentParam.LFOFreq] = state.lfo_freq;

    instr[InstrumentParam.Sources] = [];

    for (let source of state.sources) {
        if (source.gain_amount > 0) {
            let src = [];
            src[SourceParam.GainAmount] = source.gain_amount;
            src[SourceParam.GainAttack] = source.gain_attack;
            src[SourceParam.GainSustain] = source.gain_sustain;
            src[SourceParam.GainRelease] = source.gain_release;

            if (source.kind === "noise") {
                src[SourceParam.SourceType] = false;
                (instr[InstrumentParam.Sources] as Array<Buffer>).push((src as unknown) as Buffer);
            }

            if (source.kind === "oscillator") {
                src[SourceParam.SourceType] = source.type;
                src[SourceParam.DetuneAmount] = source.detune_amount;
                src[SourceParam.DetuneLFO] = source.detune_lfo;
                src[SourceParam.FreqEnabled] = source.freq_env;
                src[SourceParam.FreqAttack] = source.freq_attack;
                src[SourceParam.FreqSustain] = source.freq_sustain;
                src[SourceParam.FreqRelease] = source.freq_release;
                (instr[InstrumentParam.Sources] as Array<Oscillator>).push(
                    (src as unknown) as Oscillator
                );
            }
        }
    }

    return (instr as unknown) as Instrument;
}

export function import_instr(instr: Instrument) {
    let state = {
        gain_amount: instr[InstrumentParam.MasterGainAmount],
        filter_enabled: instr[InstrumentParam.FilterType] !== false,
        filter_type: instr[InstrumentParam.FilterType],
        filter_freq: instr[InstrumentParam.FilterFreq],
        filter_q: instr[InstrumentParam.FilterQ],
        filter_detune_lfo: instr[InstrumentParam.FilterDetuneLFO],
        lfo_enabled: instr[InstrumentParam.LFOType] !== false,
        lfo_type: instr[InstrumentParam.LFOType],
        lfo_amount: instr[InstrumentParam.LFOAmount],
        lfo_freq: instr[InstrumentParam.LFOFreq],
        sources: [],
    } as State;

    for (let src of instr[InstrumentParam.Sources]) {
        if (source_is_osc(src)) {
            state.sources.push({
                kind: "oscillator",
                type: src[SourceParam.SourceType],
                gain_amount: src[SourceParam.GainAmount],
                gain_attack: src[SourceParam.GainAttack],
                gain_sustain: src[SourceParam.GainSustain],
                gain_release: src[SourceParam.GainRelease],
                detune_amount: src[SourceParam.DetuneAmount],
                detune_lfo: src[SourceParam.DetuneLFO],
                freq_env: src[SourceParam.FreqEnabled],
                freq_attack: src[SourceParam.FreqAttack],
                freq_sustain: src[SourceParam.FreqSustain],
                freq_release: src[SourceParam.FreqRelease],
            });
        } else {
            state.sources.push({
                kind: "noise",
                gain_amount: src[SourceParam.GainAmount],
                gain_attack: src[SourceParam.GainAttack],
                gain_sustain: src[SourceParam.GainSustain],
                gain_release: src[SourceParam.GainRelease],
            });
        }
    }

    return state;
}

function source_is_osc(source: Oscillator | Buffer): source is Oscillator {
    return source[SourceParam.SourceType] !== false;
}
