import {Instrument, InstrumentParam} from "./player";
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
    let instrument = [];
    instrument[InstrumentParam.MasterGainAmount] = state.gain_amount;

    if (state.filter_enabled) {
        instrument[InstrumentParam.FilterType] = state.filter_type;
    } else {
        instrument[InstrumentParam.FilterType] = false;
    }
    instrument[InstrumentParam.FilterFreq] = state.filter_freq;
    instrument[InstrumentParam.FilterQ] = state.filter_q;
    instrument[InstrumentParam.FilterDetuneLFO] = state.filter_detune_lfo;

    if (state.lfo_enabled) {
        instrument[InstrumentParam.LFOType] = state.lfo_type;
    } else {
        instrument[InstrumentParam.LFOType] = false;
    }
    instrument[InstrumentParam.LFOAmount] = state.lfo_amount;
    instrument[InstrumentParam.LFOFreq] = state.lfo_freq;

    instrument[InstrumentParam.Sources] = [];

    return (instrument as unknown) as Instrument;
}
