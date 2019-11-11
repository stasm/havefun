import {Buffer, Instrument, InstrumentParam, Oscillator, SourceParam} from "./player";
import {Action, State} from "./state";

export function with_instrument(reducer: React.Reducer<State, Action>) {
    return function(state: State, action: Action) {
        let next = reducer(state, action);
        return init_instrument(next);
    };
}

export function init_instrument(state: State) {
    return {
        ...state,
        instrument: export_instrument(state),
    } as State;
}

function export_instrument(state: State) {
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
