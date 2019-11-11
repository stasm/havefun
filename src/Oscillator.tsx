import * as React from "react";
import {OscillatorSource} from "./state";

export function Oscillator({
    source,
    change,
}: {
    source: OscillatorSource;
    change: (evt: React.ChangeEvent) => void;
}) {
    return (
        <form className="group">
            <h2>Oscillator</h2>
            <div className="row">
                <div className="group">
                    <label>Type</label>
                    <div>
                        <label className="horizontal">
                            <input
                                type="radio"
                                name="osc-type"
                                value="sine"
                                checked={source.type === "sine"}
                                onChange={change}
                            />
                            Sine
                        </label>
                        <label className="horizontal">
                            <input
                                type="radio"
                                name="osc-type"
                                value="square"
                                checked={source.type === "square"}
                                onChange={change}
                            />
                            Square
                        </label>
                        <label className="horizontal">
                            <input
                                type="radio"
                                name="osc-type"
                                value="sawtooth"
                                checked={source.type === "sawtooth"}
                                onChange={change}
                            />
                            Sawtooth
                        </label>
                        <label className="horizontal">
                            <input
                                type="radio"
                                name="osc-type"
                                value="triangle"
                                checked={source.type === "triangle"}
                                onChange={change}
                            />
                            Triangle
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>Gain</label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="gain-amount"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_amount}
                                onChange={change}
                            />
                            Amnt
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>Gain Envelope</label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="gain-attack"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_attack}
                                onChange={change}
                            />
                            Atck
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="gain-sustain"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_sustain}
                                onChange={change}
                            />
                            Sust
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="gain-release"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_release}
                                onChange={change}
                            />
                            Rels
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>Detune</label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="detune-amount"
                                min="0"
                                max="15"
                                step="1"
                                value={source.detune_amount}
                                onChange={change}
                            />
                            Cents
                        </label>
                        <div>
                            <label className="horizontal">
                                <input
                                    type="checkbox"
                                    name="detune-lfo"
                                    checked={source.detune_lfo}
                                    onChange={change}
                                />
                                LFO
                            </label>
                        </div>
                    </div>
                </div>
                <div className="group">
                    <label>
                        <input
                            type="checkbox"
                            name="freq-env"
                            checked={source.freq_env}
                            onChange={change}
                        />{" "}
                        Frequency Envelope
                    </label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="freq-attack"
                                min="0"
                                max="15"
                                step="1"
                                value={source.freq_attack}
                                onChange={change}
                            />
                            Atck
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="freq-sustain"
                                min="0"
                                max="15"
                                step="1"
                                value={source.freq_sustain}
                                onChange={change}
                            />
                            Sust
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="freq-release"
                                min="0"
                                max="15"
                                step="1"
                                value={source.freq_release}
                                onChange={change}
                            />
                            Rels
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}
