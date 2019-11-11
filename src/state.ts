import {Instrument} from "./player";

export interface OscillatorSource {
    kind: "oscillator";
    type: OscillatorType;
    gain_amount: number;
    gain_attack: number;
    gain_sustain: number;
    gain_release: number;
    detune_amount: number;
    detune_lfo: boolean;
    freq_env: boolean;
    freq_attack: number;
    freq_sustain: number;
    freq_release: number;
}

export interface NoiseSource {
    kind: "noise";
    gain_amount: number;
    gain_attack: number;
    gain_sustain: number;
    gain_release: number;
}

export interface State {
    instrument?: Instrument;
    gain_amount: number;
    filter_enabled: boolean;
    filter_type: BiquadFilterType;
    filter_freq: number;
    filter_q: number;
    filter_detune_lfo: boolean;
    lfo_enabled: boolean;
    lfo_type: OscillatorType;
    lfo_amount: number;
    lfo_freq: number;
    sources: Array<OscillatorSource | NoiseSource>;
}

export const INITIAL_STATE: State = {
    gain_amount: 8,
    filter_enabled: false,
    filter_type: "lowpass",
    filter_freq: 8,
    filter_q: 8,
    filter_detune_lfo: false,
    lfo_enabled: false,
    lfo_type: "sine",
    lfo_amount: 8,
    lfo_freq: 8,
    sources: [
        {
            kind: "noise",
            gain_amount: 8,
            gain_attack: 8,
            gain_release: 8,
            gain_sustain: 8,
        },
    ],
};

export type Action =
    | {kind: "CHANGE_MASTER"; target: HTMLInputElement}
    | {kind: "CHANGE_SOURCE"; target: HTMLInputElement; index: number};

export const reducer: React.Reducer<State, Action> = (state, action) => {
    switch (action.kind) {
        case "CHANGE_MASTER": {
            switch (action.target.name) {
                case "gain-amount":
                    return {
                        ...state,
                        gain_amount: parseInt(action.target.value),
                    };
                case "filter-enabled":
                    return {
                        ...state,
                        filter_enabled: action.target.checked,
                    };
                case "filter-type":
                    return {
                        ...state,
                        filter_type: action.target.value as BiquadFilterType,
                    };
                case "filter-freq":
                    return {
                        ...state,
                        filter_freq: parseInt(action.target.value),
                    };
                case "filter-q":
                    return {
                        ...state,
                        filter_q: parseInt(action.target.value),
                    };
                case "filter-detune-lfo":
                    return {
                        ...state,
                        filter_detune_lfo: action.target.checked,
                    };
                case "lfo-enabled":
                    return {
                        ...state,
                        lfo_enabled: action.target.checked,
                    };
                case "lfo-type":
                    return {
                        ...state,
                        lfo_type: action.target.value as OscillatorType,
                    };
                case "lfo-amount":
                    return {
                        ...state,
                        lfo_amount: parseInt(action.target.value),
                    };
                case "lfo-freq":
                    return {
                        ...state,
                        lfo_freq: parseInt(action.target.value),
                    };
                default:
                    return state;
            }
        }
        case "CHANGE_SOURCE": {
            return {
                ...state,
                sources: state.sources.map((source, index) => {
                    if (index === action.index) {
                        switch (action.target.name) {
                            case "gain-amount":
                                return {
                                    ...source,
                                    gain_amount: parseInt(action.target.value),
                                };
                            case "gain-attack":
                                return {
                                    ...source,
                                    gain_attack: parseInt(action.target.value),
                                };
                            case "gain-sustain":
                                return {
                                    ...source,
                                    gain_sustain: parseInt(action.target.value),
                                };
                            case "gain-release":
                                return {
                                    ...source,
                                    gain_release: parseInt(action.target.value),
                                };
                        }
                    }
                    return source;
                }),
            };
        }
        default:
            return state;
    }
};
